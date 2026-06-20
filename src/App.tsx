import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Spinner from './components/Spinner'
import { LearnPrefsProvider } from './lib/learn/prefs'

// Lazy-load routes so each screen is a small, separately cached chunk — keeps
// the initial payload light for the low-data audience.
const Home = lazy(() => import('./pages/Home'))
const Section = lazy(() => import('./pages/Section'))
const Search = lazy(() => import('./pages/Search'))
const Settings = lazy(() => import('./pages/Settings'))
const Phrasebook = lazy(() => import('./pages/Phrasebook'))
const Emergency = lazy(() => import('./pages/Emergency'))
const LearnHome = lazy(() => import('./pages/learn/LearnHome'))
const LessonPlayer = lazy(() => import('./pages/learn/LessonPlayer'))
const Review = lazy(() => import('./pages/learn/Review'))

/** Wraps the Learn routes with the slow-speech preference provider. */
function LearnLayout() {
  return (
    <LearnPrefsProvider>
      <Outlet />
    </LearnPrefsProvider>
  )
}

// In production the app is served from /ghid-romania/ (GitHub Pages); BASE_URL
// is '/' in dev. react-router wants the basename without a trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section/:sectionId" element={<Section />} />
          <Route path="/phrasebook" element={<Phrasebook />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />

          {/* Learn Romanian — lesson player, microphone practice, review */}
          <Route element={<LearnLayout />}>
            <Route path="/learn" element={<LearnHome />} />
            <Route path="/learn/lesson/:lessonId" element={<LessonPlayer />} />
            <Route path="/learn/review" element={<Review />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
