import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FillBlankExercise } from '../../../lib/learn/types'
import { isAcceptable } from '../../../lib/learn/scoring'
import SpeakButton from '../SpeakButton'

interface Props {
  exercise: FillBlankExercise
  onDone: (correct: boolean) => void
}

export default function FillBlank({ exercise, onDone }: Props) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)

  const correct = isAcceptable(exercise.answer, value)
  // Preview of the completed sentence for the speak button after checking.
  const filledSentence = exercise.prompt_ro.replace('___', exercise.answer)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{exercise.instruction_uk}</p>

      <div className="flex items-center gap-2 rounded-md bg-bg p-3">
        <SpeakButton text={filledSentence} size="sm" />
        <p className="text-base text-text">{exercise.prompt_ro}</p>
      </div>

      <input
        type="text"
        value={value}
        disabled={checked}
        onChange={(e) => setValue(e.target.value)}
        placeholder="…"
        autoComplete="off"
        autoCapitalize="off"
        className="min-h-tap w-full rounded-md border border-black/10 bg-surface px-4 py-3 text-base text-text focus:border-primary"
      />

      {checked && (
        <div
          className={`rounded-md p-3 text-base ring-1 ${
            correct ? 'bg-success/10 text-success ring-success/30' : 'bg-warning/10 text-text ring-warning/30'
          }`}
        >
          <p className="font-semibold">
            {correct ? t('learn.feedbackGreat') : t('learn.feedbackClose')}
          </p>
          {!correct && (
            <p className="mt-1 text-sm">
              {t('learn.correctAnswer')} <span className="font-semibold">{exercise.answer}</span>
            </p>
          )}
        </div>
      )}

      {!checked ? (
        <button
          type="button"
          disabled={!value.trim()}
          onClick={() => setChecked(true)}
          className="min-h-tap rounded-md bg-primary px-4 font-semibold text-white disabled:opacity-40"
        >
          {t('learn.check')}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onDone(correct)}
          className="min-h-tap rounded-md bg-primary px-4 font-semibold text-white"
        >
          {t('learn.next')}
        </button>
      )}
    </div>
  )
}
