import { IconChevronForward } from './createIcons'
import { PaperFill } from './PaperFill'

/** 对应 RN components/ContinueCard。本步仅静态展示，点击暂不跳转。 */
export function ContinueCard({ previewText }: { previewText: string }) {
  return (
    <div className="continue-card">
      <PaperFill opacity={0.57} />
      <div className="continue-content">
        <div className="continue-text">
          <div className="continue-label-row">
            <span className="continue-pill" />
            <span className="continue-label">继续上次创作</span>
          </div>
          <p className="continue-preview">{previewText}</p>
        </div>
        <span className="arrow-hit" aria-hidden>
          <IconChevronForward size={16} style={{ color: '#A8B89E' }} />
        </span>
      </div>
    </div>
  )
}
