import { create } from 'zustand'
import { hydrateDemoData } from '../mock/seed'
import type { ReaderHighlight } from '../types'
import { bindPersist, loadState, STORAGE_KEYS } from './persist'

hydrateDemoData()

type HighlightPersist = { highlights: ReaderHighlight[] }

interface HighlightState extends HighlightPersist {
  addHighlight: (highlight: ReaderHighlight) => void
  removeHighlight: (id: string) => void
}

const persisted = loadState<HighlightPersist>(STORAGE_KEYS.highlights, {
  highlights: [],
})

export const useHighlightStore = create<HighlightState>()((set, get) => ({
  highlights: persisted.highlights,
  addHighlight: (highlight) => {
    set({ highlights: [...get().highlights, highlight] })
  },
  removeHighlight: (id) => {
    set({ highlights: get().highlights.filter((item) => item.id !== id) })
  },
}))

bindPersist(STORAGE_KEYS.highlights, useHighlightStore.subscribe, (state) => ({
  highlights: state.highlights,
}))
