import { useTranslation } from 'react-i18next'

/**
 * Placeholder shown in section pages until real, sourced content is added in a
 * later task. Calm, civic tone — no error styling.
 */
export default function ComingSoon() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
      <span aria-hidden="true" className="text-4xl">
        🧰
      </span>
      <p className="text-lg font-semibold text-text">{t('common.comingSoon')}</p>
      <p className="max-w-prose text-base text-text-muted">{t('common.comingSoonDesc')}</p>
    </div>
  )
}
