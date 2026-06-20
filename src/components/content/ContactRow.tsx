import { useTranslation } from 'react-i18next'
import type { TopicContact } from '../../lib/content/richTypes'

// A value is treated as a phone number when it's only +, digits, spaces, dots,
// dashes and parentheses (domains contain letters, so they fail this test).
const PHONE_RE = /^[+\d][\d\s.()-]*$/

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value) && value.replace(/\D/g, '').length >= 3
}

export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, '')}`
}

/**
 * Renders a contact as a tappable row:
 *  - phone-like value → tel: link (tap-to-call, incl. 112)
 *  - else url present → outbound link (new tab)
 *  - else plain text
 */
export default function ContactRow({ contact }: { contact: TopicContact }) {
  const { t } = useTranslation()
  const phone = isPhone(contact.value)

  const base =
    'flex min-h-tap items-center gap-3 rounded-md bg-surface p-3 ring-1 ring-black/5'

  const inner = (icon: string, action?: string) => (
    <>
      <span aria-hidden="true" className="text-xl leading-none">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-text-muted">{contact.label}</span>
        <span className="block break-words font-semibold text-text">{contact.value}</span>
      </span>
      {action ? (
        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          {action}
        </span>
      ) : null}
    </>
  )

  if (phone) {
    return (
      <a href={telHref(contact.value)} className={base}>
        {inner('📞', t('content.call'))}
      </a>
    )
  }
  if (contact.url) {
    return (
      <a href={contact.url} target="_blank" rel="noreferrer" className={base}>
        {inner('🔗', t('content.open'))}
      </a>
    )
  }
  return <div className={base}>{inner('•')}</div>
}
