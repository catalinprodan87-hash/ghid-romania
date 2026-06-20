import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import EmergencyButton from '../components/EmergencyButton'
import { useSettings } from '../lib/settings'
import type { Language, TextSize } from '../lib/types'

/** A labelled segmented control built from accessible radio buttons. */
function SegmentedControl<T extends string>({
  legend,
  hint,
  value,
  options,
  onChange,
}: {
  legend: string
  hint?: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
      <legend className="px-1 text-base font-semibold text-text">{legend}</legend>
      {hint ? <p className="mb-3 text-sm text-text-muted">{hint}</p> : null}
      <div className="flex gap-2" role="radiogroup" aria-label={legend}>
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={[
                'min-h-tap flex-1 rounded-md px-3 py-2 text-base font-semibold transition-colors',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-bg text-text ring-1 ring-black/10 hover:ring-primary',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * Settings: language toggle, text-size control (Normal / Large), and an
 * "Offline downloads" placeholder list. All preferences persist via the
 * settings provider (localStorage).
 */
export default function Settings() {
  const { t } = useTranslation()
  const { language, setLanguage, textSize, setTextSize } = useSettings()

  return (
    <div className="min-h-dvh bg-bg">
      <Header showBack title={t('settings.title')} />

      <main className="mx-auto flex max-w-screen-sm flex-col gap-4 px-4 pb-28 pt-4">
        <h1 className="text-2xl font-bold text-text">{t('settings.title')}</h1>

        <SegmentedControl<Language>
          legend={t('settings.language')}
          hint={t('settings.languageHint')}
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'uk', label: t('settings.ukrainian') },
            { value: 'ro', label: t('settings.romanian') },
          ]}
        />

        <SegmentedControl<TextSize>
          legend={t('settings.textSize')}
          hint={t('settings.textSizeHint')}
          value={textSize}
          onChange={setTextSize}
          options={[
            { value: 'normal', label: t('settings.normal') },
            { value: 'large', label: t('settings.large') },
          ]}
        />

        <section className="rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="text-base font-semibold text-text">
            {t('settings.offlineDownloads')}
          </h2>
          <p className="mb-3 text-sm text-text-muted">
            {t('settings.offlineDownloadsHint')}
          </p>
          <p className="rounded-md bg-bg p-4 text-center text-base text-text-muted">
            {t('settings.offlineEmpty')}
          </p>
        </section>

        {/* How to use the app */}
        <Link
          to="/section/how-to"
          className="flex min-h-tap items-center gap-3 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99]"
        >
          <span aria-hidden="true" className="text-xl">
            📖
          </span>
          <span className="flex-1 font-semibold text-text">{t('menu.howTo')}</span>
          <span aria-hidden="true" className="text-text-muted">
            ›
          </span>
        </Link>
      </main>

      <EmergencyButton />
    </div>
  )
}
