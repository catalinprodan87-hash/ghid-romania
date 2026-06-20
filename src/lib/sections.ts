// Single source of truth for every section: the home menu, the section routes,
// and (for content sections) which file + data shape they load. Adding a future
// section is a one-line entry here.
//
// `labelKey` points at a key in the locale files — no UI text is hard-coded.
// `icon` is an inline emoji glyph: zero network cost, renders on cheap phones.

export type ContentShape = 'topics' | 'phrasebook'

export interface SectionDef {
  /** URL slug under /section/ and the identity used everywhere. */
  id: string
  labelKey: string
  icon: string
  /** Route override; otherwise /section/<id> (see `sectionPath`). */
  path?: string
  /** Content-file basename: src/content/<file>.<lang>.json (content sections). */
  file?: string
  /** Data shape — its presence marks a section as having a content renderer. */
  shape?: ContentShape
  /** Show as a card on the home grid. Default true. */
  grid?: boolean
  /** No content authored yet → generic "Coming soon". */
  placeholder?: boolean
}

export const SECTIONS: SectionDef[] = [
  { id: 'learn-romanian', labelKey: 'menu.learnRomanian', icon: '🗣️', path: '/learn' },
  {
    id: 'institutions-documents',
    labelKey: 'menu.institutions',
    icon: '🏛️',
    file: 'institutions',
    shape: 'topics',
  },
  {
    id: 'health-emergency',
    labelKey: 'menu.health',
    icon: '🏥',
    file: 'health',
    shape: 'topics',
  },
  {
    id: 'phrasebook',
    labelKey: 'menu.phrasebook',
    icon: '💬',
    path: '/phrasebook',
    file: 'phrasebook',
    shape: 'phrasebook',
  },
  { id: 'work-money', labelKey: 'menu.work', icon: '💼', file: 'work', shape: 'topics' },
  { id: 'housing', labelKey: 'menu.housing', icon: '🏠', file: 'housing', shape: 'topics' },
  { id: 'transport', labelKey: 'menu.transport', icon: '🚌', file: 'transport', shape: 'topics' },
  { id: 'shopping', labelKey: 'menu.shopping', icon: '🛒', file: 'shopping', shape: 'topics' },
  { id: 'education', labelKey: 'menu.education', icon: '🎓', file: 'education', shape: 'topics' },
  { id: 'travel-tourism', labelKey: 'menu.travel', icon: '🧭', file: 'tourism', shape: 'topics' },
  { id: 'bucharest', labelKey: 'menu.bucharest', icon: '🌆', file: 'bucharest', shape: 'topics' },
  {
    id: 'community-support',
    labelKey: 'menu.community',
    icon: '🤝',
    file: 'community',
    shape: 'topics',
  },
  // Reached from Settings (and deep links), not the home grid.
  {
    id: 'how-to',
    labelKey: 'menu.howTo',
    icon: '📖',
    file: 'how-to',
    shape: 'topics',
    grid: false,
  },
]

// Settings is a home tile but a dedicated screen, not a content section.
export const SETTINGS_TILE = {
  to: '/settings',
  labelKey: 'menu.settings',
  icon: '⚙️',
} as const

/** Sections shown as cards on the home grid, in order. */
export const GRID_SECTIONS = SECTIONS.filter((s) => s.grid !== false)

/** The route a section opens at. */
export function sectionPath(section: SectionDef): string {
  return section.path ?? `/section/${section.id}`
}

export function getSection(id: string | undefined): SectionDef | undefined {
  return SECTIONS.find((section) => section.id === id)
}
