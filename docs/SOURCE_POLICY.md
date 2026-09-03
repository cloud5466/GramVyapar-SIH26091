# Source and evidence policy

This policy determines how GramVyapar labels information and prevents
prototype values from being mistaken for real-world findings.

## VERIFIED

Direct official or open-source information whose publisher, scope, date and
meaning can be traced.

Examples:

- official financial rules;
- source coordinates;
- government datasets.

A transformation may still use verified inputs, but its derived result becomes
`ESTIMATED / PROXY`.

## ESTIMATED / PROXY

A derived value based on real evidence and a documented method. It is useful
for decision support but is not a directly observed fact.

Examples:

- potential customer reach;
- competition density;
- business-potential indicators.

Required documentation: source inputs, formula or transformation, assumptions,
coverage, date and confidence rationale.

## USER VERIFIED

Information supplied or confirmed by the entrepreneur for their local context.

Examples:

- known local competitors;
- local rent;
- supplier location;
- local pricing.

The interface must attribute these values to entrepreneur input. User-provided
information must not be relabelled as official evidence.

## ILLUSTRATIVE

Synthetic, example or demonstration-only information used to communicate the
prototype experience.

Illustrative values:

- must be visibly labelled `Sample`, `Illustrative` or `Prototype only`;
- must never be displayed as verified real-world values;
- must not enter official data or financial rule files;
- must not support impact, eligibility or accuracy claims;
- must be replaced or reclassified before evidence-backed evaluation.

## Source acceptance checklist

Before a source is used:

1. Identify the publisher and original URL.
2. Record publication/update and retrieval dates where available.
3. Confirm geographic, temporal and business-category coverage.
4. Record license or reuse constraints for datasets.
5. Capture the relevant table, field, page or clause.
6. Assign the evidence class.
7. Document transformations and limitations.
8. Obtain a second review for financial rules and presentation-critical claims.

## Source hierarchy

1. Primary official publication or dataset
2. Authoritative open-data provider or original research
3. Credible secondary analysis, used only with explicit limitations
4. Entrepreneur-provided local information
5. Illustrative prototype content

A lower-ranked source must not silently override a current primary source.

## Display rules

- Show source/confidence detail through progressive disclosure.
- Use plain-language confidence descriptions for entrepreneurs.
- Do not imply that mapped businesses are a complete census.
- Do not imply that an indicative financial structure is approval or sanction.
- If evidence is missing, say so.
- If sources conflict, mark the result for review.

## Ownership and audit

- Data sources: maintained in the data workspace and team handoff.
- Finance sources: registered in `finance/sources.md`.
- Research sources: registered in `research/sources.md`.
- User-facing claims: checked in `testing/claim_audit.md`.
- Final evidence decisions: approved by the Product / Technical Lead.
