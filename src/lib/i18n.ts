import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import uk from '../locales/uk.json'
import ro from '../locales/ro.json'
import { DEFAULT_LANGUAGE, isLanguage } from './types'
import { readStorage, STORAGE_KEYS } from './storage'

// Restore the saved language (default: Ukrainian) before React renders, so the
// first paint is already in the right language.
const saved = readStorage(STORAGE_KEYS.language)
const initialLanguage = isLanguage(saved) ? saved : DEFAULT_LANGUAGE

void i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    ro: { translation: ro },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false, // React already escapes.
  },
  returnNull: false,
})

export default i18n
