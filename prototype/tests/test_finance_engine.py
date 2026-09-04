"""Boundary, cap and loader tests for the deterministic finance engine."""

import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from engines.finance_engine import FinanceDomainError, calculate_finance
from loaders.rules_loader import FinancialRulesError, load_financial_rules


VALID_HEADER = (
    "scheme_id,scheme_name,min_project_cost,max_project_cost,max_financing,"
    "interest_rate,repayment_years,moratorium_months,source,verified_date,"
    "finance_percentage\n"
)
VALID_ROW = "TEST001,Test Scheme,0,1000,800,5%,2,1,Official source,04-09-2026,90%\n"


class FinanceEngineTests(unittest.TestCase):
    """Derive routing expectations from the canonical configured rules."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.rules = load_financial_rules()
        cls.first = cls.rules[0]
        cls.last = cls.rules[-1]

    def result_for_project_cost(self, project_cost: Decimal):
        capital = project_cost * Decimal("0.10")
        return calculate_finance(capital, rules=self.rules)

    def test_small_capital_routes_to_first_scheme(self) -> None:
        project_cost = max(self.first.min_project_cost, Decimal("10"))
        result = self.result_for_project_cost(project_cost)
        self.assertEqual(result.scheme_id, self.first.scheme_id)
        self.assertEqual(result.project_cost, project_cost)

    def test_first_scheme_maximum_is_inclusive(self) -> None:
        result = self.result_for_project_cost(self.first.max_project_cost)
        self.assertEqual(result.scheme_id, self.first.scheme_id)

    def test_one_rupee_above_first_maximum_routes_to_next_rule(self) -> None:
        next_rule = self.rules[1]
        project_cost = self.first.max_project_cost + Decimal("1")
        result = self.result_for_project_cost(project_cost)
        self.assertEqual(project_cost, next_rule.min_project_cost)
        self.assertEqual(result.scheme_id, next_rule.scheme_id)

    def test_one_lakh_capital_produces_ten_lakh_project(self) -> None:
        result = calculate_finance(Decimal("100000"), rules=self.rules)
        expected_rule = next(
            rule
            for rule in self.rules
            if rule.min_project_cost <= Decimal("1000000") <= rule.max_project_cost
        )
        expected_financing = min(
            Decimal("1000000") * expected_rule.finance_percentage / Decimal("100"),
            expected_rule.max_financing,
        )
        self.assertEqual(result.project_cost, Decimal("1000000.00"))
        self.assertEqual(result.scheme_id, expected_rule.scheme_id)
        self.assertEqual(result.potential_financing, expected_financing)

    def test_maximum_supported_boundary_is_inclusive(self) -> None:
        result = self.result_for_project_cost(self.last.max_project_cost)
        self.assertEqual(result.scheme_id, self.last.scheme_id)
        self.assertEqual(result.status, "configured")

    def test_project_above_all_rules_is_structured_out_of_range(self) -> None:
        result = self.result_for_project_cost(self.last.max_project_cost + Decimal("1"))
        self.assertEqual(result.status, "outside_configured_range")
        self.assertEqual(
            result.reason_code, "PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES"
        )
        self.assertIsNone(result.scheme_id)
        self.assertIsNone(result.potential_financing)

    def test_invalid_internal_capital_is_rejected(self) -> None:
        for value in (0, -1, "not-a-number", float("inf"), True):
            with self.subTest(value=value), self.assertRaises(FinanceDomainError):
                calculate_finance(value, rules=self.rules)

    def test_financing_is_capped_by_configured_maximum(self) -> None:
        capped_rule = next(
            rule
            for rule in self.rules
            if rule.max_project_cost * rule.finance_percentage / Decimal("100")
            > rule.max_financing
        )
        result = self.result_for_project_cost(capped_rule.max_project_cost)
        uncapped = (
            capped_rule.max_project_cost
            * capped_rule.finance_percentage
            / Decimal("100")
        )
        self.assertGreater(uncapped, capped_rule.max_financing)
        self.assertEqual(result.potential_financing, capped_rule.max_financing)


class FinancialRuleLoaderTests(unittest.TestCase):
    """Validate canonical parsing and fail-fast malformed-file behavior."""

    def test_canonical_rule_file_parses(self) -> None:
        rules = load_financial_rules()
        self.assertGreaterEqual(len(rules), 1)
        self.assertTrue(all(rule.source for rule in rules))
        self.assertTrue(all(rule.verified_date for rule in rules))

    def test_duplicate_scheme_id_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "rules.csv"
            path.write_text(VALID_HEADER + VALID_ROW + VALID_ROW, encoding="utf-8")
            with self.assertRaisesRegex(FinancialRulesError, "Duplicate scheme IDs"):
                load_financial_rules(path)

    def test_missing_required_column_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "rules.csv"
            path.write_text(
                VALID_HEADER.replace(",finance_percentage", "") + VALID_ROW,
                encoding="utf-8",
            )
            with self.assertRaisesRegex(
                FinancialRulesError, "missing required columns: finance_percentage"
            ):
                load_financial_rules(path)


if __name__ == "__main__":
    unittest.main()
