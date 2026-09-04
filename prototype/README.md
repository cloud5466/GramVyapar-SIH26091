# GramVyapar prototype

Owner: **Member 1 — Product / Technical Lead**

Phase 5 combines canonical local evidence, deterministic finance and the
versioned explainable GramVyapar Business Potential Score.
`POST /api/v1/analyze` returns four bounded score components with reasons, evidence,
confidence, completeness and limitations. External services, authentication and
AI remain unimplemented.

## Current structure

    api/        Health, location and typed analysis HTTP routes
    engines/    Deterministic local-data, finance and viability engines
    loaders/    Validated data, finance-rule and viability-rule loaders
    models/     Typed API, evidence, rule, finance and scoring contracts
    services/   Deterministic result assembly; static non-AI advisory text
    tests/      API, data, finance, scoring, boundary and sensitivity tests

## Local development

Run the frontend and backend in two PowerShell terminals.

### Terminal 1 — frontend

```powershell
Set-Location 'C:\Users\Admin\Desktop\GramVyapar-SIH26091'
npm run dev
```

The existing frontend runtime is Vinext on Vite and starts at
[http://localhost:3000](http://localhost:3000).

The frontend API origin is configured through
`NEXT_PUBLIC_GRAMVYAPAR_API_URL`. The checked-in `.env.example` uses the local
backend. To create an explicit local override before starting the frontend:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` is ignored by Git. The central frontend client also uses
`http://localhost:8000` as the local development fallback when the variable is
unset.

### Terminal 2 — backend

```powershell
Set-Location 'C:\Users\Admin\Desktop\GramVyapar-SIH26091\prototype'
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

The activation step is optional if commands are run directly through
`.\.venv\Scripts\python.exe`.

## Local endpoints

- Health endpoint: [http://localhost:8000/health](http://localhost:8000/health)
- Locations endpoint: [http://localhost:8000/api/v1/locations](http://localhost:8000/api/v1/locations)
- Analysis endpoint: `POST http://localhost:8000/api/v1/analyze`
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Expected health response:

```json
{
  "status": "ok",
  "service": "GramVyapar Prototype API",
  "phase": "2"
}
```

## Test the Phase 3 API

Open [http://localhost:8000/docs](http://localhost:8000/docs), expand
`POST /api/v1/analyze`, choose **Try it out**, enter the request body and choose
**Execute**. The same page continues to expose `GET /health`.

PowerShell example:

```powershell
$body = @{
    location_id = 'demo-location-01'
    business_id = 'dairy'
    available_capital = 100000
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri 'http://localhost:8000/api/v1/analyze' `
    -Method Post `
    -ContentType 'application/json' `
    -Body $body
```

Run the backend tests from the `prototype` directory:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

## Local CORS policy

The API allows browser requests from the exact local frontend origins
`http://localhost:3000` and `http://127.0.0.1:3000`. It does not use a wildcard
origin. The allowlist permits `GET` and `POST`; the frontend is not connected to
the API from any unlisted origin. The Phase 2C frontend calls the backend from
the central API client. If the frontend is intentionally started on another
port, add both hostname variants for that exact port to the development
allowlist. Production CORS is not configured.

## Phase 3 finance behavior

The engine treats available capital as a 10% margin and calculates project cost
with decimal arithmetic. It selects a rule using inclusive project-cost bounds,
then caps percentage-based potential financing at the rule's maximum. Projects
outside all configured ranges return a structured coverage response with null
scheme and financing values.

Final eligibility and loan sanction remain subject to the authorised financing
agency and applicable scheme conditions. No EMI calculation is included.

## Phase 4 local evidence

The frontend location picker reads the real configured locations from
`GET /api/v1/locations`. The local-data engine accepts canonical business IDs,
parses the profile radius range and filters mapped businesses by location,
business and maximum radius. Unknown IDs return structured 404 errors. Missing
optional user-local fields remain null.

## Phase 5 scoring

The viability engine consumes only typed Local Data and Finance Engine results.
It loads `config/viability_rules.json`, calculates Market Opportunity (30),
Competition (25), Financial Fit (25) and Operational Readiness (20), and returns
the bounded total, rating, confidence, missing evidence and explanations. The
fixed Phase 2 placeholder is no longer used.

The score is a prototype decision-support heuristic, not a prediction of
success, credit score, profitability claim, eligibility result or loan
approval. The exact method is documented in `docs/VIABILITY_METHODOLOGY.md`.

The advisory engine remains unimplemented. No model call, generated SWOT or
free-form AI recommendation is included in Phase 5, and the frontend performs no
business calculations.

Future implementation must continue to follow `docs/ARCHITECTURE.md`,
`docs/DATA_CONTRACT.md` and `docs/SOURCE_POLICY.md`.
