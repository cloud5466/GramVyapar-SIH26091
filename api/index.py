"""Vercel entrypoint that exposes the authoritative GramVyapar FastAPI app."""

from __future__ import annotations

import sys
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
PROTOTYPE_ROOT = REPOSITORY_ROOT / "prototype"

# The prototype currently supports `cd prototype; uvicorn api.main:app`.
# Adding this absolute module path preserves that workflow while allowing Vercel
# to import the same application from the repository root.
prototype_path = str(PROTOTYPE_ROOT)
if prototype_path not in sys.path:
    sys.path.insert(0, prototype_path)

from prototype.api.main import app  # noqa: E402


__all__ = ["app"]
