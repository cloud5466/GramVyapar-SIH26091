# Data contract

Status: **Phase 1 canonical contract**  
Owner: **Member 1 — Product / Technical Lead**  
Contributors: **Member 3 — Hyper-local Data Lead**, **Member 4 — Finance Lead**

This contract defines the names and intended meaning shared by data files,
future Python engines and frontend integration. Types are logical types; the
runtime schema implementation belongs to a later phase.

## Contract principles

- IDs are stable machine identifiers; names are display labels.
- Currency fields use Indian rupees unless a later version adds a currency field.
- Distances use kilometres.
- Missing values remain missing. Loaders must not invent defaults.
- Every factual or derived record must retain source and evidence-class context.
- Score ranges, weights and rating thresholds are not defined in Phase 1.
- Additive changes require a documented decision; breaking changes require a
  new contract version.

## Location

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `location_id` | string | Yes | Stable identifier used across datasets |
| `location_name` | string | Yes | Human-readable location name |
| `block` | string | When applicable | Administrative block |
| `district` | string | Yes | District name |
| `state` | string | Yes | State name |
| `latitude` | decimal | Yes | Geographic latitude |
| `longitude` | decimal | Yes | Geographic longitude |
| `location_type` | string | Yes | Controlled location classification to be defined with the demo data |

## Population evidence

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `population_estimate` | integer | When available | Population value or documented proxy for the location |
| `population_year` | integer | With population | Reference year |
| `population_source` | string | With population | Source ID or traceable official/open reference |
| `population_confidence` | string | With population | Documented confidence label |

Population data remains `VERIFIED` only when it is directly reported for the
same geography and period. Re-aggregation, interpolation or proxy mapping is
`ESTIMATED / PROXY` and must document the transformation.

## Competitor evidence

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `business_category` | string | Yes | Normalized category used by the product |
| `mapped_competitor_count` | integer | Yes | Count produced within the documented search boundary |
| `competitor_source` | string | Yes | Source or query reference |
| `competition_confidence` | string | Yes | Confidence based on source coverage and recency |

Mapped counts are evidence of mapped presence, not proof of complete real-world
competition. Search radius, tags, query date and known omissions must accompany
the source notes.

## Business profile

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `business_id` | string | Yes | Stable identifier for a supported business profile |
| `business_name` | string | Yes | User-facing business name |
| `customer_radius_km` | decimal | After validation | Assumed operating/customer radius with evidence |
| `customer_type` | string | After validation | Intended customer segment description |
| `supplier_dependency` | string | After validation | Documented dependency profile |
| `seasonality` | string | After validation | Known seasonal pattern |
| `main_operational_risks` | list/string | After validation | Structured or delimited risk descriptions |
| `key_demand_indicators` | list/string | After validation | Structured or delimited demand signals |

Business profiles must cite research, domain review or user-verified inputs.
They must not be presented as universal facts.

## User input

### Required

| Field | Logical type | Constraints |
| --- | --- | --- |
| `location_id` | string | Must match a supported location for full analysis |
| `business_id` | string | Must match a supported business profile |
| `available_capital` | decimal | Non-negative amount in Indian rupees |

### Optional future local inputs

| Field | Logical type | Evidence class |
| --- | --- | --- |
| `known_competitors` | integer | USER VERIFIED |
| `local_price` | decimal | USER VERIFIED |
| `monthly_rent` | decimal | USER VERIFIED |
| `supplier_distance` | decimal | USER VERIFIED |
| `existing_experience` | string | USER VERIFIED |

The machine-readable Phase 1 input schema is
`data/user_inputs/local_input_schema.json`.

## Financial output

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `project_cost` | decimal | Yes | Deterministically calculated or selected project cost |
| `potential_financing` | decimal | Yes | Indicative financing under the applied verified rule |
| `scheme_name` | string | When a rule applies | Official scheme name |
| `interest_rate` | decimal | When verified/applicable | Rate from the referenced official rule |
| `repayment_years` | decimal | When verified/applicable | Repayment period from the rule |
| `moratorium_months` | integer | When verified/applicable | Moratorium from the rule |
| `financial_confidence` | string | Yes | Confidence based on rule completeness and input quality |

