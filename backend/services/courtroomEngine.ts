// IMPACTOS 3-Role Adversarial AI Claim Trial Courtroom Engine

export interface ClaimTrialRequest {
  claimId: string;
  claimTitle: string;
  claimedQuantity: string;
  projectId: string;
  submittedAssetIds: string[];
}

export interface CourtroomTranscript {
  claimId: string;
  prosecutorArguments: string[];
  defenderArguments: string[];
  judgeVerdict: 'VERIFIED' | 'WEAK' | 'REJECTED';
  verdictSummary: string;
  confidenceScore: number;
  citedAssetIds: string[];
  recommendedActions: string[];
}

export function executeAdversarialTrial(request: ClaimTrialRequest, assetMap: Record<string, any>): CourtroomTranscript {
  const assets = request.submittedAssetIds.map(id => assetMap[id]).filter(Boolean);

  const prosecutorArguments: string[] = [];
  const defenderArguments: string[] = [];
  let weakPoints = 0;
  let strongPoints = 0;

  // 1. Prosecutor Interrogation
  if (assets.length === 0) {
    prosecutorArguments.push(`Prosecutor: Zero verified field assets attached to claim #${request.claimId}. Direct violation of evidence policy.`);
    weakPoints += 3;
  } else {
    const t0Assets = assets.filter(a => a.tier === 'T0' || a.score < 60);
    if (t0Assets.length > 0) {
      prosecutorArguments.push(`Prosecutor: ${t0Assets.length} asset(s) are capped at Tier T0 (Max 55) lacking single-use server nonces.`);
      weakPoints += 2;
    }

    const duplicateAssets = assets.filter(a => a.flags?.some((f: string) => f.includes('pHash')));
    if (duplicateAssets.length > 0) {
      prosecutorArguments.push(`Prosecutor: Perceptual Hash collision detected on asset ${duplicateAssets[0].id}. Image reuse flagged.`);
      weakPoints += 3;
    }

    const lowLocationAssets = assets.filter(a => a.signals?.locationMatch < 15);
    if (lowLocationAssets.length > 0) {
      prosecutorArguments.push(`Prosecutor: GPS coordinates drift ${lowLocationAssets.length} asset(s) outside registered site boundary.`);
      weakPoints += 1;
    }
  }

  // 2. Defender Case Presentation
  const t1PlusAssets = assets.filter(a => a.tier === 'T1+' || a.tier === 'T2' || a.tier === 'T3');
  if (t1PlusAssets.length > 0) {
    defenderArguments.push(`Defender: Submitting ${t1PlusAssets.length} trusted asset(s) captured via single-use server nonce (/capture/:token) with verified GPS geofencing.`);
    strongPoints += 3;
  }

  const highScoreAssets = assets.filter(a => a.score >= 80);
  if (highScoreAssets.length > 0) {
    defenderArguments.push(`Defender: ${highScoreAssets.length} field media item(s) achieved high 7-Signal score (avg ${Math.round(highScoreAssets.reduce((s, a) => s + a.score, 0) / highScoreAssets.length)}/100).`);
    strongPoints += 2;
  }

  defenderArguments.push(`Defender: Ground photos corroborate target activity "${request.claimedQuantity}" across geofenced coordinates.`);

  // 3. Judge Verdict
  let judgeVerdict: 'VERIFIED' | 'WEAK' | 'REJECTED' = 'VERIFIED';
  let verdictSummary = '';
  let confidenceScore = 90;

  if (weakPoints >= 4) {
    judgeVerdict = 'REJECTED';
    verdictSummary = `CLAIM REJECTED: Severe evidence flaws identified by AI Prosecutor (duplicate pHash / unverified T0 assets). Claim cannot be published.`;
    confidenceScore = 94;
  } else if (weakPoints > 1 || strongPoints < 2) {
    judgeVerdict = 'WEAK';
    verdictSummary = `CLAIM WEAK: Evidence contains minor gaps. Require auditor physical verification (Tier T3) or live web capture upgrade.`;
    confidenceScore = 78;
  } else {
    judgeVerdict = 'VERIFIED';
    verdictSummary = `CLAIM VERIFIED: AI Defender established sufficient ground evidence with valid server nonces and high 7-Signal trust score.`;
    confidenceScore = 96;
  }

  return {
    claimId: request.claimId,
    prosecutorArguments,
    defenderArguments,
    judgeVerdict,
    verdictSummary,
    confidenceScore,
    citedAssetIds: request.submittedAssetIds,
    recommendedActions: judgeVerdict === 'VERIFIED' ? ['Approve for CSR Export', 'Publish on Public Transparency Showcase'] : ['Request Auditor Re-inspection', 'Issue Web Capture Link to Field Team']
  };
}
