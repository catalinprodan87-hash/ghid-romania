import type { Exercise } from '../../../lib/learn/types'
import MultipleChoice from './MultipleChoice'
import FillBlank from './FillBlank'
import Matching from './Matching'
import Listening from './Listening'
import Speaking from './Speaking'

interface Props {
  exercise: Exercise
  onDone: (correct: boolean) => void
}

/** Render one exercise by its `type`. Each child manages its own check/next. */
export default function ExerciseRenderer({ exercise, onDone }: Props) {
  switch (exercise.type) {
    case 'multiple_choice':
      return <MultipleChoice exercise={exercise} onDone={onDone} />
    case 'fill_blank':
      return <FillBlank exercise={exercise} onDone={onDone} />
    case 'matching':
      return <Matching exercise={exercise} onDone={onDone} />
    case 'listening':
      return <Listening exercise={exercise} onDone={onDone} />
    case 'speaking':
      return <Speaking exercise={exercise} onDone={onDone} />
    default: {
      // Exhaustiveness guard — a new exercise type will surface here at compile time.
      const _exhaustive: never = exercise
      return _exhaustive
    }
  }
}
