import { Link } from 'react-router-dom'

interface MenuCardProps {
  to: string
  icon: string
  label: string
}

/**
 * A single home-grid tile: large icon + label, generous tap target, card
 * styling from the design tokens. Used for both section cards and Settings.
 */
export default function MenuCard({ to, icon, label }: MenuCardProps) {
  return (
    <Link
      to={to}
      className="flex min-h-tap flex-col items-center justify-center gap-2 rounded-lg bg-surface p-4 text-center shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.98] hover:shadow-md"
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {icon}
      </span>
      <span className="text-sm font-semibold leading-snug text-text">{label}</span>
    </Link>
  )
}
