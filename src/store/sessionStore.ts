import { create } from 'zustand'
import { hydrateDemoData } from '../mock/seed'
import type { HistorySession } from '../types'
import { bindPersist, loadState, STORAGE_KEYS } from './persist'

hydrateDemoData()

type SessionPersist = { history: HistorySession[] }

interface SessionState extends SessionPersist {
  upsertSession: (session: HistorySession) => void
  removeSession: (id: string) => void
}

const persisted = loadState<SessionPersist>(STORAGE_KEYS.sessions, { history: [] })

export const useSessionStore = create<SessionState>()((set, get) => ({
  history: persisted.history,
  upsertSession: (session) => {
    const rest = get().history.filter((item) => item.id !== session.id)
    set({ history: [session, ...rest] })
  },
  removeSession: (id) => {
    set({ history: get().history.filter((item) => item.id !== id) })
  },
}))

bindPersist(STORAGE_KEYS.sessions, useSessionStore.subscribe, (state) => ({
  history: state.history,
}))
