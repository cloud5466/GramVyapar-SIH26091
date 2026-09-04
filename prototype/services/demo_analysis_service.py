"""Combine dataset-backed local evidence and finance with illustrative viability."""

from uuid import uuid4

from engines.finance_engine import calculate_finance
from engines.local_data_engine import get_local_evidence
from models.schemas import (
    AdvisoryInsights,
    AnalysisRequest,
    AnalysisResponse,
    BusinessProfileEvidence,
    BusinessContext,
    BusinessPotential,
    CompetitorDetail,
    EvidenceSource,
    FinanceSummary,
    LocalMarket,
    UserLocalInputEvidence,
)

SUMMARY = (
    "Your local evidence and financial structure were loaded from configured "
    "datasets. The business-potential score remains illustrative until the "
    "viability engine is implemented."
)

DISCLAIMER = (
    "Business potential and advisory text remain illustrative. Population is an "
    "estimate and mapped-business coverage may be incomplete. Final eligibility "
    "and loan sanction remain subject to the authorised financing agency and "
    "applicable scheme conditions."
)


def create_demo_analysis(request: AnalysisRequest) -> AnalysisResponse:
    """Build a Phase 4 response without viability scoring or AI."""

    local_result = get_local_evidence(request.location_id, request.business_id)
    finance_result = calculate_finance(request.available_capital)
    profile = local_result.business_profile
    location = local_result.location
    user_input = local_result.user_local_input

    sources = []
    if location.population_source and location.population_confidence:
        sources.append(
            EvidenceSource(
                evidence_type="population",
                source=location.population_source,
                confidence=location.population_confidence,
            )
        )
    for competitor in local_result.competitors:
        source = EvidenceSource(
            evidence_type="mapped_competitor",
            source=competitor.source,
            confidence=competitor.confidence,
        )
        if source not in sources:
            sources.append(source)

    return AnalysisResponse(
        analysis_id=str(uuid4()),
        mode="illustrative",
        business=BusinessContext(
            business_id=profile.business_id,
            business_name=profile.business_name,
            location_id=location.location_id,
            location_name=location.location_name,
        ),
        business_potential=BusinessPotential(score=76, rating="Promising"),
        local_market=LocalMarket(
            population_estimate=location.population_estimate,
            population_year=location.population_year,
            population_source=location.population_source,
            population_confidence=location.population_confidence,
            mapped_competitors=len(local_result.competitors),
            competitor_radius_km=(
                float(local_result.competitor_radius_km)
                if local_result.competitor_radius_km is not None
                else None
            ),
            competitors=[
                CompetitorDetail(
                    business_name=competitor.business_name,
                    distance_km=(
                        float(competitor.distance_km)
                        if competitor.distance_km is not None
                        else None
                    ),
                    source=competitor.source,
                    confidence=competitor.confidence,
                )
                for competitor in local_result.competitors
            ],
            location_type=location.location_type,
            evidence_status=local_result.evidence_status,
            business_profile=BusinessProfileEvidence(
                business_name=profile.business_name,
                customer_radius_min_km=(
                    float(profile.customer_radius_min_km)
                    if profile.customer_radius_min_km is not None
                    else None
                ),
                customer_radius_max_km=(
                    float(profile.customer_radius_max_km)
                    if profile.customer_radius_max_km is not None
                    else None
                ),
                customer_type=profile.customer_type,
                supplier_dependency=profile.supplier_dependency,
                seasonality=profile.seasonality,
                main_operational_risks=profile.main_operational_risks,
                key_demand_indicators=profile.key_demand_indicators,
            ),
            user_local_inputs=(
                UserLocalInputEvidence(
                    known_competitors=user_input.known_competitors,
                    local_price=(
                        float(user_input.local_price)
                        if user_input.local_price is not None
                        else None
                    ),
                    monthly_rent=(
                        float(user_input.monthly_rent)
                        if user_input.monthly_rent is not None
                        else None
                    ),
                    supplier_distance_km=(
                        float(user_input.supplier_distance_km)
                        if user_input.supplier_distance_km is not None
                        else None
                    ),
                    existing_experience=user_input.existing_experience,
                    input_source=user_input.input_source,
                    input_date=user_input.input_date,
                )
                if user_input is not None
                else None
            ),
            warnings=local_result.warnings,
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
                "Mapped-business coverage may not include every local competitor",
                "Final financing eligibility is decided by the authorised agency",
            ],
            next_steps=[
                "Validate demand with potential customers",
                "Check supplier and operating costs",
                "Review official financing requirements",
            ],
        ),
        sources=sources,
        disclaimer=DISCLAIMER,
    )
