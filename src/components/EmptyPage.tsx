import { useNavigate } from 'react-router-dom'

export function PageHeader({
  title,
  back = true,
}: {
  title: string
  back?: boolean
}) {
  const navigate = useNavigate()

  return (
    <div className="page-header">
      {back ? (
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          返回
        </button>
      ) : null}
      <h1 className="page-title">{title}</h1>
    </div>
  )
}

export function EmptyPage({
  title,
  hint = '功能将在后续迭代中接入。',
  back = true,
}: {
  title: string
  hint?: string
  back?: boolean
}) {
  return (
    <div className="page">
      <PageHeader title={title} back={back} />
      <p className="page-hint">{hint}</p>
    </div>
  )
}
