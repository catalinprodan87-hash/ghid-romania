import type { Phrase } from '../../lib/content/richTypes'
import PlayButton from './PlayButton'

/**
 * One phrase: Romanian (large) + Cyrillic pronunciation (visually distinct) +
 * Ukrainian translation, with a play button. Works fully offline — `pron_uk`
 * is always shown as the fallback even when TTS is unavailable.
 */
export default function PhraseCard({ phrase }: { phrase: Phrase }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
      <PlayButton text={phrase.ro} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold leading-tight text-text">{phrase.ro}</p>
        <p className="mt-0.5 text-sm font-semibold text-primary">[{phrase.pron_uk}]</p>
        <p className="mt-0.5 text-base text-text-muted">{phrase.uk}</p>
      </div>
    </div>
  )
}
