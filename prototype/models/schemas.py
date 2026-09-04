"""Typed API, local-evidence and deterministic-finance contracts."""

from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, Field, StringConstraints


NonEmptyId = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
PositiveCapital = Annotated[float, Field(gt=0, allow_inf_nan=False)]


class AnalysisRequest(BaseModel):
    """Minimum entrepreneur input accepted by the Phase 2B analysis route."""

    location_id: NonEmptyId
    business_id: NonEmptyId
    available_capital: PositiveCapital


class BusinessContext(BaseModel):
    """Display context derived only from the submitted identifiers."""

    business_id: str
    business_name: str
    location_id: str
    location_name: str


ConfidenceLevel = Literal["high", "medium", "low"]


class ScoreComponent(BaseModel):
    """One bounded, evidence-linked part of the potential score."""

    score: int
    max_score: int
    reason: str
    evidence_used: list[str]
    confidence: ConfidenceLevel
    evidence_completeness: ConfidenceLevel
    limitations: list[str]


class BusinessPotentialComponents(BaseModel):
    """Named component scores whose configured maximums total 100."""

    market_opportunity: ScoreComponent
    competition: ScoreComponent
    financial_fit: ScoreComponent
    operational_readiness: ScoreComponent


class BusinessPotential(BaseModel):
    """Deterministic, explainable GramVyapar Business Potential Score."""

    score: int
    rating: str
    methodology_version: str
    score_type: str
    confidence: ConfidenceLevel
    components: BusinessPotentialComponents
    missing_evidence: list[str]
    disclaimer: str


class LocationRecord(BaseModel):
    """Validated canonical location row."""

    location_id: str
    location_name: str
    block: str | None
    district: str
    state: str
    latitude: Decimal
    longitude: Decimal
    location_type: str
    population_estimate: int | None
    population_year: int | None
    population_source: str | None
    population_confidence: str | None


class CompetitorRecord(BaseModel):
    """Validated mapped-business record with a canonical API business ID."""

    competitor_id: str
    location_id: str
    business_id: str
    business_name: str
    latitude: Decimal
    longitude: Decimal
    distance_km: Decimal | None
    source: str
    confidence: str


class BusinessProfile(BaseModel):
    """Structured business profile normalized to a canonical API ID."""

    source_business_id: str
    business_id: str
    business_name: str
    customer_radius_text: str
    customer_radius_min_km: Decimal | None
    customer_radius_max_km: Decimal | None
    customer_type: str
    supplier_dependency: str
    seasonality: str
    main_operational_risks: list[str]
    key_demand_indicators: list[str]


class UserLocalInput(BaseModel):
    """Optional entrepreneur evidence; blanks remain nullable, never zero."""

    input_id: str
    location_id: str
    business_id: str
    known_competitors: int | None
    local_price: Decimal | None
    monthly_rent: Decimal | None
    supplier_distance_km: Decimal | None
    existing_experience: str | None
    input_source: str | None
    input_date: date | None


class LocalDataBundle(BaseModel):
    """Validated canonical records and their checked relationships."""

    locations: list[LocationRecord]
    competitors: list[CompetitorRecord]
    business_profiles: list[BusinessProfile]
    user_local_inputs: list[UserLocalInput]


class LocalEvidenceResult(BaseModel):
    """Evidence selected for one location and business without scoring."""

    location: LocationRecord
    business_profile: BusinessProfile
    competitors: list[CompetitorRecord]
    competitor_radius_km: Decimal | None
    user_local_input: UserLocalInput | None
    configured_population_estimates: list[int]
    evidence_status: Literal["complete", "partial", "limited"]
    warnings: list[str]


class CompetitorDetail(BaseModel):
    """Mapped competitor fields safe for detailed UI display."""

    business_name: str
    distance_km: float | None
    source: str
    confidence: str


class BusinessProfileEvidence(BaseModel):
    """Business-profile evidence exposed for later deterministic scoring."""

    business_name: str
    customer_radius_min_km: float | None
    customer_radius_max_km: float | None
    customer_type: str
    supplier_dependency: str
    seasonality: str
    main_operational_risks: list[str]
    key_demand_indicators: list[str]


class UserLocalInputEvidence(BaseModel):
    """Nullable user-provided evidence included without interpretation."""

    known_competitors: int | None
    local_price: float | None
    monthly_rent: float | None
    supplier_distance_km: float | None
    existing_experience: str | None
    input_source: str | None
    input_date: date | None


class LocalMarket(BaseModel):
    """Dataset-backed Phase 4 local-market response."""

    population_estimate: int | None
    population_year: int | None
    population_source: str | None
    population_confidence: str | None
    mapped_competitors: int
    competitor_radius_km: float | None
    competitors: list[CompetitorDetail]
    location_type: str
    evidence_status: Literal["complete", "partial", "limited"]
    business_profile: BusinessProfileEvidence
    user_local_inputs: UserLocalInputEvidence | None
    warnings: list[str]


class LocationOption(BaseModel):
    """Small read-only location record used to populate the frontend picker."""

    location_id: str
    location_name: str
    location_type: str


class EvidenceSource(BaseModel):
    """Source metadata retained in the analysis envelope."""

    evidence_type: Literal["population", "mapped_competitor"]
    source: str
    confidence: str


class FinancialRule(BaseModel):
    """One validated financing rule loaded from the canonical CSV."""

    scheme_id: str
    scheme_name: str
    min_project_cost: Decimal
    max_project_cost: Decimal
    max_financing: Decimal
    interest_rate: Decimal
    repayment_years: Decimal
    moratorium_months: int
    source: str
    verified_date: date
    finance_percentage: Decimal


class FinanceResult(BaseModel):
    """Precise internal result produced by the deterministic finance engine."""

    available_capital: Decimal
    margin_percentage: Decimal
    project_cost: Decimal
    potential_financing: Decimal | None
    scheme_id: str | None
    scheme_name: str | None
    interest_rate: Decimal | None
    repayment_years: Decimal | None
    moratorium_months: int | None
    finance_percentage: Decimal | None
    maximum_financing: Decimal | None
    cap_applied: bool
    rule_source: str | None
    rule_verified_date: date | None
    status: Literal["configured", "outside_configured_range"]
    reason_code: Literal[
        "SCHEME_MATCHED", "PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES"
    ]
    notes: str


class FinanceSummary(BaseModel):
    """JSON-safe deterministic financial estimate returned to the UI."""

    available_capital: float
    margin_percentage: float
    project_cost: float
    potential_financing: float | None
    scheme_id: str | None
    scheme_name: str | None
    finance_percentage: float | None
    interest_rate: float | None
    repayment_years: float | None
    moratorium_months: int | None
    maximum_financing: float | None
    cap_applied: bool
    rule_source: str | None
    rule_verified_date: date | None
    status: Literal["configured", "outside_configured_range"]
    reason_code: Literal[
        "SCHEME_MATCHED", "PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES"
    ]
    notes: str


class AdvisoryInsights(BaseModel):
    """Static Phase 2B guidance used to validate response plumbing."""

    summary: str
    opportunities: list[str]
    risks: list[str]
    next_steps: list[str]


class AnalysisResponse(BaseModel):
    """Analysis response with deterministic local, finance and potential results."""

    analysis_id: str
    mode: str
    business: BusinessContext
    business_potential: BusinessPotential
    local_market: LocalMarket
    finance: FinanceSummary
    insights: AdvisoryInsights
    sources: list[EvidenceSource]
    disclaimer: str
