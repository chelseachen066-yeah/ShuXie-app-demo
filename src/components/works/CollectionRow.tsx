import { useMemo, useState } from 'react'
import CollectionCover from '../collection/CollectionCover'
import { Toast } from '../ui/Toast'
import { IconChevronRight } from '../icons'
import { useWorksStore } from '../../store/worksStore'
import type { Collection, Work } from '../../types'
import { resolveCollectionWorkIds, resolveCollectionWorks } from '../../utils/collectionWorks'

interface CollectionRowProps {
  collection: Collection
  onPress?: () => void
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}

function resolveCollectionUpdatedAt(collection: Collection, works: Work[]) {
  const workMap = new Map(works.map((work) => [work.id, work.updatedAt]))
  const workIds = resolveCollectionWorkIds(collection.id, collection.works, works)
  return workIds.reduce((max, workId) => Math.max(max, workMap.get(workId) ?? 0), 0)
}

export function CollectionRow({ collection }: CollectionRowProps) {
  const works = useWorksStore((state) => state.works)
  const [toast, setToast] = useState(false)
  const collectionWorks = useMemo(
    () => resolveCollectionWorks(collection.id, collection.works, works),
    [collection.id, collection.works, works],
  )
  const updatedAt = useMemo(
    () => collection.updatedAt || resolveCollectionUpdatedAt(collection, works),
    [collection, works],
  )

  return (
    <div
      className="collection-row"
      role="button"
      tabIndex={0}
      onClick={() => setToast(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') setToast(true)
      }}
    >
      <div className="collection-cover-slot">
        <CollectionCover
          coverUrl={collection.cover_url ?? collection.cover}
          collectionId={collection.id}
          width={64}
        />
      </div>
      <div className="collection-info">
        <p className="collection-name">{collection.name}</p>
        <p className="collection-meta">最近更新 · {formatDate(updatedAt || Date.now())}</p>
        <p className="collection-meta count">收录 {collectionWorks.length} 篇作品</p>
      </div>
      <IconChevronRight size={16} className="collection-chevron" color="#C5BFB4" />
      {toast ? <Toast message="App 版功能" onHide={() => setToast(false)} /> : null}
    </div>
  )
}
