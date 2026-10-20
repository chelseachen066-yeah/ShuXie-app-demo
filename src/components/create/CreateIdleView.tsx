import { useState } from 'react'
import { CREATE_SCRIPTS } from '../../mock/scripts'
import { ContinueCard } from './ContinueCard'
import { InspirationCard, type InspirationItem } from './InspirationCard'

/** 对应 RN getRandomInspirations：固定 3 条，只换顺序；每条仍绑定自己的回放剧本 */
function getRandomInspirations(): InspirationItem[] {
  const pool = CREATE_SCRIPTS.map((script) => ({ id: script.id, text: script.prompt }))
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
}

/** 截图里的演示文案；后续绑定到对应剧本的第一句用户消息（见 TODO.md） */
const CONTINUE_PREVIEW = '我小学中学的时候写作文，特别喜…'

export function CreateIdleView({
  onPickScript,
  onOpenDirect,
}: {
  onPickScript: (scriptId: string) => void
  onOpenDirect: () => void
}) {
  const [inspirations, setInspirations] = useState(getRandomInspirations)

  return (
    <div className="idle-scroll">
      <div className="idle-hero">
        <h1 className="idle-hero-title">今天，想写些什么？</h1>
        <p className="idle-hero-subtitle">一段记忆，一个瞬间，都可以成为故事</p>
      </div>

      <div className="idle-host">
        <InspirationCard
          prompts={inspirations}
          onPick={onPickScript}
          onRefresh={() => setInspirations(getRandomInspirations())}
        />
      </div>

      <div className="idle-host idle-host-continue">
        <ContinueCard previewText={CONTINUE_PREVIEW} />
      </div>

      {/* 演示环境的「直接写」回放入口（原 App 里模式胶囊已关闭，这里保留入口以免断开） */}
      <button type="button" className="idle-direct-link" onClick={onOpenDirect}>
        直接写
      </button>
    </div>
  )
}
