import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import MenuCard from '../components/MenuCard'
import EmergencyButton from '../components/EmergencyButton'
import { GRID_SECTIONS, SETTINGS_TILE, sectionPath } from '../lib/sections'

/**
 * Home screen: header (app name, tagline, language toggle, search) + a card
 * grid of the nine sections plus Settings, with an always-visible Emergency
 * button.
 */
export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh bg-bg">
      <Header />

      <main className="mx-auto max-w-screen-sm px-4 pb-28 pt-4">
        <h1 className="sr-only">{t('app.name')}</h1>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GRID_SECTIONS.map((section) => (
            <li key={section.id}>
              <MenuCard
                to={sectionPath(section)}
                icon={section.icon}
                label={t(section.labelKey)}
              />
            </li>
          ))}
          <li>
            <MenuCard
              to={SETTINGS_TILE.to}
              icon={SETTINGS_TILE.icon}
              label={t(SETTINGS_TILE.labelKey)}
            />
          </li>
        </ul>
      </main>

      <EmergencyButton />
    </div>
  )
}
