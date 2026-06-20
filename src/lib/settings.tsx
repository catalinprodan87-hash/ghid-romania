import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import i18n from './i18n'
import { readStorage, writeStorage, STORAGE_KEYS } from './storage'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_TEXT_SIZE,
  isLanguage,
  isTextSize,
  type Language,
  type TextSize,
} from './types'

interface SettingsContextValue {
  language: Language
  textSize: TextSize
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  setTextSize: (size: TextSize) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function getInitialLanguage(): Language {
  const saved = readStorage(STORAGE_KEYS.language)
  return isLanguage(saved) ? saved : DEFAULT_LANGUAGE
}

function getInitialTextSize(): TextSize {
  const saved = readStorage(STORAGE_KEYS.textSize)
  return isTextSize(saved) ? saved : DEFAULT_TEXT_SIZE
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  const [textSize, setTextSizeState] = useState<TextSize>(getInitialTextSize)

  // Keep i18next, <html lang>, and localStorage in sync with the language.
  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language)
    document.documentElement.lang = language
    writeStorage(STORAGE_KEYS.language, language)
  }, [language])

  // Reflect the text-size preference on <html> (drives root font-size in CSS).
  useEffect(() => {
    document.documentElement.dataset.textSize = textSize
    writeStorage(STORAGE_KEYS.textSize, textSize)
  }, [textSize])

  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), [])
  const toggleLanguage = useCallback(
    () => setLanguageState((prev) => (prev === 'uk' ? 'ro' : 'uk')),
    [],
  )
  const setTextSize = useCallback((size: TextSize) => setTextSizeState(size), [])

  const value = useMemo<SettingsContextValue>(
    () => ({ language, textSize, setLanguage, toggleLanguage, setTextSize }),
    [language, textSize, setLanguage, toggleLanguage, setTextSize],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider')
  return ctx
}
