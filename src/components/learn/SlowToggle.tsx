import { useTranslation } from 'react-i18next'
import { useLearnPrefs } from '../../lib/learn/prefs'

/** Toggle for slower (0.7×) Romanian playback while learning. */
export default function SlowToggle() {
  const { t } = useTranslation()
  const { slow, toggleSlow } = useLearnPrefs()

  return (
    <button
      type="button"
      onClick={toggleSlow}
      aria-pressed={slow}
      aria-label={slow ? t('learn.slowOn') : t('learn.slowOff')}
      className={[
        'inline-flex min-h-tap items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors',
        slow
          ? 'bg-accent text-text'
          : 'bg-surface text-text-muted ring-1 ring-black/10',
      ].join(' ')}
    >
      <span aria-hidden="true">🐢</span>
      {t('learn.slow')}
    </button>
  )
}
