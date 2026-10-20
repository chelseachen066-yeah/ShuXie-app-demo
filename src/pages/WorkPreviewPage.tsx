import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from '../components/ui/Toast'
import { useCreateReplayStore } from '../store/createReplayStore'
import { useWorksStore } from '../store/worksStore'

function countWords(text: string) {
  return text.replace(/\s/g, '').length
}

export function WorkPreviewPage() {
  const navigate = useNavigate()
  const previewTitle = useCreateReplayStore((s) => s.previewTitle)
  const previewBody = useCreateReplayStore((s) => s.previewBody)
  const sessionId = useCreateReplayStore((s) => s.sessionId)
  const scriptId = useCreateReplayStore((s) => s.scriptId)
  const updatePreview = useCreateReplayStore((s) => s.updatePreview)
  const resetIdle = useCreateReplayStore((s) => s.resetIdle)
  const markCompleted = useCreateReplayStore((s) => s.markCompleted)
  const addWork = useWorksStore((s) => s.addWork)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!scriptId || !previewTitle) {
    return (
      <div className="page">
        <p className="page-hint">还没有选中版本。</p>
        <button type="button" className="back-btn" onClick={() => navigate('/create')}>
          返回创作
        </button>
      </div>
    )
  }

  const save = () => {
    addWork({
      title: previewTitle.trim() || '未命名',
      body: previewBody,
      tags: [{ id: `genre-${Date.now()}`, label: '散文', type: 'genre' }],
    })
    if (sessionId) markCompleted()
    setSaved(true)
    window.setTimeout(() => {
      resetIdle()
      navigate('/', { replace: true })
    }, 1200)
  }

  return (
    <div className="preview-page">
      <header className="preview-header">
        <button type="button" className="preview-header-btn" onClick={() => navigate(-1)}>
          取消
        </button>
        <span className="preview-header-title">作品预览</span>
        {editing ? (
          <button type="button" className="preview-header-btn" onClick={() => setEditing(false)}>
            完成
          </button>
        ) : (
          <span className="preview-actions">
            <button type="button" className="preview-header-btn" onClick={() => setEditing(true)}>
              编辑
            </button>
            <button type="button" className="preview-header-btn" onClick={save}>
              保存
            </button>
          </span>
        )}
      </header>

      <div className="preview-scroll">
        <div className="preview-title-section">
          {editing ? (
            <input
              className="preview-title-input"
              value={previewTitle}
              onChange={(event) => updatePreview(event.target.value, previewBody)}
            />
          ) : (
            <h1 className="preview-title">{previewTitle}</h1>
          )}
          <p className="preview-count">全文 {countWords(previewBody)} 字</p>
          <div className="preview-divider" />
        </div>
        {editing ? (
          <textarea
            className="preview-body-input"
            value={previewBody}
            onChange={(event) => updatePreview(previewTitle, event.target.value)}
          />
        ) : (
          <p className="preview-body">{previewBody}</p>
        )}
        <div className="preview-end">
          <div className="preview-end-line" />
          <span>全文完</span>
        </div>
      </div>
      {saved ? <Toast message="已保存" onHide={() => setSaved(false)} /> : null}
    </div>
  )
}
