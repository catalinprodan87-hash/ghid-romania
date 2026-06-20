import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import SlowToggle from '../../components/learn/SlowToggle'
import SpeakButton from '../../components/learn/SpeakButton'
import MicPractice from '../../components/learn/MicPractice'
import { dueCards, progressActions, type VocabCard } from '../../lib/learn/progress'

/** One listening-recall review: hear the Romanian, recall the meaning, self-mark. */
function ListeningRecall({
  card,
  onDone,
}: {
  card: VocabCard
  onDone: (correct: boolean) => void
}) {
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold text-text">{t('learn.listenRecall')}</p>

      <div className="flex items-center justify-center gap-3 rounded-lg bg-bg p-6">
        <SpeakButton text={card.ro} size="lg" />
        <span className="text-xl font-bold text-text">{card.ro}</span>
      </div>

      {revealed ? (
        <>
          <p className="rounded-md bg-surface p-3 text-center text-lg text-text ring-1 ring-black/5">
            {card.uk}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onDone(false)}
              className="min-h-tap flex-1 rounded-md bg-bg px-4 font-semibold text-text ring-1 ring-black/10"
            >
              {t('learn.again')}
            </button>
            <button
              type="button"
              onClick={() => onDone(true)}
              className="min-h-tap flex-1 rounded-md bg-success px-4 font-semibold text-white"
            >
              {t('learn.knew')}
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="min-h-tap rounded-md bg-primary px-4 font-semibold text-white"
        >
          {t('learn.showAnswer')}
        </button>
      )}
    </div>
  )
}

export default function Review() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Snapshot the due queue at mount so rescheduling doesn't reshuffle it mid-session.
  const queue = useMemo(() => dueCards(), [])
  const [idx, setIdx] = useState(0)

  if (queue.length === 0) {
    return (
      <div className="min-h-dvh bg-bg">
        <Header showBack title={t('learn.review')} />
        <main className="mx-auto max-w-screen-sm px-4 pt-10 text-center">
          <p className="text-6xl">✅</p>
          <p className="mt-4 text-lg text-text-muted">{t('learn.reviewNone')}</p>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="mt-6 min-h-tap rounded-md bg-primary px-6 py-3 font-semibold text-white"
          >
            {t('learn.backToCourse')}
          </button>
        </main>
      </div>
    )
  }

  const finished = idx >= queue.length
  const card = queue[idx]

  const onDone = (correct: boolean) => {
    progressActions.reviewVocab(card.ro, correct)
    setIdx((i) => i + 1)
  }

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={t('learn.review')} />

      {!finished && (
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-bg/95 px-4 py-2 backdrop-blur">
          <SlowToggle />
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-surface ring-1 ring-black/5">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${(idx / queue.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-text-muted">
            {idx + 1}/{queue.length}
          </span>
        </div>
      )}

      <main className="mx-auto max-w-screen-sm px-4 pb-16 pt-3">
        {finished ? (
          <div className="flex flex-col items-center gap-4 pt-8 text-center">
            <span aria-hidden="true" className="text-6xl">
              🎉
            </span>
            <h2 className="text-2xl font-bold text-text">{t('learn.feedbackGreat')}</h2>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="min-h-tap w-full rounded-md bg-primary px-4 py-3 text-lg font-bold text-white"
            >
              {t('learn.continue')}
            </button>
          </div>
        ) : // Alternate listening recall and speaking practice through the queue.
        idx % 2 === 0 ? (
          <ListeningRecall key={idx} card={card} onDone={onDone} />
        ) : (
          <MicPractice key={idx} target={card.ro} onComplete={onDone} />
        )}
      </main>
    </div>
  )
}
