import { useTranslation } from 'react-i18next'
import type { VocabularyItem } from '../../lib/learn/types'
import SpeakButton from './SpeakButton'

/**
 * Vocabulary preview card: Romanian word + Cyrillic respelling, Ukrainian
 * meaning, and an example sentence — each Romanian bit has a play button.
 */
export default function VocabularyCard({ item }: { item: VocabularyItem }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <SpeakButton text={item.ro} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold leading-tight text-text">{item.ro}</p>
          <p className="text-sm text-text-muted">
            [{item.pron_uk}]
            {item.pos ? <span className="ml-2 italic">{item.pos}</span> : null}
          </p>
          <p className="mt-1 text-base text-text">{item.uk}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md bg-bg p-2">
        <SpeakButton text={item.example_ro} size="sm" label={`${t('learn.play')}: ${item.example_ro}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text">{item.example_ro}</p>
          <p className="text-sm text-text-muted">{item.example_uk}</p>
        </div>
      </div>
    </div>
  )
}
