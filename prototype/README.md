# GramVyapar prototype

Owner: **Member 1 — Product / Technical Lead**

Phase 2C connects the existing GramVyapar form to the typed illustrative
FastAPI contract. `POST /api/v1/analyze` still validates application plumbing
only. It contains no evidence-backed business analysis, financial calculations,
real viability scoring, datasets, external services, authentication or AI
integration.

## Current structure

    api/        Health and illustrative analysis HTTP routes
    engines/    Preserved Phase 1 engine placeholders
    loaders/    Preserved Phase 1 loader placeholders
    models/     Typed Phase 2B API contracts
    services/   Illustrative response assembly only
    tests/      Backend contract and validation tests

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
- Illustrative analysis endpoint: `POST http://localhost:8000/api/v1/analyze`
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Expected health response:

```json
{
  "status": "ok",
  "service": "GramVyapar Prototype API",
  "phase": "2"
}
```

## Test the Phase 2B API

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

## Phase boundary

The files under `engines/` and `loaders/` remain non-functional architecture
placeholders. Phase 2C does not implement:

- financial or eligibility rules;
- local data or dataset loading;
- viability scoring;
- advisory generation or model calls;
- frontend-side business calculations.

The `76` business-potential score and `Promising` rating are explicit visual/test
placeholders. Every local-market and calculated financial value remains null.

Future implementation must continue to follow `docs/ARCHITECTURE.md`,
`docs/DATA_CONTRACT.md` and `docs/SOURCE_POLICY.md`.
