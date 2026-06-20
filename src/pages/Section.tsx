import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ComingSoon from '../components/ComingSoon'
import EmergencyButton from '../components/EmergencyButton'
import TopicSection from '../components/content/TopicSection'
import { getSection, sectionPath } from '../lib/sections'
import { getRichSection } from '../lib/content/richContent'
import { loadSectionContent, type SectionContent } from '../lib/content'
import { useSettings } from '../lib/settings'

/**
 * Route dispatcher for /section/:sectionId. Rich sections (Institutions, Health)
 * use the topic renderer; Phrasebook lives at its own route; everything else
 * falls through to the generic placeholder.
 */
export default function Section() {
  const { sectionId } = useParams<{ sectionId: string }>()

  // Learn Romanian has its own lesson player.
  if (sectionId === 'learn-romanian') return <Navigate to="/learn" replace />

  const rich = getRichSection(sectionId)
  if (rich?.shape === 'topics') return <TopicSection sectionId={sectionId!} />
  if (rich?.shape === 'phrasebook') return <Navigate to={sectionPath(rich)} replace />

  return <GenericSection sectionId={sectionId} />
}

/**
 * Generic placeholder section: localised title + "Coming soon" until real,
 * sourced content lands. Still loads src/content/<section>.<lang>.json when
 * populated.
 */
function GenericSection({ sectionId }: { sectionId: string | undefined }) {
  const { t } = useTranslation()
  const { language } = useSettings()
  const [content, setContent] = useState<SectionContent | null>(null)

  const section = getSection(sectionId)

  useEffect(() => {
    if (!section) return
    let active = true
    void loadSectionContent(section.id, language).then((data) => {
      if (active) setContent(data)
    })
    return () => {
      active = false
    }
  }, [section, language])

  // Unknown slug → back home.
  if (!section) return <Navigate to="/" replace />

  const title = content?.title ?? t(section.labelKey)
  const hasContent = content && content.items.length > 0

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={title} />

      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">
        <h1 className="mb-4 text-2xl font-bold text-text">{title}</h1>

        {content?.intro ? (
          <p className="mb-4 text-base text-text-muted">{content.intro}</p>
        ) : null}

        {hasContent ? (
          <ul className="flex flex-col gap-3">
            {content!.items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5"
              >
                <h2 className="text-lg font-semibold text-text">{item.title}</h2>
                {item.body ? (
                  <p className="mt-1 text-base text-text-muted">{item.body}</p>
                ) : null}
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block font-semibold text-primary underline"
                  >
                    {item.url}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <ComingSoon />
        )}
      </main>

      <EmergencyButton />
    </div>
  )
}
