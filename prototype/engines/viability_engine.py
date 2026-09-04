"""Deterministic and explainable GramVyapar Business Potential Score."""

from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP

from loaders.viability_rules_loader import ViabilityRules, load_viability_rules
from models.schemas import (
    BusinessPotential,
    BusinessPotentialComponents,
    ConfidenceLevel,
    FinanceResult,
    LocalEvidenceResult,
    ScoreComponent,
)


SCORE_DISCLAIMER = (
    "This is an explainable decision-support score, not a prediction of "
    "business success."
)
COMPETITION_LIMITATION = (
    "Mapped competitor count is a competition proxy, not a complete market census."
)


def _rounded_integer(value: Decimal) -> int:
    return int(value.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _bounded(score: int, maximum: int) -> int:
    return max(0, min(score, maximum))


def _market_opportunity(
    evidence: LocalEvidenceResult, rules: ViabilityRules
) -> ScoreComponent:
    config = rules.market_opportunity
    population = evidence.location.population_estimate
    reference_values = sorted(set(evidence.configured_population_estimates))
    population_score = 0
    evidence_used: list[str] = []

    if population is not None and reference_values:
        minimum = min(reference_values)
        maximum = max(reference_values)
        points = config.population_points
        if minimum == maximum:
            population_score = points.single_population_value
        else:
            normalized = Decimal(population - minimum) / Decimal(maximum - minimum)
            scaled = Decimal(points.minimum) + normalized * Decimal(
                points.maximum - points.minimum
            )
            population_score = _rounded_integer(scaled)
        evidence_used.extend(
            ["population_estimate", "configured_population_range"]
        )

    profile = evidence.business_profile
    context_points = 0
    if (
        profile.customer_radius_min_km is not None
        and profile.customer_radius_max_km is not None
    ):
        context_points += config.business_context_points.customer_radius
        evidence_used.append("business_profile.customer_radius_km")
    if profile.customer_type.strip():
        context_points += config.business_context_points.customer_type
        evidence_used.append("business_profile.customer_type")
    if profile.key_demand_indicators:
        context_points += config.business_context_points.demand_indicators
        evidence_used.append("business_profile.key_demand_indicators")

    confidence_key = (evidence.location.population_confidence or "unknown").casefold()
    confidence_points = config.population_confidence_points.get(
        confidence_key, config.population_confidence_points["unknown"]
    )
    if evidence.location.population_confidence:
        evidence_used.append("population_confidence")

    context_complete = context_points == sum(
        config.business_context_points.model_dump().values()
    )
    if population is not None and confidence_key == "high" and context_complete:
        confidence: ConfidenceLevel = "high"
    elif population is not None or context_complete:
        confidence = "medium"
    else:
        confidence = "low"

    score = _bounded(
        population_score + context_points + confidence_points,
        rules.weights.market_opportunity,
    )
    if population is None:
        reason = (
            "No population estimate is available, so only the configured business "
            "context contributes to this component."
        )
    else:
        reason = (
            f"The {population:,} population estimate is normalized across the "
            f"{len(reference_values)} configured MVP locations as a customer-reach "
            "proxy, then combined with the available business-profile context."
        )
    return ScoreComponent(
        score=score,
        max_score=rules.weights.market_opportunity,
        reason=reason,
        evidence_used=evidence_used,
        confidence=confidence,
        evidence_completeness=confidence,
        limitations=[
            "Population is a proxy for potential reach, not proof of demand or sales.",
            "Normalization is relative to the small configured MVP location set.",
            "Business-profile demand indicators have not yet been measured locally.",
        ],
    )


def _competition(
    evidence: LocalEvidenceResult, rules: ViabilityRules
) -> ScoreComponent:
    config = rules.competition
    count = len(evidence.competitors)
    bucket = next(
        item
        for item in config.count_buckets
        if count >= item.min_count
        and (item.max_count is None or count <= item.max_count)
    )
    score = bucket.score
    radius = evidence.competitor_radius_km
    distances = [
        competitor.distance_km
        for competitor in evidence.competitors
        if competitor.distance_km is not None
    ]
    proximity_note = ""
    if count and radius is not None and radius > 0 and distances:
        nearest = min(distances)
        ratio = float(nearest / radius)
        penalty = next(
            (
                item.penalty
                for item in config.proximity_penalties
                if ratio <= item.max_radius_ratio
            ),
            0,
        )
        score -= penalty
        proximity_note = (
            f" The nearest mapped business is {float(nearest):g} km away within "
            f"the {float(radius):g} km configured radius."
        )

    evidence_used = ["mapped_competitor_count"]
    if radius is not None:
        evidence_used.append("business_profile.customer_radius_km")
    if distances:
        evidence_used.append("competitor_distances_km")

    if count == 0:
        confidence: ConfidenceLevel = "low"
    elif radius is not None and len(distances) == count:
        confidence = (
            "high"
            if all(item.confidence.casefold() == "high" for item in evidence.competitors)
            else "medium"
        )
    else:
        confidence = "low"

    reason = (
        f"{count} mapped competitor{' was' if count == 1 else 's were'} found "
        f"inside the configured business radius.{proximity_note}"
    )
    if count == 0:
        reason += " The score is capped because an empty map does not prove no competition."
    return ScoreComponent(
        score=_bounded(score, rules.weights.competition),
        max_score=rules.weights.competition,
        reason=reason,
        evidence_used=evidence_used,
        confidence=confidence,
        evidence_completeness=confidence,
        limitations=[COMPETITION_LIMITATION],
    )


def _financial_fit(finance: FinanceResult, rules: ViabilityRules) -> ScoreComponent:
    config = rules.financial_fit

    if finance.status == "outside_configured_range":
        score = config.outside_configured_range
        reason = (
            "The estimated project cost is outside the financial routes currently "
            "configured in GramVyapar."
        )
        evidence_used = ["finance.status", "finance.project_cost"]
        confidence: ConfidenceLevel = "high"
    elif finance.cap_applied:
        score = config.configured_with_cap
        reason = (
            "A configured financial route was found, but its maximum-financing cap "
            "limits the percentage-based amount."
        )
        evidence_used = [
            "finance.status",
            "finance.scheme_id",
            "finance.potential_financing",
            "finance.maximum_financing",
            "finance.cap_applied",
        ]
        confidence = "high" if finance.rule_source and finance.rule_verified_date else "medium"
    else:
        score = config.configured
        reason = (
            "The estimated project cost falls within a configured financial route "
            "without triggering its financing cap."
        )
        evidence_used = [
            "finance.status",
            "finance.scheme_id",
            "finance.project_cost",
            "finance.potential_financing",
            "finance.cap_applied",
        ]
        confidence = "high" if finance.rule_source and finance.rule_verified_date else "medium"

    return ScoreComponent(
        score=_bounded(score, rules.weights.financial_fit),
        max_score=rules.weights.financial_fit,
        reason=reason,
        evidence_used=evidence_used,
        confidence=confidence,
        evidence_completeness=confidence,
        limitations=[
            "Financial Fit does not assess profitability, cash flow, DSCR or repayment capacity.",
            "A configured route is not loan eligibility or approval.",
        ],
    )


def _leading_mapping(value: str, mapping: dict[str, int]) -> tuple[str, int]:
    normalized = value.strip().casefold()
    for key in sorted((item for item in mapping if item != "unknown"), key=len, reverse=True):
        if normalized.startswith(key):
            return key, mapping[key]
    return "unknown", mapping["unknown"]


def _operational_readiness(
    evidence: LocalEvidenceResult, rules: ViabilityRules
) -> tuple[ScoreComponent, list[str]]:
    config = rules.operational_readiness
    profile = evidence.business_profile
    dependency_label, dependency_score = _leading_mapping(
        profile.supplier_dependency, config.supplier_dependency_points
    )
    seasonality_label, seasonality_score = _leading_mapping(
        profile.seasonality, config.seasonality_points
    )
    evidence_used = [
        "business_profile.supplier_dependency",
        "business_profile.seasonality",
    ]
    missing_evidence: list[str] = []
    user_input = evidence.user_local_input

    experience = user_input.existing_experience if user_input else None
    if experience:
        normalized_experience = experience.strip().casefold()
        explicitly_none = normalized_experience in {
            "no",
            "none",
            "no experience",
            "not yet",
            "0",
        }
        meaningful_markers = {
            "year",
            "month",
            "worked",
            "managed",
            "running",
            "experience",
            "trained",
            "training",
            "family business",
            "helped",
        }
        if explicitly_none:
            experience_key = "explicitly_none"
        elif any(marker in normalized_experience for marker in meaningful_markers):
            experience_key = "present"
        else:
            experience_key = "unverified"
            missing_evidence.append("verified existing business experience")
        evidence_used.append("user_local_input.existing_experience")
    else:
        experience_key = "missing"
        missing_evidence.append("existing business experience")
    experience_score = config.experience_points[experience_key]

    supplier_distance = user_input.supplier_distance_km if user_input else None
    radius = evidence.competitor_radius_km
    if supplier_distance is not None and radius is not None:
        supplier_key = (
            "within_customer_radius"
            if supplier_distance <= radius
            else "beyond_customer_radius"
        )
        evidence_used.append("user_local_input.supplier_distance_km")
    else:
        supplier_key = "missing"
        missing_evidence.append("supplier distance")
    supplier_distance_score = config.supplier_distance_points[supplier_key]

    if dependency_label == "unknown" or seasonality_label == "unknown":
        confidence: ConfidenceLevel = "low"
    elif experience_key in {"present", "explicitly_none"} and supplier_key != "missing":
        confidence = "high"
    else:
        confidence = "medium"

    score = dependency_score + seasonality_score + experience_score + supplier_distance_score
    reason = (
        f"The business profile records {dependency_label} supplier dependency and "
        f"{seasonality_label} seasonality. Missing entrepreneur inputs receive neutral, "
        "not zero, contributions."
    )
    return (
        ScoreComponent(
            score=_bounded(score, rules.weights.operational_readiness),
            max_score=rules.weights.operational_readiness,
            reason=reason,
            evidence_used=evidence_used,
            confidence=confidence,
            evidence_completeness=confidence,
            limitations=[
                "Business-profile categories are prototype heuristics, not observed operating outcomes.",
                "Missing experience or supplier-distance evidence is treated neutrally and lowers confidence.",
            ],
        ),
        missing_evidence,
    )


def _overall_confidence(components: BusinessPotentialComponents) -> ConfidenceLevel:
    values = [
        components.market_opportunity.confidence,
        components.competition.confidence,
        components.financial_fit.confidence,
        components.operational_readiness.confidence,
    ]
    if all(value == "high" for value in values):
        return "high"
    if values.count("low") >= 2:
        return "low"
    return "medium"


def rating_for_score(score: int, rules: ViabilityRules | None = None) -> str:
    """Map one bounded score to the configured non-overlapping rating bands."""

    methodology = rules or load_viability_rules()
    return next(
        band.rating
        for band in methodology.rating_bands
        if band.minimum <= score <= band.maximum
    )


def calculate_business_potential(
    local_evidence: LocalEvidenceResult,
    finance_result: FinanceResult,
    *,
    rules: ViabilityRules | None = None,
) -> BusinessPotential:
    """Calculate a bounded score without reading raw data or changing finance."""

    methodology = rules or load_viability_rules()
    market = _market_opportunity(local_evidence, methodology)
    competition = _competition(local_evidence, methodology)
    financial = _financial_fit(finance_result, methodology)
    operational, operational_missing = _operational_readiness(
        local_evidence, methodology
    )
    components = BusinessPotentialComponents(
        market_opportunity=market,
        competition=competition,
        financial_fit=financial,
        operational_readiness=operational,
    )
    total = _bounded(
        sum(component.score for component in components.__dict__.values()), 100
    )

    user_input = local_evidence.user_local_input
    missing_evidence = ["validated local demand measurements"]
    if user_input is None or user_input.known_competitors is None:
        missing_evidence.append("user-verified competitor count")
    if user_input is None or user_input.local_price is None:
        missing_evidence.append("local selling price")
    if user_input is None or user_input.monthly_rent is None:
        missing_evidence.append("monthly rent")
    missing_evidence.extend(operational_missing)

    return BusinessPotential(
        score=total,
        rating=rating_for_score(total, methodology),
        methodology_version=methodology.methodology_version,
        score_type=methodology.score_type,
        confidence=_overall_confidence(components),
        components=components,
        missing_evidence=list(dict.fromkeys(missing_evidence)),
        disclaimer=SCORE_DISCLAIMER,
    )
