import type { Language } from '../types'
import { sectionPath } from '../sections'
import { fold } from './textMatch'
import { CONTENT_SECTIONS, loadPhrasebook, loadTopics } from './richContent'

// Lightweight client-side search over the currently-loaded rich content in the
// active language. No external library — normalized substring matching with a
// small field weighting so titles/phrases rank above body text.

export interface SearchResult {
  sectionId: string
  sectionLabelKey: string
  /** Topic title or Romanian phrase. */
  title: string
  /** Matched snippet to show under the title. */
  snippet: string
  /** Route (with ?focus=) that jumps to the topic/category. */
  to: string
  score: number
}

interface Field {
  text: string
  weight: number
}

function bestMatch(fields: Field[], folded: string): Field | null {
  let best: Field | null = null
  for (const f of fields) {
    if (f.text && fold(f.text).includes(folded) && (!best || f.weight > best.weight)) {
      best = f
    }
  }
  return best
}

export async function search(query: string, lang: Language): Promise<SearchResult[]> {
  const folded = fold(query)
  if (folded.length < 2) return []

  const results: SearchResult[] = []

  for (const section of CONTENT_SECTIONS) {
    if (!section.file) continue
    if (section.shape === 'topics') {
      const data = await loadTopics(section.file, lang)
      if (!data) continue
      for (const topic of data.topics) {
        const fields: Field[] = [
          { text: topic.title, weight: 6 },
          { text: topic.summary, weight: 4 },
          ...(topic.steps ?? []).map((t) => ({ text: t, weight: 2 })),
          ...(topic.eligibility ?? []).map((t) => ({ text: t, weight: 2 })),
          ...(topic.notes ?? []).map((t) => ({ text: t, weight: 1 })),
        ]
        const hit = bestMatch(fields, folded)
        if (hit) {
          results.push({
            sectionId: section.id,
            sectionLabelKey: section.labelKey,
            title: topic.title,
            snippet: hit.weight >= 6 ? topic.summary : hit.text,
            to: `${sectionPath(section)}?focus=${encodeURIComponent(topic.id)}`,
            score: hit.weight,
          })
        }
      }
    } else {
      const data = await loadPhrasebook(section.file, lang)
      if (!data) continue
      for (const cat of data.categories) {
        for (const phrase of cat.phrases) {
          const fields: Field[] = [
            { text: phrase.ro, weight: 6 },
            { text: phrase.uk, weight: 5 },
            { text: phrase.pron_uk, weight: 3 },
          ]
          const hit = bestMatch(fields, folded)
          if (hit) {
            results.push({
              sectionId: section.id,
              sectionLabelKey: section.labelKey,
              title: phrase.ro,
              snippet: `${phrase.ro} — ${phrase.uk}`,
              to: `${sectionPath(section)}?focus=${encodeURIComponent(cat.id)}`,
              score: hit.weight,
            })
          }
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 40)
}
