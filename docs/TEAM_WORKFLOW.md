# Team workflow

The repository is the single source of truth. Chat messages, personal notes and
slide drafts become project inputs only after they are placed in the correct
workspace with a completed handoff.

## Contribution flow

1. Select an assigned task from team/TASK_BOARD.md.
2. Confirm the expected contract and source requirements.
3. Work only in the owning workspace unless coordination is documented.
4. Preserve original source files and record provenance.
5. Classify facts and values using docs/SOURCE_POLICY.md.
6. Complete team/HANDOFF_TEMPLATE.md for the delivery.
7. Request review from the Product / Technical Lead.
8. Update task status only after the deliverable is accepted.

## Ownership boundaries

| Workspace | Primary owner | Required reviewer |
| --- | --- | --- |
| Website, architecture, integration | Member 1 | Relevant workstream owner |
| Research | Member 2 | Member 1 |
| Data | Member 3 | Member 1 |
| Finance | Member 4 | Member 1 plus independent finance review |
| Presentation | Member 5 | Member 1 and Member 6 |
| Testing / claims / demo | Member 6 | Member 1 |

## Status definitions

- **NOT STARTED:** no accepted work has begun.
- **IN PROGRESS:** owner is actively producing the deliverable.
- **DONE:** deliverable exists, sources are present and review is complete.
- **BLOCKED:** progress requires a named decision, source or dependency.

## Integration gates

Data cannot enter an engine until its schema and source record are reviewed.
Financial values cannot enter code until the official rule and boundary tests
are reviewed. Presentation claims cannot be finalized until they appear in the
claim audit. Illustrative UI values cannot be reclassified without evidence.

## File naming

- Use lowercase snake_case for data and Python files.
- Use descriptive markdown filenames already defined by the workspace.
- Prefer stable IDs inside data; do not use display names as join keys.
- Do not create duplicate final, final-v2 or latest copies. Update the canonical
  file and rely on version control.

## Handoff quality

A handoff is incomplete when its source, evidence type, assumptions,
limitations or prototype dependency is missing. The technical lead should not
guess around incomplete handoffs.
