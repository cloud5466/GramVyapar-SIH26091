"""Load and validate canonical local evidence without cwd assumptions."""

from __future__ import annotations

import csv
import re
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from pathlib import Path

from models.schemas import (
    BusinessProfile,
    CompetitorRecord,
    LocalDataBundle,
    LocationRecord,
    UserLocalInput,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DATA_ROOT = REPOSITORY_ROOT / "data" / "processed"
USER_INPUT_DATA_ROOT = REPOSITORY_ROOT / "data" / "user_inputs"
LOCATIONS_PATH = PROCESSED_DATA_ROOT / "locations.csv"
COMPETITORS_PATH = PROCESSED_DATA_ROOT / "mapped_competitors.csv"
BUSINESS_PROFILES_PATH = PROCESSED_DATA_ROOT / "business_profiles.csv"
USER_LOCAL_INPUTS_PATH = USER_INPUT_DATA_ROOT / "user_local_inputs.csv"

LOCATION_COLUMNS = frozenset(
    {
        "location_id",
        "location_name",
        "block",
        "district",
        "state",
        "latitude",
        "longitude",
        "location_type",
        "population_estimate",
        "population_year",
        "population_source",
        "population_confidence",
    }
)
COMPETITOR_COLUMNS = frozenset(
    {
        "competitor_id",
        "location_id",
        "business_category",
        "business_name",
        "latitude",
        "longitude",
        "distance_km",
        "source",
        "confidence",
    }
)
BUSINESS_PROFILE_COLUMNS = frozenset(
    {
        "business_id",
        "business_name",
        "customer_radius_km",
        "customer_type",
        "supplier_dependency",
        "seasonality",
        "main_operational_risks",
        "key_demand_indicators",
    }
)
USER_LOCAL_INPUT_COLUMNS = frozenset(
    {
        "input_id",
        "location_id",
        "business_category",
        "known_competitors",
        "local_price",
        "monthly_rent",
        "supplier_distance_km",
        "existing_experience",
        "input_source",
        "input_date",
    }
)

# Harmless category aliases are normalized only at this translation boundary.
BUSINESS_CATEGORY_ALIASES = {
    "dairy": "dairy",
    "kirana": "kirana",
    "tailor": "tailoring",
    "tailoring": "tailoring",
    "tailorings": "tailoring",
}
RADIUS_RANGE_PATTERN = re.compile(
    r"^\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*$"
)


class LocalDataValidationError(ValueError):
    """Raised when a canonical dataset cannot be trusted by the engine."""


def normalize_business_category(value: str) -> str:
    """Translate dataset labels to the three stable public business IDs."""

    normalized = BUSINESS_CATEGORY_ALIASES.get(value.strip().casefold())
    if normalized is None:
        raise LocalDataValidationError(f"Unsupported business category: {value}")
    return normalized


def _read_rows(path: Path, required_columns: frozenset[str]) -> list[dict[str, str]]:
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as data_file:
            reader = csv.DictReader(data_file)
            headers = reader.fieldnames or []
            if any(not (header or "").strip() for header in headers):
                raise LocalDataValidationError(f"{path.name} has a blank column header")
            missing = sorted(required_columns.difference(headers))
            if missing:
                raise LocalDataValidationError(
                    f"{path.name} missing required columns: {', '.join(missing)}"
                )
            return [dict(row) for row in reader]
    except OSError as error:
        raise LocalDataValidationError(f"Cannot read canonical data: {path}") from error


def _required_text(row: dict[str, str], field: str, context: str) -> str:
    value = (row.get(field) or "").strip()
    if not value:
        raise LocalDataValidationError(f"{context}: {field} is required")
    return value


def _optional_text(row: dict[str, str], field: str) -> str | None:
    value = (row.get(field) or "").strip()
    return value or None


def _decimal(
    row: dict[str, str], field: str, context: str, *, optional: bool = False
) -> Decimal | None:
    value = (row.get(field) or "").strip()
    if optional and not value:
        return None
    if not value:
        raise LocalDataValidationError(f"{context}: {field} is required")
    try:
        parsed = Decimal(value)
    except InvalidOperation as error:
        raise LocalDataValidationError(f"{context}: {field} must be numeric") from error
    if not parsed.is_finite():
        raise LocalDataValidationError(f"{context}: {field} must be finite")
    return parsed


def _integer(
    row: dict[str, str], field: str, context: str, *, optional: bool = False
) -> int | None:
    parsed = _decimal(row, field, context, optional=optional)
    if parsed is None:
        return None
    if parsed != parsed.to_integral_value():
        raise LocalDataValidationError(f"{context}: {field} must be an integer")
    return int(parsed)


def _optional_date(row: dict[str, str], field: str, context: str) -> date | None:
    value = (row.get(field) or "").strip()
    if not value:
        return None
    for date_format in ("%Y-%m-%d", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, date_format).date()
        except ValueError:
            continue
    raise LocalDataValidationError(
        f"{context}: {field} must use YYYY-MM-DD or DD-MM-YYYY"
    )


def _parse_radius(value: str) -> tuple[Decimal | None, Decimal | None]:
    match = RADIUS_RANGE_PATTERN.fullmatch(value)
    if match is None:
        return None, None
    minimum, maximum = (Decimal(part) for part in match.groups())
    if minimum < 0 or maximum < minimum:
        return None, None
    return minimum, maximum


def _split_evidence(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _assert_unique(records: list[object], field: str, dataset: str) -> None:
    values = [getattr(record, field) for record in records]
    duplicates = sorted(value for value in set(values) if values.count(value) > 1)
    if duplicates:
        raise LocalDataValidationError(
            f"{dataset} has duplicate {field} values: {', '.join(duplicates)}"
        )


def load_locations(path: Path = LOCATIONS_PATH) -> list[LocationRecord]:
    records: list[LocationRecord] = []
    for row_number, row in enumerate(_read_rows(path, LOCATION_COLUMNS), start=2):
        context = f"{path.name} row {row_number}"
        latitude = _decimal(row, "latitude", context)
        longitude = _decimal(row, "longitude", context)
        assert latitude is not None and longitude is not None
        if not Decimal("-90") <= latitude <= Decimal("90"):
            raise LocalDataValidationError(f"{context}: latitude is out of range")
        if not Decimal("-180") <= longitude <= Decimal("180"):
            raise LocalDataValidationError(f"{context}: longitude is out of range")
        population = _integer(row, "population_estimate", context, optional=True)
        population_year = _integer(row, "population_year", context, optional=True)
        population_source = _optional_text(row, "population_source")
        population_confidence = _optional_text(row, "population_confidence")
        if population is not None and (
            population_year is None
            or population_source is None
            or population_confidence is None
        ):
            raise LocalDataValidationError(
                f"{context}: population metadata is required with an estimate"
            )
        records.append(
            LocationRecord(
                location_id=_required_text(row, "location_id", context),
                location_name=_required_text(row, "location_name", context),
                block=_optional_text(row, "block"),
                district=_required_text(row, "district", context),
                state=_required_text(row, "state", context),
                latitude=latitude,
                longitude=longitude,
                location_type=_required_text(row, "location_type", context),
                population_estimate=population,
                population_year=population_year,
                population_source=population_source,
                population_confidence=population_confidence,
            )
        )
    _assert_unique(records, "location_id", path.name)
    return records


def load_business_profiles(path: Path = BUSINESS_PROFILES_PATH) -> list[BusinessProfile]:
    records: list[BusinessProfile] = []
    for row_number, row in enumerate(_read_rows(path, BUSINESS_PROFILE_COLUMNS), start=2):
        context = f"{path.name} row {row_number}"
        radius_text = _required_text(row, "customer_radius_km", context)
        radius_minimum, radius_maximum = _parse_radius(radius_text)
        records.append(
            BusinessProfile(
                source_business_id=_required_text(row, "business_id", context),
                business_id=normalize_business_category(
                    _required_text(row, "business_name", context)
                ),
                business_name=_required_text(row, "business_name", context),
                customer_radius_text=radius_text,
                customer_radius_min_km=radius_minimum,
                customer_radius_max_km=radius_maximum,
                customer_type=_required_text(row, "customer_type", context),
                supplier_dependency=_required_text(
                    row, "supplier_dependency", context
                ),
                seasonality=_required_text(row, "seasonality", context),
                main_operational_risks=_split_evidence(
                    _required_text(row, "main_operational_risks", context)
                ),
                key_demand_indicators=_split_evidence(
                    _required_text(row, "key_demand_indicators", context)
                ),
            )
        )
    _assert_unique(records, "source_business_id", path.name)
    _assert_unique(records, "business_id", path.name)
    return records


def load_competitors(path: Path = COMPETITORS_PATH) -> list[CompetitorRecord]:
    records: list[CompetitorRecord] = []
    for row_number, row in enumerate(_read_rows(path, COMPETITOR_COLUMNS), start=2):
        context = f"{path.name} row {row_number}"
        latitude = _decimal(row, "latitude", context)
        longitude = _decimal(row, "longitude", context)
        distance = _decimal(row, "distance_km", context, optional=True)
        assert latitude is not None and longitude is not None
        if not Decimal("-90") <= latitude <= Decimal("90"):
            raise LocalDataValidationError(f"{context}: latitude is out of range")
        if not Decimal("-180") <= longitude <= Decimal("180"):
            raise LocalDataValidationError(f"{context}: longitude is out of range")
        if distance is not None and distance < 0:
            raise LocalDataValidationError(f"{context}: distance_km cannot be negative")
        records.append(
            CompetitorRecord(
                competitor_id=_required_text(row, "competitor_id", context),
                location_id=_required_text(row, "location_id", context),
                business_id=normalize_business_category(
                    _required_text(row, "business_category", context)
                ),
                business_name=_required_text(row, "business_name", context),
                latitude=latitude,
                longitude=longitude,
                distance_km=distance,
                source=_required_text(row, "source", context),
                confidence=_required_text(row, "confidence", context),
            )
        )
    _assert_unique(records, "competitor_id", path.name)
    return records


def load_user_local_inputs(path: Path = USER_LOCAL_INPUTS_PATH) -> list[UserLocalInput]:
    records: list[UserLocalInput] = []
    for row_number, row in enumerate(_read_rows(path, USER_LOCAL_INPUT_COLUMNS), start=2):
        context = f"{path.name} row {row_number}"
        known_competitors = _integer(
            row, "known_competitors", context, optional=True
        )
        local_price = _decimal(row, "local_price", context, optional=True)
        monthly_rent = _decimal(row, "monthly_rent", context, optional=True)
        supplier_distance = _decimal(
            row, "supplier_distance_km", context, optional=True
        )
        for field, value in (
            ("known_competitors", known_competitors),
            ("local_price", local_price),
            ("monthly_rent", monthly_rent),
            ("supplier_distance_km", supplier_distance),
        ):
            if value is not None and value < 0:
                raise LocalDataValidationError(f"{context}: {field} cannot be negative")
        records.append(
            UserLocalInput(
                input_id=_required_text(row, "input_id", context),
                location_id=_required_text(row, "location_id", context),
                business_id=normalize_business_category(
                    _required_text(row, "business_category", context)
                ),
                known_competitors=known_competitors,
                local_price=local_price,
                monthly_rent=monthly_rent,
                supplier_distance_km=supplier_distance,
                existing_experience=_optional_text(row, "existing_experience"),
                input_source=_optional_text(row, "input_source"),
                input_date=_optional_date(row, "input_date", context),
            )
        )
    _assert_unique(records, "input_id", path.name)
    return records


def load_local_data() -> LocalDataBundle:
    """Load all Phase 4 records and enforce their key relationships."""

    locations = load_locations()
    profiles = load_business_profiles()
    competitors = load_competitors()
    user_inputs = load_user_local_inputs()
    location_ids = {record.location_id for record in locations}
    business_ids = {record.business_id for record in profiles}

    orphan_competitors = [
        record.competitor_id
        for record in competitors
        if record.location_id not in location_ids or record.business_id not in business_ids
    ]
    if orphan_competitors:
        raise LocalDataValidationError(
            "Mapped competitors have invalid relationships: "
            + ", ".join(orphan_competitors)
        )

    orphan_inputs = [
        record.input_id
        for record in user_inputs
        if record.location_id not in location_ids or record.business_id not in business_ids
    ]
    if orphan_inputs:
        raise LocalDataValidationError(
            "User-local inputs have invalid relationships: " + ", ".join(orphan_inputs)
        )

    input_keys = [(record.location_id, record.business_id) for record in user_inputs]
    if len(input_keys) != len(set(input_keys)):
        raise LocalDataValidationError(
            "user_local_inputs.csv has duplicate location/business relationships"
        )

    return LocalDataBundle(
        locations=locations,
        competitors=competitors,
        business_profiles=profiles,
        user_local_inputs=user_inputs,
    )
