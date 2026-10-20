import { useMemo, useRef } from 'react'
import { useSessionStore } from '../../store/sessionStore'
import type { HistorySession } from '../../types'
import { formatDate } from '../../utils/formatDate'
import { IconChatbubbleOutline, IconCloseOutline } from './createIcons'

const LONG_PRESS_MS = 500

function SessionRow({
  session,
  onPress,
}: {
  session: HistorySession
  onPress: () => void
}) {
  const removeSession = useSessionStore((s) => s.removeSession)
  const timerRef = useRef<number | null>(null)
  const longPressedRef = useRef(false)
  const userMessageCount = session.messages.filter((m) => m.role === 'user').length
  const inProgress = session.status === 'in_progress'

  const confirmDelete = () => {
    longPressedRef.current = true
    // 对应 App 的 Alert.alert('删除对话', …)；Demo 里的其它确认框也用浏览器原生 confirm
    if (window.confirm('删除对话\n\n删除后无法恢复，确认删除这条对话记录吗？')) {
      removeSession(session.id)
    }
  }

  const cancelTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <button
      type="button"
      className="history-row"
      onPointerDown={() => {
        longPressedRef.current = false
        cancelTimer()
        timerRef.current = window.setTimeout(confirmDelete, LONG_PRESS_MS)
      }}
      onPointerUp={cancelTimer}
      onPointerLeave={cancelTimer}
      onPointerCancel={cancelTimer}
      onContextMenu={(event) => {
        event.preventDefault()
        cancelTimer()
        confirmDelete()
      }}
      onClick={() => {
        if (longPressedRef.current) {
          longPressedRef.current = false
          return
        }
        onPress()
      }}
    >
      <span className="history-row-top">
        <span className={`history-badge ${inProgress ? 'in-progress' : 'completed'}`}>
          {inProgress ? '进行中' : '已完成'}
        </span>
        <span className="history-date">{formatDate(session.updatedAt)}</span>
      </span>
      <span className="history-summary">{session.firstMessage}</span>
      <span className="history-meta">{`共 ${userMessageCount} 条素材`}</span>
    </button>
  )
}

type Props = {
  open: boolean
  onClose: () => void
  onResume: (sessionId: string) => void
}

/** 历史对话抽屉（对应 App 的 HistoryDrawerContent + create.tsx 里的抽屉容器） */
export function HistoryDrawer({ open, onClose, onResume }: Props) {
  const history = useSessionStore((s) => s.history)
  const sorted = useMemo(
    () => [...history].sort((a, b) => b.updatedAt - a.updatedAt),
    [history],
  )

  return (
    <>
      <div
        className={`history-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden
      />
      <aside className={`history-panel${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="history-header">
          <span className="history-title">历史对话</span>
          <button type="button" className="history-close" aria-label="关闭" onClick={onClose}>
            <IconCloseOutline size={24} />
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="history-empty">
            <IconChatbubbleOutline size={36} />
            <span>还没有历史对话</span>
          </div>
        ) : (
          <div className="history-list">
            {sorted.map((session, index) => (
              <div key={session.id}>
                {index > 0 ? <div className="history-sep" /> : null}
                <SessionRow session={session} onPress={() => onResume(session.id)} />
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  )
}
