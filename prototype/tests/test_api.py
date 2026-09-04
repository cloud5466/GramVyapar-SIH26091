"""Regression tests for the Phase 3 GramVyapar prototype API."""

import unittest
from uuid import UUID

from fastapi.testclient import TestClient

from api.main import app


class GramVyaparApiTests(unittest.TestCase):
    """Validate API plumbing while finance uses deterministic rule data."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def post_analysis(
        self,
        *,
        location_id: str = "demo-location-01",
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
        self.assertEqual(body["mode"], "illustrative")
        self.assertEqual(body["business"]["business_id"], business_id)
        self.assertEqual(body["business"]["business_name"], business_name)
        self.assertEqual(body["business"]["location_name"], "Demo Location 1")
        self.assertEqual(body["business_potential"], {"score": 76.0, "rating": "Promising"})
        self.assertEqual(
            body["local_market"],
            {
                "population_estimate": None,
                "mapped_competitors": None,
                "confidence": "illustrative",
            },
        )
        self.assertEqual(body["finance"]["available_capital"], 100000.0)
        self.assertEqual(body["finance"]["margin_percentage"], 10.0)
        self.assertEqual(body["finance"]["project_cost"], 1000000.0)
        self.assertEqual(body["finance"]["potential_financing"], 900000.0)
        self.assertEqual(body["finance"]["scheme_id"], "FIN002")
        self.assertEqual(body["finance"]["status"], "configured")
        self.assertEqual(body["finance"]["reason_code"], "SCHEME_MATCHED")
        self.assertEqual(body["sources"], [])
        self.assertIn("Illustrative prototype analysis", body["disclaimer"])

    def test_valid_dairy(self) -> None:
        self.assert_valid_business("dairy", "Dairy")

    def test_valid_tailoring(self) -> None:
        self.assert_valid_business("tailoring", "Tailoring")

    def test_valid_kirana(self) -> None:
        self.assert_valid_business("kirana", "Kirana")

    def test_second_demo_location_mapping(self) -> None:
        response = self.post_analysis(location_id="demo-location-02")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["business"]["location_name"], "Demo Location 2")

    def test_other_location_uses_safe_display_name(self) -> None:
        response = self.post_analysis(location_id="another-valid-location")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["business"]["location_name"], "Demo Location")

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
            json={"location_id": "demo-location-01", "business_id": "dairy"},
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
