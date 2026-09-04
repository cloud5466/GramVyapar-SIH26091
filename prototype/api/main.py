"""FastAPI application for the GramVyapar Phase 6 prototype."""

from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engines.local_data_engine import LocalDataDomainError, get_available_locations
from models.schemas import AnalysisRequest, AnalysisResponse, LocationOption
from services.demo_analysis_service import create_demo_analysis


SERVICE_NAME = "GramVyapar Prototype API"
LOCAL_FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


class HealthResponse(BaseModel):
    """Typed contract exposed by the Phase 2A health endpoint."""

    status: Literal["ok"]
    service: Literal["GramVyapar Prototype API"]
    phase: Literal["2"]


app = FastAPI(title=SERVICE_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=LOCAL_FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Return the Phase 2A service readiness response."""

    return HealthResponse(status="ok", service=SERVICE_NAME, phase="2")


@app.get("/api/health", response_model=HealthResponse)
def production_health() -> HealthResponse:
    """Expose the same readiness contract under the production API prefix."""

    return health()


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest) -> AnalysisResponse:
    """Return deterministic analysis followed by grounded advisory guidance."""

    try:
        return create_demo_analysis(request)
    except LocalDataDomainError as error:
        raise HTTPException(
            status_code=404,
            detail={"reason_code": error.reason_code, "message": error.message},
        ) from error


@app.get("/api/v1/locations", response_model=list[LocationOption])
def locations() -> list[LocationOption]:
    """Return configured MVP locations from the canonical dataset."""

    return get_available_locations()
