import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import PhraseCard from '../components/content/PhraseCard'
import ContactRow from '../components/content/ContactRow'
import { useSettings } from '../lib/settings'
import { loadPhrasebook, loadTopics } from '../lib/content/richContent'
import type { Phrase, TopicContact } from '../lib/content/richTypes'

/**
 * Emergency screen — works entirely offline from precached content:
 *  - a large Call 112 button (tel:112)
 *  - the phrasebook's `emergency` category, inline with pron_uk
 *  - key contacts pulled from the `key-contacts` topics in Health + Institutions
 */
export default function Emergency() {
  const { t } = useTranslation()
  const { language } = useSettings()

  const [phrases, setPhrases] = useState<Phrase[]>([])
  const [contacts, setContacts] = useState<TopicContact[]>([])

  useEffect(() => {
    let active = true

    void loadPhrasebook('phrasebook', language).then((pb) => {
      if (!active || !pb) return
      const cat = pb.categories.find((c) => c.id === 'emergency')
      setPhrases(cat?.phrases ?? [])
    })

    void Promise.all([
      loadTopics('health', language),
      loadTopics('institutions', language),
    ]).then(([health, institutions]) => {
      if (!active) return
      // Merge the key-contacts from both sections, de-duplicating by value
      // (e.g. 112 appears in both).
      const seen = new Set<string>()
      const merged: TopicContact[] = []
      for (const topics of [health, institutions]) {
        const keyTopic = topics?.topics.find((tp) => tp.id === 'key-contacts')
        for (const contact of keyTopic?.contacts ?? []) {
          const dedupeKey = contact.value.replace(/\s/g, '')
          if (seen.has(dedupeKey)) continue
          seen.add(dedupeKey)
          merged.push(contact)
        }
      }
      setContacts(merged)
    })

    return () => {
      active = false
    }
  }, [language])

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={t('emergency.title')} />

      <main className="mx-auto flex max-w-screen-sm flex-col gap-5 px-4 pb-12 pt-4">
        {/* Call 112 */}
        <section>
          <p className="mb-2 text-base text-text-muted">{t('emergency.intro')}</p>
          <a
            href="tel:112"
            className="flex min-h-[64px] items-center justify-center gap-3 rounded-lg bg-danger px-4 text-2xl font-bold text-white shadow-md active:scale-[0.99]"
          >
            <span aria-hidden="true">📞</span>
            {t('emergency.call112')}
          </a>
        </section>

        {/* Emergency phrases */}
        {phrases.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-bold text-text">{t('emergency.phrases')}</h2>
            <ul className="flex flex-col gap-2">
              {phrases.map((phrase, i) => (
                <li key={i}>
                  <PhraseCard phrase={phrase} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Key contacts */}
        {contacts.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-bold text-text">{t('emergency.keyContacts')}</h2>
            <ul className="flex flex-col gap-2">
              {contacts.map((contact, i) => (
                <li key={i}>
                  <ContactRow contact={contact} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
