import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import EmergencyButton from '../components/EmergencyButton'
import { useSettings } from '../lib/settings'
import { search, type SearchResult } from '../lib/content/search'

/**
 * Global search over the live (Institutions / Health / Phrasebook) content in
 * the active language. Diacritic- and script-insensitive; tapping a result
 * jumps to the section and scrolls to the topic/category.
 */
export default function Search() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    let active = true
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    void search(query, language).then((r) => {
      if (active) setResults(r)
    })
    return () => {
      active = false
    }
  }, [query, language])

  const tooShort = query.trim().length < 2

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={t('search.title')} showSearch={false} />

      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">
        <h1 className="mb-4 text-2xl font-bold text-text">{t('search.title')}</h1>

        <label className="relative block">
          <span className="sr-only">{t('search.title')}</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-text-muted"
          >
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            autoComplete="off"
            autoFocus
            className="min-h-tap w-full rounded-md border border-black/10 bg-surface py-3 pl-12 pr-4 text-base text-text shadow-sm placeholder:text-text-muted focus:border-primary"
          />
        </label>

        {tooShort ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <span aria-hidden="true" className="text-4xl">
              🔎
            </span>
            <p className="max-w-prose text-base text-text-muted">{t('search.empty')}</p>
          </div>
        ) : results.length === 0 ? (
          <p className="mt-8 text-center text-base text-text-muted">{t('search.noResults')}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {results.map((r, i) => (
              <li key={`${r.to}-${i}`}>
                <Link
                  to={r.to}
                  className="block rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
                >
                  <span className="mb-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {t(r.sectionLabelKey)}
                  </span>
                  <p className="font-semibold text-text">{r.title}</p>
                  <p className="line-clamp-2 text-sm text-text-muted">{r.snippet}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <EmergencyButton />
    </div>
  )
}
