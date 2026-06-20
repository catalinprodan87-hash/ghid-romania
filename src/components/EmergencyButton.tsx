import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/**
 * Always-visible emergency shortcut. Floats above content, bottom-right, with a
 * large tap target and danger colour. Routes to the health & emergency section
 * (which will hold 112 and other emergency info once content lands).
 */
export default function EmergencyButton() {
  const { t } = useTranslation()

  return (
    <Link
      to="/emergency"
      className="fixed right-4 z-30 flex min-h-tap items-center gap-2 rounded-full bg-danger px-5 py-3 font-bold text-white shadow-lg active:scale-95"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      aria-label={t('common.emergency')}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        🆘
      </span>
      <span>{t('common.emergency')}</span>
    </Link>
  )
}
