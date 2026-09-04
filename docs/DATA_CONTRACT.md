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
| `available_capital` | decimal | Yes | Entrepreneur-provided margin contribution in rupees |
| `margin_percentage` | decimal | Yes | Configured margin percentage; 10 in Phase 3 |
| `project_cost` | decimal | Yes | `available_capital / 0.10`, calculated with decimal arithmetic |
| `potential_financing` | decimal/null | When a rule applies | Lower of the percentage-based amount and configured maximum |
| `scheme_id` | string/null | When a rule applies | Stable ID of the inclusive range match |
| `scheme_name` | string | When a rule applies | Official scheme name |
| `finance_percentage` | decimal/null | When a rule applies | Financing percentage loaded from the rule |
| `interest_rate` | decimal | When verified/applicable | Rate from the referenced official rule |
| `repayment_years` | decimal | When verified/applicable | Repayment period from the rule |
| `moratorium_months` | integer | When verified/applicable | Moratorium from the rule |
| `maximum_financing` | decimal/null | When a rule applies | Financing cap loaded from the rule |
| `cap_applied` | boolean | Yes | Whether the existing Finance Engine capped the percentage-based amount |
| `rule_source` | string/null | When a rule applies | Source recorded by the matched rule |
| `rule_verified_date` | date/null | When a rule applies | Rule verification date in ISO API serialization |
| `status` | string | Yes | `configured` or `outside_configured_range` |
| `reason_code` | string | Yes | Stable routing outcome code |
| `notes` | string | Yes | Plain-language routing/coverage note |

These fields describe an indicative structure, not loan approval, sanction or a
binding eligibility decision. Calculation reason codes and rule IDs should be
retained for auditability. A project outside all configured inclusive ranges
returns null scheme/rate/financing fields with reason code
`PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES`; it does not fall back to an invented
scheme. EMI is outside the Phase 3 contract.

## Viability output

Phase 5 supersedes the Phase 1 draft with the typed `BusinessPotential`
contract documented below. The implemented labels are Market Opportunity,
Competition, Financial Fit and Operational Readiness. All rules are versioned,
bounded and accompanied by boundary and sensitivity tests.

## AI advisory output

| Field | Logical type | Required | Meaning |
| --- | --- | --- | --- |
| `summary` | string | Yes | Plain-language explanation of supplied evidence and outputs |
| `why_this_score` | list of strings | Yes | Up to four explanations tied to deterministic components |
| `opportunities` | list of strings | Yes | Evidence-grounded positive conditions |
| `risks` | list of strings | Yes | Evidence-grounded risks and uncertainties |
| `swot` | object | Yes | Strengths, weaknesses, opportunities and threats |
| `next_steps` | ordered list of strings | Yes | Exactly three practical validation or preparation actions |
| `questions_to_verify` | list of strings | Yes | Up to four questions that surface missing evidence |
| `confidence_note` | string | Yes | Plain-language evidence-confidence limitation |
| `disclaimer` | string | Yes | Non-guarantee and verification warning |
| `prompt_version` | string | Yes | Application-controlled prompt contract version |
| `ai_status` | string | Yes | `generated`, `fallback`, `disabled` or `error` |

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
| `language` | `en` or `hi` | Optional; defaults to `en` for backward compatibility |

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

Phase 2B used a fixed illustrative business-potential number while population
and competition remained null. That placeholder is historical and is no longer
part of the runtime contract. Phase 5 replaces it with deterministic evidence-
linked component scores.

## Phase 3 deterministic finance contract

`FinanceSummary` now contains:

```text
available_capital: number
margin_percentage: number
project_cost: number
potential_financing: number | null
scheme_id: string | null
scheme_name: string | null
finance_percentage: number | null
interest_rate: number | null
repayment_years: number | null
moratorium_months: integer | null
maximum_financing: number | null
cap_applied: boolean
rule_source: string | null
rule_verified_date: date | null
status: configured | outside_configured_range
reason_code: SCHEME_MATCHED | PROJECT_COST_OUTSIDE_CONFIGURED_SCHEMES
notes: string
```

The canonical rules file is `finance/financial_rules.csv`. All range endpoints
are inclusive. Potential financing is:

```text
min(project_cost × finance_percentage / 100, maximum_financing)
```

Financial values are estimates. Final eligibility and loan sanction remain
subject to the authorised financing agency and applicable scheme conditions.

## Phase 4 local-evidence contract

