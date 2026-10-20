const NAV_ICON_COLOR = '#8A8375'

/** 与 RN app/(tabs)/create.tsx 里的 ClockIcon / PlusIcon 路径一致 */
function ClockIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={NAV_ICON_COLOR} strokeWidth={1.5} />
      <path
        d="M12 7v5l3 2"
        stroke={NAV_ICON_COLOR}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" stroke={NAV_ICON_COLOR} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke={NAV_ICON_COLOR} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

type Props = {
  /** 时钟：打开历史抽屉 */
  onHistory?: () => void
  /** +：新对话 */
  onNew?: () => void
}

/** 顶部右侧：历史（时钟）、新建（+） */
export function CreateTopBar({ onHistory, onNew }: Props) {
  return (
    <div className="create-topbar">
      <div className="create-topbar-actions">
        <button type="button" className="create-topbar-btn" aria-label="历史对话" onClick={onHistory}>
          <ClockIcon />
        </button>
        <button type="button" className="create-topbar-btn" aria-label="新建对话" onClick={onNew}>
          <PlusIcon />
        </button>
      </div>
    </div>
  )
}
