import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header'
import Spinner from '../../components/Spinner'
import SlowToggle from '../../components/learn/SlowToggle'
import VocabularyCard from '../../components/learn/VocabularyCard'
import ExerciseRenderer from '../../components/learn/exercises/ExerciseRenderer'
import { useSettings } from '../../lib/settings'
import { loadLesson } from '../../lib/learn/lessons'
import { progressActions, type CompletionSummary } from '../../lib/learn/progress'
import { cancelSpeech } from '../../services/speech'
import type { Lesson } from '../../lib/learn/types'

type Phase = 'intro' | 'exercise' | 'complete'

export default function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const { t } = useTranslation()
  const { language } = useSettings()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined)
  const [phase, setPhase] = useState<Phase>('intro')
  const [idx, setIdx] = useState(0)
  const [summary, setSummary] = useState<CompletionSummary | null>(null)

  useEffect(() => {
    let active = true
    void loadLesson(lessonId ?? '').then((l) => active && setLesson(l))
    return () => {
      active = false
      cancelSpeech() // stop any audio when leaving the lesson
    }
  }, [lessonId])

  if (lesson === undefined) {
    return (
      <div className="min-h-dvh bg-bg">
        <Header showBack />
        <Spinner />
      </div>
    )
  }
  if (lesson === null) return <Navigate to="/learn" replace />

  const pick = (uk: string, ro: string) => (language === 'ro' ? ro : uk)
  const exercises = lesson.exercises
  const title = pick(lesson.title_uk, lesson.title_ro)

  const advance = () => {
    cancelSpeech()
    if (idx < exercises.length - 1) {
      setIdx(idx + 1)
    } else {
      setSummary(progressActions.completeLesson(lesson))
      setPhase('complete')
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={title} />

      {/* Sticky controls: slow-speed toggle + step progress */}
      {phase !== 'complete' && (
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-bg/95 px-4 py-2 backdrop-blur">
          <SlowToggle />
          {phase === 'exercise' && (
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-surface ring-1 ring-black/5">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(idx / exercises.length) * 100}%` }}
                />
              </div>
            </div>
          )}
          {phase === 'exercise' && (
            <span className="text-sm font-semibold text-text-muted">
              {idx + 1}/{exercises.length}
            </span>
          )}
        </div>
      )}

      <main className="mx-auto max-w-screen-sm px-4 pb-16 pt-3">
        {phase === 'intro' && (
          <div className="flex flex-col gap-4">
            <p className="rounded-lg bg-primary/5 p-4 text-base text-text">
              <span className="font-semibold">🎯 </span>
              {lesson.goal_uk}
            </p>

            {lesson.grammar_notes_uk && lesson.grammar_notes_uk.length > 0 && (
              <section>
                <h2 className="mb-2 text-lg font-bold text-text">{t('learn.grammar')}</h2>
                <ul className="flex flex-col gap-2">
                  {lesson.grammar_notes_uk.map((note, i) => (
                    <li
                      key={i}
                      className="rounded-md bg-surface p-3 text-sm text-text ring-1 ring-black/5"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="mb-2 text-lg font-bold text-text">{t('learn.vocabulary')}</h2>
              <div className="flex flex-col gap-2">
                {lesson.vocabulary.map((item) => (
                  <VocabularyCard key={item.ro} item={item} />
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => {
                setIdx(0)
                setPhase('exercise')
              }}
              className="min-h-tap rounded-md bg-primary px-4 py-3 text-lg font-bold text-white"
            >
              {t('learn.begin')}
            </button>
          </div>
        )}

        {phase === 'exercise' && (
          <ExerciseRenderer
            key={idx}
            exercise={exercises[idx]}
            onDone={advance}
          />
        )}

        {phase === 'complete' && summary && (
          <div className="flex flex-col items-center gap-4 pt-8 text-center">
            <span aria-hidden="true" className="text-6xl">
              🎉
            </span>
            <h2 className="text-2xl font-bold text-text">{t('learn.lessonComplete')}</h2>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-bold text-success">
                {t('learn.xpEarned', { count: summary.xpEarned })}
              </p>
              {summary.reviewAdded > 0 && (
                <p className="text-base text-text-muted">
                  {t('learn.addedToReview', { count: summary.reviewAdded })}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="min-h-tap w-full rounded-md bg-primary px-4 py-3 text-lg font-bold text-white"
            >
              {t('learn.continue')}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
