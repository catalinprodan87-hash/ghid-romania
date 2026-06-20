import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import ProgressRing from '../../components/learn/ProgressRing'
import { useSettings } from '../../lib/settings'
import { courseIndex } from '../../lib/learn/lessons'
import {
  DAILY_GOAL_XP,
  dueCount,
  isLessonComplete,
  useProgress,
} from '../../lib/learn/progress'

export default function LearnHome() {
  const { t } = useTranslation()
  const { language } = useSettings()
  const progress = useProgress()
  const due = dueCount(progress)

  const pick = (uk: string, ro: string) => (language === 'ro' ? ro : uk)

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={t('learn.courseTitle')} />

      <main className="mx-auto flex max-w-screen-sm flex-col gap-4 px-4 pb-12 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {pick(courseIndex.course_uk, courseIndex.course_ro)}
          </h1>
          <p className="text-base text-text-muted">{t('learn.subtitle')}</p>
        </div>

        {/* Motivation header: daily ring, XP, streak */}
        <div className="flex items-center gap-4 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
          <ProgressRing
            value={progress.daily.xp / DAILY_GOAL_XP}
            center={`${progress.daily.xp}`}
            caption={t('learn.dailyGoal')}
          />
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-base">
              <span className="font-bold text-text">{progress.xp}</span>{' '}
              <span className="text-text-muted">{t('learn.xp')}</span>
            </p>
            <p className="text-base">
              <span aria-hidden="true">🔥</span>{' '}
              <span className="font-bold text-text">{progress.streak.count}</span>{' '}
              <span className="text-text-muted">{t('learn.streak')}</span>
            </p>
          </div>
        </div>

        {/* Review entry */}
        {due > 0 ? (
          <Link
            to="/learn/review"
            className="flex min-h-tap items-center justify-between rounded-lg bg-accent px-4 py-3 font-semibold text-text shadow-sm"
          >
            <span>🔁 {t('learn.review')}</span>
            <span className="rounded-full bg-text/10 px-2 py-0.5 text-sm">
              {t('learn.reviewDue', { count: due })}
            </span>
          </Link>
        ) : (
          <p className="rounded-lg bg-surface p-3 text-center text-sm text-text-muted ring-1 ring-black/5">
            {t('learn.reviewNone')}
          </p>
        )}

        {/* Units + lessons */}
        {courseIndex.units.map((unit) => {
          const total = unit.lessons.length
          const done = unit.lessons.filter((l) => isLessonComplete(l.id, progress)).length
          return (
            <section key={unit.id} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-text">
                  {pick(unit.unit_uk, unit.unit_ro)}
                </h2>
                <span className="text-sm text-text-muted">
                  {done}/{total}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {unit.lessons.map((lesson) => {
                  const complete = isLessonComplete(lesson.id, progress)
                  return (
                    <li key={lesson.id}>
                      <Link
                        to={`/learn/lesson/${lesson.id}`}
                        className="flex min-h-tap items-center gap-3 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${
                            complete ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {complete ? '✓' : lesson.level}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-text">
                            {pick(lesson.title_uk, lesson.title_ro)}
                          </span>
                          {complete && (
                            <span className="text-sm text-success">{t('learn.completed')}</span>
                          )}
                        </span>
                        <span aria-hidden="true" className="text-text-muted">
                          ›
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </main>
    </div>
  )
}
