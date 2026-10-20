import { create } from 'zustand'
import { hydrateDemoData, SEED_PROFILE } from '../mock/seed'
import type { ProfileState } from '../types'
import { bindPersist, loadState, STORAGE_KEYS } from './persist'

hydrateDemoData()

interface ProfileStore extends ProfileState {
  login: () => void
  logout: () => void
  updateProfile: (updates: Partial<Pick<ProfileState, 'nickname' | 'avatar' | 'bio'>>) => void
}

const persisted = loadState<ProfileState>(STORAGE_KEYS.profile, SEED_PROFILE)

export const useProfileStore = create<ProfileStore>()((set) => ({
  ...persisted,
  isLoggedIn: persisted.isLoggedIn ?? true,
  id: persisted.id || 'demo-user',
  nickname: persisted.nickname || '去码头整点薯条',
  login: () =>
    set({
      isLoggedIn: true,
      id: 'demo-user',
      nickname: '去码头整点薯条',
    }),
  logout: () => set({ isLoggedIn: false }),
  updateProfile: (updates) => set(updates),
}))

bindPersist(STORAGE_KEYS.profile, useProfileStore.subscribe, (state) => ({
  isLoggedIn: state.isLoggedIn,
  id: state.id,
  nickname: state.nickname,
  avatar: state.avatar,
  bio: state.bio,
}))
