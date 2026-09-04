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

export interface LocalMarket {
  population_estimate: number | null;
  mapped_competitors: number | null;
  confidence: string;
}

export interface FinanceSummary {
  available_capital: number;
  project_cost: number | null;
  potential_financing: number | null;
  scheme_name: string | null;
  interest_rate: number | null;
  repayment_years: number | null;
  moratorium_months: number | null;
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
  sources: unknown[];
  disclaimer: string;
}

const configuredApiUrl = process.env.NEXT_PUBLIC_GRAMVYAPAR_API_URL?.trim();
const API_BASE_URL = (configuredApiUrl || 'http://localhost:8000').replace(/\/+$/, '');

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
    throw new Error('GramVyapar analysis request was not successful.');
  }

  return (await response.json()) as AnalysisResponse;
}
