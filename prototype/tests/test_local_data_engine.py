"""Dataset and selection tests for the Phase 4 local-data engine."""

import unittest
from decimal import Decimal

from engines.local_data_engine import (
    LocalDataDomainError,
    get_available_locations,
    get_local_evidence,
)
from loaders.data_loader import load_local_data
from models.schemas import CompetitorRecord


class LocalDataEngineTests(unittest.TestCase):
    """Exercise the actual configured MVP records and relationships."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.bundle = load_local_data()

    def test_each_configured_location_loads(self) -> None:
        options = get_available_locations(bundle=self.bundle)
        self.assertEqual(
            [option.location_id for option in options], ["LOC001", "LOC002"]
        )
        for option in options:
            result = get_local_evidence(
                option.location_id, "dairy", bundle=self.bundle
            )
            self.assertEqual(result.location.location_id, option.location_id)

    def test_all_canonical_business_profiles_load(self) -> None:
        profiles = {profile.business_id: profile for profile in self.bundle.business_profiles}
        self.assertEqual(set(profiles), {"dairy", "tailoring", "kirana"})
        self.assertEqual(profiles["dairy"].business_name, "Dairy")
        self.assertEqual(profiles["tailoring"].business_name, "Tailoring")
        self.assertEqual(profiles["kirana"].business_name, "Kirana")

    def test_competitors_filter_by_location_and_business(self) -> None:
        dairy = get_local_evidence("LOC002", "dairy", bundle=self.bundle)
        kirana = get_local_evidence("LOC002", "kirana", bundle=self.bundle)
        self.assertEqual(
            {record.competitor_id for record in dairy.competitors},
            {"COMP002", "COMP003"},
        )
        self.assertEqual(
            {record.competitor_id for record in kirana.competitors},
            {"COMP004", "COMP005"},
        )
        self.assertTrue(all(record.location_id == "LOC002" for record in dairy.competitors))
        self.assertTrue(all(record.business_id == "dairy" for record in dairy.competitors))

    def test_tailorings_alias_normalizes_and_radius_filtering_applies(self) -> None:
        result = get_local_evidence("LOC002", "tailoring", bundle=self.bundle)
        self.assertEqual(result.competitor_radius_km, 5)
        self.assertEqual(
            {record.competitor_id for record in result.competitors},
            {"COMP006", "COMP007"},
        )
        self.assertTrue(
            all(
                record.distance_km is None
                or record.distance_km <= result.competitor_radius_km
                for record in result.competitors
            )
        )

    def test_competitor_beyond_profile_radius_is_excluded(self) -> None:
        far_competitor = CompetitorRecord(
            competitor_id="TEST-FAR",
            location_id="LOC002",
            business_id="dairy",
            business_name="Outside Radius Test Record",
            latitude=Decimal("19.6"),
            longitude=Decimal("74.2"),
            distance_km=Decimal("3.01"),
            source="Test fixture",
            confidence="Test",
        )
        bundle = self.bundle.model_copy(
            update={"competitors": [*self.bundle.competitors, far_competitor]}
        )
        result = get_local_evidence("LOC002", "dairy", bundle=bundle)
        self.assertNotIn(
            "TEST-FAR", {competitor.competitor_id for competitor in result.competitors}
        )

    def test_unknown_location_is_controlled(self) -> None:
        with self.assertRaises(LocalDataDomainError) as context:
            get_local_evidence("LOC999", "dairy", bundle=self.bundle)
        self.assertEqual(context.exception.reason_code, "LOCATION_NOT_FOUND")

    def test_unknown_business_is_controlled(self) -> None:
        with self.assertRaises(LocalDataDomainError) as context:
            get_local_evidence("LOC001", "unknown", bundle=self.bundle)
        self.assertEqual(context.exception.reason_code, "BUSINESS_PROFILE_NOT_FOUND")

    def test_blank_optional_user_input_remains_none(self) -> None:
        result = get_local_evidence("LOC001", "dairy", bundle=self.bundle)
        user_input = result.user_local_input
        self.assertIsNotNone(user_input)
        assert user_input is not None
        self.assertIsNone(user_input.known_competitors)
        self.assertIsNone(user_input.local_price)
        self.assertIsNone(user_input.monthly_rent)
        self.assertIsNone(user_input.supplier_distance_km)
        self.assertIsNone(user_input.existing_experience)

    def test_population_metadata_is_preserved(self) -> None:
        result = get_local_evidence("LOC002", "dairy", bundle=self.bundle)
        self.assertEqual(result.location.population_estimate, 65804)
        self.assertEqual(result.location.population_year, 2011)
        self.assertEqual(
            result.location.population_source,
            "Census of India 2011 (via Wikipedia infobox)",
        )
        self.assertEqual(result.location.population_confidence, "High")

    def test_competitor_count_contract_matches_filtered_list(self) -> None:
        expected_counts = {
            ("LOC001", "dairy"): 0,
            ("LOC001", "tailoring"): 0,
            ("LOC001", "kirana"): 1,
            ("LOC002", "dairy"): 2,
            ("LOC002", "tailoring"): 2,
            ("LOC002", "kirana"): 2,
        }
        for (location_id, business_id), expected_count in expected_counts.items():
            result = get_local_evidence(
                location_id, business_id, bundle=self.bundle
            )
            self.assertEqual(len(result.competitors), expected_count)


if __name__ == "__main__":
    unittest.main()
