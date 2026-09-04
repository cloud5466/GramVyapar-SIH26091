"""Load and validate the versioned GramVyapar viability methodology."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field, ValidationError, model_validator


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
VIABILITY_RULES_PATH = REPOSITORY_ROOT / "config" / "viability_rules.json"


class ViabilityRulesError(ValueError):
    """Raised when the scoring methodology is malformed or incomplete."""


class ScoreWeights(BaseModel):
    market_opportunity: int = Field(gt=0)
    competition: int = Field(gt=0)
    financial_fit: int = Field(gt=0)
    operational_readiness: int = Field(gt=0)


class PopulationPoints(BaseModel):
    minimum: int = Field(ge=0)
    maximum: int = Field(ge=0)
    single_population_value: int = Field(ge=0)


class BusinessContextPoints(BaseModel):
    customer_radius: int = Field(ge=0)
    customer_type: int = Field(ge=0)
    demand_indicators: int = Field(ge=0)


class MarketOpportunityRules(BaseModel):
    population_points: PopulationPoints
    business_context_points: BusinessContextPoints
    population_confidence_points: dict[str, int]


class CompetitionBucket(BaseModel):
    min_count: int = Field(ge=0)
    max_count: int | None = Field(default=None, ge=0)
    score: int = Field(ge=0)


class ProximityPenalty(BaseModel):
    max_radius_ratio: float = Field(gt=0)
    penalty: int = Field(ge=0)


class CompetitionRules(BaseModel):
    count_buckets: list[CompetitionBucket]
    proximity_penalties: list[ProximityPenalty]


class FinancialFitRules(BaseModel):
    configured: int = Field(ge=0)
    configured_with_cap: int = Field(ge=0)
    outside_configured_range: int = Field(ge=0)


class OperationalReadinessRules(BaseModel):
    supplier_dependency_points: dict[str, int]
    seasonality_points: dict[str, int]
    experience_points: dict[str, int]
    supplier_distance_points: dict[str, int]


class RatingBand(BaseModel):
    minimum: int = Field(ge=0, le=100)
    maximum: int = Field(ge=0, le=100)
    rating: str = Field(min_length=1)


class ViabilityRules(BaseModel):
    methodology_version: str = Field(min_length=1)
    score_type: str = Field(min_length=1)
    weights: ScoreWeights
    market_opportunity: MarketOpportunityRules
    competition: CompetitionRules
    financial_fit: FinancialFitRules
    operational_readiness: OperationalReadinessRules
    rating_bands: list[RatingBand]

    @model_validator(mode="after")
    def validate_methodology(self) -> "ViabilityRules":
        weights = self.weights
        if sum(weights.model_dump().values()) != 100:
            raise ValueError("viability weights must total 100")

        population = self.market_opportunity.population_points
        if not population.minimum <= population.single_population_value <= population.maximum:
            raise ValueError("market population points must be ordered")
        context_max = sum(self.market_opportunity.business_context_points.model_dump().values())
        confidence_max = max(self.market_opportunity.population_confidence_points.values())
        if population.maximum + context_max + confidence_max != weights.market_opportunity:
            raise ValueError("market-opportunity rule maximum must equal its weight")
        required_population_confidence = {"high", "medium", "low", "unknown"}
        if not required_population_confidence.issubset(
            self.market_opportunity.population_confidence_points
        ):
            raise ValueError("population confidence mappings are incomplete")

        buckets = self.competition.count_buckets
        if not buckets or buckets[0].min_count != 0:
            raise ValueError("competition buckets must start at zero")
        previous_max = -1
        previous_score = weights.competition + 1
        for index, bucket in enumerate(buckets):
            if bucket.min_count != previous_max + 1:
                raise ValueError("competition buckets must be contiguous and ordered")
            if bucket.max_count is not None and bucket.max_count < bucket.min_count:
                raise ValueError("competition bucket maximum is invalid")
            if bucket.score > weights.competition or bucket.score >= previous_score:
                raise ValueError("competition bucket scores must decrease and stay bounded")
            if bucket.max_count is None and index != len(buckets) - 1:
                raise ValueError("only the final competition bucket may be open-ended")
            previous_max = bucket.max_count if bucket.max_count is not None else previous_max
            previous_score = bucket.score
        if buckets[-1].max_count is not None:
            raise ValueError("final competition bucket must be open-ended")

        penalty_thresholds = [item.max_radius_ratio for item in self.competition.proximity_penalties]
        if penalty_thresholds != sorted(penalty_thresholds) or len(set(penalty_thresholds)) != len(penalty_thresholds):
            raise ValueError("competition proximity thresholds must be strictly ordered")
        penalties = [item.penalty for item in self.competition.proximity_penalties]
        if penalties != sorted(penalties, reverse=True):
            raise ValueError("competition proximity penalties must decrease with distance")
        maximum_penalty = max(penalties, default=0)
        for previous, current in zip(buckets, buckets[1:]):
            previous_floor = previous.score if previous.min_count == 0 else previous.score - maximum_penalty
            if previous_floor < current.score:
                raise ValueError("competition rules could reward a higher competitor count")

        if max(self.financial_fit.model_dump().values()) > weights.financial_fit:
            raise ValueError("financial-fit score exceeds its weight")

        operational = self.operational_readiness
        required_operational_keys = (
            (operational.supplier_dependency_points, {"low", "low-moderate", "moderate", "high", "unknown"}),
            (operational.seasonality_points, {"low", "moderate", "high", "unknown"}),
            (operational.experience_points, {"present", "explicitly_none", "unverified", "missing"}),
            (operational.supplier_distance_points, {"within_customer_radius", "beyond_customer_radius", "missing"}),
        )
        if any(not required.issubset(mapping) for mapping, required in required_operational_keys):
            raise ValueError("operational-readiness mappings are incomplete")
        operational_max = (
            max(operational.supplier_dependency_points.values())
            + max(operational.seasonality_points.values())
            + max(operational.experience_points.values())
            + max(operational.supplier_distance_points.values())
        )
        if operational_max != weights.operational_readiness:
            raise ValueError("operational-readiness rule maximum must equal its weight")

        bands = self.rating_bands
        if not bands or bands[0].minimum != 0 or bands[-1].maximum != 100:
            raise ValueError("rating bands must cover 0 through 100")
        previous_maximum = -1
        for band in bands:
            if band.minimum != previous_maximum + 1 or band.maximum < band.minimum:
                raise ValueError("rating bands must be contiguous, ordered and non-overlapping")
            previous_maximum = band.maximum
        return self


@lru_cache(maxsize=1)
def _load_default_rules() -> ViabilityRules:
    return _read_rules(VIABILITY_RULES_PATH)


def _read_rules(path: Path) -> ViabilityRules:
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        return ViabilityRules.model_validate(raw)
    except (OSError, json.JSONDecodeError, ValidationError, ValueError) as error:
        raise ViabilityRulesError(f"Invalid viability rules at {path}: {error}") from error


def load_viability_rules(path: Path | None = None) -> ViabilityRules:
    """Return validated rules; cache only the canonical immutable config."""

    return _load_default_rules() if path is None else _read_rules(path)
