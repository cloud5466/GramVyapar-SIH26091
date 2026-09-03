# Architecture

## System flow

    USER
    Location · Business · Capital
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
    Simple Dhandha Dost result + Detailed Analysis for advanced users/judges

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
derived indicator.

### Viability engine

Produces demand, competition, financial and operational components and a
composite rating using documented deterministic rules. Weights, score ranges
and thresholds remain undefined until reviewed before Phase 2.

### Financial engine

Applies versioned, official rule data and documented formulas. It returns an
indicative structure with rule references and reason codes. It does not approve
or sanction a loan.

### Advisory engine

Explains supplied evidence and calculated outputs in accessible language. It may
structure opportunities, risks, SWOT and next steps. It may not recalculate
critical values, invent missing evidence or state unsupported eligibility.

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

The current landing website remains independent from deep backend
implementation. A later integration should consume one versioned result object
rather than importing engine internals into React components. The UI must keep
illustrative demo state separate from real engine responses.

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
