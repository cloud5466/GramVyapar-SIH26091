# Project overview

## Identity

- **Product:** Dhandha Dost
- **Tagline:** Har Business Ka Smart Dost
- **Event:** Smart India Hackathon 2026
- **Problem Statement ID:** SIH26091

## Product purpose

Dhandha Dost helps rural and semi-urban first-time entrepreneurs move from:

    Location
    +
    Business Idea
    +
    Available Capital

to:

    Local Business Potential
    +
    Financial Structure
    +
    Recommended Next Steps

The product is intended to support an early business decision, not replace an
authorized lender, domain expert, field survey or entrepreneur judgement.

## Problem framing

An entrepreneur may understand the kind of business they want to start and the
capital they can contribute, while local demand evidence, competition context,
business planning and official finance rules remain fragmented. Generic AI
advice can sound confident without local evidence or auditable calculations.

Dhandha Dost brings those layers into one explainable workflow.

## Product principles

1. **Simple outside, structured inside.** The public UI asks only for essential
   inputs and reveals technical details progressively.
2. **Evidence before explanation.** Advice must be constrained by local,
   financial and entrepreneur-provided evidence.
3. **Deterministic critical calculations.** Financial and scoring logic belongs
   in code with tests, not free-form LLM output.
4. **Visible uncertainty.** Missing, proxy or illustrative information is
   labelled honestly.
5. **Narrow, credible MVP.** The prototype begins with three business categories
   and exactly two selected demo locations.

## Current implementation

The repository contains a working Next.js landing website with an illustrative,
frontend-only advisory interaction. It does not yet contain a backend, real
financial engine, local-data engine, AI integration or live external dataset.

Phase 1 establishes the contracts, ownership and source policy needed before
those components are implemented.

## Success for the hackathon prototype

The prototype should demonstrate that one approved demo input can be traced
from source-backed local data and verified financial rules through deterministic
calculations to a clear, confidence-labelled advisory result. Every limitation
should remain visible.
