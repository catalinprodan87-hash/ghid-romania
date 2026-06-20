import { useTranslation } from 'react-i18next'
import { isSpeechSupported, speak } from '../../services/speech'

interface PlayButtonProps {
  /** Romanian text to speak (lang ro-RO). */
  text: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'min-h-tap min-w-tap text-base',
  md: 'min-h-tap min-w-tap text-lg',
  lg: 'h-14 w-14 text-2xl',
}

/**
 * Standalone speaker button (not tied to the lesson player). Renders nothing
 * when TTS is unavailable — callers always keep the Cyrillic pron as the
 * offline fallback, so the card still works without it.
 */
export default function PlayButton({ text, label, size = 'md' }: PlayButtonProps) {
  const { t } = useTranslation()
  if (!isSpeechSupported()) return null

  return (
    <button
      type="button"
      onClick={() => speak(text, { rate: 1, lang: 'ro-RO' })}
      aria-label={label ?? `${t('content.listen')}: ${text}`}
      className={[
        'inline-flex shrink-0 items-center justify-center rounded-full text-primary',
        'bg-primary/10 hover:bg-primary/20 active:scale-95 transition-colors',
        sizes[size],
      ].join(' ')}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  )
}
