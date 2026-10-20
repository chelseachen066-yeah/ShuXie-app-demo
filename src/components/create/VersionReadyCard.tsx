import { StarIcon } from './StarIcon'

/** 对应 RN GeneratingCard.tsx 的 CompletedGeneratingCard（静态，无进场动画） */
export function VersionReadyCard({ onViewVersions }: { onViewVersions?: () => void }) {
  return (
    <div className="gen-card">
      <div className="gen-completed">
        <p className="gen-completed-text">两个版本已就绪，去挑选你更喜欢的一篇</p>
        <div className="gen-completed-line" />
        <button type="button" className="gen-completed-cta" onClick={onViewVersions}>
          <span className="gen-completed-icon">
            <StarIcon size={13} />
          </span>
          <span className="gen-completed-label">去选择</span>
          <span className="gen-completed-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
