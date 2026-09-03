# Finance workspace

Owner: **Member 4 — Finance Lead**

This directory is the source of truth for official scheme rules, deterministic
financial formulas, eligibility boundaries and finance-specific test cases.
The current files are templates only; no scheme values have been populated.

## Working rules

1. Use primary, official sources wherever possible.
2. Record the source URL and the date on which each rule was verified.
3. Separate scheme eligibility from indicative project structuring.
4. Document units, rounding, boundary behavior and missing-data behavior.
5. Never infer an official rate or threshold from a secondary summary.
6. Treat sanction and final eligibility as decisions of authorized agencies.
7. Hand off changes with `team/HANDOFF_TEMPLATE.md`.

The eventual financial engine must use these structured rules. An LLM must not
calculate or invent critical financial values.
