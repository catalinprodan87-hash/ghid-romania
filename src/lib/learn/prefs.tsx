import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readStorage, writeStorage } from '../storage'
import { RATE_NORMAL, RATE_SLOW } from '../../services/speech'

// Small preference shared across the lesson player: slower playback for
// learners. Persisted so it sticks between sessions.

const SLOW_KEY = 'speechSlow'

interface LearnPrefs {
  slow: boolean
  toggleSlow: () => void
  /** Playback rate to pass to `speak()`. */
  rate: number
}

const LearnPrefsContext = createContext<LearnPrefs | null>(null)

export function LearnPrefsProvider({ children }: { children: ReactNode }) {
  const [slow, setSlow] = useState<boolean>(() => readStorage(SLOW_KEY) === '1')

  const toggleSlow = useCallback(() => {
    setSlow((prev) => {
      const next = !prev
      writeStorage(SLOW_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const value = useMemo<LearnPrefs>(
    () => ({ slow, toggleSlow, rate: slow ? RATE_SLOW : RATE_NORMAL }),
    [slow, toggleSlow],
  )

  return <LearnPrefsContext.Provider value={value}>{children}</LearnPrefsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLearnPrefs(): LearnPrefs {
  const ctx = useContext(LearnPrefsContext)
  if (!ctx) throw new Error('useLearnPrefs must be used within a LearnPrefsProvider')
  return ctx
}
