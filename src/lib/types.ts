// Shared types for the app.

export type Language = 'uk' | 'ro'
export type TextSize = 'normal' | 'large'

export const LANGUAGES: Language[] = ['uk', 'ro']
export const DEFAULT_LANGUAGE: Language = 'uk'
export const DEFAULT_TEXT_SIZE: TextSize = 'normal'

export function isLanguage(value: unknown): value is Language {
  return value === 'uk' || value === 'ro'
}

export function isTextSize(value: unknown): value is TextSize {
  return value === 'normal' || value === 'large'
}
