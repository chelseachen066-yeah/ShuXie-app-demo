import { useLayoutEffect, useRef, useState } from 'react'
import { ASSETS } from '../../constants'
import { useProfileStore } from '../../store/profileStore'

export const HERO_HEIGHT_RATIO = 0.2
export const WORKS_SEARCH_BAR_HEIGHT = 38
export const WORKS_SEARCH_HERO_OVERLAP = Math.round(WORKS_SEARCH_BAR_HEIGHT / 2)
export const WORKS_SEARCH_TEXT_GAP = 12

export function HeroHeader() {
  const nickname = useProfileStore((state) => state.nickname)
  const shellRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState(() =>
    typeof window === 'undefined' ? 160 : window.innerHeight * HERO_HEIGHT_RATIO,
  )

  useLayoutEffect(() => {
    const frame = document.querySelector('.phone-frame')
    if (frame instanceof HTMLElement) {
      setMinHeight(frame.clientHeight * HERO_HEIGHT_RATIO)
    }
  }, [])

  return (
    <div ref={shellRef} className="hero-shell" style={{ minHeight }}>
      <img className="hero-bg" src={ASSETS.hero} alt="" />
      <div
        className="hero-content"
        style={{ paddingBottom: WORKS_SEARCH_HERO_OVERLAP + WORKS_SEARCH_TEXT_GAP }}
      >
        <h1 className="hero-title">我的文学空间</h1>
        <p className="hero-subtitle">{nickname ? `@${nickname}` : '登录后开启创作之旅'}</p>
      </div>
    </div>
  )
}
