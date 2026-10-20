import { type ComponentType, type SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconApps,
  IconBell,
  IconChevronRight,
  IconFileText,
  IconInfoCircle,
  IconMessage,
  IconTrash,
  IconTypography,
} from '../icons'
import { ProfileQuoteWidget } from './ProfileQuoteWidget'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

type SettingsItem = {
  Icon: IconType
  label: string
  route?: string
  action?: 'clearCache' | 'addWidget'
}

const PRIMARY_ITEMS: SettingsItem[] = [
  { Icon: IconApps, label: '添加小组件', action: 'addWidget' },
  { Icon: IconBell, label: '通知设置', route: '/notification-settings' },
  { Icon: IconTypography, label: '阅读与排版', route: '/reading-settings' },
  { Icon: IconTrash, label: '清除缓存', action: 'clearCache' },
]

const SECONDARY_ITEMS: SettingsItem[] = [
  { Icon: IconMessage, label: '意见反馈', route: '/feedback' },
  { Icon: IconInfoCircle, label: '关于灵境', route: '/about' },
  { Icon: IconFileText, label: '用户协议', route: '/user-agreement' },
]

export function ProfileLoggedOutView() {
  const navigate = useNavigate()

  const handleAction = (item: SettingsItem) => {
    if (item.action === 'clearCache') {
      window.confirm('确定要清除本地缓存吗？')
      return
    }
    if (item.action === 'addWidget') {
      window.alert('当前环境暂不支持一键添加，请在桌面长按空白处手动添加小组件。')
      return
    }
    if (item.route) navigate(item.route)
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <button type="button" className="profile-row" onClick={() => navigate('/auth')}>
          <div className="avatar-shadow">
            <div className="profile-avatar">
              <span className="profile-avatar-fallback">我</span>
            </div>
          </div>
          <span className="profile-nickname">登录 / 注册</span>
          <IconChevronRight size={14} color="#C5BFB4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="profile-cards">
        <ProfileQuoteWidget />
        <div className="settings-card-shadow">
          <div className="settings-card">
            {PRIMARY_ITEMS.map((item, index) => {
              const ItemIcon = item.Icon
              return (
                <button
                  key={item.label}
                  type="button"
                  className="settings-row"
                  onClick={() => handleAction(item)}
                >
                  <span className="settings-icon">
                    <ItemIcon size={20} color="#8A8478" strokeWidth={1.5} />
                  </span>
                  <span className="settings-label">{item.label}</span>
                  <span className="settings-arrow">
                    <IconChevronRight size={16} color="#C5BFB4" strokeWidth={1.5} />
                  </span>
                  {index < PRIMARY_ITEMS.length - 1 ? <span className="settings-row-divider" /> : null}
                </button>
              )
            })}
          </div>
        </div>
        <div className="settings-card-gap">
          <div className="settings-card-shadow">
            <div className="settings-card">
              {SECONDARY_ITEMS.map((item, index) => {
                const ItemIcon = item.Icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="settings-row"
                    onClick={() => handleAction(item)}
                  >
                    <span className="settings-icon">
                      <ItemIcon size={20} color="#8A8478" strokeWidth={1.5} />
                    </span>
                    <span className="settings-label">{item.label}</span>
                    <span className="settings-arrow">
                      <IconChevronRight size={16} color="#C5BFB4" strokeWidth={1.5} />
                    </span>
                    {index < SECONDARY_ITEMS.length - 1 ? (
                      <span className="settings-row-divider" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
