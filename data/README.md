# Data workspace

Owner: **Member 3 — Hyper-local Data Lead**

This directory stores source evidence and normalized files consumed by the
future prototype. No dataset should be added without a source entry and an
evidence classification defined in `docs/SOURCE_POLICY.md`.

## Structure

- `raw/population/`: source population files as received.
- `raw/osm/`: OpenStreetMap extracts or query outputs.
- `raw/udyam/`: Udyam/MSME context files.
- `raw/other/`: other approved source material.
- `processed/`: normalized CSVs that follow `docs/DATA_CONTRACT.md`.
- `user_inputs/`: machine-readable entrepreneur input contracts.

## Rules

1. Preserve raw files; do not edit them in place.
2. Record source URL, publisher, retrieval date, coverage and license notes.
3. Do not add synthetic rows to processed datasets.
4. Use stable IDs so data can be joined without matching display names.
5. Record missing values as empty fields, not invented defaults.
6. Submit each contribution with `team/HANDOFF_TEMPLATE.md`.
