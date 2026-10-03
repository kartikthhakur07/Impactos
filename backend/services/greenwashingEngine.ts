// IMPACTOS Greenwashing CSR Report Card Audit Engine

export interface CSRReportAuditInput {
  reportTitle: string;
  organizationName: string;
  reportYear: number;
  extractedClaimsText: string[];
}

export interface ClaimAuditRuleResult {
  claimText: string;
  specificityRules: {
    what: boolean;       // What action named
    howMuch: boolean;    // Quantitative metric declared
    where: boolean;      // Site/location declared
    when: boolean;       // Timeframe stated
    baseline: boolean;   // Comparison baseline declared
  };
  scorePercentage: number;
  groundEvidenceMatched: boolean;
  greenwashingRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

export interface CSRReportAuditResult {
  reportTitle: string;
  organizationName: string;
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  overallSpecificityScore: number;
  totalClaimsAnalyzed: number;
  verifiedGroundClaims: number;
  flaggedGreenwashingClaims: number;
  claimAudits: ClaimAuditRuleResult[];
  timestamp: string;
}

export function auditCSRReport(input: CSRReportAuditInput): CSRReportAuditResult {
  const claimAudits: ClaimAuditRuleResult[] = input.extractedClaimsText.map((claimText, idx) => {
    const textLower = claimText.toLowerCase();

    // 1. Check 5 Specificity Rules
    const what = textLower.includes('planted') || textLower.includes('installed') || textLower.includes('restored') || textLower.includes('collected') || textLower.includes('protected');
    const howMuch = /\d+/.test(claimText) || textLower.includes('hectare') || textLower.includes('trees') || textLower.includes('mw') || textLower.includes('tons');
    const where = textLower.includes('site') || textLower.includes('basin') || textLower.includes('delta') || textLower.includes('district') || textLower.includes('array') || textLower.includes('sundarbans') || textLower.includes('kenya') || textLower.includes('amazon');
    const when = textLower.includes('202') || textLower.includes('month') || textLower.includes('year') || textLower.includes('quarter');
    const baseline = textLower.includes('baseline') || textLower.includes('compared to') || textLower.includes('increase') || textLower.includes('prior') || textLower.includes('2024');

    const matchedRules = [what, howMuch, where, when, baseline].filter(Boolean).length;
    const scorePercentage = Math.round((matchedRules / 5) * 100);

    const flags: string[] = [];
    if (!what) flags.push('Vague action verbs used');
    if (!howMuch) flags.push('Missing quantitative metric');
    if (!where) flags.push('Specific site location not disclosed');
    if (!when) flags.push('Timeframe boundary missing');
    if (!baseline) flags.push('No comparison baseline provided');

    let greenwashingRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (matchedRules <= 2) {
      greenwashingRiskLevel = 'HIGH';
    } else if (matchedRules <= 3) {
      greenwashingRiskLevel = 'MEDIUM';
    }

    return {
      claimText,
      specificityRules: { what, howMuch, where, when, baseline },
      scorePercentage,
      groundEvidenceMatched: matchedRules >= 3,
      greenwashingRiskLevel,
      flags
    };
  });

  const avgScore = Math.round(
    claimAudits.reduce((sum, c) => sum + c.scorePercentage, 0) / (claimAudits.length || 1)
  );

  let overallGrade: 'A' | 'B' | 'C' | 'D' | 'E' = 'A';
  if (avgScore >= 90) overallGrade = 'A';
  else if (avgScore >= 75) overallGrade = 'B';
  else if (avgScore >= 60) overallGrade = 'C';
  else if (avgScore >= 45) overallGrade = 'D';
  else overallGrade = 'E';

  const verifiedGroundClaims = claimAudits.filter(c => c.groundEvidenceMatched).length;
  const flaggedGreenwashingClaims = claimAudits.filter(c => c.greenwashingRiskLevel === 'HIGH').length;

  return {
    reportTitle: input.reportTitle,
    organizationName: input.organizationName,
    overallGrade,
    overallSpecificityScore: avgScore,
    totalClaimsAnalyzed: claimAudits.length,
    verifiedGroundClaims,
    flaggedGreenwashingClaims,
    claimAudits,
    timestamp: new Date().toISOString()
  };
}
