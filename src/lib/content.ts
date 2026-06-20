import type { Language } from './types'

// ---------------------------------------------------------------------------
// Content loading.
//
// Section content lives in editable data files, separate from code, so an NGO
// partner or non-developer can update it later without touching components:
//
//   src/content/<section>.<lang>.json   e.g. src/content/housing.uk.json
//
// The documented shape is in SectionContent below (and src/content/README.md).
// Files are loaded lazily and cached, so the bundle stays light for low-data
// users and offline (service worker) caching can revalidate them in the
// background.
// ---------------------------------------------------------------------------

/** A single block of section content. Extend as real content takes shape. */
export interface ContentItem {
  /** Stable id for linking / deep-links / "save". */
  id: string
  /** Heading shown to the user. */
  title: string
  /** Body text (plain or simple markdown — renderer decided later). */
  body?: string
  /** Optional external link (e.g. an official institution page). */
  url?: string
}

/** The shape every src/content/<section>.<lang>.json file must follow. */
export interface SectionContent {
  /** Section id — must match the filename and the route slug. */
  section: string
  /** Localised section title. */
  title: string
  /** Short localised intro paragraph (may be empty in placeholders). */
  intro: string
  /** Ordered content blocks (empty in placeholders). */
  items: ContentItem[]
}

// Eagerly map the glob so Vite knows every content module at build time, but
// import each file's contents lazily (only when a section is opened).
const modules = import.meta.glob<{ default: SectionContent }>('../content/*.json')

const cache = new Map<string, SectionContent>()

/** Build the glob key for a section + language. */
function keyFor(section: string, lang: Language): string {
  return `../content/${section}.${lang}.json`
}

/**
 * Load the content file for a section in the active language.
 * Falls back to Ukrainian if a localised file is missing, then to null.
 */
export async function loadSectionContent(
  section: string,
  lang: Language,
): Promise<SectionContent | null> {
  const candidates = [keyFor(section, lang), keyFor(section, 'uk')]

  for (const key of candidates) {
    if (cache.has(key)) return cache.get(key)!
    const loader = modules[key]
    if (!loader) continue
    const mod = await loader()
    cache.set(key, mod.default)
    return mod.default
  }

  return null
}
