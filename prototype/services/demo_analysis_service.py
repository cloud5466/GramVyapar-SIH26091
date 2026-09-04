"""Phase 3 service combining real finance output with illustrative placeholders."""

from uuid import uuid4

from engines.finance_engine import calculate_finance
from models.schemas import (
    AdvisoryInsights,
    AnalysisRequest,
    AnalysisResponse,
    BusinessContext,
    BusinessPotential,
    FinanceSummary,
    LocalMarket,
)


BUSINESS_DISPLAY_NAMES = {
    "dairy": "Dairy",
    "tailoring": "Tailoring",
    "kirana": "Kirana",
}

LOCATION_DISPLAY_NAMES = {
    "demo-location-01": "Demo Location 1",
    "demo-location-02": "Demo Location 2",
}

SUMMARY = (
    "Your business idea has been received successfully. Its financial structure "
    "uses the configured rule dataset. Verified local-market analysis will be "
    "enabled after data integration."
)

DISCLAIMER = (
    "Illustrative prototype analysis — business potential and local-market "
    "insights remain illustrative. Final eligibility and loan sanction remain "
    "subject to the authorised financing agency and applicable scheme conditions."
)


def create_demo_analysis(request: AnalysisRequest) -> AnalysisResponse:
    """Build the deterministic illustrative Phase 2B response."""

    business_name = BUSINESS_DISPLAY_NAMES.get(
        request.business_id.casefold(), "Demo Business"
    )
    location_name = LOCATION_DISPLAY_NAMES.get(request.location_id, "Demo Location")
    finance_result = calculate_finance(request.available_capital)

    return AnalysisResponse(
        analysis_id=str(uuid4()),
        mode="illustrative",
        business=BusinessContext(
            business_id=request.business_id,
            business_name=business_name,
            location_id=request.location_id,
            location_name=location_name,
        ),
        business_potential=BusinessPotential(score=76, rating="Promising"),
        local_market=LocalMarket(
            population_estimate=None,
            mapped_competitors=None,
            confidence="illustrative",
        ),
        finance=FinanceSummary(
            available_capital=float(finance_result.available_capital),
            margin_percentage=float(finance_result.margin_percentage),
            project_cost=float(finance_result.project_cost),
            potential_financing=(
                float(finance_result.potential_financing)
                if finance_result.potential_financing is not None
                else None
            ),
            scheme_id=finance_result.scheme_id,
            scheme_name=finance_result.scheme_name,
            finance_percentage=(
                float(finance_result.finance_percentage)
                if finance_result.finance_percentage is not None
                else None
            ),
            interest_rate=(
                float(finance_result.interest_rate)
                if finance_result.interest_rate is not None
                else None
            ),
            repayment_years=(
                float(finance_result.repayment_years)
                if finance_result.repayment_years is not None
                else None
            ),
            moratorium_months=finance_result.moratorium_months,
            maximum_financing=(
                float(finance_result.maximum_financing)
                if finance_result.maximum_financing is not None
                else None
            ),
            rule_source=finance_result.rule_source,
            rule_verified_date=finance_result.rule_verified_date,
            status=finance_result.status,
            reason_code=finance_result.reason_code,
            notes=finance_result.notes,
        ),
        insights=AdvisoryInsights(
            summary=SUMMARY,
            opportunities=[
                "Review local customer demand",
                "Understand nearby alternatives",
                "Compare supplier options",
            ],
            risks=[
                "Verified local market evidence is not connected yet",
                "Final financing eligibility is decided by the authorised agency",
            ],
            next_steps=[
                "Validate demand with potential customers",
                "Check supplier and operating costs",
                "Review official financing requirements",
            ],
        ),
        sources=[],
        disclaimer=DISCLAIMER,
    )
