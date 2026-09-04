"""Behavior, boundaries and sensitivity tests for the Phase 5 engine."""

import json
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from engines.finance_engine import calculate_finance
from engines.local_data_engine import get_local_evidence
from engines.viability_engine import calculate_business_potential, rating_for_score
from loaders.data_loader import load_local_data
from loaders.viability_rules_loader import (
    ViabilityRulesError,
    load_viability_rules,
)
from models.schemas import CompetitorRecord


BUSINESSES = ("dairy", "tailoring", "kirana")
LOCATIONS = ("LOC001", "LOC002")


class ViabilityEngineTests(unittest.TestCase):
    """Prove deterministic direction, bounds and explanation behavior."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.bundle = load_local_data()
        cls.finance = calculate_finance(100000)
        cls.rules = load_viability_rules()

    def potential(self, location_id: str, business_id: str, capital: float = 100000):
        evidence = get_local_evidence(
            location_id, business_id, bundle=self.bundle
        )
        return calculate_business_potential(evidence, calculate_finance(capital))

    def test_every_configured_location_and_business_scores(self) -> None:
        expected = {
            ("LOC001", "dairy"): (72, "Promising"),
            ("LOC001", "tailoring"): (74, "Promising"),
            ("LOC001", "kirana"): (73, "Promising"),
            ("LOC002", "dairy"): (78, "Promising"),
            ("LOC002", "tailoring"): (80, "Strong Potential"),
            ("LOC002", "kirana"): (83, "Strong Potential"),
        }
        for location_id in LOCATIONS:
            for business_id in BUSINESSES:
                result = self.potential(location_id, business_id)
                self.assertEqual(
                    (result.score, result.rating), expected[(location_id, business_id)]
                )

    def test_same_evidence_always_produces_same_score(self) -> None:
        evidence = get_local_evidence("LOC002", "dairy", bundle=self.bundle)
        first = calculate_business_potential(evidence, self.finance)
        second = calculate_business_potential(evidence, self.finance)
        self.assertEqual(first, second)

    def test_score_and_components_are_bounded(self) -> None:
        for location_id in LOCATIONS:
            for business_id in BUSINESSES:
                result = self.potential(location_id, business_id)
                self.assertGreaterEqual(result.score, 0)
                self.assertLessEqual(result.score, 100)
                for component in result.components.__dict__.values():
                    self.assertGreaterEqual(component.score, 0)
                    self.assertLessEqual(component.score, component.max_score)

    def test_component_maximums_total_100(self) -> None:
        result = self.potential("LOC002", "dairy")
        self.assertEqual(
            sum(component.max_score for component in result.components.__dict__.values()),
            100,
        )

    def test_more_mapped_competitors_cannot_improve_competition_score(self) -> None:
        evidence = get_local_evidence("LOC001", "dairy", bundle=self.bundle)
        scores = []
        competitors = []
        for index in range(6):
            if index:
                competitors.append(
                    CompetitorRecord(
                        competitor_id=f"SENS-{index}",
                        location_id="LOC001",
                        business_id="dairy",
                        business_name=f"Sensitivity business {index}",
                        latitude=Decimal("19.06861"),
                        longitude=Decimal("74.60111"),
                        distance_km=Decimal("0.10"),
                        source="Test fixture",
                        confidence="High",
                    )
                )
            changed = evidence.model_copy(update={"competitors": list(competitors)})
            score = calculate_business_potential(changed, self.finance)
            scores.append(score.components.competition.score)
        self.assertEqual(scores, sorted(scores, reverse=True))

    def test_explanation_names_evidence_and_limitation(self) -> None:
        result = self.potential("LOC002", "dairy")
        competition = result.components.competition
        self.assertIn("mapped_competitor_count", competition.evidence_used)
        self.assertIn("2 mapped competitors", competition.reason)
        self.assertTrue(
            any("not a complete market census" in item for item in competition.limitations)
        )

    def test_outside_finance_range_reduces_financial_fit(self) -> None:
        configured = self.potential("LOC002", "dairy", 100000)
        outside = self.potential("LOC002", "dairy", 500000.1)
        self.assertEqual(configured.components.financial_fit.score, 23)
        self.assertEqual(outside.components.financial_fit.score, 8)
        self.assertLess(
            outside.components.financial_fit.score,
            configured.components.financial_fit.score,
        )

    def test_financing_cap_reduces_financial_fit(self) -> None:
        below_cap = self.potential("LOC002", "dairy", 13000)
        cap_applied = self.potential("LOC002", "dairy", 14000)
        self.assertEqual(below_cap.components.financial_fit.score, 23)
        self.assertEqual(cap_applied.components.financial_fit.score, 20)
        self.assertIn("cap", cap_applied.components.financial_fit.reason)

    def test_missing_user_inputs_are_neutral_not_zero(self) -> None:
        result = self.potential("LOC001", "dairy")
        operational = result.components.operational_readiness
        self.assertEqual(operational.score, 10)
        self.assertGreater(operational.score, 0)
        self.assertIn("existing business experience", result.missing_evidence)
        self.assertIn("supplier distance", result.missing_evidence)

    def test_missing_optional_evidence_reduces_confidence(self) -> None:
        result = self.potential("LOC001", "dairy")
        self.assertEqual(result.components.competition.confidence, "low")
        self.assertEqual(result.components.operational_readiness.confidence, "medium")
        self.assertEqual(result.confidence, "medium")

    def test_market_population_is_only_part_of_30_points(self) -> None:
        result = self.potential("LOC002", "dairy")
        self.assertEqual(self.rules.market_opportunity.population_points.maximum, 18)
        self.assertEqual(result.components.market_opportunity.max_score, 30)
        self.assertIn("proxy", result.components.market_opportunity.reason)

    def test_bad_weight_total_fails_clearly(self) -> None:
        raw = self.rules.model_dump(mode="json")
        raw["weights"]["market_opportunity"] = 29
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad-rules.json"
            path.write_text(json.dumps(raw), encoding="utf-8")
            with self.assertRaisesRegex(ViabilityRulesError, "weights must total 100"):
                load_viability_rules(path)

    def test_overlapping_rating_band_fails_clearly(self) -> None:
        raw = self.rules.model_dump(mode="json")
        raw["rating_bands"][1]["minimum"] = 39
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "bad-ratings.json"
            path.write_text(json.dumps(raw), encoding="utf-8")
            with self.assertRaisesRegex(ViabilityRulesError, "rating bands"):
                load_viability_rules(path)

    def test_rating_band_boundaries(self) -> None:
        expected = {
            0: "High Caution",
            39: "High Caution",
            40: "Needs Validation",
            59: "Needs Validation",
            60: "Promising",
            79: "Promising",
            80: "Strong Potential",
            100: "Strong Potential",
        }
        for score, rating in expected.items():
            self.assertEqual(rating_for_score(score, self.rules), rating)


if __name__ == "__main__":
    unittest.main()
