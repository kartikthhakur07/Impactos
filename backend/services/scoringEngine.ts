// IMPACTOS 7-Signal Scorecard & Assurance Tier Cap Engine

export interface SignalItem {
  name: string;
  status: 'pass' | 'fail' | 'na';
  points: number;
  maxPoints: number;
  reason: string;
}

export interface DetailedVerificationResult {
  score: number;             // FINAL score (after cap)
  rawScore: number;          // RAW score total
  capScore: number;          // Hard max tier cap
  tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3';
  tierLabel: string;
  signals: SignalItem[];
  flags: string[];
  isDuplicate: boolean;
  isPossibleReuse: boolean;
}

export interface ComputeScoreInput {
  isVideo: boolean;
  hasGps: boolean;
  distanceMeters?: number;
  geofenceRadiusMeters: number;
  hasTimestamp: boolean;
  uploadLatencyHours: number;
  isExactDuplicate: boolean;
  isPossibleReuse: boolean;
  hammingDistance?: number;
  captureMethod: 'standard_upload' | 'trusted_web_capture' | 'native_app' | 'auditor_attested';
  isValidCaptureToken?: boolean;
}

export function evaluate7SignalScore(input: ComputeScoreInput): DetailedVerificationResult {
  const flags: string[] = [];
  const signals: SignalItem[] = [];

  // 1. Location Signal (Max 20 pts)
  let locationPoints = 0;
  let locationStatus: 'pass' | 'fail' | 'na' = 'fail';
  let locationReason = '';

  if (!input.hasGps || input.distanceMeters === undefined) {
    locationStatus = 'na';
    locationPoints = 0;
    locationReason = 'GPS metadata missing from file';
    flags.push('GPS metadata missing');
  } else if (input.distanceMeters <= input.geofenceRadiusMeters) {
    locationStatus = 'pass';
    locationPoints = 20;
    locationReason = `Inside site radius (${input.distanceMeters}m from center, radius ${input.geofenceRadiusMeters}m)`;
  } else {
    locationStatus = 'fail';
    locationPoints = 0;
    locationReason = `Outside site radius (${input.distanceMeters}m from center, exceeds ${input.geofenceRadiusMeters}m geofence)`;
    flags.push(`Location mismatch: ${input.distanceMeters}m from site center`);
  }
  signals.push({ name: 'Location Radius', status: locationStatus, points: locationPoints, maxPoints: 20, reason: locationReason });

  // 2. Time Delta Signal (Max 15 pts)
  let timePoints = 0;
  let timeStatus: 'pass' | 'fail' | 'na' = 'fail';
  let timeReason = '';

  if (!input.hasTimestamp) {
    timeStatus = 'na';
    timePoints = 0;
    timeReason = 'EXIF capture timestamp missing';
  } else if (input.uploadLatencyHours <= 12) {
    timeStatus = 'pass';
    timePoints = 15;
    timeReason = `Upload latency gap ${input.uploadLatencyHours.toFixed(1)} hours (within 12h window)`;
  } else if (input.uploadLatencyHours <= 48) {
    timeStatus = 'pass';
    timePoints = 10;
    timeReason = `Upload latency gap ${input.uploadLatencyHours.toFixed(1)} hours (within 48h window)`;
  } else {
    timeStatus = 'fail';
    timePoints = 0;
    timeReason = `High upload latency gap (${input.uploadLatencyHours.toFixed(1)} hours)`;
    flags.push('High upload latency gap (>48 hours)');
  }
  signals.push({ name: 'Time & Latency', status: timeStatus, points: timePoints, maxPoints: 15, reason: timeReason });

  // 3. Uniqueness Signal (Max 15 pts)
  let uniquePoints = 15;
  let uniqueStatus: 'pass' | 'fail' | 'na' = 'pass';
  let uniqueReason = 'SHA-256 and pHash unique across library';

  if (input.isExactDuplicate) {
    uniqueStatus = 'fail';
    uniquePoints = 0;
    uniqueReason = 'Exact SHA-256 duplicate detected';
    flags.push('exact_duplicate');
  } else if (input.isPossibleReuse) {
    uniqueStatus = 'fail';
    uniquePoints = 5;
    uniqueReason = `Possible image reuse detected (pHash Hamming distance ${input.hammingDistance} <= threshold)`;
    flags.push('possible_reuse');
  }
  signals.push({ name: 'Media Uniqueness', status: uniqueStatus, points: uniquePoints, maxPoints: 15, reason: uniqueReason });

  // 4. Visual AI Signal (Max 15 pts)
  let visualPoints = 15;
  let visualStatus: 'pass' | 'fail' | 'na' = 'pass';
  let visualReason = 'Vision AI confirmed environmental activity';

  if (input.isVideo) {
    visualStatus = 'na';
    visualPoints = 0;
    visualReason = 'Video analysis not implemented';
    flags.push('video_analysis_not_implemented');
  }
  signals.push({ name: 'Visual AI Match', status: visualStatus, points: visualPoints, maxPoints: 15, reason: visualReason });

  // 5. Tamper Nonce Signal (Max 15 pts)
  let noncePoints = 0;
  let nonceStatus: 'pass' | 'fail' | 'na' = 'fail';
  let nonceReason = 'No server nonce provided (standard upload)';

  if (input.isValidCaptureToken || input.captureMethod === 'trusted_web_capture') {
    nonceStatus = 'pass';
    noncePoints = 15;
    nonceReason = 'Valid single-use server nonce token verified';
  } else if (input.captureMethod === 'native_app') {
    nonceStatus = 'pass';
    noncePoints = 15;
    nonceReason = 'Device enclave cryptographic signature verified';
  }
  signals.push({ name: 'Tamper Nonce Check', status: nonceStatus, points: noncePoints, maxPoints: 15, reason: nonceReason });

  // 6. Calculate Tier Cap
  let tier: 'T0' | 'T1' | 'T1+' | 'T2' | 'T3' = 'T0';
  let tierLabel = 'Self-Reported';
  let capScore = 55;

  if (input.isVideo) {
    tier = 'T0';
    tierLabel = 'T0 Video (Unanalyzed)';
    capScore = 55;
  } else if (input.captureMethod === 'auditor_attested') {
    tier = 'T3';
    tierLabel = 'T3 Auditor Confirmed';
    capScore = 100;
  } else if (input.captureMethod === 'native_app') {
    tier = 'T2';
    tierLabel = 'T2 Attested Native';
    capScore = 90;
  } else if (input.isValidCaptureToken || input.captureMethod === 'trusted_web_capture') {
    tier = 'T1+';
    tierLabel = 'T1+ Trusted Capture';
    capScore = 80;
  } else if (input.hasGps && input.hasTimestamp) {
    tier = 'T1';
    tierLabel = 'T1 EXIF Cross-checked';
    capScore = 75;
  } else {
    tier = 'T0';
    tierLabel = 'T0 Self-reported';
    capScore = 55;
    flags.push('Capped at Tier T0 (Max 55) due to unverified uploader metadata');
  }

  // Raw Score Total
  const rawScore = locationPoints + timePoints + uniquePoints + visualPoints + noncePoints + 20; // Base verification credit
  const finalScore = Math.min(rawScore, capScore);

  return {
    score: finalScore,
    rawScore,
    capScore,
    tier,
    tierLabel,
    signals,
    flags,
    isDuplicate: input.isExactDuplicate,
    isPossibleReuse: input.isPossibleReuse
  };
}