The public API uses canonical business IDs `dairy`, `tailoring` and `kirana`.
Source IDs such as `BUS001` and display/category variants remain behind the data
loader translation boundary.

`GET /api/v1/locations` returns:

```text
location_id: string
location_name: string
location_type: string
```

The `local_market` object in `AnalysisResponse` contains:

```text
population_estimate: integer | null
population_year: integer | null
population_source: string | null
population_confidence: string | null
mapped_competitors: integer
competitor_radius_km: number | null
competitors: list[CompetitorDetail]
location_type: string
evidence_status: complete | partial | limited
business_profile: BusinessProfileEvidence
user_local_inputs: UserLocalInputEvidence | null
warnings: list[string]
```

`CompetitorDetail` contains `business_name`, nullable `distance_km`, `source`
and `confidence`. The count always equals the returned list after location,
business-category and radius filtering. It describes mapped records, never all
real-world competitors.

`BusinessProfileEvidence` contains the parsed minimum/maximum customer radius,
customer type, supplier dependency, seasonality, operational-risk strings and
demand-indicator strings. These fields are evidence inputs for Phase 5; they do
not produce a score in Phase 4.

`UserLocalInputEvidence` contains nullable `known_competitors`, `local_price`,
`monthly_rent`, `supplier_distance_km`, `existing_experience`, `input_source`
and `input_date`. Empty CSV fields serialize as null and never as zero.

Customer radius ranges are parsed explicitly. The maximum is used as the Phase
4 mapped-competitor search radius. Unparseable radii retain the matching records
without distance filtering and add a warning. Unknown locations and profiles
return `LOCATION_NOT_FOUND` and `BUSINESS_PROFILE_NOT_FOUND` respectively.

Phase 4 deliberately left business potential illustrative. Phase 5 now consumes
this local-evidence contract without changing its selection behavior.

## Phase 5 Business Potential contract

`AnalysisResponse.mode` is `deterministic-prototype`. `business_potential`
contains:

```text
score: integer (0–100)
rating: High Caution | Needs Validation | Promising | Strong Potential
methodology_version: string
score_type: string
confidence: high | medium | low
components: BusinessPotentialComponents
missing_evidence: list[string]
disclaimer: string
```

`BusinessPotentialComponents` contains exactly:

```text
market_opportunity: ScoreComponent (maximum 30)
competition: ScoreComponent (maximum 25)
financial_fit: ScoreComponent (maximum 25)
operational_readiness: ScoreComponent (maximum 20)
```

Every `ScoreComponent` contains:

```text
score: integer
max_score: integer
reason: string
evidence_used: list[string]
confidence: high | medium | low
evidence_completeness: high | medium | low
limitations: list[string]
```

The total is the bounded sum of the four component scores. Missing source values
are never replaced with invented facts. Neutral points for missing operational
inputs are explicitly configured and the missing fields are listed in
`missing_evidence`.

Confidence describes evidence completeness/reliability, not percentage
accuracy. The score is a decision-support heuristic—not a probability of
success, credit score, profitability forecast, loan-eligibility score or loan
approval. Exact formulas and thresholds are defined in
`docs/VIABILITY_METHODOLOGY.md`; machine-readable rules are in
`config/viability_rules.json`.

## Phase 6 grounded advisory contract

After the deterministic engines finish, the service creates a versioned
`EvidencePack` containing normalized request, local-market, business-profile,
finance and Business Potential results. `response_language` is `English` or
`Hindi` and affects advisory display text only. Raw dataset paths, debug state,
environment values and secrets are excluded.

`AnalysisResponse.advisory` contains:

```text
summary: string
why_this_score: list[string] (maximum 4)
opportunities: list[string] (maximum 4)
risks: list[string] (maximum 4)
swot:
  strengths: list[string] (maximum 3)
  weaknesses: list[string] (maximum 3)
  opportunities: list[string] (maximum 3)
  threats: list[string] (maximum 3)
next_steps: list[string] (exactly 3)
questions_to_verify: list[string] (maximum 4)
confidence_note: string
disclaimer: string
prompt_version: advisory-prompt-v1
ai_status: generated | fallback | disabled | error
```

Provider output cannot carry or overwrite deterministic numerical fields.
`insights` remains temporarily available as a deprecated compatibility mirror
of advisory summary, opportunities, risks and next steps. New consumers must use
`advisory`.

AI-disabled, missing-key, timeout, provider-error and malformed-output states
return a complete deterministic fallback advisory and do not fail an otherwise
valid analysis request. Details and configuration are documented in
`docs/AI_ADVISORY.md`.
