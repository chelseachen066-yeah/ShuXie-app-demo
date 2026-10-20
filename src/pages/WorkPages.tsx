import { Link, useParams } from 'react-router-dom'
import { EmptyPage, PageHeader } from '../components/EmptyPage'
import { useWorksStore } from '../store/worksStore'

export function WorkPage() {
  const { id } = useParams()
  const work = useWorksStore((s) => s.works.find((item) => item.id === id))

  if (!work) {
    return <EmptyPage title="作品" hint="未找到该作品。" />
  }

  return (
    <div className="page">
      <PageHeader title={work.title} />
      <p className="page-hint">{work.body}</p>
      <p className="page-hint" style={{ marginTop: 20 }}>
        <Link to={`/work-edit/${work.id}`}>编辑</Link>
        {' · '}
        <Link to={`/work-share-image?id=${work.id}`}>分享图片</Link>
      </p>
    </div>
  )
}

export function WorkEditPage() {
  const { id } = useParams()
  const work = useWorksStore((s) => s.works.find((item) => item.id === id))

  if (!work) {
    return <EmptyPage title="编辑作品" hint="未找到该作品。" />
  }

  return (
    <div className="page">
      <PageHeader title="编辑作品" />
      <p className="page-hint">{work.title} 的编辑能力将在后续迭代接入。</p>
    </div>
  )
}

export function CollectionPage() {
  const { id } = useParams()
  const collection = useWorksStore((s) =>
    s.collections.find((item) => item.id === id),
  )

  if (!collection) {
    return <EmptyPage title="文集" hint="未找到该作品集。" />
  }

  return (
    <div className="page">
      <PageHeader title={collection.name} />
      <p className="page-hint">{collection.desc}</p>
      <p className="page-hint" style={{ marginTop: 16 }}>
        <Link to={`/collection-edit?id=${collection.id}`}>编辑</Link>
        {' · '}
        <Link to={`/collection-reader/${collection.id}`}>开始阅读</Link>
      </p>
    </div>
  )
}

export function CollectionReaderPage() {
  const { id } = useParams()
  const collection = useWorksStore((s) =>
    s.collections.find((item) => item.id === id),
  )

  return (
    <EmptyPage
      title={collection ? `阅读 · ${collection.name}` : '文集阅读'}
      hint="竖排阅读将在后续迭代接入。"
    />
  )
}
