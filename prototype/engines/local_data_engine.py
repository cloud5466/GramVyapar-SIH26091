"""Select Phase 4 hyper-local evidence without scoring or recommendations."""

from __future__ import annotations

from loaders.data_loader import load_local_data
from models.schemas import LocalDataBundle, LocalEvidenceResult, LocationOption


class LocalDataDomainError(ValueError):
    """Controlled request-domain failure with a stable reason code."""

    def __init__(self, reason_code: str, message: str) -> None:
        super().__init__(message)
        self.reason_code = reason_code
        self.message = message


def get_available_locations(
    *, bundle: LocalDataBundle | None = None
) -> list[LocationOption]:
    """Return the small canonical location list required by the frontend."""

    data = bundle or load_local_data()
    return [
        LocationOption(
            location_id=location.location_id,
            location_name=location.location_name,
            location_type=location.location_type,
        )
        for location in data.locations
    ]


def get_local_evidence(
    location_id: str,
    business_id: str,
    *,
    bundle: LocalDataBundle | None = None,
) -> LocalEvidenceResult:
    """Return source-preserving evidence for one canonical location/business."""

    data = bundle or load_local_data()
    location = next(
        (record for record in data.locations if record.location_id == location_id),
        None,
    )
    if location is None:
        raise LocalDataDomainError(
            "LOCATION_NOT_FOUND",
            "We don't have enough information for this location yet.",
        )

    profile = next(
        (record for record in data.business_profiles if record.business_id == business_id),
        None,
    )
    if profile is None:
        raise LocalDataDomainError(
            "BUSINESS_PROFILE_NOT_FOUND",
            "We don't have a configured business profile for this business yet.",
        )

    warnings: list[str] = []
    radius = profile.customer_radius_max_km
    if radius is None:
        warnings.append(
            "The business customer-radius range could not be parsed; mapped "
            "businesses were not distance-filtered."
        )

    category_matches = [
        competitor
        for competitor in data.competitors
        if competitor.location_id == location.location_id
        and competitor.business_id == profile.business_id
    ]
    competitors = []
    for competitor in category_matches:
        if radius is None or competitor.distance_km is None:
            competitors.append(competitor)
            if competitor.distance_km is None:
                warnings.append(
                    f"Distance is missing for mapped business {competitor.competitor_id}."
                )
        elif competitor.distance_km <= radius:
            competitors.append(competitor)

    if not competitors:
        warnings.append(
            "No matching mapped businesses are available inside the configured "
            "search area; this is not proof that no competitors exist."
        )
    if location.population_estimate is None:
        warnings.append("A population estimate is not available for this location.")

    user_local_input = next(
        (
            record
            for record in data.user_local_inputs
            if record.location_id == location.location_id
            and record.business_id == profile.business_id
        ),
        None,
    )

    if location.population_estimate is None and not competitors:
        evidence_status = "limited"
    elif warnings:
        evidence_status = "partial"
    else:
        evidence_status = "complete"

    return LocalEvidenceResult(
        location=location,
        business_profile=profile,
        competitors=competitors,
        competitor_radius_km=radius,
        user_local_input=user_local_input,
        configured_population_estimates=[
            record.population_estimate
            for record in data.locations
            if record.population_estimate is not None
        ],
        evidence_status=evidence_status,
        warnings=warnings,
    )
