import { useTranslation } from 'react-i18next'
import type { SpeakingExercise } from '../../../lib/learn/types'
import MicPractice from '../MicPractice'

interface Props {
  exercise: SpeakingExercise
  onDone: (correct: boolean) => void
}

export default function Speaking({ exercise, onDone }: Props) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{exercise.instruction_uk}</p>
      <span className="sr-only">{t('learn.mic')}</span>
      <MicPractice target={exercise.target_ro} tips={exercise.tips_uk} onComplete={onDone} />
    </div>
  )
}
