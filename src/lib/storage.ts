// Tiny, safe localStorage wrapper. Local-first persistence: the user's
// language and text-size preferences live here and survive refreshes.

const PREFIX = 'rg.'

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    // Private mode / storage disabled — fail soft.
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value)
  } catch {
    // Ignore quota / disabled storage errors.
  }
}

export const STORAGE_KEYS = {
  language: 'language',
  textSize: 'textSize',
} as const
