"""Minimal FastAPI application for GramVyapar Phase 2A."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


SERVICE_NAME = "GramVyapar Prototype API"
LOCAL_FRONTEND_ORIGINS = ["http://localhost:3000"]

app = FastAPI(title=SERVICE_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    """Return the Phase 2A service readiness response."""

    return {
        "status": "ok",
        "service": SERVICE_NAME,
        "phase": "2",
    }
