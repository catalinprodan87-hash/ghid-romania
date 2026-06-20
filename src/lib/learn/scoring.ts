// Pronunciation / answer scoring. Deliberately forgiving and encouraging — no
// failing, no blocking. Three tiers feed friendly feedback in the UI.

export type ScoreTier = 'great' | 'close' | 'tryAgain'

/**
 * Normalize text for comparison: lowercase, strip diacritics (so Romanian
 * ă/â/î/ș/ț fold to a/a/i/s/t), drop punctuation, collapse whitespace.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining diacritical marks
    .replace(/[^\p{L}\p{N}\s]/gu, '') // punctuation/symbols
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  let curr = new Array<number>(b.length + 1)

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[b.length]
}

/** Similarity in [0, 1] between two strings after normalization. */
export function similarity(a: string, b: string): number {
  const x = normalize(a)
  const y = normalize(b)
  if (!x && !y) return 1
  const max = Math.max(x.length, y.length)
  if (max === 0) return 1
  return 1 - levenshtein(x, y) / max
}

/** Map a spoken/typed attempt against a target to an encouraging tier. */
export function scoreTier(target: string, attempt: string): ScoreTier {
  const s = similarity(target, attempt)
  if (s >= 0.8) return 'great'
  if (s >= 0.5) return 'close'
  return 'tryAgain'
}

/** Whether a typed answer is "correct enough" (used by fill-blank/listening). */
export function isAcceptable(target: string, attempt: string): boolean {
  return similarity(target, attempt) >= 0.8
}
