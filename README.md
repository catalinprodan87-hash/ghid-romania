# Гід Румунія / Ghid România

A mobile-first **Progressive Web App** that helps Ukrainian citizens living in
Romania adapt faster. Calm, trustworthy, civic — a steady helper. Fully
bilingual (Ukrainian / Romanian), installable, and works offline.

## Quick start

```bash
npm install
npm run icons   # generate the PWA icons (one-time / after editing the source icon)
npm run dev     # http://localhost:5173
```

Open the dev URL on your phone (same Wi-Fi, use your machine's LAN IP), then
**Add to Home Screen** to install. Toggle **УКР ⇄ РУМ** in the header and the
whole interface switches language; the choice is remembered after refresh.

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build (best for testing install/offline)
```

## Features

- **Bilingual UI** — two complete locales, `uk` (default) and `ro`; instant
  toggle flips every label and all content; choice persists.
- **Live information sections** (topic accordions with official, dated sources,
  tap-to-call contacts, and a disclaimer banner on each):
  Institutions & documents, Health & emergencies, Work & money, Housing,
  Transport, Online shopping, Community & support.
- **Phrasebook** — offline Romanian phrases with Ukrainian meaning, Cyrillic
  pronunciation, and text-to-speech.
- **Learn Romanian** — lesson player with vocabulary audio (TTS), microphone
  speaking practice (with a record-and-compare fallback where live recognition
  isn't available), XP / streak, and spaced-repetition review.
- **Emergency button** — always visible; opens Call 112, emergency phrases, and
  key contacts, fully offline.
- **Global search** — diacritic- and script-insensitive, across all live
  sections, jumping to the matched topic/phrase.
- **How to use** — in-app guide (from Settings).
- **Offline-first** — app shell + all content precached by the service worker.
- **Accessibility** — ≥44px tap targets, labelled icon buttons, visible focus,
  and a text-size setting that scales the whole UI.

> **Content is for general orientation, not legal or medical advice.** Each
> official topic links to its source with a `verified` date; time-sensitive
> facts (protection validity, amounts, helplines) should be re-checked before
> relying on them. See the pre-publish checklist for the volatile facts.

## Tech

Vite · React · TypeScript · react-router (lazy routes) · i18next /
react-i18next · vite-plugin-pwa (Workbox) · Tailwind CSS (design tokens as CSS
variables) · Noto Sans (Ukrainian Cyrillic + Romanian diacritics ă â î ș ț) ·
Web Speech API (TTS + speech recognition) · `localStorage` for preferences and
learning progress.

## Project layout

```
src/
  locales/        uk.json, ro.json — every UI string (no hard-coded text)
  content/        section content (topics/phrasebook shapes) + lesson JSON
                  <section>.<lang>.json ; lessons/<level>/<id>.json
  lib/            i18n, settings, storage, sections registry (single source of
                  truth), content/ (rich loaders, search), learn/ (progress,
                  scoring, lesson loaders)
  services/       speech.ts (TTS), recognition.ts (mic / STT + fallback)
  components/     Header, LanguageToggle, EmergencyButton, content/ renderers,
                  learn/ lesson components
  pages/          Home, Section, Phrasebook, Emergency, Search, Settings,
                  learn/ (course, lesson player, review)
scripts/
  generate-icons.mjs  — renders the PWA icons via sharp
```

## Editing content

Content lives in `src/content/`, separate from code, so a non-developer or NGO
partner can update it. Two shapes:

- **Topics** (`<section>.<lang>.json`) — `_meta` (with `disclaimer`, `updated`)
  + `topics[]`. Used by Institutions, Health, Work, Housing, Transport,
  Community, Online shopping, How to use.
- **Phrasebook** (`phrasebook.<lang>.json`) — `_meta` + `categories[]` of
  `phrases[] { ro, uk, pron_uk }`.

Add a section in one line in `src/lib/sections.ts` (id, label key, icon, file,
shape). Lessons are JSON under `src/content/lessons/` (see the lessons skill).
See [`src/content/README.md`](src/content/README.md) for shapes.

## Adding / changing UI strings

Add the key to **both** `src/locales/uk.json` and `src/locales/ro.json` (keys
must match), then reference it with `t('your.key')`. Never hard-code visible
text.

## License

MIT — see [`LICENSE`](LICENSE). Content carries its own re-verification note;
NGOs are welcome to reuse.
