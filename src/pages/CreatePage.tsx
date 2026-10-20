import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionCard } from '../components/create/ActionCard'
import { AssistantMessageRow, UserMessageRow } from '../components/create/ChatMessages'
import { CreateIdleView } from '../components/create/CreateIdleView'
import { CreateTopBar } from '../components/create/CreateTopBar'
import { GeneratingCard } from '../components/create/GeneratingCard'
import { HistoryDrawer } from '../components/create/HistoryDrawer'
import { MessageInputBar } from '../components/create/MessageInputBar'
import { ThinkingDots } from '../components/create/ThinkingDots'
import { VersionReadyCard } from '../components/create/VersionReadyCard'
import { ASSETS } from '../constants'
import { DEMO_REPLAY_TAG, DIRECT_WRITE } from '../mock/scripts'
import { useCreateReplayStore } from '../store/createReplayStore'

type ChatItem = { key: string; role: 'ai' | 'user' | 'system'; node: ReactNode }

/** 距底部不到这个值，认为用户还“贴着底部”，文字增长时继续跟随 */
const NEAR_BOTTOM_PX = 40

export function CreatePage() {
  const navigate = useNavigate()
  const phase = useCreateReplayStore((s) => s.phase)
  const messages = useCreateReplayStore((s) => s.messages)
  const pendingSuggestion = useCreateReplayStore((s) => s.pendingSuggestion)
  const actionCard = useCreateReplayStore((s) => s.actionCard)
  const directDraft = useCreateReplayStore((s) => s.directDraft)
  const startScript = useCreateReplayStore((s) => s.startScript)
  const sendSuggested = useCreateReplayStore((s) => s.sendSuggested)
  const sendFreeText = useCreateReplayStore((s) => s.sendFreeText)
  const confirmActionCard = useCreateReplayStore((s) => s.confirmActionCard)
  const openDirectWrite = useCreateReplayStore((s) => s.openDirectWrite)
  const closeDirectWrite = useCreateReplayStore((s) => s.closeDirectWrite)
  const setDirectDraft = useCreateReplayStore((s) => s.setDirectDraft)
  const submitDirectWrite = useCreateReplayStore((s) => s.submitDirectWrite)
  const resetIdle = useCreateReplayStore((s) => s.resetIdle)
  const resumeSession = useCreateReplayStore((s) => s.resumeSession)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const stickRef = useRef(true)
  const lastSigRef = useRef('')

  const inChat = phase !== 'idle' && phase !== 'direct_sheet'

  const items: ChatItem[] = []
  if (inChat) {
    for (const message of messages) {
      if (message.thinking) {
        items.push({ key: message.id, role: 'ai', node: <ThinkingDots /> })
      } else if (message.role === 'user') {
        items.push({ key: message.id, role: 'user', node: <UserMessageRow content={message.text} /> })
      } else {
        items.push({
          key: message.id,
          role: 'ai',
          node: <AssistantMessageRow content={message.text} />,
        })
      }
    }
    if (phase === 'awaiting_user' && pendingSuggestion) {
      items.push({
        key: 'suggest',
        role: 'user',
        node: (
          <button type="button" className="chat-suggest" onClick={sendSuggested}>
            <span className="chat-suggest-label">建议回复</span>
            <span className="chat-suggest-text">{pendingSuggestion}</span>
          </button>
        ),
      })
    }
    if (phase === 'action' && actionCard) {
      items.push({
        key: 'action',
        role: 'system',
        node: <ActionCard initial={actionCard} onStart={confirmActionCard} />,
      })
    }
    if (phase === 'generating') {
      items.push({ key: 'generating', role: 'system', node: <GeneratingCard /> })
    }
    if (phase === 'selecting') {
      items.push({
        key: 'ready',
        role: 'system',
        node: <VersionReadyCard onViewVersions={() => navigate('/version-select')} />,
      })
    }
  }

  // 新条目出现（消息 / 建议回复 / 卡片）一律滚到底；打字机文字增长时只在贴着底部时跟随
  const sig = items.map((item) => item.key).join('|')
  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    const changed = lastSigRef.current !== sig
    lastSigRef.current = sig
    if (changed || stickRef.current) {
      el.scrollTop = el.scrollHeight
      stickRef.current = true
    }
  }, [messages, sig])

  const handleScroll = () => {
    const el = listRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
  }

  /** 对应 App 的 handleNewSession：对话进行中先确认，其余直接回到空态；空态无消息时什么都不做 */
  const handleNew = () => {
    if (phase === 'idle' && messages.length === 0) return
    if (phase === 'playing' || phase === 'awaiting_user' || phase === 'action') {
      if (window.confirm('开启新对话\n\n当前对话将保存到历史记录')) resetIdle()
      return
    }
    resetIdle()
  }

  const handleResume = (sessionId: string) => {
    setDrawerOpen(false)
    const dest = resumeSession(sessionId)
    if (dest && dest !== 'chat') navigate(dest)
  }

  if (phase === 'direct_sheet') {
    return (
      <div className="create-screen create-direct">
        <header className="create-nav">
          <button type="button" className="back-btn" onClick={closeDirectWrite}>
            取消
          </button>
          <span className="create-nav-title">直接写</span>
          <button
            type="button"
            className="back-btn"
            onClick={submitDirectWrite}
          >
            生成
          </button>
        </header>
        <textarea
          className="direct-draft"
          value={directDraft}
          onChange={(event) => setDirectDraft(event.target.value)}
          placeholder={DIRECT_WRITE.draft}
        />
      </div>
    )
  }

  const drawer = (
    <HistoryDrawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onResume={handleResume}
    />
  )

  if (!inChat) {
    return (
      <div
        className="create-idle-screen"
        style={{ backgroundImage: `url(${ASSETS.createBg})` }}
      >
        <CreateTopBar onHistory={() => setDrawerOpen(true)} onNew={handleNew} />
        <CreateIdleView onPickScript={startScript} onOpenDirect={openDirectWrite} />
        <MessageInputBar onSend={sendFreeText} />
        {drawer}
      </div>
    )
  }

  const inputVisible = phase !== 'generating' && phase !== 'selecting'

  return (
    <div
      className="create-idle-screen"
      style={{ backgroundImage: `url(${ASSETS.createBg})` }}
    >
      <CreateTopBar onHistory={() => setDrawerOpen(true)} onNew={handleNew} />

      <div
        className={`chat-scroll${inputVisible ? '' : ' no-input'}`}
        ref={listRef}
        onScroll={handleScroll}
      >
        <div className="chat-demo-tag">{DEMO_REPLAY_TAG}</div>
        {/* 对应 CreateChatView.renderMessage：首条 0；同角色 8；不同角色 16 */}
        {items.map((item, index) => {
          const prev = items[index - 1]
          const marginTop = index === 0 ? 0 : prev && prev.role === item.role ? 8 : 16
          return (
            <div key={item.key} className="chat-item" style={{ marginTop }}>
              {item.node}
            </div>
          )
        })}
      </div>

      {inputVisible ? (
        <MessageInputBar onSend={sendFreeText} sendDisabled={phase === 'playing'} />
      ) : null}
      {drawer}
    </div>
  )
}
