# Data workspace

Owner: **Member 3 — Hyper-local Data Lead**

This directory stores source evidence and normalized files consumed by the
Phase 4 local-data engine. No dataset should be added without a source entry and
an evidence classification defined in `docs/SOURCE_POLICY.md`.

## Structure

- `raw/population/`: source population files as received.
- `raw/osm/`: OpenStreetMap extracts or query outputs.
- `raw/udyam/`: Udyam/MSME context files.
- `raw/other/`: other approved source material.
- `processed/`: normalized CSVs that follow `docs/DATA_CONTRACT.md`.
- `user_inputs/`: machine-readable entrepreneur input contracts.

## Phase 4 canonical files

- `processed/locations.csv`: location identity, geography, type and population
  estimate with year/source/confidence.
- `processed/mapped_competitors.csv`: mapped businesses keyed by location and
  normalized business category, with distance, source and confidence.
- `processed/business_profiles.csv`: the three MVP profiles and their explicit
  customer-radius ranges, customer types, dependencies, seasonality, risks and
  demand indicators.
- `user_inputs/user_local_inputs.csv`: optional entrepreneur-supplied evidence.
  Empty optional cells remain null.
- `processed/local_market_indicators.csv`: reserved derived-output schema; it has
  no rows and is not consumed in Phase 4.

`prototype/loaders/data_loader.py` resolves these files from the repository,
validates schema/types/IDs/relationships and translates business labels to the
public IDs `dairy`, `tailoring` and `kirana`. The source value `Tailorings` is
normalized to `tailoring` in memory; the factual source CSV is unchanged.

Customer-radius ranges are parsed into explicit minimum and maximum distances.
The local-data engine uses the maximum as the initial MVP mapped-business search
radius. These counts are mapped evidence, not a complete business census.

## Rules

1. Preserve raw files; do not edit them in place.
2. Record source URL, publisher, retrieval date, coverage and license notes.
3. Do not add synthetic rows to processed datasets.
4. Use stable IDs so data can be joined without matching display names.
5. Record missing values as empty fields, not invented defaults.
6. Submit each contribution with `team/HANDOFF_TEMPLATE.md`.
