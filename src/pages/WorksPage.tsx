import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddToCollectionSheet } from '../components/works/AddToCollectionSheet'
import { CollectionsPanel } from '../components/works/CollectionsPanel'
import { HeroHeader } from '../components/works/HeroHeader'
import { SearchOverlay } from '../components/works/SearchOverlay'
import { WorkCard } from '../components/works/WorkCard'
import { WorksSearchBar } from '../components/works/WorksSearchBar'
import { WorksTabBar, type WorksTabKey } from '../components/works/WorksTabBar'
import { EmptyState } from '../components/ui/EmptyState'
import { Toast } from '../components/ui/Toast'
import { useProfileStore } from '../store/profileStore'
import { useWorksStore } from '../store/worksStore'
import type { Work } from '../types'

export function WorksPage() {
  const navigate = useNavigate()
  const isLoggedIn = useProfileStore((state) => state.isLoggedIn)
  const works = useWorksStore((state) => state.works)
  const collections = useWorksStore((state) => state.collections)
  const deleteWork = useWorksStore((state) => state.deleteWork)
  const removeWorkFromCollection = useWorksStore((state) => state.removeWorkFromCollection)

  const [collectionSheetWorkId, setCollectionSheetWorkId] = useState<string | null>(null)
  const [collectionSheetVisible, setCollectionSheetVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<WorksTabKey>('works')
  const [searchVisible, setSearchVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const sortedWorks = useMemo(
    () => [...works].sort((a, b) => b.updatedAt - a.updatedAt),
    [works],
  )
  const collectionMap = useMemo(
    () => new Map(collections.map((collection) => [collection.id, collection])),
    [collections],
  )

  const showToast = useCallback((message: string) => setToastMessage(message), [])
  const openCollectionSheet = useCallback((workId: string) => {
    setCollectionSheetWorkId(workId)
    setCollectionSheetVisible(true)
  }, [])

  const handleWorkPress = useCallback((work: Work) => {
    setSearchVisible(false)
    void work
    showToast('App 版功能')
  }, [showToast])

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (!isLoggedIn) {
        navigate('/auth')
        return false
      }
      action?.()
      return true
    },
    [isLoggedIn, navigate],
  )

  const handleRemoveFromCollection = useCallback(
    (work: Work) => {
      if (!work.collectionId) return
      removeWorkFromCollection(work.id, work.collectionId)
      showToast('已从文集中移除')
    },
    [removeWorkFromCollection, showToast],
  )

  const menuHandlers = {
    onAddToCollection: (work: Work) => requireAuth(() => openCollectionSheet(work.id)),
    onRemoveFromCollection: (work: Work) =>
      requireAuth(() => {
        handleRemoveFromCollection(work)
      }),
    onShare: (work: Work) => requireAuth(() => window.alert(`分享「${work.title}」`)),
    onDelete: (work: Work) =>
      requireAuth(() => {
        deleteWork(work.id)
        window.alert(`「${work.title}」已删除`)
      }),
  }

  return (
    <div className="works-root">
      <div>
        <HeroHeader />
        <WorksSearchBar onPress={() => requireAuth(() => setSearchVisible(true))} />
        <WorksTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="works-list">
        {activeTab === 'collections' ? (
          isLoggedIn ? (
            <CollectionsPanel
              collections={collections}
              workCount={works.length}
              onCreateCollection={() => navigate('/collection-edit')}
            />
          ) : (
            <EmptyState
              icon="books"
              title="登录后开始整理你的作品"
              ctaText="✦ 登录 / 注册 →"
              onCta={() => navigate('/auth')}
            />
          )
        ) : !isLoggedIn ? (
          <EmptyState
            icon="feather"
            title="登录后开始你的创作"
            ctaText="✦ 登录 / 注册 →"
            onCta={() => navigate('/auth')}
          />
        ) : works.length === 0 ? (
          <EmptyState
            icon="feather"
            title="还没有写下任何故事"
            ctaText="✦ 开始我的第一篇创作 →"
            onCta={() => navigate('/create')}
          />
        ) : (
          sortedWorks.map((item) => (
            <WorkCard
              key={item.id}
              work={item}
              collection={item.collectionId ? collectionMap.get(item.collectionId) : undefined}
              onPress={() => requireAuth(() => handleWorkPress(item))}
              onBeforeOpenMenu={() => requireAuth()}
              {...menuHandlers}
            />
          ))
        )}
      </div>

      <SearchOverlay
        visible={searchVisible}
        works={works}
        collections={collections}
        onClose={() => setSearchVisible(false)}
        onWorkPress={(work) => requireAuth(() => handleWorkPress(work))}
        workMenuHandlers={menuHandlers}
      />

      {collectionSheetVisible ? (
        <AddToCollectionSheet
          workId={collectionSheetWorkId ?? ''}
          currentCollectionId={
            collectionSheetWorkId
              ? (works.find((item) => item.id === collectionSheetWorkId)?.collectionId ?? null)
              : null
          }
          showRemoveOption={false}
          onDismiss={() => setCollectionSheetVisible(false)}
          onAssigned={() => showToast('已保存到文集')}
          onRemoved={() => showToast('已从文集中移除')}
          onCreated={(name, joined) =>
            setToastMessage(joined ? `已创建并加入「${name}」` : `已创建「${name}」`)
          }
        />
      ) : null}

      {toastMessage ? (
        <Toast key={toastMessage} message={toastMessage} onHide={() => setToastMessage(null)} />
      ) : null}
    </div>
  )
}
