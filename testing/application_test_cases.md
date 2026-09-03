# Application test cases

Owner: **Member 6 — QA / Demo / Jury Lead**

Use the same structure in every section:

| Test ID | Scenario | Input / Setup | Expected Result | Evidence | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | NOT STARTED |  |

## Input Validation

Cover required fields, invalid types, negative capital, boundary values and
safe user-facing error messages.

## Financial Engine

Cover every verified rule boundary, calculation, rounding behavior, missing
rule and unsupported scheme. Expected values must come from reviewed formulas.

## Data Loader

Cover schema validation, missing columns, malformed values, duplicate IDs,
source metadata and deterministic joins.

## Viability Engine

Cover score boundaries, missing evidence, confidence handling and explanation
traceability. Do not assert an expected score until the scoring rules exist.

## AI Advisory

Cover evidence grounding, prohibited invented values, source/confidence
language, output schema and safe degradation.

## Unknown Location

Verify that unsupported locations produce an honest limited-coverage response
and do not silently substitute another location.

## Unsupported Business

Verify that unsupported business categories are identified clearly and do not
reuse unrelated assumptions.

## Missing Data

Verify that missing evidence lowers confidence or limits the result instead of
creating a synthetic fact.

## Offline/API Failure

Verify deterministic parts remain stable where possible and network-dependent
features fail with a clear recovery path.

## Mobile UX

Cover 360px and larger mobile widths, touch targets, keyboard behavior, readable
results, no horizontal overflow and progressive-disclosure controls.
