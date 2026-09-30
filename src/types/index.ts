export type AssuranceTier = 'T0' | 'T1' | 'T1+' | 'T2' | 'T3';

export type SyntheticRiskLevel = 'low' | 'medium' | 'high';

export type AssetStatus = 'verified' | 'flagged' | 'under_review' | 'rejected';

export interface ScoreReason {
  signal: string;
  description: string;
  points: number;
  passed: boolean;
}

export interface ExifData {
  lat?: number;
  lng?: number;
  date?: string;
  camera?: string;
  software?: string;
  hasGps: boolean;
  hasTimestamp: boolean;
}

export interface AIAnalysis {
  activity: string;
  condition: 'before' | 'during' | 'after' | 'unclear';
  scene: {
    terrain: string;
    season_cues: string;
    weather_cues: string;
  };
  objects: string[];
  counts: Record<string, { min: number; max: number }>;
  quality_flags: string[];
  synthetic_risk: {
    level: SyntheticRiskLevel;
    cues: string[];
    confidence: number;
  };
  location_cues: string[];
  confidence: number;
}

export interface Asset {
  id: string;
  site_id: string;
  site_name: string;
  project_id: string;
  project_name: string;
  cloudinary_public_id: string;
  url: string;
  thumbnail_url: string;
  sha256: string;
  phash: string;
  exif: ExifData;
  server_upload_time: string;
  captured_at: string;
  ai_json: AIAnalysis;
  tags: string[];
  score: number;
  raw_score: number;
  tier: AssuranceTier;
  tier_name: string;
  score_reasons: ScoreReason[];
  synthetic_risk_level: SyntheticRiskLevel;
  status: AssetStatus;
  is_duplicate?: boolean;
  duplicate_of_id?: string;
  location_mismatch?: boolean;
  capture_method: 'self_reported' | 'trusted_web' | 'attested_native' | 'third_party';
}

export interface Site {
  id: string;
  project_id: string;
  name: string;
  lat: number;
  lng: number;
  radius_m: number;
  asset_count: number;
  before_asset_id?: string;
  after_asset_id?: string;
  change_summary?: string;
  comparability?: 'high' | 'medium' | 'low';
}

export interface Project {
  id: string;
  name: string;
  org_name: string;
  type: string;
  start_date: string;
  end_date: string;
  total_assets: number;
  verified_count: number;
  flagged_count: number;
  sites: Site[];
  evidence_coverage: number; // percentage
}

export type ClaimGrade = 'Strong' | 'Weak' | 'Unsupported' | 'Contradicted' | 'Supported' | 'Partially supported' | 'Unverifiable' | 'Vague';

export interface Claim {
  id: string;
  project_id: string;
  text: string;
  type: string;
  period: string;
  grade: ClaimGrade;
  supporting_asset_ids: string[];
  contradicting_asset_ids?: string[];
  missing_evidence?: string;
  prosecutor_notes?: string[];
  defender_notes?: string[];
  judge_verdict?: string;
}

export interface ExtractedClaim {
  id: string;
  page: number;
  text: string;
  what: string;
  quantity: string;
  unit: string;
  place: string;
  period: string;
  baseline: string;
  verification_mentioned: boolean;
  vague_terms: string[];
  quality_checks: {
    concrete_action: boolean;
    quantity_present: boolean;
    site_stated: boolean;
    period_stated: boolean;
    baseline_stated: boolean;
    third_party_assurance: boolean;
  };
  grade: ClaimGrade;
  linked_asset_ids: string[];
  assurance_tier?: AssuranceTier;
}

export interface ReportCard {
  id: string;
  company_name: string;
  filename: string;
  report_title: string;
  overall_grade: 'A' | 'B' | 'C' | 'D' | 'E';
  metrics: {
    specificity: number; // % concrete claims
    evidence_coverage: number; // % claims with proof
    evidence_trust: string; // Highest tier e.g. T1
    consistency: number; // % consistent metrics
  };
  extracted_claims: ExtractedClaim[];
}

export interface ReviewItem {
  id: string;
  asset: Asset;
  risk_factor: 'synthetic_risk' | 'duplicate_reuse' | 'location_mismatch' | 'low_score' | 'metadata_missing';
  flag_reason: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'reshoot_requested';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  cited_asset_ids?: string[];
  action_type?: 'open_slider' | 'view_review' | 'generate_report' | 'filter_assets';
  action_data?: Record<string, any>;
}
