export interface AnalysisRequest {
  location_id: string;
  business_id: string;
  available_capital: number;
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

export interface AnalysisResponse {
  analysis_id: string;
  mode: string;
  business: BusinessContext;
  business_potential: BusinessPotential;
  local_market: LocalMarket;
  finance: FinanceSummary;
  insights: AdvisoryInsights;
  sources: EvidenceSource[];
  disclaimer: string;
}

const configuredApiUrl = process.env.NEXT_PUBLIC_GRAMVYAPAR_API_URL?.trim();
const API_BASE_URL = (configuredApiUrl || 'http://localhost:8000').replace(/\/+$/, '');

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
