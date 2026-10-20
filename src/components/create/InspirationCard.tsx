import { ASSETS } from '../../constants'
import { IconChevronForward, IconFeatherGlyph, IconRefreshOutline } from './createIcons'
import { PaperFill } from './PaperFill'

export type InspirationItem = { id: string; text: string }

/**
 * 对应 RN components/InspirationCard：绿色标题栏 + 编号列表。
 * 点击某一行仍然触发该行绑定的回放剧本（原 App 里是点右侧箭头发送，这里整行可点）。
 */
export function InspirationCard({
  prompts,
  onPick,
  onRefresh,
}: {
  prompts: InspirationItem[]
  onPick: (id: string) => void
  onRefresh: () => void
}) {
  return (
    <div className="insp-card">
      <div className="insp-header">
        <div className="insp-fill" style={{ backgroundColor: 'rgba(93, 126, 85, 0.8)' }} />
        <img className="insp-fill insp-fill-img" src={ASSETS.cardBg} alt="" style={{ opacity: 0.22 }} />
        <div className="insp-header-row">
          <div className="insp-header-content">
            <IconFeatherGlyph size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span className="insp-header-title">来点灵感</span>
          </div>
          <button type="button" className="insp-refresh" aria-label="换一换" onClick={onRefresh}>
            <IconRefreshOutline size={18} style={{ color: 'rgba(255,255,255,0.85)' }} />
          </button>
        </div>
      </div>

      <div className="insp-body">
        <PaperFill opacity={0.57} />
        <div className="insp-body-content">
          {prompts.map((item, index) => (
            <div key={`${index}-${item.id}`}>
              {index > 0 ? <div className="insp-divider" /> : null}
              <div
                className="insp-row"
                role="button"
                tabIndex={0}
                aria-label={`发送灵感：${item.text}`}
                onClick={() => onPick(item.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onPick(item.id)
                  }
                }}
              >
                <div className="insp-index">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <span className="insp-prompt">{item.text}</span>
                <span className="arrow-hit">
                  <IconChevronForward size={16} style={{ color: '#A8B89E' }} />
                </span>
              </div>
              {index === prompts.length - 1 ? <div className="insp-divider" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
