import { useState, type ComponentType, type SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconApps,
  IconBell,
  IconChevronRight,
  IconFileText,
  IconInfoCircle,
  IconLogout,
  IconMessage,
  IconTrash,
  IconTypography,
} from '../icons'
import { Toast } from '../ui/Toast'
import { useProfileStore } from '../../store/profileStore'
import { ProfileQuoteWidget } from './ProfileQuoteWidget'

const ICON_COLOR = '#8A8478'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

type SettingsItem = {
  Icon: IconType
  label: string
  route?: string
  action?: 'clearCache' | 'addWidget' | 'logout'
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
  { Icon: IconLogout, label: '退出登录', action: 'logout' },
]

function SettingsCard({
  items,
  onAction,
}: {
  items: SettingsItem[]
  onAction: (item: SettingsItem) => void
}) {
  return (
    <div className="settings-card-shadow">
      <div className="settings-card">
        {items.map((item, index) => {
          const ItemIcon = item.Icon
          return (
            <button
              key={item.label}
              type="button"
              className="settings-row"
              onClick={() => onAction(item)}
            >
              <span className="settings-icon">
                <ItemIcon size={20} color={ICON_COLOR} strokeWidth={1.5} />
              </span>
              <span className="settings-label">{item.label}</span>
              <span className="settings-arrow">
                <IconChevronRight size={16} color="#C5BFB4" strokeWidth={1.5} />
              </span>
              {index < items.length - 1 ? <span className="settings-row-divider" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProfileLoggedInView() {
  const navigate = useNavigate()
  const avatar = useProfileStore((state) => state.avatar)
  const nickname = useProfileStore((state) => state.nickname)
  const logout = useProfileStore((state) => state.logout)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleAction = (item: SettingsItem) => {
    if (item.action === 'clearCache') {
      if (window.confirm('确定要清除本地缓存吗？')) {
        setToastMessage('缓存已清除')
      }
      return
    }
    if (item.action === 'addWidget') {
      window.alert('当前环境暂不支持一键添加，请在桌面长按空白处手动添加小组件。')
      return
    }
    if (item.action === 'logout') {
      if (window.confirm('确定退出登录？')) logout()
      return
    }
    if (item.route) navigate(item.route)
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <button type="button" className="profile-row" onClick={() => navigate('/profile-edit')}>
          <div className="avatar-shadow">
            <div className="profile-avatar">
              {avatar ? (
                <img src={avatar} alt="" />
              ) : (
                <span className="profile-avatar-fallback">{nickname?.[0] ?? '我'}</span>
              )}
            </div>
          </div>
          <span className="profile-nickname">{nickname ?? '小明'}</span>
          <IconChevronRight size={14} color="#C5BFB4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="profile-cards">
        <ProfileQuoteWidget />
        <SettingsCard items={PRIMARY_ITEMS} onAction={handleAction} />
        <div className="settings-card-gap">
          <SettingsCard items={SECONDARY_ITEMS} onAction={handleAction} />
        </div>
      </div>

      {toastMessage ? (
        <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
      ) : null}
    </div>
  )
}
