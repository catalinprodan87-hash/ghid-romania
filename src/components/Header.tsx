import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'

interface HeaderProps {
  /** Show a Back button instead of the app name (used on inner pages). */
  showBack?: boolean
  /** Optional page title shown when `showBack` is set. */
  title?: string
  /** Show the search icon button (default: true). */
  showSearch?: boolean
}

/**
 * App header: primary-coloured bar with the app name (or a Back button on inner
 * pages), the language toggle, and a search shortcut. Safe-area aware for
 * installed PWAs with a notch.
 */
export default function Header({ showBack = false, title, showSearch = true }: HeaderProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header
      className="sticky top-0 z-20 bg-primary text-white shadow-md"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex max-w-screen-sm items-center gap-3 px-4 py-3">
        {showBack ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="-ml-2 flex min-h-tap min-w-tap items-center gap-1 rounded-md px-2 font-semibold"
            aria-label={t('common.back')}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ‹
            </span>
            <span className="text-base">{t('common.back')}</span>
          </button>
        ) : (
          <Link to="/" className="flex min-h-tap flex-col justify-center" aria-label={t('common.home')}>
            <span className="text-lg font-bold leading-tight">{t('app.name')}</span>
            <span className="text-xs font-normal text-white/80 leading-tight">
              {t('app.tagline')}
            </span>
          </Link>
        )}

        {title && showBack && (
          <h1 className="flex-1 truncate text-base font-semibold">{title}</h1>
        )}

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          {showSearch && (
            <Link
              to="/search"
              aria-label={t('common.search')}
              className="flex min-h-tap min-w-tap items-center justify-center rounded-full text-xl hover:bg-white/15"
            >
              <span aria-hidden="true">🔍</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
