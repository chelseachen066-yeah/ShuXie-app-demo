import { EmptyState } from '../ui/EmptyState'
import { CollectionRow } from './CollectionRow'
import type { Collection } from '../../types'

interface CollectionsPanelProps {
  collections: Collection[]
  workCount: number
  onCreateCollection?: () => void
}

function CollectionsEmptyState({
  workCount,
  onCreateCollection,
}: {
  workCount: number
  onCreateCollection?: () => void
}) {
  return (
    <EmptyState
      icon="books"
      title={workCount === 0 ? '还没有整理成册' : `你已经写下了 ${workCount} 篇故事`}
      ctaText="✦ 创建第一个作品集 →"
      onCta={() => onCreateCollection?.()}
    />
  )
}

export function CollectionsPanel({
  collections,
  workCount,
  onCreateCollection,
}: CollectionsPanelProps) {
  if (collections.length === 0) {
    return <CollectionsEmptyState workCount={workCount} onCreateCollection={onCreateCollection} />
  }

  return (
    <div className="collection-list">
      {collections.map((item, index) => (
        <div key={item.id}>
          {index > 0 ? <div className="collection-sep" /> : null}
          <CollectionRow collection={item} />
        </div>
      ))}
    </div>
  )
}
