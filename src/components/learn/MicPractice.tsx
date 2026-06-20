import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLearnPrefs } from '../../lib/learn/prefs'
import { progressActions, useProgress } from '../../lib/learn/progress'
import { scoreTier, type ScoreTier } from '../../lib/learn/scoring'
import {
  getCapabilities,
  recognizeOnce,
  startRecording,
  type RecognitionHandle,
  type RecorderHandle,
} from '../../services/recognition'
import { speak } from '../../services/speech'
import SpeakButton from './SpeakButton'

interface MicPracticeProps {
  /** The Romanian phrase the learner should say. */
  target: string
  /** Optional Ukrainian pronunciation tips. */
  tips?: string
  /** Called when the learner finishes an attempt and continues. */
  onComplete: (correct: boolean) => void
}

type Phase = 'idle' | 'busy' | 'done'

const caps = getCapabilities()
const mode: 'stt' | 'record' | 'none' = caps.stt ? 'stt' : caps.recorder ? 'record' : 'none'

const tierStyle: Record<ScoreTier, string> = {
  great: 'bg-success/10 text-success ring-success/30',
  close: 'bg-warning/10 text-warning ring-warning/30',
  tryAgain: 'bg-bg text-text-muted ring-black/10',
}

/**
 * Speaking practice. Uses live speech recognition where available and falls
 * back to record-and-listen (the learner replays their attempt against the
 * model and self-marks). Audio never leaves the device.
 */
