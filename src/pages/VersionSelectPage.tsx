import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from '../components/create/StarIcon'
import { CREATE_SCRIPTS, getScriptById } from '../mock/scripts'
import { useCreateReplayStore } from '../store/createReplayStore'

function ChevronBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 5 L8 12 L15 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.5a1 1 0 0 1 1-1Z"
        stroke="#B8C7A9"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function VersionSelectPage() {
  const navigate = useNavigate()
  const scriptId = useCreateReplayStore((s) => s.scriptId)
  const selectVersion = useCreateReplayStore((s) => s.selectVersion)
  const script = getScriptById(scriptId) ?? CREATE_SCRIPTS[0]
  const [page, setPage] = useState(0)

  const versions = useMemo(
    () => [script.versions[0], script.versions[1]],
    [script],
  )

  if (!scriptId) {
    return (
      <div className="page">
        <p className="page-hint">还没有生成结果，请回到创作页走完回放。</p>
        <button type="button" className="back-btn" onClick={() => navigate('/create')}>
          返回创作
        </button>
      </div>
    )
  }

  return (
    <div className="version-page">
      <header className="version-header">
        <button type="button" className="version-back" onClick={() => navigate('/create')}>
          <ChevronBack />
          <span>继续对话</span>
        </button>
      </header>
      <p className="version-sub">左右滑动对比两个版本</p>
      <div className="version-dots" aria-hidden>
        <i className={page === 0 ? 'on' : ''} />
        <i className={page === 1 ? 'on' : ''} />
      </div>
      <div
        className="version-scroller"
        onScroll={(event) => {
          const slide = event.currentTarget.querySelector('.version-slide')
          const interval = slide ? slide.getBoundingClientRect().width + 16 : event.currentTarget.clientWidth
          const next = Math.round(event.currentTarget.scrollLeft / Math.max(interval, 1))
          setPage(next > 1 ? 1 : next)
        }}
      >
        {versions.map((version, index) => (
          <section key={version.title} className="version-slide">
            <article className="version-card">
              <span className="version-bookmark">
                <BookmarkIcon />
              </span>
              <div className="version-card-head">
                <i className="version-card-line" />
                <h2>{version.title}</h2>
              </div>
              <div className="version-body">
                <div className="version-body-scroll">
                  <p>{version.content}</p>
                </div>
                <div className="version-fade" />
              </div>
            </article>
            <button
              type="button"
              className="pick-version"
              onClick={() => {
                selectVersion(index as 0 | 1)
                navigate('/work-preview')
              }}
            >
              <StarIcon size={13} />
              <span>选这个版本</span>
              <span className="pick-version-arrow">→</span>
            </button>
          </section>
        ))}
      </div>
    </div>
  )
}
