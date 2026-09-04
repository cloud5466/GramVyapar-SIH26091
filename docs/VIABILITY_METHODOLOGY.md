# GramVyapar Business Potential Score methodology

**Methodology version:** `prototype-v1`  
**Score type:** decision-support heuristic  
**Configuration:** `config/viability_rules.json`

## Purpose

The GramVyapar Business Potential Score summarizes the evidence currently
available to the prototype in a transparent 0–100 indicator. It helps a rural
or semi-urban entrepreneur see which parts of a business idea appear better
supported and which parts still need validation.

The score is deterministic: the same validated evidence and financial result
always produce the same component scores, total, rating and explanation.

## What the score does not mean

It is not a probability of success, credit score, loan-eligibility score,
profit forecast, guaranteed demand measure or machine-learning prediction. It
does not establish profitability, repayment capacity, DSCR, income or loan
approval.

## Components and weights

| Component | Maximum | Purpose |
| --- | ---: | --- |
| Market Opportunity | 30 | Summarize potential customer reach and available business context |
| Competition | 25 | Summarize mapped competitive pressure inside the configured business radius |
| Financial Fit | 25 | Confirm whether the deterministic project structure matches a configured route |
| Operational Readiness | 20 | Summarize supplier dependency, seasonality and available entrepreneur inputs |
| **Total** | **100** | Bounded sum of the four components |

Weights and thresholds are loaded from the versioned configuration. The loader
rejects a weight total other than 100, invalid component bounds, unordered
thresholds, gaps or overlaps in rating bands, and competition rules that could
reward a higher mapped-competitor count.

## Market Opportunity — 30 points

Population is used only as a potential-customer-reach proxy. It cannot award
the full component by itself.

### Population proxy — up to 18 points

The selected location is min–max normalized across all valid population values
in the currently configured MVP locations:

```text
normalized = (selected population - configured minimum)
             / (configured maximum - configured minimum)

population points = round-half-up(6 + normalized × 12)
```

The smallest configured population receives 6 points and the largest receives
18. If only one valid population exists, it receives the neutral configured
value of 12. If the selected location has no population value, this sub-score
is 0; no substitute population is invented.

### Business context — up to 8 points

| Available evidence | Points |
| --- | ---: |
| Valid parsed customer-radius range | 3 |
| Non-empty customer-type description | 2 |
| At least one configured demand indicator | 3 |

These points reward the presence of relevant context, not proof that local
demand exists. Demand indicators remain topics to validate in the field.

### Population evidence quality — up to 4 points

| Population confidence label | Points |
| --- | ---: |
| High | 4 |
| Medium | 3 |
| Low | 1 |
| Missing/unknown | 0 |

## Competition — 25 points

Phase 4 currently produces mapped counts of 0, 1 and 2 across the six supported
location/business combinations. The buckets distinguish those observed values
and retain conservative headroom for future denser mappings:

| Mapped competitors inside radius | Base score |
| ---: | ---: |
| 0 | 22 |
| 1 | 20 |
| 2 | 17 |
| 3–4 | 12 |
| 5+ | 7 |

Zero mapped competitors is capped below 25 because absence from the map is not
proof that no competitors exist.

The nearest mapped competitor adds a proximity adjustment using the configured
maximum customer radius:

| Nearest distance as share of radius | Deduction |
| --- | ---: |
| At or below 25% | 2 |
| Above 25% and at or below 50% | 1 |
| Above 50%, or no usable distance | 0 |

Missing distance does not create a penalty; it lowers evidence confidence.
Mapped competitor count is a competition proxy, not a complete market census.

## Financial Fit — 25 points

Only the existing deterministic Finance Engine result is used.

| Finance Engine result | Score |
| --- | ---: |
| Configured route found, cap not applied | 23 |
| Configured route found, financing cap applied | 20 |
| Project outside currently configured ranges | 8 |

The viability engine reads the Finance Engine's `cap_applied` result; it does
not recalculate or replace the financial result. Interest rate is not ranked.
Financial Fit does not infer profitability,
cash flow, monthly income, DSCR or repayment capacity.

## Operational Readiness — 20 points

### Supplier dependency — up to 8 points

| Profile category | Points |
| --- | ---: |
| Low | 8 |
| Low–Moderate | 7 |
| Moderate | 6 |
| High | 3 |
| Missing/unrecognized | 5 neutral points |

### Seasonality — up to 6 points

| Profile category | Points |
| --- | ---: |
| Low | 6 |
| Moderate | 4 |
| High | 2 |
| Missing/unrecognized | 3 neutral points |

### Existing experience — up to 4 points

| User evidence | Points |
| --- | ---: |
| Statement containing a simple experience marker such as years, worked, managed, trained or family business | 4 |
| Explicit `no`, `none`, `no experience`, `not yet` or `0` | 1 |
| Non-empty statement that cannot be classified deterministically | 2 neutral points |
| Missing | 2 neutral points |

### Supplier distance — up to 2 points

| User evidence | Points |
| --- | ---: |
| Distance at or within configured customer-radius maximum | 2 |
| Distance beyond that radius | 0 |
| Missing distance or radius | 1 neutral point |

The distance comparison is an intentionally simple prototype accessibility
proxy, not a transport-cost model. Missing user evidence is neutral rather than
zero and lowers confidence.

## Missing-data policy

No missing value is converted to a fabricated numerical fact. Population
missingness suppresses population points. Missing competitor distances avoid a
proximity deduction. Missing experience and supplier distance receive the
documented neutral contribution. The response lists missing evidence such as
validated local demand measurements, user-verified competitor count, local
selling price, monthly rent, existing experience and supplier distance.

## Confidence methodology

Confidence describes evidence completeness and reliability, not statistical
accuracy.

- **Market Opportunity:** high when population has High confidence and all
  business-context fields exist; medium when population or complete profile
  context exists; otherwise low.
- **Competition:** high when at least one record exists and every record has a
  distance and High source confidence; medium when distances are complete but
  source confidence is mixed; low for zero mapped records or incomplete radius/
  distance evidence.
- **Financial Fit:** high for a complete deterministic route/out-of-range result
  with recorded rule context; medium when configured provenance is incomplete.
- **Operational Readiness:** high when the profile plus experience and supplier
  distance exist; medium when the profile exists but optional user fields are
  missing; low when profile categories are unrecognized.

Overall confidence is high only when all four components are high, low when two
or more components are low, and medium otherwise.

## Rating bands

| Total score | Rating |
| ---: | --- |
| 0–39 | High Caution |
| 40–59 | Needs Validation |
| 60–79 | Promising |
| 80–100 | Strong Potential |

No rating means guaranteed success, safe investment, approval or profitability.

## Evidence sources

The viability engine receives a typed `LocalEvidenceResult` from the Local Data
Engine and a typed `FinanceResult` from the Finance Engine. It never reads raw
CSV files and never duplicates the underlying financial calculation.

## Limitations and future validation

The methodology is a hackathon MVP heuristic. Current weights are not
statistically trained or validated against business outcomes. Population and
mapped competitors are incomplete proxies, business-profile categories require
domain review, and optional entrepreneur evidence is sparse.

Production weights, thresholds and mappings should be calibrated using real
entrepreneur outcomes, domain experts, field validation and larger datasets.
Any future change must receive a new methodology version and boundary tests.
