// Lesson data types — mirror the fixed schema produced by the
// `ukrainian-romanian-lessons` skill. Explanations are in Ukrainian; the target
// language is Romanian. Do not change field names/types.

export type Level = 'A1' | 'A2' | 'B1'

export interface VocabularyItem {
  ro: string
  uk: string
  pron_uk: string
  ipa?: string
  pos?: string
  example_ro: string
  example_uk: string
}

export interface MultipleChoiceExercise {
  type: 'multiple_choice'
  prompt_uk: string
  prompt_ro: string
  options: string[]
  answer_index: number
}

export interface FillBlankExercise {
  type: 'fill_blank'
  instruction_uk: string
  prompt_ro: string
  answer: string
}

export interface MatchingPair {
  ro: string
  uk: string
}

export interface MatchingExercise {
  type: 'matching'
  instruction_uk: string
  pairs: MatchingPair[]
}

export interface ListeningExercise {
  type: 'listening'
  instruction_uk: string
  audio_ro: string
  answer_uk: string
}

export interface SpeakingExercise {
  type: 'speaking'
  instruction_uk: string
  target_ro: string
  tips_uk: string
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | MatchingExercise
  | ListeningExercise
  | SpeakingExercise

export interface Lesson {
  id: string
  level: Level
  unit_uk: string
  unit_ro: string
  title_uk: string
  title_ro: string
  goal_uk: string
  vocabulary: VocabularyItem[]
  grammar_notes_uk?: string[]
  exercises: Exercise[]
}

// ---- Course index (course → units → ordered lessons) ----

export interface CourseLessonRef {
  id: string
  level: Level
  title_uk: string
  title_ro: string
}

export interface CourseUnit {
  id: string
  unit_uk: string
  unit_ro: string
  lessons: CourseLessonRef[]
}

export interface CourseIndex {
  course_uk: string
  course_ro: string
  units: CourseUnit[]
}
