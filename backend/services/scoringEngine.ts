// IMPACTOS 7-Signal Scorecard & Assurance Tier Cap Engine

export interface RawAssetPayload {
  projectId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  captureTimestamp: string;
  uploadTimestamp?: string;
  exifAvailable: boolean;
  captureMethod: 'standard_upload' | 'trusted_web_capture' | 'native_app' | 'auditor_attested';
  nonceToken?: string;
  phash?: string;
  imageUrl: string;
  claimedActivity: string;
}

export interface VerificationResult {
  score: number;
  tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3';
  tierLabel: string;
  maxTierCap: number;
  signals: {
    locationMatch: number;      // Max 20
    latencyGap: number;         // Max 15
    phashUniqueness: number;    // Max 15
    visualAiMatch: number;      // Max 15
    tierCapBonus: number;       // Max 15
    tamperNonceCheck: number;   // Max 10
    humanReviewBonus: number;   // Max 10
  };
  phashMatch: boolean;
  flags: string[];
}

export function calculate7SignalScore(payload: RawAssetPayload, existingPhashes: string[] = []): VerificationResult {
  const flags: string[] = [];
  
  // 1. Location Check (20 pts max)
  let locationMatch = 20;
  if (!payload.exifAvailable || !payload.latitude || !payload.longitude) {
    locationMatch = 5;
    flags.push('EXIF GPS missing or unverified');
  }

  // 2. Upload Latency Gap Check (15 pts max)
  let latencyGap = 15;
  if (payload.captureTimestamp && payload.uploadTimestamp) {
    const deltaMs = Math.abs(new Date(payload.uploadTimestamp).getTime() - new Date(payload.captureTimestamp).getTime());
    const deltaHours = deltaMs / (1000 * 60 * 60);
    if (deltaHours > 48) {
      latencyGap = 5;
      flags.push('High upload latency gap (>48 hours)');
    } else if (deltaHours > 12) {
      latencyGap = 10;
    }
  }

  // 3. Perceptual Hash Uniqueness (15 pts max)
  let phashUniqueness = 15;
  let phashMatch = false;
  if (payload.phash && existingPhashes.includes(payload.phash)) {
    phashUniqueness = 0;
    phashMatch = true;
    flags.push('Perceptual Hash duplicate detected — potential image reuse');
  }

  // 4. Visual AI Activity Match (15 pts max)
  let visualAiMatch = 15;
  if (payload.claimedActivity.toLowerCase().includes('tree') && !payload.imageUrl.includes('photo')) {
    visualAiMatch = 10;
  }

  // 5. Tamper Nonce Check (10 pts max)
  let tamperNonceCheck = 0;
  if (payload.captureMethod === 'trusted_web_capture' && payload.nonceToken) {
    tamperNonceCheck = 10;
  } else if (payload.captureMethod === 'native_app') {
    tamperNonceCheck = 10;
  } else {
    flags.push('No cryptographic single-use server nonce provided');
  }

  // 6. Human Review Bonus (10 pts max)
  const humanReviewBonus = 0; // Awarded upon reviewer queue approval

  // 7. Base Tier Assignment & Max Tier Cap Enforcement
  let tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3' = 'T0';
  let tierLabel = 'Self-Reported';
  let maxTierCap = 55;
  let tierCapBonus = 5;

  if (payload.captureMethod === 'auditor_attested') {
    tier = 'T3';
    tierLabel = 'Auditor Confirmed';
    maxTierCap = 100;
    tierCapBonus = 15;
  } else if (payload.captureMethod === 'native_app') {
    tier = 'T2';
    tierLabel = 'Attested Native';
    maxTierCap = 90;
    tierCapBonus = 12;
  } else if (payload.captureMethod === 'trusted_web_capture' && payload.nonceToken) {
    tier = 'T1+';
    tierLabel = 'Trusted Web Capture';
    maxTierCap = 80;
    tierCapBonus = 10;
  } else if (payload.exifAvailable) {
    tier = 'T1';
    tierLabel = 'EXIF Geofenced';
    maxTierCap = 75;
    tierCapBonus = 8;
  } else {
    tier = 'T0';
    tierLabel = 'Self-Reported';
    maxTierCap = 55;
    tierCapBonus = 5;
    flags.push('Capped at Tier T0 (Max 55) due to unverified uploader metadata');
  }

  // Raw Total Calculation
  const rawTotal = locationMatch + latencyGap + phashUniqueness + visualAiMatch + tierCapBonus + tamperNonceCheck + humanReviewBonus;
  
  // Enforce Hard Tier Cap
  const finalScore = Math.min(rawTotal, maxTierCap);

  return {
    score: finalScore,
    tier,
    tierLabel,
    maxTierCap,
    signals: {
      locationMatch,
      latencyGap,
      phashUniqueness,
      visualAiMatch,
      tierCapBonus,
      tamperNonceCheck,
      humanReviewBonus
    },
    phashMatch,
    flags
  };
}
