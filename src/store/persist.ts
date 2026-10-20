export const STORAGE_KEYS = {
  seeded: 'lingjing.seeded',
  works: 'lingjing.works',
  sessions: 'lingjing.sessions',
  highlights: 'lingjing.highlights',
  profile: 'lingjing.profile',
  reading: 'lingjing.reading',
} as const

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveState(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function bindPersist<T>(
  key: string,
  subscribe: (listener: (state: T) => void) => () => void,
  select: (state: T) => unknown,
) {
  subscribe((state) => {
    saveState(key, select(state))
  })
}
