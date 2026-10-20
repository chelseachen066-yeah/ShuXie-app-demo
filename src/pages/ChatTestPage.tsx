import { useSearchParams } from 'react-router-dom'
import { ActionCard } from '../components/create/ActionCard'
import { AssistantMessageRow, UserMessageRow } from '../components/create/ChatMessages'
import { CreateTopBar } from '../components/create/CreateTopBar'
import { MessageInputBar } from '../components/create/MessageInputBar'
import { VersionReadyCard } from '../components/create/VersionReadyCard'
import { ASSETS } from '../constants'
import { CREATE_SCRIPTS, DEMO_REPLAY_TAG, getScriptById } from '../mock/scripts'

/**
 * 临时测试路由 #/chat-test（?id=script-cat 切换剧本）：
 * 一次性静态渲染「灵感卡文案(首条用户消息) → 剧本全部消息 → 静态 ActionCard → 版本已就绪卡」。
 * 只用于对照截图，之后会删除。
 */
export function ChatTestPage() {
  const [params] = useSearchParams()
  const script = getScriptById(params.get('id')) ?? CREATE_SCRIPTS[0]

  // 对应 CreateChatView.renderMessage：首条 0；同角色 8；不同角色 16
  const items: { key: string; role: 'ai' | 'user' | 'system'; node: React.ReactNode }[] = [
    { key: 'prompt', role: 'user', node: <UserMessageRow content={script.prompt} /> },
    ...script.turns.map((turn, index) => ({
      key: `m-${index}`,
      role: turn.role,
      node:
        turn.role === 'user' ? (
          <UserMessageRow content={turn.text} />
        ) : (
          <AssistantMessageRow content={turn.text} />
        ),
    })),
    {
      key: 'action',
      role: 'system' as const,
      node: <ActionCard initial={script.actionCard} onStart={() => {}} />,
    },
    { key: 'ready', role: 'system' as const, node: <VersionReadyCard /> },
  ]

  return (
    <div
      className="create-idle-screen"
      style={{ backgroundImage: `url(${ASSETS.createBg})` }}
    >
      <CreateTopBar />
      <div className="chat-scroll">
        <div className="chat-demo-tag">{DEMO_REPLAY_TAG}</div>
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
      <MessageInputBar onSend={() => {}} />
    </div>
  )
}
