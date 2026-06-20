// Diacritic- and script-insensitive text folding for search.
// Folds Romanian diacritics (ă â î ș ț → a a i s t) via NFD so "urgenta"
// matches "urgență"; lowercases; strips apostrophes/punctuation. Cyrillic
// characters pass through (lowercased), so Ukrainian queries work too.

export function fold(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining diacritical marks
    .replace(/['ʼ’`´]/g, '') // apostrophe variants
    .replace(/\s+/g, ' ')
    .trim()
}

/** True if `query` (folded) appears anywhere in `text` (folded). */
export function foldedIncludes(text: string, query: string): boolean {
  return fold(text).includes(fold(query))
}
