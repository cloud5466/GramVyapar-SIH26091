"""Regression tests for the Phase 5 GramVyapar prototype API."""

import unittest
from uuid import UUID

from fastapi.testclient import TestClient

from api.main import app


class GramVyaparApiTests(unittest.TestCase):
    """Validate local evidence, finance and preserved request behavior."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def post_analysis(
        self,
        *,
        location_id: str = "LOC002",
        business_id: str = "dairy",
        available_capital: float = 100000,
    ):
        return self.client.post(
            "/api/v1/analyze",
            json={
                "location_id": location_id,
                "business_id": business_id,
                "available_capital": available_capital,
            },
        )

    def assert_valid_business(self, business_id: str, business_name: str) -> None:
        response = self.post_analysis(business_id=business_id)
        self.assertEqual(response.status_code, 200)

        body = response.json()
        UUID(body["analysis_id"])
        self.assertEqual(body["mode"], "deterministic-prototype")
        self.assertEqual(body["business"]["business_id"], business_id)
        self.assertEqual(body["business"]["business_name"], business_name)
        self.assertEqual(body["business"]["location_name"], "Sangamner")
        potential = body["business_potential"]
        self.assertEqual(potential["methodology_version"], "prototype-v1")
        self.assertEqual(potential["score_type"], "decision-support heuristic")
        self.assertIn(potential["confidence"], {"high", "medium", "low"})
        self.assertEqual(
            sum(component["score"] for component in potential["components"].values()),
            potential["score"],
        )
        self.assertEqual(
            sum(component["max_score"] for component in potential["components"].values()),
            100,
        )
        self.assertEqual(body["local_market"]["population_estimate"], 65804)
        self.assertEqual(body["local_market"]["population_year"], 2011)
        self.assertEqual(body["local_market"]["location_type"], "Semi-Urban")
        self.assertEqual(body["local_market"]["evidence_status"], "complete")
        self.assertEqual(
            body["local_market"]["mapped_competitors"],
            len(body["local_market"]["competitors"]),
        )
        self.assertEqual(body["finance"]["available_capital"], 100000.0)
        self.assertEqual(body["finance"]["margin_percentage"], 10.0)
        self.assertEqual(body["finance"]["project_cost"], 1000000.0)
        self.assertEqual(body["finance"]["potential_financing"], 900000.0)
        self.assertEqual(body["finance"]["scheme_id"], "FIN002")
        self.assertEqual(body["finance"]["status"], "configured")
        self.assertEqual(body["finance"]["reason_code"], "SCHEME_MATCHED")
        self.assertGreater(len(body["sources"]), 0)
        self.assertIn("Business Potential Score", body["disclaimer"])

    def test_valid_dairy(self) -> None:
        self.assert_valid_business("dairy", "Dairy")

    def test_valid_tailoring(self) -> None:
        self.assert_valid_business("tailoring", "Tailoring")

    def test_valid_kirana(self) -> None:
        self.assert_valid_business("kirana", "Kirana")

    def test_second_real_location_mapping(self) -> None:
        response = self.post_analysis(location_id="LOC001")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["business"]["location_name"], "Hiware Bazar")

    def test_unknown_location_returns_structured_error(self) -> None:
        response = self.post_analysis(location_id="another-valid-location")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"]["reason_code"], "LOCATION_NOT_FOUND")

    def test_unknown_business_returns_structured_error(self) -> None:
        response = self.post_analysis(business_id="unknown-business")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            response.json()["detail"]["reason_code"], "BUSINESS_PROFILE_NOT_FOUND"
        )

    def test_locations_endpoint_uses_canonical_dataset(self) -> None:
        response = self.client.get("/api/v1/locations")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            [
                {
                    "location_id": "LOC001",
                    "location_name": "Hiware Bazar",
                    "location_type": "Rural",
                },
                {
                    "location_id": "LOC002",
                    "location_name": "Sangamner",
                    "location_type": "Semi-Urban",
                },
            ],
        )

    def test_zero_available_capital_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(available_capital=0).status_code, 422)

    def test_negative_available_capital_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(available_capital=-1).status_code, 422)

    def test_empty_location_id_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(location_id="").status_code, 422)

    def test_whitespace_location_id_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(location_id="   ").status_code, 422)

    def test_empty_business_id_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(business_id="").status_code, 422)

    def test_whitespace_business_id_is_rejected(self) -> None:
        self.assertEqual(self.post_analysis(business_id=" \t ").status_code, 422)

    def test_missing_available_capital_is_rejected(self) -> None:
        response = self.client.post(
            "/api/v1/analyze",
            json={"location_id": "LOC002", "business_id": "dairy"},
        )
        self.assertEqual(response.status_code, 422)

    def test_out_of_range_finance_is_returned_without_invented_scheme(self) -> None:
        response = self.post_analysis(available_capital=500000.1)
        self.assertEqual(response.status_code, 200)
        finance = response.json()["finance"]
        self.assertEqual(finance["status"], "outside_configured_range")
        self.assertEqual(
            finance["reason_code"], "PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES"
        )
        self.assertIsNone(finance["scheme_id"])
        self.assertIsNone(finance["potential_financing"])

    def test_health(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)

    def test_production_health(self) -> None:
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(
            response.json(),
            {
                "status": "ok",
                "service": "GramVyapar Prototype API",
                "phase": "2",
            },
        )


if __name__ == "__main__":
    unittest.main()
