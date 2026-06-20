import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import EmergencyButton from '../components/EmergencyButton'
import PhraseCard from '../components/content/PhraseCard'
import { useSettings } from '../lib/settings'
import { loadPhrasebook } from '../lib/content/richContent'
import type { PhrasebookContent } from '../lib/content/richTypes'

/**
 * Phrasebook: category list → tap a category → phrase cards. Fully offline.
 * A `?focus=<categoryId>` query (from search) opens that category directly.
 */
export default function Phrasebook() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [params] = useSearchParams()
  const focus = params.get('focus')

  const [data, setData] = useState<PhrasebookContent | null | undefined>(undefined)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setData(undefined)
    void loadPhrasebook('phrasebook', language).then((d) => active && setData(d))
    return () => {
      active = false
    }
  }, [language])

  // Open a category requested via ?focus= once content is loaded.
  useEffect(() => {
    if (focus && data?.categories.some((c) => c.id === focus)) setSelected(focus)
  }, [focus, data])

  const title = t('menu.phrasebook')
  const category = data?.categories.find((c) => c.id === selected) ?? null

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={title} />

      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">
        {category ? (
          <>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-3 inline-flex min-h-tap items-center gap-1 font-semibold text-primary"
            >
              <span aria-hidden="true">‹</span> {t('content.backToCategories')}
            </button>
            <h1 className="mb-3 text-2xl font-bold text-text">{category.title}</h1>
            <ul className="flex flex-col gap-2">
              {category.phrases.map((phrase, i) => (
                <li key={i}>
                  <PhraseCard phrase={phrase} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <h1 className="mb-3 text-2xl font-bold text-text">{title}</h1>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {data?.categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(cat.id)}
                    className="flex min-h-tap w-full items-center gap-3 rounded-lg bg-surface p-4 text-left shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
                  >
                    <span className="flex-1 font-semibold text-text">{cat.title}</span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">
                      {cat.phrases.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>

      <EmergencyButton />
    </div>
  )
}
