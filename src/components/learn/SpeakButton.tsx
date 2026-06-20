import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isSpeechSupported, speak } from '../../services/speech'
import { useLearnPrefs } from '../../lib/learn/prefs'

interface SpeakButtonProps {
  /** Romanian text to speak. */
  text: string
  /** Accessible label override (defaults to "Listen"). */
  label?: string
  /** Visual size. */
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'min-h-tap min-w-tap text-base',
  md: 'min-h-tap min-w-tap text-lg',
  lg: 'h-14 w-14 text-2xl',
}

/** Speaker button that reads Romanian aloud, honoring the slow-speed toggle. */
export default function SpeakButton({ text, label, size = 'md' }: SpeakButtonProps) {
  const { t } = useTranslation()
  const { rate } = useLearnPrefs()
  const [active, setActive] = useState(false)

  // Reset the "speaking" state if the component unmounts mid-utterance.
  useEffect(() => () => setActive(false), [])

  if (!isSpeechSupported()) return null

  return (
    <button
      type="button"
      onClick={() =>
        speak(text, {
          rate,
          onStart: () => setActive(true),
          onEnd: () => setActive(false),
        })
      }
      aria-label={label ?? `${t('learn.play')}: ${text}`}
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full text-primary transition-colors',
        'bg-primary/10 hover:bg-primary/20 active:scale-95',
        active ? 'ring-2 ring-primary' : '',
        sizes[size],
      ].join(' ')}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  )
}
