import { useMemo } from 'react'
import { getCollectionCoverSource } from '../collection/CollectionCover'
import type { Collection, Work } from '../../types'
import { WorkCardMenu } from './WorkCardMenu'

function formatDate(timestamp: number) {
  const d = new Date(timestamp)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

interface WorkCardProps {
  work: Work
  collection?: Collection
  onPress: () => void
  onAddToCollection: (work: Work) => void
  onRemoveFromCollection: (work: Work) => void
  onShare: (work: Work) => void
  onDelete: (work: Work) => void
  onBeforeOpenMenu?: () => boolean
}

export function WorkCard({
  work,
  collection,
  onPress,
  onAddToCollection,
  onRemoveFromCollection,
  onShare,
  onDelete,
  onBeforeOpenMenu,
}: WorkCardProps) {
  const menuItems = useMemo(
    () => [
      work.collectionId
        ? { id: 'remove-collection', label: '从当前文集移除' }
        : { id: 'collection', label: '加入文集' },
      { id: 'share', label: '分享' },
      { id: 'delete', label: '删除', destructive: true },
    ],
    [work.collectionId],
  )

  const handleMenuAction = (actionId: string) => {
    switch (actionId) {
      case 'collection':
        onAddToCollection(work)
        break
      case 'remove-collection':
        onRemoveFromCollection(work)
        break
      case 'share':
        onShare(work)
        break
      case 'delete':
        if (window.confirm(`确定删除「${work.title}」？`)) {
          onDelete(work)
        }
        break
      default:
        break
    }
  }

  const coverSource = collection
    ? getCollectionCoverSource(collection.cover_url ?? collection.cover, collection.id)
    : null
  const showFooter = Boolean(work.collectionId && collection)

  return (
    <article className="work-card" onClick={onPress} role="button" tabIndex={0}>
      <div className={`work-card-inner${showFooter ? '' : ' no-footer'}`}>
        <div className="work-card-title-row">
          <h2 className="work-card-title">{work.title}</h2>
          <span className="work-card-date">{formatDate(work.updatedAt)}</span>
          <div className="work-card-menu-wrap" onClick={(e) => e.stopPropagation()}>
            <WorkCardMenu
              items={menuItems}
              onAction={handleMenuAction}
              onBeforeOpen={onBeforeOpenMenu}
            />
          </div>
        </div>
        <p className={`work-card-excerpt${showFooter ? ' with-footer' : ''}`}>{work.excerpt.replace(/[\r\n]+/g, ' ')}</p>
        {showFooter && collection ? (
          <div className="work-card-footer">
            <div className="work-card-cover">{coverSource ? <img src={coverSource} alt="" /> : null}</div>
            <p className="work-card-collection">
              收录于<em>《{collection.name}》</em>
            </p>
          </div>
        ) : null}
      </div>
    </article>
  )
}
