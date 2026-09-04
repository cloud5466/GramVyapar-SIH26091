"""Load and validate canonical financial rules without cwd assumptions."""

from __future__ import annotations

import csv
from datetime import datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

from models.schemas import FinancialRule


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
CANONICAL_RULES_PATH = REPOSITORY_ROOT / "finance" / "financial_rules.csv"
REQUIRED_COLUMNS = frozenset(
    {
        "scheme_id",
        "scheme_name",
        "min_project_cost",
        "max_project_cost",
        "max_financing",
        "interest_rate",
        "repayment_years",
        "moratorium_months",
        "source",
        "verified_date",
        "finance_percentage",
    }
)


class FinancialRulesError(ValueError):
    """Raised when the canonical rules file is incomplete or inconsistent."""


def _required_text(row: dict[str, str | None], field: str, row_number: int) -> str:
    value = (row.get(field) or "").strip()
    if not value:
        raise FinancialRulesError(f"Row {row_number}: {field} is required")
    return value


def _decimal_value(
    row: dict[str, str | None], field: str, row_number: int, *, percentage: bool = False
) -> Decimal:
    value = _required_text(row, field, row_number)
    if percentage:
        value = value.removesuffix("%").strip()
    try:
        number = Decimal(value)
    except InvalidOperation as error:
        raise FinancialRulesError(
            f"Row {row_number}: {field} must be numeric"
        ) from error
    if not number.is_finite():
        raise FinancialRulesError(f"Row {row_number}: {field} must be finite")
    return number


def _parse_rule(row: dict[str, str | None], row_number: int) -> FinancialRule:
    min_project_cost = _decimal_value(row, "min_project_cost", row_number)
    max_project_cost = _decimal_value(row, "max_project_cost", row_number)
    max_financing = _decimal_value(row, "max_financing", row_number)
    interest_rate = _decimal_value(
        row, "interest_rate", row_number, percentage=True
    )
    repayment_years = _decimal_value(row, "repayment_years", row_number)
    moratorium_value = _decimal_value(row, "moratorium_months", row_number)
    finance_percentage = _decimal_value(
        row, "finance_percentage", row_number, percentage=True
    )

    if min_project_cost < 0 or max_project_cost < min_project_cost:
        raise FinancialRulesError(f"Row {row_number}: invalid project-cost range")
    if max_financing < 0:
        raise FinancialRulesError(f"Row {row_number}: max_financing cannot be negative")
    if interest_rate < 0:
        raise FinancialRulesError(f"Row {row_number}: interest_rate cannot be negative")
    if repayment_years <= 0:
        raise FinancialRulesError(f"Row {row_number}: repayment_years must be positive")
    if moratorium_value < 0 or moratorium_value != moratorium_value.to_integral_value():
        raise FinancialRulesError(
            f"Row {row_number}: moratorium_months must be a non-negative integer"
        )
    if not Decimal("0") < finance_percentage <= Decimal("100"):
        raise FinancialRulesError(
            f"Row {row_number}: finance_percentage must be above 0 and at most 100"
        )

    verified_date_text = _required_text(row, "verified_date", row_number)
    try:
        verified_date = datetime.strptime(verified_date_text, "%d-%m-%Y").date()
    except ValueError as error:
        raise FinancialRulesError(
            f"Row {row_number}: verified_date must use DD-MM-YYYY"
        ) from error

    return FinancialRule(
        scheme_id=_required_text(row, "scheme_id", row_number),
        scheme_name=_required_text(row, "scheme_name", row_number),
        min_project_cost=min_project_cost,
        max_project_cost=max_project_cost,
        max_financing=max_financing,
        interest_rate=interest_rate,
        repayment_years=repayment_years,
        moratorium_months=int(moratorium_value),
        source=_required_text(row, "source", row_number),
        verified_date=verified_date,
        finance_percentage=finance_percentage,
    )


def load_financial_rules(path: Path | None = None) -> tuple[FinancialRule, ...]:
    """Return validated rules sorted by inclusive project-cost bounds."""

    rules_path = path or CANONICAL_RULES_PATH
    try:
        with rules_path.open("r", encoding="utf-8-sig", newline="") as rules_file:
            reader = csv.DictReader(rules_file)
            headers = reader.fieldnames or []
            if any(not (header or "").strip() for header in headers):
                raise FinancialRulesError("Financial rules contain a blank column header")
            missing = sorted(REQUIRED_COLUMNS.difference(headers))
            if missing:
                raise FinancialRulesError(
                    f"Financial rules missing required columns: {', '.join(missing)}"
                )
            rules = tuple(
                _parse_rule(row, row_number)
                for row_number, row in enumerate(reader, start=2)
            )
    except OSError as error:
        raise FinancialRulesError(f"Cannot read financial rules: {rules_path}") from error

    if not rules:
        raise FinancialRulesError("Financial rules file contains no rule rows")

    scheme_ids = [rule.scheme_id for rule in rules]
    duplicates = sorted(
        scheme_id for scheme_id in set(scheme_ids) if scheme_ids.count(scheme_id) > 1
    )
    if duplicates:
        raise FinancialRulesError(
            f"Duplicate scheme IDs: {', '.join(duplicates)}"
        )

    ordered = tuple(sorted(rules, key=lambda rule: rule.min_project_cost))
    for previous, current in zip(ordered, ordered[1:]):
        if current.min_project_cost <= previous.max_project_cost:
            raise FinancialRulesError(
                "Overlapping project-cost ranges: "
                f"{previous.scheme_id} and {current.scheme_id}"
            )
    return ordered
