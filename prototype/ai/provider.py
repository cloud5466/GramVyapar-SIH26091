"""Optional advisory provider abstraction and environment configuration."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from dotenv import load_dotenv

from models.schemas import AdvisoryDraft, EvidencePack

from .prompts import SYSTEM_PROMPT, build_evidence_message


TRUE_VALUES = {"1", "true", "yes", "on"}
BACKEND_ENV_FILE = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=BACKEND_ENV_FILE, override=False)


@dataclass(frozen=True)
class AISettings:
    """Runtime-only provider settings loaded without exposing secret values."""

    enabled: bool
    provider: str
    model: str
    api_key: str | None
    timeout_seconds: float

    @classmethod
    def from_env(cls) -> "AISettings":
        enabled = os.getenv("GRAMVYAPAR_AI_ENABLED", "false").strip().lower()
        timeout_raw = os.getenv("GRAMVYAPAR_AI_TIMEOUT_SECONDS", "12").strip()
        try:
            timeout_seconds = max(1.0, float(timeout_raw))
        except ValueError:
            timeout_seconds = 12.0
        return cls(
            enabled=enabled in TRUE_VALUES,
            provider=os.getenv("GRAMVYAPAR_LLM_PROVIDER", "openai").strip().lower(),
            model=os.getenv(
                "GRAMVYAPAR_LLM_MODEL", "gpt-5.4-mini"
            ).strip(),
            api_key=os.getenv("OPENAI_API_KEY") or None,
            timeout_seconds=timeout_seconds,
        )


class AdvisoryProvider(Protocol):
    """Provider-independent contract used by the advisory engine."""

    def generate(self, evidence_pack: EvidencePack) -> AdvisoryDraft: ...


class OpenAIAdvisoryProvider:
    """OpenAI Structured Outputs adapter isolated from business logic."""

    def __init__(self, settings: AISettings) -> None:
        from openai import OpenAI

        self._client = OpenAI(
            api_key=settings.api_key,
            timeout=settings.timeout_seconds,
            max_retries=0,
        )
        self._model = settings.model

    def generate(self, evidence_pack: EvidencePack) -> AdvisoryDraft:
        response = self._client.responses.parse(
            model=self._model,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_evidence_message(evidence_pack)},
            ],
            text_format=AdvisoryDraft,
        )
        if response.output_parsed is None:
            raise ValueError("Provider returned no structured advisory")
        return response.output_parsed


def create_provider(settings: AISettings) -> AdvisoryProvider:
    """Create a configured provider or fail closed for unsupported values."""

    if settings.provider != "openai":
        raise ValueError("Unsupported advisory provider")
    return OpenAIAdvisoryProvider(settings)


def configuration_diagnostic(settings: AISettings | None = None) -> dict[str, object]:
    """Return safe configuration presence flags without secret material."""

    current = settings or AISettings.from_env()
    return {
        "environment_file": str(BACKEND_ENV_FILE),
        "environment_file_exists": BACKEND_ENV_FILE.exists(),
        "ai_enabled": current.enabled,
        "provider_configured": bool(current.provider),
        "api_key_present": bool(current.api_key),
        "model_configured": bool(current.model),
        "provider": current.provider,
        "model": current.model,
    }


def sanitize_provider_error(error: Exception, api_key: str | None = None) -> str:
    """Keep diagnostics useful while removing authorization material."""

    if type(error).__name__ == "ValidationError":
        return "ValidationError: structured advisory did not match the required schema"
    message = str(error)
    if api_key:
        message = message.replace(api_key, "[REDACTED]")
    message = re.sub(r"(?i)bearer\s+\S+", "Bearer [REDACTED]", message)
    message = re.sub(r"sk-[A-Za-z0-9_-]+", "[REDACTED]", message)
    message = re.sub(r"(?i)input_value=.*?(?=\s+\[type=|$)", "input_value=[REDACTED]", message)
    message = " ".join(message.split())[:500]
    return f"{type(error).__name__}: {message or 'No provider message'}"
