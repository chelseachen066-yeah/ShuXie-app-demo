export const PAGE_BG = '#F3F0EB'
export const DESKTOP_BG = '#E8E4DC'
export const TEXT_PRIMARY = '#2C2720'
export const TEXT_MUTED = '#9A8F84'
export const BRAND = '#5D7E55'
export const TAB_ACTIVE = '#7FA26E'
export const TAB_INACTIVE = '#9E968D'
export const TAB_BAR_HEIGHT = 56

export const Typography = {
  serif: '"SourceHanSerif", "Noto Serif SC", serif',
  serifBold: '"SourceHanSerif", "Noto Serif SC", serif',
  sans: '"LingjingSans", "PingFang SC", system-ui, sans-serif',
  sansMedium: '"LingjingSans", "PingFang SC", system-ui, sans-serif',
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
  },
} as const

export const Colors = {
  brand: '#2E7D52',
  textPrimary: '#2D2D2D',
  textSecondary: '#9A9A9A',
  bg: '#FFFFFF',
  pageBg: '#F3F0EB',
  cardBg: '#FFFFFF',
} as const

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const ASSETS = {
  hero: asset('background1.webp'),
  createBg: asset('create_bg.webp'),
  cardBg: asset('card_bg.jpg'),
  widgetPlaceholder: asset('widget-placeholder.png'),
  profileWidget: asset('/widget.webp'),
  covers: [
    asset('default1.webp'),
    asset('default2.webp'),
    asset('default3.webp'),
    asset('default4.webp'),
    asset('default5.webp'),
  ],
  textures: {
    jianyue: asset('card_texture/jianyue.jpg'),
    banbo: asset('card_texture/banbo.jpg'),
    fugu: asset('card_texture/fugu.jpg'),
    ziran: asset('card_texture/ziran.jpg'),
    tianguang: asset('card_texture/tianguang.jpg'),
    huying: asset('card_texture/huying.jpg'),
  },
  readingBg: {
    texture1: asset('reading_bg1.jpg'),
    texture2: asset('reading_bg2.jpg'),
    texture3: asset('reading_bg3.jpg'),
    texture4: asset('reading_bg2.jpg'),
  },
  widgetBg: {
    b1: asset('widget_bg/widget_bg_b1.png'),
    b2: asset('widget_bg/widget_bg_b2.png'),
    b3: asset('widget_bg/widget_bg_b3.png'),
    s1: asset('widget_bg/widget_bg_s1.png'),
  },
} as const

export function excerptOf(body: string, max = 80) {
  const normalized = body.replace(/\s+/g, ' ').trim()
  return normalized.length > max ? `${normalized.slice(0, max)}…` : normalized
}
