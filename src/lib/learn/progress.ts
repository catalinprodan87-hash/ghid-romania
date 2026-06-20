import { useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from '../storage'
import type { Lesson } from './types'

// ---------------------------------------------------------------------------
// Learn progress: completed lessons, XP, daily streak/goal, and a simple
// Leitner spaced-repetition box per vocabulary item. Persisted in localStorage.
// Gentle by design — no guilt mechanics, nothing punitive.
// ---------------------------------------------------------------------------

export const XP_PER_LESSON = 20
export const XP_PER_REVIEW = 3
export const DAILY_GOAL_XP = 30

// Leitner intervals in days, indexed by box (1..5). Box 1 = due again today.
const BOX_INTERVALS = [0, 0, 1, 3, 7, 16]
const MAX_BOX = 5

export interface VocabCard {
  ro: string
  uk: string
  box: number
  /** ISO date (YYYY-MM-DD) this card is next due. */
  due: string
}

export interface ProgressState {
  xp: number
  completedLessons: string[]
  streak: { count: number; lastDay: string }
  daily: { day: string; xp: number }
  vocab: Record<string, VocabCard>
  micPrivacyAck: boolean
}

export interface CompletionSummary {
  xpEarned: number
  reviewAdded: number
}

const STORAGE_KEY = 'learnProgress'

function emptyState(): ProgressState {
  return {
    xp: 0,
    completedLessons: [],
    streak: { count: 0, lastDay: '' },
    daily: { day: '', xp: 0 },
    vocab: {},
    micPrivacyAck: false,
  }
}

// ---- date helpers (local time, date-only) ----
function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}
function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  return todayStr(new Date(y, m - 1, d + days))
}
function isYesterday(iso: string): boolean {
  return iso === addDays(todayStr(), -1)
}

// ---- store ----
function load(): ProgressState {
  const raw = readStorage(STORAGE_KEY)
  if (!raw) return emptyState()
  try {
    return { ...emptyState(), ...(JSON.parse(raw) as ProgressState) }
  } catch {
    return emptyState()
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function setState(updater: (s: ProgressState) => ProgressState): void {
  state = updater(state)
  writeStorage(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** React hook: subscribe to the current progress snapshot. */
export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, () => state)
}

// ---- derived selectors ----
export function dueCards(s: ProgressState = state): VocabCard[] {
  const today = todayStr()
  return Object.values(s.vocab)
    .filter((c) => c.due <= today)
    .sort((a, b) => a.box - b.box)
}

export function dueCount(s: ProgressState = state): number {
  return dueCards(s).length
}

export function isLessonComplete(id: string, s: ProgressState = state): boolean {
  return s.completedLessons.includes(id)
}

// ---- actions ----
function bumpStreakAndDaily(s: ProgressState, xpGain: number): ProgressState {
  const today = todayStr()

  let { count, lastDay } = s.streak
  if (lastDay !== today) {
    count = isYesterday(lastDay) ? count + 1 : 1
    lastDay = today
  }

  const daily =
    s.daily.day === today
      ? { day: today, xp: s.daily.xp + xpGain }
      : { day: today, xp: xpGain }

  return { ...s, streak: { count, lastDay }, daily }
}

export const progressActions = {
  /** Mark a lesson complete: award XP, update streak, queue vocab for review. */
  completeLesson(lesson: Lesson): CompletionSummary {
    const today = todayStr()
    let reviewAdded = 0

    setState((s) => {
      const vocab = { ...s.vocab }
      for (const v of lesson.vocabulary) {
        if (!vocab[v.ro]) reviewAdded += 1
        // New items enter box 1, due today so they appear in Review immediately.
        vocab[v.ro] = vocab[v.ro] ?? { ro: v.ro, uk: v.uk, box: 1, due: today }
      }

      const completedLessons = s.completedLessons.includes(lesson.id)
        ? s.completedLessons
        : [...s.completedLessons, lesson.id]

      const next = bumpStreakAndDaily(
        { ...s, vocab, completedLessons, xp: s.xp + XP_PER_LESSON },
        XP_PER_LESSON,
      )
      return next
    })

    return { xpEarned: XP_PER_LESSON, reviewAdded }
  },

  /** Record a review result and reschedule the card (Leitner). */
  reviewVocab(ro: string, correct: boolean): void {
    setState((s) => {
      const card = s.vocab[ro]
      if (!card) return s
      const box = correct ? Math.min(card.box + 1, MAX_BOX) : 1
      const due = addDays(todayStr(), BOX_INTERVALS[box])
      const updated: VocabCard = { ...card, box, due }
      const gain = correct ? XP_PER_REVIEW : 0
      return bumpStreakAndDaily(
        { ...s, vocab: { ...s.vocab, [ro]: updated }, xp: s.xp + gain },
        gain,
      )
    })
  },

  /** Remember the learner has seen the microphone privacy note. */
  ackMicPrivacy(): void {
    setState((s) => (s.micPrivacyAck ? s : { ...s, micPrivacyAck: true }))
  },
}
