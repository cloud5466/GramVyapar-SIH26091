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

Implement verified financial formulas, boundaries, reason codes and tests.

**Exit:** finance test cases pass and a second reviewer signs off the rules.

## PHASE 4 — Local Data Engine

Implement normalized data loading, location/business lookup, approved proxies
and provenance handling.

**Exit:** both demo locations return traceable indicators and honest missing-data
states.

## PHASE 5 — Explainable Viability Engine

Implement documented scoring formulas, thresholds and confidence behavior.

**Exit:** score calculations are reproducible and boundary tests pass.

## PHASE 6 — AI Advisory Layer

Add constrained explanation using calculated values and sourced evidence only.

**Exit:** output schema, grounding checks, prohibited behaviors and fallback
responses pass review.

## PHASE 7 — Production Result Integration

Replace illustrative fields with the versioned outputs of the reviewed Phase
3–6 engines while preserving the established frontend/API boundary.

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
