# Section content

Each section of the app reads its content from a plain JSON file here. Content
is intentionally kept **separate from code** so an NGO partner or non-developer
can update it later without touching React components.

## File naming

```
<section-id>.<lang>.json
```

- `<section-id>` — must match the section slug used in the route and in
  `src/lib/sections.ts` (e.g. `housing`, `health-emergency`).
- `<lang>` — `uk` (Ukrainian) or `ro` (Romanian).

Example: `housing.uk.json`, `housing.ro.json`.

## Shape

```jsonc
{
  "section": "housing",          // must match the filename / route slug
  "title": "Житло",              // localised section title shown in the header
  "intro": "",                    // short localised intro paragraph (may be empty)
  "items": [                      // ordered content blocks (empty for now)
    {
      "id": "rent-contract",     // stable id, used for links / "save"
      "title": "…",              // heading shown to the user
      "body": "…",               // body text (plain text / simple markdown)
      "url": "https://…"          // optional external official link
    }
  ]
}
```

The TypeScript types live in `src/lib/content.ts` (`SectionContent`,
`ContentItem`). The typed loader `loadSectionContent(section, lang)` picks the
right file for the active language and falls back to Ukrainian if a translation
is missing.

> ⚠️ These files currently hold **placeholders only**. Real institutional,
> legal, health, housing, education, and tourism content must be added in a
> later task with current, sourced, dated research.
