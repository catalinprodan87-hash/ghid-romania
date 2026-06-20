import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ListeningExercise } from '../../../lib/learn/types'
import { isAcceptable } from '../../../lib/learn/scoring'
import { useLearnPrefs } from '../../../lib/learn/prefs'
import { isSpeechSupported, speak } from '../../../services/speech'
import SpeakButton from '../SpeakButton'

interface Props {
  exercise: ListeningExercise
  onDone: (correct: boolean) => void
}

export default function Listening({ exercise, onDone }: Props) {
  const { t } = useTranslation()
  const { rate } = useLearnPrefs()
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const played = useRef(false)

  // Auto-play the prompt once so it's clearly a listening task.
  useEffect(() => {
    if (played.current) return
    played.current = true
    speak(exercise.audio_ro, { rate })
    // rate intentionally read once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise])

  const correct = isAcceptable(exercise.answer_uk, value)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{exercise.instruction_uk}</p>

      <div className="flex items-center justify-center gap-3 rounded-lg bg-bg p-6">
        <SpeakButton text={exercise.audio_ro} size="lg" label={t('learn.play')} />
        <span className="text-base text-text-muted">
          {isSpeechSupported() ? t('learn.listenRecall') : exercise.audio_ro}
        </span>
      </div>

      <input
        type="text"
        value={value}
        disabled={checked}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('learn.typeMeaning')}
        autoComplete="off"
        className="min-h-tap w-full rounded-md border border-black/10 bg-surface px-4 py-3 text-base text-text focus:border-primary"
      />

      {checked && (
        <div
          className={`rounded-md p-3 ring-1 ${
            correct ? 'bg-success/10 text-success ring-success/30' : 'bg-warning/10 text-text ring-warning/30'
          }`}
        >
          <p className="font-semibold">
            {correct ? t('learn.feedbackGreat') : t('learn.feedbackClose')}
          </p>
          <p className="mt-1 text-sm">
            {t('learn.correctAnswer')} <span className="font-semibold">{exercise.answer_uk}</span>
          </p>
        </div>
      )}

      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="min-h-tap rounded-md bg-primary px-4 font-semibold text-white"
        >
          {value.trim() ? t('learn.check') : t('learn.showAnswer')}
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
