import { useLayoutEffect, useRef, useState } from 'react'
import { IconArrowUp, IconMicOutline } from './createIcons'

/**
 * 对应 RN components/create/MessageInputBar：绝对定位在 Tab 栏上方 16px。
 * 麦克风本步只显示；发送沿用原有回放逻辑（由 onSend 接管）。
 */
export function MessageInputBar({
  onSend,
  sendDisabled = false,
}: {
  onSend: (text: string) => void
  /** 例如 AI 正在回复时：输入框可以继续编辑，但发送按钮不可用 */
  sendDisabled?: boolean
}) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const trimmed = text.trim()
  const canSend = trimmed.length > 0 && !sendDisabled

  // 对应 TextInput multiline + lineHeight 20 + maxHeight 40
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = '20px'
    const lines = Math.min(2, Math.max(1, Math.round(el.scrollHeight / 20)))
    el.style.height = `${lines * 20}px`
  }, [text])

  const handleSend = () => {
    if (!canSend) return
    onSend(trimmed)
    setText('')
  }

  return (
    <div className="msg-wrapper">
      <div className="msg-outer">
        <div className="msg-shell">
          <textarea
            ref={inputRef}
            className="msg-input"
            rows={1}
            value={text}
            placeholder="跟我说说你的故事..."
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                handleSend()
              }
            }}
          />
          <button type="button" className="msg-mic" aria-label="语音输入">
            <IconMicOutline size={20} style={{ color: '#7A7267' }} />
          </button>
          <button
            type="button"
            className="msg-send"
            aria-label="发送"
            disabled={!canSend}
            onClick={handleSend}
          >
            <IconArrowUp size={18} style={{ color: '#FFFFFF' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
