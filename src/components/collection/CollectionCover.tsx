import { ASSETS } from '../../constants'

const DESIGN_WIDTH = 750
const DESIGN_HEIGHT = 1000

export function getDefaultCover(collectionId: string) {
  let hash = 0
  for (let i = 0; i < collectionId.length; i++) {
    hash = (hash * 31 + collectionId.charCodeAt(i)) >>> 0
  }
  return ASSETS.covers[hash % ASSETS.covers.length]
}

export function getCollectionCoverSource(coverUrl?: string | null, collectionId?: string) {
  const uri = coverUrl?.trim()
  if (uri) return uri
  if (collectionId) return getDefaultCover(collectionId)
  return null
}

function scale(value: number, width: number) {
  return Math.round((width / DESIGN_WIDTH) * value)
}

interface Props {
  coverUrl?: string | null
  collectionId?: string
  width: number
}

export default function CollectionCover({ coverUrl, collectionId, width }: Props) {
  const height = Math.round((width * DESIGN_HEIGHT) / DESIGN_WIDTH)
  const borderLeftRadius = scale(8, width)
  const borderRightRadius = scale(20, width)
  const shadowOffsetY = scale(4, width)
  const shadowBlur = scale(4, width)
  const src = getCollectionCoverSource(coverUrl, collectionId)

  return (
    <div
      className="cover-shadow"
      style={{
        width,
        height,
        boxShadow: `0 ${shadowOffsetY}px ${shadowBlur}px rgba(0,0,0,0.25)`,
      }}
    >
      <div
        className="cover-clip"
        style={{
          width,
          height,
          borderTopLeftRadius: borderLeftRadius,
          borderBottomLeftRadius: borderLeftRadius,
          borderTopRightRadius: borderRightRadius,
          borderBottomRightRadius: borderRightRadius,
        }}
      >
        {src ? (
          <img src={src} alt="" />
        ) : (
          <div className="cover-fallback" style={{ fontSize: scale(48, width) }}>
            📚
          </div>
        )}
      </div>
    </div>
  )
}
