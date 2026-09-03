# GramVyapar prototype

Owner: **Member 1 — Product / Technical Lead**

Phase 2A provides the smallest runnable Python backend: a FastAPI application
with one custom endpoint, `GET /health`. It contains no business analysis,
financial calculations, viability scoring, datasets, external services,
authentication or AI integration.

## Current structure

    api/        Minimal HTTP application
    engines/    Preserved Phase 1 engine placeholders
    loaders/    Preserved Phase 1 loader placeholders
    models/     Future canonical runtime models
    services/   Reserved for later service orchestration
    tests/      Future backend tests

## Windows PowerShell setup

From any PowerShell window:

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
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Expected health response:

```json
{
  "status": "ok",
  "service": "GramVyapar Prototype API",
  "phase": "2"
}
```

## Local CORS policy

The API allows browser requests from `http://localhost:3000`, the default
Next.js development origin. If the frontend is intentionally started on another
port during a later integration phase, add that exact local origin to the
development allowlist. Production CORS is not configured in Phase 2A.

## Phase boundary

The files under `engines/`, `loaders/` and `models/schemas.py` remain
non-functional placeholders. Phase 2A does not implement:

- analysis endpoints;
- financial or eligibility rules;
- local data or dataset loading;
- viability scoring;
- advisory generation or model calls;
- frontend API integration.

Future implementation must continue to follow `docs/ARCHITECTURE.md`,
`docs/DATA_CONTRACT.md` and `docs/SOURCE_POLICY.md`.