export default function MicPractice({ target, tips, onComplete }: MicPracticeProps) {
  const { t } = useTranslation()
  const { rate } = useLearnPrefs()
  const progress = useProgress()

  const [phase, setPhase] = useState<Phase>('idle')
  const [transcript, setTranscript] = useState('')
  const [tier, setTier] = useState<ScoreTier | null>(null)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const [denied, setDenied] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const sttRef = useRef<RecognitionHandle | null>(null)
  const recRef = useRef<RecorderHandle | null>(null)

  const reset = () => {
    setTranscript('')
    setTier(null)
    setRecordedUrl(null)
    setDenied(false)
  }

  // Gate the first microphone use behind a one-time privacy note.
  const requireConsent = (proceed: () => void) => {
    if (!progress.micPrivacyAck) {
      setShowPrivacy(true)
      return
    }
    proceed()
  }

  // ---- live recognition ----
  const startStt = () => {
    reset()
    setPhase('busy')
    sttRef.current = recognizeOnce({
      lang: 'ro-RO',
      onResult: (text) => {
        setTranscript(text)
        setTier(text.trim() ? scoreTier(target, text) : 'tryAgain')
      },
      onError: (err) => {
        // Permission denial gets its own message; every other error (no-speech,
        // network, engine hiccup) just invites an encouraging retry.
        if (err === 'not-allowed') setDenied(true)
        else setTier('tryAgain')
        setPhase('done')
      },
      onEnd: () => setPhase('done'),
    })
  }

  // ---- record-and-listen fallback ----
  const toggleRecord = async () => {
    if (phase === 'busy') {
      const url = await recRef.current?.stop()
      recRef.current = null
      if (url) setRecordedUrl(url)
      setPhase('done')
      return
    }
    reset()
    try {
      recRef.current = await startRecording()
      setPhase('busy')
    } catch {
      setDenied(true)
      setPhase('done')
    }
  }

  const onMicTap = () => requireConsent(mode === 'stt' ? startStt : toggleRecord)

  const ackPrivacy = () => {
    progressActions.ackMicPrivacy()
    setShowPrivacy(false)
    if (mode === 'stt') startStt()
    else void toggleRecord()
  }

  const playYours = () => {
    if (recordedUrl) void new Audio(recordedUrl).play()
  }

  // ---------------------------------------------------------------- privacy
  if (showPrivacy) {
    return (
      <div className="rounded-lg bg-surface p-4 shadow-sm ring-1 ring-primary/20">
        <p className="flex items-center gap-2 text-base font-semibold text-text">
          <span aria-hidden="true">🔒</span>
          {t('learn.privacyTitle')}
        </p>
        <p className="mt-2 text-sm text-text-muted">{t('learn.privacyBody')}</p>
        <button
          type="button"
          onClick={ackPrivacy}
          className="mt-3 min-h-tap w-full rounded-md bg-primary px-4 font-semibold text-white"
        >
          {t('learn.privacyOk')}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Model phrase + listen */}
      <div className="flex items-center gap-3 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
        <SpeakButton text={target} size="lg" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('learn.speakPrompt')}
          </p>
          <p className="text-lg font-bold text-text">{target}</p>
        </div>
      </div>

      {tips ? (
        <p className="rounded-md bg-accent/15 p-3 text-sm text-text">
          <span className="font-semibold">{t('learn.tips')}: </span>
          {tips}
        </p>
      ) : null}

      {/* Capability notices */}
      {mode === 'record' && phase === 'idle' && (
        <p className="text-sm text-text-muted">{t('learn.micUnsupported')}</p>
      )}
      {mode === 'none' && (
        <p className="text-sm text-text-muted">{t('learn.micUnsupportedNeither')}</p>
      )}
      {denied && <p className="text-sm font-semibold text-danger">{t('learn.micDenied')}</p>}

      {/* Primary action */}
      {mode !== 'none' && (
        <button
          type="button"
          onClick={onMicTap}
          className={[
            'flex min-h-tap items-center justify-center gap-2 rounded-full px-5 py-3 text-lg font-bold text-white',
            phase === 'busy' ? 'bg-danger animate-pulse' : 'bg-primary',
          ].join(' ')}
        >
          <span aria-hidden="true">🎤</span>
          {phase === 'busy'
            ? mode === 'stt'
              ? t('learn.micListening')
              : t('learn.stop')
            : mode === 'stt'
              ? t('learn.mic')
              : t('learn.record')}
        </button>
      )}

      {/* Live recognition result */}
      {mode === 'stt' && phase === 'done' && tier && (
        <div className={`rounded-lg p-4 text-center ring-1 ${tierStyle[tier]}`}>
          <p className="text-lg font-bold">{t(`learn.feedback${capitalize(tier)}`)}</p>
          {transcript ? (
            <p className="mt-1 text-sm">
              {t('learn.heardYou')} <span className="font-semibold">“{transcript}”</span>
            </p>
          ) : null}
        </div>
      )}

      {/* Record-and-listen self-marking */}
      {recordedUrl && phase === 'done' && (
        <div className="flex flex-col gap-2 rounded-lg bg-surface p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={playYours}
              className="min-h-tap flex-1 rounded-md bg-primary/10 px-3 font-semibold text-primary"
            >
              ▶︎ {t('learn.playYours')}
            </button>
            <button
              type="button"
              onClick={() => speak(target, { rate })}
              className="min-h-tap flex-1 rounded-md bg-primary/10 px-3 font-semibold text-primary"
            >
              🔊 {t('learn.playModel')}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onComplete(true)}
              className="min-h-tap flex-1 rounded-md bg-success px-3 font-semibold text-white"
            >
              {t('learn.selfGood')}
            </button>
            <button
              type="button"
              onClick={() => {
                reset()
                setPhase('idle')
              }}
              className="min-h-tap flex-1 rounded-md bg-bg px-3 font-semibold text-text ring-1 ring-black/10"
            >
              {t('learn.selfRetry')}
            </button>
          </div>
        </div>
      )}

      {/* Continue / retry for STT and the "none" fallback */}
      {(mode === 'none' || (mode === 'stt' && phase === 'done')) && (
        <div className="flex gap-2">
          {mode === 'stt' && tier !== 'great' && phase === 'done' && (
            <button
              type="button"
              onClick={startStt}
              className="min-h-tap flex-1 rounded-md bg-bg px-4 font-semibold text-text ring-1 ring-black/10"
            >
              {t('learn.retry')}
            </button>
          )}
          <button
            type="button"
            onClick={() => onComplete(mode === 'stt' ? tier !== 'tryAgain' : true)}
            className="min-h-tap flex-1 rounded-md bg-primary px-4 font-semibold text-white"
          >
            {t('learn.next')}
          </button>
        </div>
      )}
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
