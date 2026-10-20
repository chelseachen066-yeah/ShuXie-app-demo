import { WorkCard } from './WorkCard'
import { WORKS_LAYOUT, buildMasonryColumns, getWorkCardWidth } from './masonry'
import type { Collection, Work } from '../../types'

export interface WorkMenuHandlers {
  onAddToCollection: (work: Work) => void
  onRemoveFromCollection: (work: Work) => void
  onShare: (work: Work) => void
  onDelete: (work: Work) => void
}

interface WorksMasonryGridProps {
  works: Work[]
  collections: Collection[]
  onWorkPress: (work: Work) => void
  workMenuHandlers: WorkMenuHandlers
  width: number
}

export function WorksMasonryGrid({
  works,
  collections,
  onWorkPress,
  workMenuHandlers,
  width,
}: WorksMasonryGridProps) {
  const cardWidth = getWorkCardWidth(width)
  const columns = buildMasonryColumns(works, WORKS_LAYOUT.rowGap)
  const collectionMap = new Map(collections.map((collection) => [collection.id, collection]))

  const renderColumn = (columnWorks: Work[]) => (
    <div className="masonry-col" style={{ width: cardWidth }}>
      {columnWorks.map((work) => (
        <WorkCard
          key={work.id}
          work={work}
          collection={work.collectionId ? collectionMap.get(work.collectionId) : undefined}
          onPress={() => onWorkPress(work)}
          onAddToCollection={workMenuHandlers.onAddToCollection}
          onRemoveFromCollection={workMenuHandlers.onRemoveFromCollection}
          onShare={workMenuHandlers.onShare}
          onDelete={workMenuHandlers.onDelete}
        />
      ))}
    </div>
  )

  return (
    <div className="masonry-grid">
      {renderColumn(columns.left)}
      {renderColumn(columns.right)}
    </div>
  )
}
