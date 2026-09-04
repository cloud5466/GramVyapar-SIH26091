"""Illustrative Phase 2B service for validating API request/response plumbing."""

from uuid import uuid4

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
    "Your business idea has been received successfully. Verified local-market "
    "and financial analysis will be enabled after data and financial-rule "
    "integration."
)

DISCLAIMER = (
    "Illustrative prototype analysis — verified local and financial data "
    "integration is not enabled in Phase 2."
)


def create_demo_analysis(request: AnalysisRequest) -> AnalysisResponse:
    """Build the deterministic illustrative Phase 2B response."""

    business_name = BUSINESS_DISPLAY_NAMES.get(
        request.business_id.casefold(), "Demo Business"
    )
    location_name = LOCATION_DISPLAY_NAMES.get(request.location_id, "Demo Location")

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
            available_capital=request.available_capital,
            project_cost=None,
            potential_financing=None,
            scheme_name=None,
            interest_rate=None,
            repayment_years=None,
            moratorium_months=None,
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
                "Financial eligibility has not been calculated yet",
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
