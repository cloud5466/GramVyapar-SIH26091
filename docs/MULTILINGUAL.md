# Multilingual experience

## Supported languages

The hackathon MVP supports:

- English (`en`), the default;
- Hindi (`hi`) in clear Devanagari.

The product does not currently claim support for every Indian language. The
same architecture can later add Marathi, Gujarati, Kannada and voice guidance.

## Frontend language state

`LanguageProvider` owns one global language value. The compact selector in the
top navigation changes it for the complete page and persists the choice under
`gramvyapar-language` in browser `localStorage`. A reload restores the saved
choice. The document `lang` attribute and Devanagari-safe font fallback update
with the selection.

All UI strings live in `lib/i18n/translations.ts`. Components consume the typed
dictionary through `useLanguage`; they do not maintain separate language state.
Canonical location and business IDs never change.

## API contract

`AnalysisRequest.language` accepts `en` or `hi` and defaults to `en`, preserving
older clients:

```json
{
  "location_id": "LOC002",
  "business_id": "kirana",
  "available_capital": 100000,
  "language": "hi"
}
```

The JSON field names and deterministic result structure are identical in both
languages. `EvidencePack.response_language` is `English` or `Hindi`, guiding
only advisory presentation.

## Advisory language

The versioned system prompt requires all human-readable advisory values in the
requested language while preserving numbers, rupee amounts, IDs, schemes,
sources and proper nouns. AI-disabled and provider-error paths use separate
deterministic English and Hindi fallback templates.

Changing language after a result immediately translates static UI and safely
reissues the same analysis request for an advisory in the new language. The
same input values are used; tests prove that local evidence, finance, score,
component scores and confidence remain identical.

## Detailed engine text

Primary entrepreneur-facing headings, controls, errors, loading states,
financial labels, advisory text, disclaimers and actions are translated.
Low-level deterministic engine reasons and source records remain unchanged in
the progressive technical detail view so translation cannot alter calculation
semantics. Future versions can replace these strings with semantic reason codes
and translate those codes independently.

## Accessibility

Hindi uses `Nirmala UI`, `Noto Sans Devanagari`, `Mangal` and sans-serif
fallbacks without distributing font files. Controls use flexible minimum
heights and wrapping so longer labels remain usable on mobile.
