"""Typed request and response contracts for the GramVyapar prototype API."""

from typing import Annotated

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


class BusinessPotential(BaseModel):
    """Illustrative Phase 2B potential result."""

    score: float
    rating: str


class LocalMarket(BaseModel):
    """Local-market fields reserved for later evidence integration."""

    population_estimate: int | None
    mapped_competitors: int | None
    confidence: str


class FinanceSummary(BaseModel):
    """Financial fields reserved for later deterministic calculation."""

    available_capital: float
    project_cost: float | None
    potential_financing: float | None
    scheme_name: str | None
    interest_rate: float | None
    repayment_years: float | None
    moratorium_months: int | None


class AdvisoryInsights(BaseModel):
    """Static Phase 2B guidance used to validate response plumbing."""

    summary: str
    opportunities: list[str]
    risks: list[str]
    next_steps: list[str]


class AnalysisResponse(BaseModel):
    """Complete Phase 2B illustrative analysis response contract."""

    analysis_id: str
    mode: str
    business: BusinessContext
    business_potential: BusinessPotential
    local_market: LocalMarket
    finance: FinanceSummary
    insights: AdvisoryInsights
    sources: list[object]
    disclaimer: str
