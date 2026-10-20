import { create } from 'zustand'
import { excerptOf } from '../constants'
import { hydrateDemoData, SEED_COLLECTIONS, SEED_WORKS } from '../mock/seed'
import type { Collection, Work } from '../types'
import { bindPersist, loadState, STORAGE_KEYS } from './persist'

hydrateDemoData()

type WorksPersist = {
  works: Work[]
  collections: Collection[]
}

interface WorksState extends WorksPersist {
  addWork: (work: Omit<Work, 'id' | 'excerpt' | 'updatedAt'> & { id?: string }) => Work
  updateWork: (id: string, updates: Partial<Omit<Work, 'id'>>) => void
  deleteWork: (id: string) => void
  addCollection: (collection: Omit<Collection, 'id'> & { id?: string }) => Collection
  updateCollection: (id: string, updates: Partial<Omit<Collection, 'id'>>) => void
  deleteCollection: (id: string) => void
  assignWorkToCollection: (workId: string, collectionId: string | undefined) => void
  removeWorkFromCollection: (workId: string, collectionId: string) => void
}

const persisted = loadState<WorksPersist>(STORAGE_KEYS.works, {
  works: SEED_WORKS,
  collections: SEED_COLLECTIONS,
})

export const useWorksStore = create<WorksState>()((set, get) => ({
  works: persisted.works,
  collections: persisted.collections,

  addWork: (input) => {
    const work: Work = {
      id: input.id ?? `work-${Date.now()}`,
      title: input.title,
      body: input.body,
      excerpt: excerptOf(input.body),
      tags: input.tags,
      collectionId: input.collectionId,
      updatedAt: Date.now(),
    }
    set({ works: [work, ...get().works] })
    return work
  },

  updateWork: (id, updates) => {
    set({
      works: get().works.map((work) => {
        if (work.id !== id) return work
        const next = { ...work, ...updates, updatedAt: Date.now() }
        if (updates.body !== undefined) {
          next.excerpt = excerptOf(updates.body)
        }
        return next
      }),
    })
  },

  deleteWork: (id) => {
    set({
      works: get().works.filter((work) => work.id !== id),
      collections: get().collections.map((collection) => ({
        ...collection,
        works: collection.works.filter((workId) => workId !== id),
      })),
    })
  },

  addCollection: (input) => {
    const collection: Collection = {
      id: input.id ?? `col-${Date.now()}`,
      name: input.name,
      desc: input.desc,
      cover: input.cover,
      cover_url: input.cover_url,
      works: input.works ?? [],
      tags: input.tags,
    }
    set({ collections: [collection, ...get().collections] })
    return collection
  },

  updateCollection: (id, updates) => {
    set({
      collections: get().collections.map((collection) =>
        collection.id === id ? { ...collection, ...updates } : collection,
      ),
    })
  },

  deleteCollection: (id) => {
    set({
      collections: get().collections.filter((collection) => collection.id !== id),
      works: get().works.map((work) =>
        work.collectionId === id ? { ...work, collectionId: undefined } : work,
      ),
    })
  },

  assignWorkToCollection: (workId, collectionId) => {
    set({
      works: get().works.map((work) =>
        work.id === workId ? { ...work, collectionId, updatedAt: Date.now() } : work,
      ),
      collections: get().collections.map((collection) => {
        const without = collection.works.filter((id) => id !== workId)
        if (collection.id === collectionId) {
          return { ...collection, works: [...without, workId] }
        }
        return { ...collection, works: without }
      }),
    })
  },

  removeWorkFromCollection: (workId, collectionId) => {
    set({
      works: get().works.map((work) =>
        work.id === workId && work.collectionId === collectionId
          ? { ...work, collectionId: undefined, updatedAt: Date.now() }
          : work,
      ),
      collections: get().collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, works: collection.works.filter((id) => id !== workId) }
          : collection,
      ),
    })
  },
}))

bindPersist(STORAGE_KEYS.works, useWorksStore.subscribe, (state) => ({
  works: state.works,
  collections: state.collections,
}))
