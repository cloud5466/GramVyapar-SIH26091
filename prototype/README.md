# Prototype workspace

Owner: **Member 1 — Product / Technical Lead**

This directory defines the future Python prototype boundaries. It intentionally
contains no working engine logic in Phase 1.

## Planned flow

    loaders → normalized models → local/finance/viability engines
            → advisory engine → frontend-safe result

## Rules before implementation

1. Complete and review docs/DATA_CONTRACT.md.
2. Select exactly two demo locations and prepare source-backed data.
3. Verify financial rules and boundary test cases.
4. Define deterministic scoring rules and expected outputs.
5. Agree on error and confidence behavior.
6. Do not let the advisory layer invent or recalculate critical values.
7. Add tests with every engine implementation.

Phase 2 implementation must replace placeholders incrementally and preserve the
contract boundaries documented in docs/ARCHITECTURE.md.
