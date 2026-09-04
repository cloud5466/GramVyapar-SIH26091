"""Deterministic, auditable financial structuring for the Phase 3 MVP."""

from __future__ import annotations

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from loaders.rules_loader import load_financial_rules
from models.schemas import FinanceResult, FinancialRule


MARGIN_PERCENTAGE = Decimal("10")
MARGIN_RATE = MARGIN_PERCENTAGE / Decimal("100")
CURRENCY_UNIT = Decimal("0.01")
OUTSIDE_RANGE_NOTE = (
    "The estimated project cost falls outside the financing schemes currently "
    "configured in GramVyapar."
)


class FinanceDomainError(ValueError):
    """Raised when an internal caller supplies invalid available capital."""


def _capital_decimal(value: object) -> Decimal:
    if isinstance(value, bool):
        raise FinanceDomainError("Available capital must be a positive number")
    try:
        capital = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError) as error:
        raise FinanceDomainError("Available capital must be a positive number") from error
    if not capital.is_finite() or capital <= 0:
        raise FinanceDomainError("Available capital must be greater than zero")
    return capital.quantize(CURRENCY_UNIT, rounding=ROUND_HALF_UP)


def _matching_rule(
    project_cost: Decimal, rules: tuple[FinancialRule, ...]
) -> FinancialRule | None:
    matches = [
        rule
        for rule in rules
        if rule.min_project_cost <= project_cost <= rule.max_project_cost
    ]
    if len(matches) > 1:
        raise FinanceDomainError("Multiple financing rules match the project cost")
    return matches[0] if matches else None


def calculate_finance(
    available_capital: object,
    *,
    rules: tuple[FinancialRule, ...] | None = None,
) -> FinanceResult:
    """Calculate a 10% margin structure and route it through loaded rules."""

    capital = _capital_decimal(available_capital)
    project_cost = (capital / MARGIN_RATE).quantize(
        CURRENCY_UNIT, rounding=ROUND_HALF_UP
    )
    configured_rules = rules if rules is not None else load_financial_rules()
    rule = _matching_rule(project_cost, configured_rules)

    if rule is None:
        return FinanceResult(
            available_capital=capital,
            margin_percentage=MARGIN_PERCENTAGE,
            project_cost=project_cost,
            potential_financing=None,
            scheme_id=None,
            scheme_name=None,
            interest_rate=None,
            repayment_years=None,
            moratorium_months=None,
            finance_percentage=None,
            maximum_financing=None,
            rule_source=None,
            rule_verified_date=None,
            status="outside_configured_range",
            reason_code="PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES",
            notes=OUTSIDE_RANGE_NOTE,
        )

    calculated_financing = (
        project_cost * rule.finance_percentage / Decimal("100")
    ).quantize(CURRENCY_UNIT, rounding=ROUND_HALF_UP)
    potential_financing = min(calculated_financing, rule.max_financing)

    return FinanceResult(
        available_capital=capital,
        margin_percentage=MARGIN_PERCENTAGE,
        project_cost=project_cost,
        potential_financing=potential_financing,
        scheme_id=rule.scheme_id,
        scheme_name=rule.scheme_name,
        interest_rate=rule.interest_rate,
        repayment_years=rule.repayment_years,
        moratorium_months=rule.moratorium_months,
        finance_percentage=rule.finance_percentage,
        maximum_financing=rule.max_financing,
        rule_source=rule.source,
        rule_verified_date=rule.verified_date,
        status="configured",
        reason_code="SCHEME_MATCHED",
        notes="Matched to the configured project-cost range and financing cap.",
    )
