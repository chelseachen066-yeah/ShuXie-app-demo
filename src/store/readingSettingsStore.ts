import { create } from 'zustand'
import { hydrateDemoData, SEED_READING } from '../mock/seed'
import type { ReadingSettingsState } from '../types'
import { bindPersist, loadState, STORAGE_KEYS } from './persist'

hydrateDemoData()

interface ReadingStore extends ReadingSettingsState {
  setColor: (colorKey: ReadingSettingsState['colorKey']) => void
  setTexture: (textureKey: ReadingSettingsState['textureKey']) => void
  setFontSize: (fontSize: number) => void
  setBrightness: (brightness: number) => void
}

const persisted = loadState<ReadingSettingsState>(STORAGE_KEYS.reading, SEED_READING)

export const useReadingSettingsStore = create<ReadingStore>()((set) => ({
  ...SEED_READING,
  ...persisted,
  setColor: (colorKey) => set({ colorKey }),
  setTexture: (textureKey) => set({ textureKey }),
  setFontSize: (fontSize) => set({ fontSize }),
  setBrightness: (brightness) => set({ brightness }),
}))

bindPersist(STORAGE_KEYS.reading, useReadingSettingsStore.subscribe, (state) => ({
  colorKey: state.colorKey,
  textureKey: state.textureKey,
  fontSize: state.fontSize,
  brightness: state.brightness,
}))
