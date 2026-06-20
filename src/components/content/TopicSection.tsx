import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Header from '../Header'
import EmergencyButton from '../EmergencyButton'
import DisclaimerBanner from './DisclaimerBanner'
import ContactRow from './ContactRow'
import { useSettings } from '../../lib/settings'
import { getRichSection, loadTopics } from '../../lib/content/richContent'
import type { Topic, TopicsContent } from '../../lib/content/richTypes'

/** Small labelled bullet/numbered list used for several topic blocks. */
function LabeledList({
  label,
  items,
  ordered = false,
  muted = false,
}: {
  label: string
  items: string[]
  ordered?: boolean
  muted?: boolean
}) {
  const ListTag = ordered ? 'ol' : 'ul'
  return (
    <div>
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </h3>
      <ListTag
        className={[
          ordered ? 'list-decimal' : 'list-disc',
          'flex flex-col gap-1 pl-5 text-base',
          muted ? 'text-text-muted' : 'text-text',
        ].join(' ')}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    </div>
  )
}

/** The expanded body of a topic — renders each block only when present. */
function TopicBody({ topic }: { topic: Topic }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <p className="text-base text-text-muted">{topic.summary}</p>

      {topic.eligibility?.length ? (
        <LabeledList label={t('content.eligibility')} items={topic.eligibility} />
      ) : null}

      {topic.validity ? (
        <div className="rounded-md bg-accent/15 p-3">
          <h3 className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('content.validity')}
          </h3>
          <p className="text-base font-medium text-text">{topic.validity}</p>
        </div>
      ) : null}

      {topic.steps?.length ? (
        <LabeledList label={t('content.steps')} items={topic.steps} ordered />
      ) : null}

      {topic.documents?.length ? (
        <LabeledList label={t('content.documents')} items={topic.documents} />
      ) : null}

      {topic.forms?.length ? (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('content.forms')}
          </h3>
          <ul className="flex flex-col gap-2">
            {topic.forms.map((form, i) => (
              <li key={i}>
                <a
                  href={form.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-tap items-center gap-2 font-semibold text-primary underline"
                >
                  <span aria-hidden="true">📄</span>
                  {form.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {topic.contacts?.length ? (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('content.contacts')}
          </h3>
          <ul className="flex flex-col gap-2">
            {topic.contacts.map((contact, i) => (
              <li key={i}>
                <ContactRow contact={contact} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {topic.notes?.length ? (
        <div className="rounded-md bg-bg p-3">
          <LabeledList label={t('content.notes')} items={topic.notes} muted />
        </div>
      ) : null}

      {topic.sources?.length ? (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('content.sources')}
          </h3>
          <ul className="flex flex-col gap-1">
            {topic.sources.map((source, i) => (
              <li key={i} className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {source.label}
                </a>
                <span className="ml-1 text-text-muted">
                  · {t('content.verifiedOn', { date: source.verified })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/**
 * Topic-shape section renderer (Institutions, Health). Shows a prominent
 * disclaimer then an accordion of topics. A `?focus=<id>` query (used by search)
 * auto-expands and scrolls to a topic.
 */
export default function TopicSection({ sectionId }: { sectionId: string }) {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [params] = useSearchParams()
  const focus = params.get('focus')

  const def = getRichSection(sectionId)
  const [data, setData] = useState<TopicsContent | null | undefined>(undefined)
  const [open, setOpen] = useState<Set<string>>(new Set())

  const file = def?.file

  useEffect(() => {
    if (!file) return
    let active = true
    setData(undefined)
    void loadTopics(file, language).then((d) => active && setData(d))
    return () => {
      active = false
    }
  }, [file, language])

  // Expand + scroll to the focused topic once content is loaded.
  useEffect(() => {
    if (!focus || !data) return
    setOpen((prev) => new Set(prev).add(focus))
    requestAnimationFrame(() => {
      document.getElementById(`topic-${focus}`)?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [focus, data])

  const title = def ? t(def.labelKey) : ''

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={title} />

      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">
        <h1 className="mb-3 text-2xl font-bold text-text">{title}</h1>

        {data && <DisclaimerBanner text={data._meta.disclaimer} />}

        <ul className="flex flex-col gap-2">
          {data?.topics.map((topic) => {
            const isOpen = open.has(topic.id)
            return (
              <li
                key={topic.id}
                id={`topic-${topic.id}`}
                className="overflow-hidden rounded-lg bg-surface shadow-sm ring-1 ring-black/5 scroll-mt-20"
              >
                <button
                  type="button"
                  onClick={() => toggle(topic.id)}
                  aria-expanded={isOpen}
                  className="flex min-h-tap w-full items-center gap-3 p-4 text-left"
                >
                  <span className="flex-1 font-semibold text-text">{topic.title}</span>
                  <span
                    aria-hidden="true"
                    className={`text-text-muted transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  >
                    ›
                  </span>
                </button>
                {isOpen && <TopicBody topic={topic} />}
              </li>
            )
          })}
        </ul>

        {data && (
          <p className="mt-4 text-center text-xs text-text-muted">
            {t('content.updated', { date: data._meta.updated })}
          </p>
        )}
      </main>

      <EmergencyButton />
    </div>
  )
}
