import { NavLink } from 'react-router-dom'
import { IconBook, IconPencil, IconUser } from '../components/icons'

function TabIcon({ name }: { name: 'index' | 'create' | 'profile' }) {
  const props = { size: 24, strokeWidth: 1.5 }
  if (name === 'index') return <IconBook {...props} />
  if (name === 'create') return <IconPencil {...props} />
  return <IconUser {...props} />
}

const TABS = [
  { to: '/', label: '文集', name: 'index' as const, end: true },
  { to: '/create', label: '创作', name: 'create' as const, end: false },
  { to: '/profile', label: '我的', name: 'profile' as const, end: false },
]

export function TabBar() {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}
        >
          <span className="tab-item-inner">
            <TabIcon name={tab.name} />
            <span>{tab.label}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
