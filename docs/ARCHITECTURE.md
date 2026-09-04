# Architecture

## Implemented Phase 6 flow

    NEXT.JS UI
    English/Hindi selection · Location · Business · Available capital
                         ↓ HTTP REST API
    FASTAPI
    Typed validation · GET /health · GET /api/v1/locations · POST /api/v1/analyze
                         ↓
    LOCAL DATA + FINANCE + VIABILITY ENGINES
    Canonical evidence · Financial rules · Versioned scoring rules
                         ↓ typed EvidencePack + requested response language
    OPTIONAL GROUNDED ADVISORY + BILINGUAL VALIDATED FALLBACK
                         ↓
    GRAMVYAPAR RESULT VIEW
    Loading · Validation · Success · Service-error states

The React frontend loads canonical location options, collects input, sends the
typed request and renders the returned response. It does not calculate project
cost, financing, viability or market indicators. Local evidence, finance and
potential scoring are selected/calculated only by their Python engines from
versioned data and rules.

The global frontend language provider sends `AnalysisRequest.language` as `en`
or `hi`. Deterministic engines run identically in both languages. Only after
their work finishes does `EvidencePack.response_language` instruct the advisory
layer to return English or Hindi display values.

Future backend layers remain deliberately separate:

| Layer | Planned phase | Current status |
| --- | --- | --- |
| Finance Engine | Phase 3 | Implemented |
| Local Data Engine | Phase 4 | Implemented |
| Viability Engine | Phase 5 | Implemented |
| AI Advisory | Phase 6 | Implemented with graceful fallback |

## System flow

    USER
    Language · Location · Business · Capital
                         ↓
    DATA & EVIDENCE LAYER
    Population · Mapped Competitors · MSME Context
    Business Profiles · Entrepreneur Local Inputs
                         ↓
    NORMALIZATION / DATA LOADER
                         ↓
    DECISION ENGINES
    Local Data Engine · Viability Engine · Financial Engine
                         ↓
    ADVISORY ENGINE
    AI explanation constrained by calculated and sourced evidence
                         ↓
    PRESENTATION LAYER
    Simple GramVyapar result + Detailed Analysis for advanced users/judges

> Data provides the evidence.  
> Code performs critical calculations.  
> AI explains the decision.

## Layer responsibilities

### User input

Collect the canonical required inputs: location ID, business ID and available
capital. Optional local inputs may be added later as user-verified evidence.

### Data and evidence layer

Stores source material and normalized records for population, mapped
businesses, MSME context, business profiles and entrepreneur inputs. Every
record carries provenance, evidence class and confidence context.

### Normalization / data loader

Validates schema, types, IDs and relationships before an engine receives data.
It must report missing or conflicting evidence and must not fabricate defaults.

### Local data engine

Selects evidence for the requested location/business boundary and calculates
only approved proxies. It preserves the inputs and methods supporting each
derived indicator. Phase 4 implements exact location selection, the canonical
business-ID translation boundary, explicit customer-radius parsing, mapped
competitor filtering and nullable user-local evidence. It performs no scoring.

### Viability engine

Produces demand, competition, financial and operational components and a
composite rating using documented deterministic rules. Phase 5 loads the
`prototype-v1` methodology from `config/viability_rules.json`, validates that
weights total 100 and returns reasons, evidence fields, confidence,
completeness, limitations and missing evidence for every score. It never reads
raw CSV files or recalculates Finance Engine outputs.

### Financial engine

Applies versioned, official rule data and documented formulas. It returns an
indicative structure with rule references and reason codes. It does not approve
or sanction a loan.

### Advisory engine

Explains supplied evidence and calculated outputs in accessible language. It may
structure opportunities, risks, SWOT and next steps. It may not recalculate
critical values, invent missing evidence or state unsupported eligibility.
Phase 6 sends a versioned normalized `EvidencePack` through a provider
abstraction, validates the structured result and falls back to deterministic
evidence-based guidance when AI is disabled or unavailable. Provider output has
no schema fields capable of changing calculated values. See
`docs/AI_ADVISORY.md`.

