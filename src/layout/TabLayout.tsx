import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'

export function TabLayout() {
  return (
    <div className="tab-layout">
      <div className="tab-layout-body">
        <Outlet />
      </div>
      <TabBar />
    </div>
  )
}
