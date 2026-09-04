export interface AnalysisRequest {
  location_id: string;
  business_id: string;
  available_capital: number;
  language?: 'en' | 'hi';
}

export interface BusinessContext {
  business_id: string;
  business_name: string;
  location_id: string;
  location_name: string;
}

export interface BusinessPotential {
  score: number;
  rating: string;
  methodology_version: string;
  score_type: string;
  confidence: 'high' | 'medium' | 'low';
  components: BusinessPotentialComponents;
  missing_evidence: string[];
  disclaimer: string;
}

export interface ScoreComponent {
  score: number;
  max_score: number;
  reason: string;
  evidence_used: string[];
  confidence: 'high' | 'medium' | 'low';
  evidence_completeness: 'high' | 'medium' | 'low';
  limitations: string[];
}

export interface BusinessPotentialComponents {
  market_opportunity: ScoreComponent;
  competition: ScoreComponent;
  financial_fit: ScoreComponent;
  operational_readiness: ScoreComponent;
}

export interface CompetitorDetail {
  business_name: string;
  distance_km: number | null;
  source: string;
  confidence: string;
}

export interface BusinessProfileEvidence {
  business_name: string;
  customer_radius_min_km: number | null;
  customer_radius_max_km: number | null;
  customer_type: string;
  supplier_dependency: string;
  seasonality: string;
  main_operational_risks: string[];
  key_demand_indicators: string[];
}

export interface UserLocalInputEvidence {
  known_competitors: number | null;
  local_price: number | null;
  monthly_rent: number | null;
  supplier_distance_km: number | null;
  existing_experience: string | null;
  input_source: string | null;
  input_date: string | null;
}

export interface LocalMarket {
  population_estimate: number | null;
  population_year: number | null;
  population_source: string | null;
  population_confidence: string | null;
  mapped_competitors: number;
  competitor_radius_km: number | null;
  competitors: CompetitorDetail[];
  location_type: string;
  evidence_status: 'complete' | 'partial' | 'limited';
  business_profile: BusinessProfileEvidence;
  user_local_inputs: UserLocalInputEvidence | null;
  warnings: string[];
}

export interface LocationOption {
  location_id: string;
  location_name: string;
  location_type: string;
}

export interface EvidenceSource {
  evidence_type: 'population' | 'mapped_competitor';
  source: string;
  confidence: string;
}

export interface FinanceSummary {
  available_capital: number;
  margin_percentage: number;
  project_cost: number;
  potential_financing: number | null;
  scheme_id: string | null;
  scheme_name: string | null;
  finance_percentage: number | null;
  interest_rate: number | null;
  repayment_years: number | null;
  moratorium_months: number | null;
  maximum_financing: number | null;
  cap_applied: boolean;
  rule_source: string | null;
  rule_verified_date: string | null;
  status: 'configured' | 'outside_configured_range';
  reason_code: 'SCHEME_MATCHED' | 'PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES';
  notes: string;
}

export interface AdvisoryInsights {
  summary: string;
  opportunities: string[];
  risks: string[];
  next_steps: string[];
}

export interface AdvisorySwot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AdvisoryResult {
  summary: string;
  why_this_score: string[];
  opportunities: string[];
  risks: string[];
  swot: AdvisorySwot;
  next_steps: string[];
  questions_to_verify: string[];
  confidence_note: string;
  disclaimer: string;
  prompt_version: 'advisory-prompt-v1';
  ai_status: 'generated' | 'fallback' | 'disabled' | 'error';
}

export interface AnalysisResponse {
  analysis_id: string;
  mode: string;
  business: BusinessContext;
  business_potential: BusinessPotential;
  local_market: LocalMarket;
  finance: FinanceSummary;
  advisory: AdvisoryResult;
  /** Deprecated compatibility mirror. New UI should use advisory. */
  insights: AdvisoryInsights;
  sources: EvidenceSource[];
  disclaimer: string;
}

const configuredApiUrl = process.env.NEXT_PUBLIC_GRAMVYAPAR_API_URL?.trim();
// An empty base URL deliberately uses the current origin in production.
const API_BASE_URL = configuredApiUrl ? configuredApiUrl.replace(/\/+$/, '') : '';

async function getErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { detail?: { message?: string } };
    return body.detail?.message;
  } catch {
    return undefined;
  }
}

export async function analyzeBusiness(request: AnalysisRequest): Promise<AnalysisResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error('GramVyapar analysis service is unavailable.');
  }

  if (!response.ok) {
    throw new Error(
      (await getErrorMessage(response)) || 'GramVyapar analysis request was not successful.',
    );
  }

  return (await response.json()) as AnalysisResponse;
}

export async function getLocations(): Promise<LocationOption[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/v1/locations`);
  } catch {
    throw new Error('GramVyapar location service is unavailable.');
  }

  if (!response.ok) {
    throw new Error('GramVyapar locations could not be loaded.');
  }

  return (await response.json()) as LocationOption[];
}
