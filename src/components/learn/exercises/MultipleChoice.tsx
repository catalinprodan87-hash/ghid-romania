import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MultipleChoiceExercise } from '../../../lib/learn/types'
import SpeakButton from '../SpeakButton'

interface Props {
  exercise: MultipleChoiceExercise
  onDone: (correct: boolean) => void
}

export default function MultipleChoice({ exercise, onDone }: Props) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  const correct = selected === exercise.answer_index

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{exercise.prompt_uk}</p>
      <div className="flex items-center gap-2 rounded-md bg-bg p-3">
        <SpeakButton text={exercise.prompt_ro} size="sm" />
        <p className="text-base text-text">{exercise.prompt_ro}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {exercise.options.map((opt, i) => {
          const isAnswer = i === exercise.answer_index
          const isChosen = i === selected
          let state = 'bg-surface ring-black/10 text-text'
          if (checked && isAnswer) state = 'bg-success/10 ring-success text-text'
          else if (checked && isChosen) state = 'bg-danger/10 ring-danger text-text'
          else if (!checked && isChosen) state = 'bg-primary/10 ring-primary text-text'

          return (
            <li key={i}>
              <button
                type="button"
                disabled={checked}
                onClick={() => setSelected(i)}
                aria-pressed={isChosen}
                className={`flex min-h-tap w-full items-center gap-2 rounded-md px-4 py-2 text-left text-base font-medium ring-1 ${state}`}
              >
                <span className="flex-1">{opt}</span>
                <SpeakButton text={opt} size="sm" />
              </button>
            </li>
          )
        })}
      </ul>

      {!checked ? (
        <button
          type="button"
          disabled={selected === null}
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
