import { useLayoutEffect, useState, type CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar, StatusBar } from './SystemBars'

const PHONE_W = 393
const PHONE_H = 852
const MOBILE_MAX = 499
/** 窗口上下留白，避免阴影被裁切 */
const DESKTOP_GAP = 24

function computeScale() {
  if (window.innerWidth <= MOBILE_MAX) return 1
  const byH = (window.innerHeight - DESKTOP_GAP * 2) / PHONE_H
  const byW = (window.innerWidth - DESKTOP_GAP * 2) / PHONE_W
  return Math.min(1, byH, byW)
}

export function PhoneShell() {
  const [scale, setScale] = useState(computeScale)

  useLayoutEffect(() => {
    const update = () => setScale(computeScale())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div
      className="desktop-shell"
      style={{ '--phone-scale': scale } as CSSProperties}
    >
      <div className="phone-scaler">
        <div className="phone-frame">
          <div className="phone-body">
            <Outlet />
          </div>
          <NavBar />
          <StatusBar />
        </div>
      </div>
    </div>
  )
}
