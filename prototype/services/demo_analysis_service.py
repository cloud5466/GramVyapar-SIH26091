"""Orchestrate deterministic engines, then explain their output safely."""

from uuid import uuid4

from ai.provider import AISettings, AdvisoryProvider
from engines.advisory_engine import create_advisory
from engines.finance_engine import calculate_finance
from engines.local_data_engine import get_local_evidence
from engines.viability_engine import calculate_business_potential
from models.schemas import (
    AdvisoryInsights,
    AnalysisRequest,
    AnalysisResponse,
    BusinessContext,
    BusinessProfileEvidence,
    CompetitorDetail,
    EvidenceBusinessProfile,
    EvidenceFinance,
    EvidenceLocalMarket,
    EvidencePack,
    EvidenceSource,
    EvidenceUserInput,
    FinanceSummary,
    LocalMarket,
    UserLocalInputEvidence,
)


DISCLAIMER = (
    "Business Potential Score is a decision-support indicator based on available "
    "evidence. It does not guarantee business success, profitability or loan "
    "approval. Population is an estimate and mapped-business coverage may be "
    "incomplete."
)


def _finance_summary(finance_result) -> FinanceSummary:
    return FinanceSummary(
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
        cap_applied=finance_result.cap_applied,
        rule_source=finance_result.rule_source,
        rule_verified_date=finance_result.rule_verified_date,
        status=finance_result.status,
        reason_code=finance_result.reason_code,
        notes=finance_result.notes,
    )


def _local_market(local_result) -> LocalMarket:
    profile = local_result.business_profile
    location = local_result.location
    user_input = local_result.user_local_input
    return LocalMarket(
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
                local_price=(float(user_input.local_price) if user_input.local_price is not None else None),
                monthly_rent=(float(user_input.monthly_rent) if user_input.monthly_rent is not None else None),
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
    )


def _evidence_pack(
    request: AnalysisRequest,
    business: BusinessContext,
    local_market: LocalMarket,
    finance: FinanceSummary,
    business_potential,
) -> EvidencePack:
    user_local = local_market.user_local_inputs
    profile = local_market.business_profile
    return EvidencePack(
        response_language="Hindi" if request.language == "hi" else "English",
        user_input=EvidenceUserInput(
            location_id=request.location_id,
            location_name=business.location_name,
            business_id=request.business_id,
            business_name=business.business_name,
            available_capital=request.available_capital,
            known_competitors=user_local.known_competitors if user_local else None,
            local_price=user_local.local_price if user_local else None,
            monthly_rent=user_local.monthly_rent if user_local else None,
            supplier_distance_km=user_local.supplier_distance_km if user_local else None,
            existing_experience=user_local.existing_experience if user_local else None,
        ),
        local_market=EvidenceLocalMarket(
            population_estimate=local_market.population_estimate,
            population_year=local_market.population_year,
            population_source=local_market.population_source,
            population_confidence=local_market.population_confidence,
            mapped_competitors=local_market.mapped_competitors,
            competitor_radius_km=local_market.competitor_radius_km,
            competitor_names=[item.business_name for item in local_market.competitors],
            evidence_status=local_market.evidence_status,
            warnings=local_market.warnings,
        ),
        business_profile=EvidenceBusinessProfile(
            customer_type=profile.customer_type,
            supplier_dependency=profile.supplier_dependency,
            seasonality=profile.seasonality,
            main_operational_risks=profile.main_operational_risks,
            key_demand_indicators=profile.key_demand_indicators,
        ),
        finance=EvidenceFinance(**finance.model_dump()),
        business_potential=business_potential,
    )


def create_demo_analysis(
    request: AnalysisRequest,
    *,
    advisory_settings: AISettings | None = None,
    advisory_provider: AdvisoryProvider | None = None,
) -> AnalysisResponse:
    """Run deterministic analysis before the optional advisory layer."""

    local_result = get_local_evidence(request.location_id, request.business_id)
    finance_result = calculate_finance(request.available_capital)
    business_potential = calculate_business_potential(local_result, finance_result)
    profile = local_result.business_profile
    location = local_result.location

    business = BusinessContext(
        business_id=profile.business_id,
        business_name=profile.business_name,
        location_id=location.location_id,
        location_name=location.location_name,
    )
    local_market = _local_market(local_result)
    finance = _finance_summary(finance_result)
    evidence_pack = _evidence_pack(
        request, business, local_market, finance, business_potential
    )
    advisory = create_advisory(
        evidence_pack,
        settings=advisory_settings,
        provider=advisory_provider,
    )

    sources: list[EvidenceSource] = []
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
        mode="deterministic-prototype",
        business=business,
        business_potential=business_potential,
        local_market=local_market,
        finance=finance,
        advisory=advisory,
        insights=AdvisoryInsights(
            summary=advisory.summary,
            opportunities=advisory.opportunities,
            risks=advisory.risks,
            next_steps=advisory.next_steps,
        ),
        sources=sources,
        disclaimer=DISCLAIMER,
    )
