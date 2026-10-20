import { useState } from 'react'
import { useProfileStore } from '../../store/profileStore'

/** 对应 RN ChatMessageItem 里的 AiAvatar：32×32 绿色圆，SemiBold "L" */
function AiAvatar() {
  return (
    <div className="chat-ai-avatar">
      <span>L</span>
    </div>
  )
}

/** 演示用户头像：优先用 public/avatar.jpg（或资料里的头像），加载失败回落到「演」字兜底 */
const DEMO_AVATAR = `${import.meta.env.BASE_URL}avatar.jpg`

function UserAvatar() {
  const avatar = useProfileStore((state) => state.avatar)
  const nickname = useProfileStore((state) => state.nickname)
  const [failed, setFailed] = useState(false)
  const src = avatar ?? DEMO_AVATAR

  return (
    <div className="chat-user-avatar">
      {!failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} />
      ) : (
        <span>{nickname?.[0] ?? '我'}</span>
      )}
    </div>
  )
}

/** 对应 AiTypewriterBubble：按空行拆段 */
function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function AssistantMessageRow({ content }: { content: string }) {
  return (
    <div className="chat-assistant-row">
      <AiAvatar />
      <div className="chat-assistant-content">
        <div className="chat-ai-bubble">
          <div className="chat-ai-paragraphs">
            {splitParagraphs(content).map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 8)}`} className="chat-ai-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function UserMessageRow({ content }: { content: string }) {
  return (
    <div className="chat-user-row">
      <div className="chat-user-bubble">
        <p className="chat-user-text">{content}</p>
      </div>
      <UserAvatar />
    </div>
  )
}
