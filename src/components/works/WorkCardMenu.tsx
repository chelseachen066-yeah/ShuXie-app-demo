import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { PhonePortal } from '../PhonePortal'

export type WorkCardMenuItem = {
  id: string
  label: string
  destructive?: boolean
}

interface WorkCardMenuProps {
  items: WorkCardMenuItem[]
  onAction: (actionId: string) => void
  onBeforeOpen?: () => boolean
}

export function WorkCardMenu({ items, onAction, onBeforeOpen }: WorkCardMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })

  const openMenu = (event: MouseEvent) => {
    event.stopPropagation()
    if (onBeforeOpen?.() === false) return
    const frame = document.querySelector('.phone-body')
    const trigger = triggerRef.current
    if (!frame || !trigger) return
    const fr = frame.getBoundingClientRect()
    const tr = trigger.getBoundingClientRect()
    // 相对 App 内容区定位；手机框可能被 transform: scale 缩小，需换算回逻辑像素
    const k = frame instanceof HTMLElement && frame.offsetWidth ? fr.width / frame.offsetWidth : 1
    setPos({
      top: (tr.bottom - fr.top) / k + 4,
      right: (fr.right - tr.right) / k,
    })
    setVisible(true)
  }

  useLayoutEffect(() => {
    if (!visible) return
    const close = () => setVisible(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [visible])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="menu-trigger"
        aria-label="更多操作"
        onClick={openMenu}
      >
        {/* 原 RN 为文本 "···"（18px），其中点号字宽依赖系统字体；网页用 CSS 绘制以保证各平台一致 */}
        <span className="menu-icon" aria-hidden="true">
          <i className="menu-dot" />
          <i className="menu-dot" />
          <i className="menu-dot" />
        </span>
      </button>
      {visible ? (
        <PhonePortal>
          <button type="button" className="card-menu-backdrop" aria-label="关闭菜单" onClick={() => setVisible(false)} />
          <div className="card-menu" style={{ top: pos.top, right: pos.right }}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`card-menu-item${item.destructive ? ' destructive' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setVisible(false)
                  onAction(item.id)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </PhonePortal>
      ) : null}
    </>
  )
}
