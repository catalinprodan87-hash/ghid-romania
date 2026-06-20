import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MatchingExercise } from '../../../lib/learn/types'
import SpeakButton from '../SpeakButton'

interface Props {
  exercise: MatchingExercise
  onDone: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Matching({ exercise, onDone }: Props) {
  const { t } = useTranslation()
  // Right column is shuffled once; left column keeps lesson order.
  const ukColumn = useMemo(() => shuffle(exercise.pairs.map((p) => p.uk)), [exercise])

  const [selectedRo, setSelectedRo] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<string | null>(null)

  const partnerOf = (ro: string) => exercise.pairs.find((p) => p.ro === ro)?.uk
  const isDone = matched.size === exercise.pairs.length

  const tapUk = (uk: string) => {
    if (!selectedRo || matched.has(selectedRo)) return
    if (partnerOf(selectedRo) === uk) {
      const next = new Set(matched)
      next.add(selectedRo)
      setMatched(next)
      setSelectedRo(null)
      setWrong(null)
    } else {
      setWrong(uk)
      setTimeout(() => setWrong(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{exercise.instruction_uk}</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Romanian column */}
        <ul className="flex flex-col gap-2">
          {exercise.pairs.map((pair) => {
            const done = matched.has(pair.ro)
            const sel = selectedRo === pair.ro
            return (
              <li key={pair.ro}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => setSelectedRo(pair.ro)}
                  className={[
                    'flex min-h-tap w-full items-center gap-1 rounded-md px-2 py-2 text-left text-base font-medium ring-1',
                    done
                      ? 'bg-success/10 text-success ring-success/30'
                      : sel
                        ? 'bg-primary/10 text-text ring-primary'
                        : 'bg-surface text-text ring-black/10',
                  ].join(' ')}
                >
                  <span className="flex-1">{pair.ro}</span>
                  <SpeakButton text={pair.ro} size="sm" />
                </button>
              </li>
            )
          })}
        </ul>

        {/* Ukrainian column */}
        <ul className="flex flex-col gap-2">
          {ukColumn.map((uk) => {
            const done = [...matched].some((ro) => partnerOf(ro) === uk)
            const isWrong = wrong === uk
            return (
              <li key={uk}>
                <button
                  type="button"
                  disabled={done}
                  onClick={() => tapUk(uk)}
                  className={[
                    'min-h-tap w-full rounded-md px-2 py-2 text-base font-medium ring-1',
                    done
                      ? 'bg-success/10 text-success ring-success/30'
                      : isWrong
                        ? 'bg-danger/10 text-text ring-danger'
                        : 'bg-surface text-text ring-black/10',
                  ].join(' ')}
                >
                  {uk}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {isDone ? (
        <>
          <p className="text-center font-semibold text-success">{t('learn.matchedAll')}</p>
          <button
            type="button"
            onClick={() => onDone(true)}
            className="min-h-tap rounded-md bg-primary px-4 font-semibold text-white"
          >
            {t('learn.next')}
          </button>
        </>
      ) : (
        <p className="text-center text-sm text-text-muted">{t('learn.selectPair')}</p>
      )}
    </div>
  )
}
