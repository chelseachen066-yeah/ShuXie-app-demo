export type WorksTabKey = 'works' | 'collections'

interface WorksTabBarProps {
  activeTab: WorksTabKey
  onTabChange: (tab: WorksTabKey) => void
}

const TABS: { key: WorksTabKey; label: string }[] = [
  { key: 'works', label: '我的创作' },
  { key: 'collections', label: '作品集' },
]

export function WorksTabBar({ activeTab, onTabChange }: WorksTabBarProps) {
  return (
    <div className="works-tabs">
      <div className="works-tabs-row">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className="works-tab"
              onClick={() => onTabChange(tab.key)}
            >
              <span className={`works-tab-label${isActive ? ' active' : ''}`}>{tab.label}</span>
              {isActive ? <span className="works-tab-indicator" /> : null}
            </button>
          )
        })}
      </div>
      <div className="works-tabs-divider" />
    </div>
  )
}
