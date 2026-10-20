import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toast } from '../components/ui/Toast'

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])
  return time
}

/**
 * 模拟系统状态栏（仅桌面手机框显示；< 500px 真机由 CSS 隐藏）。
 * 透明、叠加在页面内容之上，pointer-events: none 不拦截点击。
 */
export function StatusBar() {
  const time = useClock()

  return (
    <div className="sys-statusbar" aria-hidden="true">
      <span className="sys-time">{time}</span>
      <span className="sys-icons">
        {/* 信号 */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.8" />
          <rect x="4.67" y="5" width="3" height="6" rx="0.8" />
          <rect x="9.33" y="2.5" width="3" height="8.5" rx="0.8" />
          <rect x="14" y="0" width="3" height="11" rx="0.8" />
        </svg>
        {/* Wi-Fi */}
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M1 4.2a10 10 0 0 1 14 0" />
          <path d="M3.5 6.9a6.4 6.4 0 0 1 9 0" />
          <path d="M6 9.4a2.8 2.8 0 0 1 4 0" />
          <circle cx="8" cy="10.8" r="1" fill="currentColor" stroke="none" />
        </svg>
        {/* 电池 100% */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3.2"
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" />
          <path
            d="M24.2 4.2v3.6c.8-.3 1.4-1.1 1.4-1.8s-.6-1.5-1.4-1.8Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
        </svg>
      </span>
    </div>
  )
}

/** 模拟 Android 三键导航栏（仅桌面手机框显示） */
export function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [toast, setToast] = useState<string | null>(null)

  const handleBack = () => {
    // 已在首页（文集 Tab）时无反应
    if (location.pathname === '/') return
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  const handleHome = () => navigate('/')

  const iconProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinejoin: 'round' as const,
  }

  return (
    <>
      <nav className="sys-navbar" aria-label="系统导航栏">
        <button type="button" className="sys-nav-btn" aria-label="返回" onClick={handleBack}>
          <svg {...iconProps}>
            <path d="M15.5 5 6.5 12l9 7Z" />
          </svg>
        </button>
        <button type="button" className="sys-nav-btn" aria-label="主页" onClick={handleHome}>
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="7" />
          </svg>
        </button>
        <button
          type="button"
          className="sys-nav-btn"
          aria-label="多任务"
          onClick={() => setToast('演示环境')}
        >
          <svg {...iconProps}>
            <rect x="5.5" y="5.5" width="13" height="13" rx="2.2" />
          </svg>
        </button>
      </nav>
      {toast ? (
        <Toast key={toast} message={toast} showIcon={false} onHide={() => setToast(null)} />
      ) : null}
    </>
  )
}
