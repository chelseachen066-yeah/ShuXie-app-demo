import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function PhonePortal({ children }: { children: ReactNode }) {
  const [host, setHost] = useState<Element | null>(null)

  useEffect(() => {
    // 挂到 App 内容区（不含系统状态栏 / 导航栏），弹层不会盖住它们
    setHost(document.querySelector('.phone-body'))
  }, [])

  if (!host) return null
  return createPortal(children, host)
}