### Presentation layer

Shows a simple result to the entrepreneur. Detailed scores, sources,
assumptions and confidence are available through progressive disclosure for
advanced users and judges.

## Planned engine boundaries

| Component | Receives | Returns | Must not do |
| --- | --- | --- | --- |
| Data loader | Raw/processed files and input payload | Validated normalized records or structured errors | Invent missing values |
| Local data engine | Location, business profile and normalized evidence | Local indicators with provenance/confidence | Treat mapped coverage as complete |
| Financial engine | Capital, project assumptions and verified rules | Financial output with rule/reason references | Use LLM-generated calculations |
| Viability engine | Approved local, financial and business indicators | Component scores, total and rating | Hide missing evidence or undocumented weights |
| Advisory engine | Evidence plus deterministic outputs | Summary, risks, opportunities, SWOT and next steps | Alter values or create unsupported facts |

Canonical fields are defined in docs/DATA_CONTRACT.md.

## Evidence model

All information uses one of four classes:

- VERIFIED
- ESTIMATED / PROXY
- USER VERIFIED
- ILLUSTRATIVE

The definitions and display rules are in docs/SOURCE_POLICY.md.

## Failure and fallback behavior

- Invalid inputs return field-specific errors.
- Unknown locations and unsupported businesses return explicit limited-coverage
  states.
- Missing evidence lowers confidence or suppresses the affected conclusion.
- External data failure must not change previously validated deterministic
  results.
- AI failure falls back to structured calculated outputs and approved static
  explanation patterns.

## Frontend integration boundary

The landing website now consumes the typed analysis response through a
central HTTP client. React imports no engine internals and performs no business
calculations. The UI presents the deterministic prototype Business Potential
Score with four components, evidence confidence and progressive explanations.
It displays explicit outside-coverage states rather than zero or invented rules.

## Phase 3 finance boundary

    available_capital
           ↓ 10% configured margin
    Decimal project-cost calculation
           ↓ inclusive CSV range match
    versioned financial rule
           ↓ finance percentage + maximum cap
    typed FinanceResult with reason code and provenance

The loader resolves `finance/financial_rules.csv` from the repository location,
not the terminal's current working directory. It validates required columns,
types, dates, scheme-ID uniqueness and non-overlapping ranges before any rule is
used. No EMI or amortization method is implemented.

## Phase 4 local-evidence boundary

    GET /api/v1/locations
             ↓
    data/processed/locations.csv

    location_id + canonical business_id
             ↓
    validated repository-relative CSV loaders
             ↓
    location + population + business profile
    + radius-filtered mapped competitors + optional user input
             ↓
    typed LocalEvidenceResult (complete / partial / limited)

CSV business labels and `BUS001`–`BUS003` remain internal. The API accepts only
`dairy`, `tailoring` and `kirana`. The harmless source label `Tailorings` is
normalized to `tailoring` at this single loader boundary. Radius strings such as
`1-3` are parsed into minimum/maximum values; the maximum is the Phase 4 mapped
competitor search radius. Missing or unparseable evidence produces nulls and
warnings rather than invented defaults.

## Phase 5 viability boundary

    typed LocalEvidenceResult + typed FinanceResult
                         ↓
    config/viability_rules.json (prototype-v1)
                         ↓
    Market Opportunity · Competition · Financial Fit · Operational Readiness
                         ↓
    bounded score + rating + confidence + reasons + limitations

The score is a configurable decision-support heuristic, not a success
probability, credit score, financial eligibility decision or profitability
forecast. Exact rules and limitations are documented in
`docs/VIABILITY_METHODOLOGY.md`.

## Auditability

A reproducible result should identify:

- input payload;
- dataset/source versions;
- applied financial rules;
- applied scoring-rule version;
- derived indicators;
- confidence and evidence classes;
- advisory prompt/model version when AI is enabled;
- warnings and missing evidence.