These fields describe an indicative structure, not loan approval, sanction or a
binding eligibility decision. Calculation reason codes and rule IDs should be
added when the engine interface is implemented.

## Viability output

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `demand_score` | decimal | Yes | Demand component under a documented formula |
| `competition_score` | decimal | Yes | Competition component under a documented formula |
| `financial_score` | decimal | Yes | Financial-feasibility component |
| `operational_score` | decimal | Yes | Operational-readiness/risk component |
| `total_score` | decimal | Yes | Deterministic composite |
| `rating` | string | Yes | Label mapped from a documented threshold |

No score range, weight or rating threshold is approved in Phase 1. Those rules
must be reviewed and accompanied by boundary test cases before implementation.

## AI advisory output

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `summary` | string | Yes | Plain-language explanation of supplied evidence and outputs |
| `opportunities` | list of strings | Yes | Evidence-grounded positive conditions |
| `risks` | list of strings | Yes | Evidence-grounded risks and uncertainties |
| `swot` | object | Yes | Strengths, weaknesses, opportunities and threats |
| `next_steps` | ordered list of strings | Yes | Practical validation or preparation actions |

The advisory layer may explain or organize supplied evidence. It must not invent
sources, change calculated values, decide financial eligibility or hide missing
evidence.

## Confidence and provenance

The serialization envelope will be finalized before Phase 2. Until then, every
handoff must preserve:

- evidence class;
- source ID or entrepreneur-input reference;
- source/retrieval date where relevant;
- transformation notes for proxies;
- confidence rationale;
- known limitations.

## Failure behavior

- Unknown location: return an explicit unsupported/limited-coverage state.
- Unsupported business: return an explicit unsupported state.
- Missing evidence: omit or limit the affected output and lower confidence.
- Invalid input: reject with a field-specific, user-safe error.
- Conflicting evidence: retain both sources for review; do not silently choose.

## Phase 2B API contract

Phase 2B values are illustrative placeholders used only to validate application
plumbing. This contract does not represent evidence-backed analysis, financial
eligibility, loan sanction or real viability scoring.

### Request: `AnalysisRequest`

| Field | API type | Validation |
| --- | --- | --- |
| `location_id` | string | Required; trimmed value must contain at least one character |
| `business_id` | string | Required; trimmed value must contain at least one character |
| `available_capital` | number | Required; must be strictly greater than zero |

### Response: `AnalysisResponse`

| Field | API type | Phase 2B meaning |
| --- | --- | --- |
| `analysis_id` | string | Newly generated UUID for the illustrative response |
| `mode` | string | Always `illustrative` in Phase 2B |
| `business` | `BusinessContext` | Submitted IDs plus safe temporary display labels |
| `business_potential` | `BusinessPotential` | Illustrative score and rating only |
| `local_market` | `LocalMarket` | Reserved nullable evidence fields |
| `finance` | `FinanceSummary` | Submitted capital plus reserved nullable calculation fields |
| `insights` | `AdvisoryInsights` | Fixed non-AI guidance for plumbing validation |
| `sources` | list | Empty until evidence integration |
| `disclaimer` | string | Explicit Phase 2 illustrative-use notice |

Nested response objects:

```text
BusinessContext
  business_id: string
  business_name: string
  location_id: string
  location_name: string

BusinessPotential
  score: number
  rating: string

LocalMarket
  population_estimate: integer | null
  mapped_competitors: integer | null
  confidence: string

FinanceSummary
  available_capital: number
  project_cost: number | null
  potential_financing: number | null
  scheme_name: string | null
  interest_rate: number | null
  repayment_years: number | null
  moratorium_months: integer | null

AdvisoryInsights
  summary: string
  opportunities: list[string]
  risks: list[string]
  next_steps: list[string]
```

The sole illustrative analysis number is `business_potential.score = 76`. All
population, competition and calculated financial fields remain `null`.
