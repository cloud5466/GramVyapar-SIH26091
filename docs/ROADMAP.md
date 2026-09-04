# Development roadmap

## PHASE 1 — Research + Data + Finance + Architecture

Complete SIH requirement mapping, source registers, demo-location selection,
financial rule research, contracts and team handoffs.

**Exit:** inputs for Prototype V0 are reviewed and no critical contract question
is unresolved.

## PHASE 2 — Prototype V0

Create the smallest end-to-end local workflow with explicitly versioned
interfaces and no dependency on datasets or real engine calculations.

- **Phase 2A — complete:** runnable FastAPI service, `GET /health` and Swagger.
- **Phase 2B — complete:** typed analysis request/response contract, illustrative
  service and backend validation tests.
- **Phase 2C — complete:** existing Next.js form connected to FastAPI with
  loading, validation, success and service-error states.

**Exit:** one illustrative golden case runs end to end locally without AI,
datasets or fabricated engine calculations.

## PHASE 3 — Financial Engine

**Implemented:** deterministic Decimal-based project structuring, versioned CSV
rule loading, inclusive boundary routing, financing caps, reason codes,
provenance fields, API/UI integration and automated tests.

**Validation complete:** finance and API tests pass; frontend lint/build and the
end-to-end golden case pass. **Governance remaining:** an independent reviewer
must still sign off the official rule transcription before production use.

## PHASE 4 — Local Data Engine

**Implemented:** normalized repository-relative data loading, canonical
location/business lookup, explicit radius-range parsing, mapped competitor
filtering, nullable user evidence, provenance, structured errors and frontend
location/evidence integration.

**Validation complete:** both configured locations return traceable evidence and
honest partial-data states; API/data/finance tests and frontend lint/build pass.

## PHASE 5 — Explainable Viability Engine

**Implemented:** versioned and validated scoring configuration, deterministic
four-component scoring, rating bands, missing-evidence handling, evidence
confidence, component explanations and progressive frontend disclosure.

**Validation complete:** all six configured location/business combinations are
reproducible; score bounds, configuration failures, competition sensitivity,
API/local-data/finance regressions and frontend lint/build pass.

## PHASE 6 — AI Advisory Layer

**Implemented:** versioned `EvidencePack`, constrained structured prompt,
provider abstraction, typed advisory result, prompt-injection boundary,
deterministic fallback and frontend progressive disclosure.

**Validation complete:** generated, disabled, missing-key, timeout, provider
failure and malformed-output paths are covered without modifying deterministic
results. Manual real-provider validation remains optional and requires a local
API key.

## PHASE 7 — Production Result Integration

Harden the reviewed Phase 6 output for deployment while preserving the
established frontend/API boundary and deterministic Phase 3–5 results.

**Exit:** UI handles loading, success, unsupported and failure states without
mixing real and illustrative data.

## PHASE 8 — Confidence + Sources

Expose plain-language confidence and detailed provenance through progressive
disclosure.

**Exit:** each visible result can be traced to a source, calculation or
user-verified input.

## PHASE 9 — Testing + Feature Freeze

Run regression, edge-case, mobile, claim and demo-readiness checks. Stop adding
features.

**Exit:** no critical test or claim-audit blocker remains.

## PHASE 10 — Final Demo

Prepare the golden journey, backups, screenshots, jury responses and final
presentation.

**Exit:** primary and fallback demonstrations are rehearsed on the presentation
device.
