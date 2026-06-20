import type { Language } from '../types'
import { SECTIONS, type SectionDef } from '../sections'
import type { PhrasebookContent, TopicsContent } from './richTypes'

// ---------------------------------------------------------------------------
// Loaders for the "rich" content sections. The registry itself lives in
// src/lib/sections.ts (the single source of truth); here we derive the subset
// that has a content shape + a renderer. Files live in src/content/<file>.
// <lang>.json and are loaded lazily (code-split + service-worker precached) so
// each section works offline.
// ---------------------------------------------------------------------------

/** Every section that has authored content (topics or phrasebook). */
export const CONTENT_SECTIONS: SectionDef[] = SECTIONS.filter((s) => s.shape)

export function getRichSection(id: string | undefined): SectionDef | undefined {
  return CONTENT_SECTIONS.find((s) => s.id === id)
}

// Lazy glob of every content file; we only ever pull the keys we ask for.
const modules = import.meta.glob<{ default: unknown }>('../../content/*.json')

const cache = new Map<string, unknown>()

async function loadFile<T>(file: string, lang: Language): Promise<T | null> {
  const candidates = [
    `../../content/${file}.${lang}.json`,
    `../../content/${file}.uk.json`, // fall back to Ukrainian
  ]
  for (const key of candidates) {
    if (cache.has(key)) return cache.get(key) as T
    const loader = modules[key]
    if (!loader) continue
    const mod = await loader()
    cache.set(key, mod.default)
    return mod.default as T
  }
  return null
}

export function loadTopics(file: string, lang: Language): Promise<TopicsContent | null> {
  return loadFile<TopicsContent>(file, lang)
}

export function loadPhrasebook(
  file: string,
  lang: Language,
): Promise<PhrasebookContent | null> {
  return loadFile<PhrasebookContent>(file, lang)
}
