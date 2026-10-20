import { useCallback, useEffect, useState } from 'react'
import CollectionCover from '../collection/CollectionCover'
import { IconAdd, IconCheck, IconClose } from '../icons'
import { PhonePortal } from '../PhonePortal'
import { useWorksStore } from '../../store/worksStore'
import type { Collection, Work } from '../../types'
import { resolveCollectionWorks } from '../../utils/collectionWorks'

interface AddToCollectionSheetProps {
  workId?: string
  currentCollectionId?: string | null
  showRemoveOption?: boolean
  onDismiss?: () => void
  onAssigned?: (collectionId: string) => void
  onRemoved?: () => void
  onCreated?: (name: string, joined: boolean) => void
}

function CollectionPickerRow({
  collection,
  works,
  selected,
  onPress,
  showDivider,
}: {
  collection: Collection
  works: Work[]
  selected: boolean
  onPress: () => void
  showDivider: boolean
}) {
  const workCount = resolveCollectionWorks(collection.id, collection.works, works).length

  return (
    <div>
      <button type="button" className={`picker-row${selected ? ' selected' : ''}`} onClick={onPress}>
        <CollectionCover
          coverUrl={collection.cover_url ?? collection.cover}
          collectionId={collection.id}
          width={48}
        />
        <div className="picker-row-content">
          <p className="picker-row-name">{collection.name}</p>
          {collection.desc ? <p className="picker-row-desc">{collection.desc}</p> : null}
          <p className="picker-row-count">收录 {workCount} 篇作品</p>
        </div>
        <span className={`picker-check${selected ? ' on' : ''}`}>
          {selected ? <IconCheck size={12} strokeWidth={2.5} /> : null}
        </span>
      </button>
      {showDivider && !selected ? <div className="picker-divider" /> : null}
    </div>
  )
}

export function AddToCollectionSheet({
  workId,
  currentCollectionId,
  showRemoveOption = false,
  onDismiss,
  onAssigned,
  onRemoved,
  onCreated,
}: AddToCollectionSheetProps) {
  const collections = useWorksStore((s) => s.collections)
  const works = useWorksStore((s) => s.works)
  const addCollection = useWorksStore((s) => s.addCollection)
  const assignWorkToCollection = useWorksStore((s) => s.assignWorkToCollection)
  const removeWorkFromCollection = useWorksStore((s) => s.removeWorkFromCollection)

  const [view, setView] = useState<'list' | 'create'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(currentCollectionId ?? null)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    setSelectedId(currentCollectionId ?? null)
    setView('list')
    setNewName('')
    setNewDesc('')
  }, [currentCollectionId, workId])

  const handleClose = useCallback(() => {
    onDismiss?.()
  }, [onDismiss])

  const handleConfirm = () => {
    if (!workId || !selectedId) return
    assignWorkToCollection(workId, selectedId)
    onAssigned?.(selectedId)
    handleClose()
  }

  const handleRemove = () => {
    if (!workId || !currentCollectionId) return
    removeWorkFromCollection(workId, currentCollectionId)
    onRemoved?.()
    handleClose()
  }

  const handleCreate = () => {
    if (!newName.trim()) return
    const created = addCollection({
      name: newName.trim(),
      desc: newDesc.trim(),
      works: [],
    })
    if (created && workId) {
      assignWorkToCollection(workId, created.id)
      onAssigned?.(created.id)
    }
    onCreated?.(newName.trim(), Boolean(workId))
    handleClose()
  }

  return (
    <PhonePortal>
      <button type="button" className="sheet-backdrop" aria-label="关闭" onClick={handleClose} />
      <div className="sheet" role="dialog" aria-label="加入作品集">
        {view === 'list' ? (
          <>
            <div className="sheet-header">
              <button type="button" className="sheet-header-btn" onClick={handleClose}>
                取消
              </button>
              <h2 className="sheet-title">加入作品集</h2>
              <button
                type="button"
                className="sheet-header-btn right"
                disabled={!workId || !selectedId}
                onClick={handleConfirm}
              >
                完成
              </button>
            </div>
            <div className="sheet-scroll">
              {collections.map((col, index) => (
                <CollectionPickerRow
                  key={col.id}
                  collection={col}
                  works={works}
                  selected={selectedId === col.id}
                  onPress={() => setSelectedId(col.id)}
                  showDivider={index < collections.length - 1}
                />
              ))}
              <button type="button" className="new-collection-row" onClick={() => setView('create')}>
                <IconAdd size={16} color="#6B6660" />
                新建作品集
              </button>
              {showRemoveOption ? (
                <>
                  <div style={{ height: 0.5, background: 'rgba(90,80,60,0.1)', margin: '8px 0' }} />
                  <button
                    type="button"
                    onClick={handleRemove}
                    style={{
                      padding: '14px 0',
                      width: '100%',
                      border: 0,
                      background: 'transparent',
                      fontFamily: '"LingjingSans", "PingFang SC", system-ui, sans-serif',
                      fontSize: 15,
                      color: '#E8453C',
                      cursor: 'pointer',
                    }}
                  >
                    从当前文集中移除
                  </button>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="sheet-create-header">
              <button type="button" className="sheet-back" onClick={() => setView('list')}>
                返回
              </button>
              <h2 className="sheet-create-title">新建作品集</h2>
              <button type="button" className="sheet-close" onClick={handleClose} aria-label="关闭">
                <IconClose size={20} color="#6B6560" />
              </button>
            </div>
            <div className="sheet-form">
              <input
                className="sheet-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value.slice(0, 20))}
                placeholder="作品集名称"
                maxLength={20}
              />
              <textarea
                className="sheet-input area"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value.slice(0, 100))}
                placeholder="添加简介（选填）"
                maxLength={100}
              />
              <button
                type="button"
                className="sheet-create-btn"
                disabled={!newName.trim()}
                onClick={handleCreate}
              >
                创建作品集
              </button>
            </div>
          </>
        )}
      </div>
    </PhonePortal>
  )
}
