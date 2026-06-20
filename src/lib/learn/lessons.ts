import courseIndexRaw from '../../content/course-index.json'
import type { CourseIndex, Lesson } from './types'

// The course index is bundled statically — it's tiny and always needed.
export const courseIndex = courseIndexRaw as CourseIndex

// Lesson files are loaded lazily so the player stays light: only the opened
// lesson is fetched. Each file is named `<id>.json`, so we key the loaders by
// basename and don't need to know the level/folder up front.
const lessonModules = import.meta.glob<{ default: Lesson }>(
  '../../content/lessons/**/*.json',
)

const loaderById = new Map<string, () => Promise<{ default: Lesson }>>()
for (const path in lessonModules) {
  const id = path.split('/').pop()!.replace(/\.json$/, '')
  loaderById.set(id, lessonModules[path])
}

const cache = new Map<string, Lesson>()

/** Load a single lesson by id (cached). Returns null for unknown ids. */
export async function loadLesson(id: string): Promise<Lesson | null> {
  if (cache.has(id)) return cache.get(id)!
  const loader = loaderById.get(id)
  if (!loader) return null
  const mod = await loader()
  cache.set(id, mod.default)
  return mod.default
}

/** Flat list of every lesson id known to the course index, in order. */
export function allLessonIds(): string[] {
  return courseIndex.units.flatMap((unit) => unit.lessons.map((l) => l.id))
}
