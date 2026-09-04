"""FastAPI application for the GramVyapar Phase 2 prototype."""

from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.schemas import AnalysisRequest, AnalysisResponse
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


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest) -> AnalysisResponse:
    """Return the Phase 2B illustrative analysis contract."""

    return create_demo_analysis(request)
