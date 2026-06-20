import { useTranslation } from 'react-i18next'
import { useSettings } from '../lib/settings'

/**
 * Compact UK ⇄ RO segmented toggle for the header.
 * Switching flips the entire interface instantly and persists the choice.
 */
export default function LanguageToggle() {
  const { t } = useTranslation()
  const { language, setLanguage } = useSettings()

  return (
    <div
      role="group"
      aria-label={t('language.toggle')}
      className="flex items-center rounded-full bg-white/15 p-0.5"
    >
      {(['uk', 'ro'] as const).map((lng) => {
        const active = language === lng
        return (
          <button
            key={lng}
            type="button"
            onClick={() => setLanguage(lng)}
            aria-pressed={active}
            className={[
              'min-h-tap rounded-full px-3 text-sm font-semibold transition-colors',
              active
                ? 'bg-white text-primary shadow-sm'
                : 'text-white/90 hover:text-white',
            ].join(' ')}
          >
            {t(`language.${lng}`)}
          </button>
        )
      })}
    </div>
  )
}
