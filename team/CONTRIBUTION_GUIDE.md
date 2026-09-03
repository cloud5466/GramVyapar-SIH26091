# Contribution guide

## Before starting

1. Choose an assigned task from `TASK_BOARD.md`.
2. Read `docs/SOURCE_POLICY.md` and the contract relevant to your work.
3. Confirm the canonical destination file; do not create duplicate “final”
   copies.
4. Mark the task `IN PROGRESS`.

## While working

- Keep source files and notes in the owning workspace.
- Never fabricate a missing value, source, financial rule or test result.
- Preserve official wording and units when transcribing rules.
- Separate verified, proxy, user-verified and illustrative information.
- Record open questions as open questions.
- Do not change website or engine boundaries without a decision-log entry and
  technical-lead review.

## Handing off

1. Copy `HANDOFF_TEMPLATE.md` into the relevant workstream or attach its
   completed content to the review.
2. List every file, source and transformation.
3. Explain what the future prototype should consume.
4. Identify assumptions, limitations and unresolved questions.
5. Ask the required reviewer to check the contribution.
6. Mark the task `DONE` only after acceptance.

## Review checklist

- [ ] File is in the canonical workspace
- [ ] Required fields/headers match the contract
- [ ] Sources are traceable
- [ ] Evidence classes are correct
- [ ] No illustrative value appears verified
- [ ] No unsupported financial claim exists
- [ ] Limitations and missing values are explicit
- [ ] Downstream prototype need is clear
- [ ] Relevant tests or claim-audit rows are updated

## Safe repository practices

- Keep secrets and local environment files out of version control.
- Do not commit generated dependency or build directories.
- Make focused changes and avoid unrelated formatting churn.
- Preserve the working Next.js application.
- Use the decision log for choices that affect multiple members.
