# Finance workspace

Owner: **Member 4 — Finance Lead**

This directory is the source of truth for official scheme rules, deterministic
financial formulas, configured boundaries and finance-specific test cases.
Phase 3 reads the canonical rules only from `financial_rules.csv`.

## Phase 3 calculation flow

1. Treat the entrepreneur's available capital as a 10% margin contribution.
2. Calculate `project_cost = available_capital / 0.10` using decimal arithmetic.
3. Select the one CSV rule whose inclusive minimum/maximum range contains the
   calculated project cost.
4. Calculate `project_cost × (finance_percentage / 100)`.
5. Return the lower of that amount and the selected rule's `max_financing` cap.

Ranges are inclusive at both ends. The current rules are contiguous at a
one-rupee boundary: FIN001 ends at ₹1,40,000 and FIN002 begins at ₹1,40,001.
If no rule matches, the API returns `outside_configured_range` with null scheme
and financing fields; it never invents another scheme.

The engine exposes the rule source and verification date for auditability. The
primary interface uses entrepreneur-friendly labels and keeps those source
details behind progressive disclosure.

## Working rules

1. Use primary, official sources wherever possible.
2. Record the source URL and the date on which each rule was verified.
3. Separate scheme eligibility from indicative project structuring.
4. Document units, rounding, boundary behavior and missing-data behavior.
5. Never infer an official rate or threshold from a secondary summary.
6. Treat sanction and final eligibility as decisions of authorized agencies.
7. Hand off changes with `team/HANDOFF_TEMPLATE.md`.

Final eligibility and loan sanction remain subject to the authorised financing
agency and applicable scheme conditions. GramVyapar reports an estimated
financial structure, not an approval, sanction or binding eligibility decision.
An LLM must not calculate or invent critical financial values.
