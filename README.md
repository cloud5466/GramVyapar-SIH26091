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

- The Next.js website and FastAPI prototype work together locally and are
  prepared for a single Vercel project.
- Deterministic local-data, finance and explainable Business Potential engines
  are implemented with provenance, confidence and tests.
- The grounded OpenAI advisory adapter is implemented with schema validation
  and deterministic fallback.
- English/Hindi UI — implemented.
- Multilingual English/Hindi AI advisory and fallback — implemented.
- Voice and additional Indian languages — future scope.

## Local development

Requirements: Node.js 22.13 or newer.

Install and start the frontend from the repository root:

```powershell
npm install
npm run dev
```

In a second PowerShell window, start the authoritative FastAPI application:

```powershell
cd prototype
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn api.main:app --reload --port 8000
```

For local frontend-to-backend requests, create a private `.env.local` from
`.env.example` or set:

```text
NEXT_PUBLIC_GRAMVYAPAR_API_URL=http://localhost:8000
```

The frontend is available at `http://localhost:3000`; backend health is at
`http://localhost:8000/health` and API documentation is at
`http://localhost:8000/docs`.

For validation:

```powershell
npm run lint
npm run build
cd prototype
.\.venv\Scripts\python.exe -m pytest tests -q
```

Backend setup and runtime commands are documented in `prototype/README.md`.
Multilingual behavior is documented in `docs/MULTILINGUAL.md`; AI configuration
and grounding rules are documented in `docs/AI_ADVISORY.md`.

## Vercel deployment

GramVyapar deploys as one Vercel project: native Next.js serves `/`, while
`api/index.py` exposes the existing FastAPI application under `/api/*`.
Production browser requests use same-origin API paths automatically.

1. Commit and push this repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Select **Next.js** as the framework preset.
4. Keep **Root Directory** set to the repository root (`./`).
5. Keep the default install and build commands (`npm install`, `npm run build`).
6. Add these server-side environment variables in the Vercel dashboard:

   ```text
   GRAMVYAPAR_AI_ENABLED=true
   GRAMVYAPAR_LLM_PROVIDER=openai
   GRAMVYAPAR_LLM_MODEL=gpt-5.4-mini
   GRAMVYAPAR_AI_TIMEOUT_SECONDS=12
   OPENAI_API_KEY=<configured only in Vercel>
   ```

7. Do **not** set `NEXT_PUBLIC_GRAMVYAPAR_API_URL` in Vercel unless the API is
   intentionally moved to an external host. When absent, the browser calls the
   deployed domain's `/api` routes.
8. Deploy, then confirm `https://<your-domain>/api/health` returns `status: ok`.
9. Run one English and one Hindi business analysis through the deployed UI.

The root `requirements.txt` is the Vercel Python runtime dependency manifest.
`vercel.json` only guarantees that the canonical `data/`, `finance/` and
`config/` files are included with the Python function; framework detection and
frontend routing remain native.

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
