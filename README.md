# GramVyapar

**Smart India Hackathon 2026 · Problem Statement SIH26091**

GramVyapar is an AI-driven, hyper-local business advisory and financial
structuring assistant for rural and semi-urban first-time entrepreneurs. It
helps a user move from three simple inputs—location, business idea and
available capital—to an evidence-backed view of local business potential,
financial structure and recommended next steps.

> Data provides the evidence. Code performs critical calculations. AI explains
> the decision.

## Target users

Rural and semi-urban first-time entrepreneurs who need clear, accessible
guidance before committing capital or applying for finance.

## Core user flow

```text
Location + Business Idea + Available Capital
                         ↓
Local Business Potential + Financial Structure + Recommended Next Steps
```

## Repository map

| Path | Purpose |
| --- | --- |
| `app/`, `components/`, `lib/` | Working Next.js landing website and illustrative prototype UI |
| `config/` | Shared project metadata and stable cross-workspace constants |
| `data/` | Raw evidence, normalized templates and entrepreneur input contract |
| `finance/` | Financial rule templates, source register and test-case inputs |
| `research/` | SIH requirements, papers, solution review and user research |
| `presentation/` | Structured content, screenshots and diagrams for the six-slide SIH deck |
| `testing/` | Application tests, jury preparation, claim audit and demo readiness |
| `prototype/` | Future Python engine boundaries, loaders, models and tests |
| `docs/` | Architecture, contracts, scope, workflow, decisions and roadmap |
| `team/` | Shared task board, contribution guide and evidence-aware handoffs |
| `scripts/` | Future repeatable validation and data-processing utilities |

## Team workstreams

| Member | Workstream | Primary workspace |
| --- | --- | --- |
| Member 1 | Product / Technical Lead | `app/`, `components/`, `prototype/`, `docs/` |
| Member 2 | Research Lead | `research/` |
| Member 3 | Hyper-local Data Lead | `data/` |
| Member 4 | Finance Lead | `finance/` |
| Member 5 | Presentation / UX Lead | `presentation/` |
| Member 6 | QA / Demo / Jury Lead | `testing/` |

See `team/TASK_BOARD.md` for current ownership and status. Every handoff should
use `team/HANDOFF_TEMPLATE.md`.

## Current status

- The GramVyapar Next.js landing website is working.
- The public prototype experience is illustrative and frontend-only.
- Phase 1 repository architecture and team workspaces are initialized.
- Data CSVs and financial rule CSVs contain headers only.
- Python engine files are responsibility placeholders; no business logic exists.
- Demo locations remain TBD and must be limited to exactly two for the MVP.

## Run the website locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

For validation:

```bash
npm run lint
npm run build
```

## Development roadmap

1. Research, data, finance and architecture
2. Prototype V0
3. Financial engine
4. Local data engine
5. Explainable viability engine
6. AI advisory layer
7. Frontend integration
8. Confidence and sources
9. Testing and feature freeze
10. Final demo

The detailed sequence and exit criteria live in `docs/ROADMAP.md`.

## Source and evidence policy

Every value used by the product must be classified as **Verified**,
**Estimated / Proxy**, **User Verified**, or **Illustrative**. Illustrative
values must never be presented as verified findings. Official URLs, retrieval
dates and transformation notes should travel with contributed data.

Read `docs/SOURCE_POLICY.md` before adding data, financial rules, research
claims or presentation content.
