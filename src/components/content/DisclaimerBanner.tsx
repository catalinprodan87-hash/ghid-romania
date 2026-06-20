interface DisclaimerBannerProps {
  text: string
}

/**
 * Prominent, info-styled disclaimer shown at the top of a content section
 * (e.g. the Health medical/112 note). Deliberately high-contrast so it isn't
 * buried — accent left border + tinted background.
 */
export default function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <div
      role="note"
      className="mb-4 flex gap-3 rounded-md border-l-4 border-warning bg-warning/10 p-3"
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ℹ️
      </span>
      <p className="text-sm leading-snug text-text">{text}</p>
    </div>
  )
}
