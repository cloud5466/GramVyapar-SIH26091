# Scripts workspace

This directory is reserved for reviewed, repeatable utilities such as schema
validation, data normalization, source checks and demo preparation.

No script is required in Phase 1. Future scripts must:

- accept explicit input and output paths;
- avoid modifying raw source files;
- fail clearly on schema errors;
- record deterministic transformations;
- avoid embedded credentials or machine-specific paths;
- include usage notes and tests where practical.
