import { useState } from 'react'
import type { ActionCardDefaults } from '../../mock/scripts'
import { PaperFill } from './PaperFill'

/** 对应 RN components/create/ActionCard.tsx（本步无展开动画：旁观者视角时名字区直接显示为 80px 高） */
export function ActionCard({
  initial,
  onStart,
}: {
  initial: ActionCardDefaults
  onStart: (details: ActionCardDefaults) => void
}) {
  const [gender, setGender] = useState(initial.gender)
  const [perspective, setPerspective] = useState(initial.perspective)
  const [protagonistName, setProtagonistName] = useState(initial.protagonistName)
  const canStart = gender !== null && perspective !== null

  return (
    <div className="action-card">
      <PaperFill opacity={0.57} />
      <div className="action-card-content">
        <div className="action-title-block">
          <div className="action-title">素材已经很充足了</div>
          <div className="action-subtitle">补充几个细节，让故事更贴近你的想象</div>
        </div>

        <div className="action-divider" />

        <div>
          <div className="action-label">主人公是</div>
          <div className="action-option-row">
            {(['男生', '女生', '不限'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                className={`action-option${gender === opt ? ' action-option-selected' : ''}`}
                onClick={() => setGender(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="action-question-spaced">
          <div className="action-label">用什么视角讲述</div>
          <div className="action-option-row">
            {(['以我的口吻', '以旁观者视角'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                className={`action-option${perspective === opt ? ' action-option-selected' : ''}`}
                onClick={() => setPerspective(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div
          className="action-name-wrap"
          style={{ height: perspective === '以旁观者视角' ? 80 : 0 }}
        >
          <div className="action-label action-name-label">主人公叫什么？</div>
          <input
            className="action-name-input"
            value={protagonistName}
            onChange={(event) => setProtagonistName(event.target.value)}
            placeholder="可以不填，AI 会用「他/她」代替"
          />
        </div>

        <button
          type="button"
          className="action-start"
          disabled={!canStart}
          onClick={() => onStart({ gender, perspective, protagonistName })}
        >
          <span className="action-start-text">开始创作</span>
          <span className="action-start-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
