"""Typed request, response and deterministic finance contracts."""

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


class BusinessPotential(BaseModel):
    """Illustrative Phase 2B potential result."""

    score: float
    rating: str


class LocalMarket(BaseModel):
    """Local-market fields reserved for later evidence integration."""

    population_estimate: int | None
    mapped_competitors: int | None
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
    """Analysis response with deterministic finance and phased placeholders."""

    analysis_id: str
    mode: str
    business: BusinessContext
    business_potential: BusinessPotential
    local_market: LocalMarket
    finance: FinanceSummary
    insights: AdvisoryInsights
    sources: list[object]
    disclaimer: str
