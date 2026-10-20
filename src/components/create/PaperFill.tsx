import { ASSETS } from '../../constants'

const BODY_BASE = '#FBFAF8'

/** 对应 RN components/PaperFill.tsx：底色 + 纸纹图 + soft-light 叠层 */
export function PaperFill({
  opacity,
  baseColor = BODY_BASE,
}: {
  opacity: number
  baseColor?: string
}) {
  return (
    <div className="paper-fill" aria-hidden>
      <div className="paper-fill-layer" style={{ backgroundColor: baseColor }} />
      <img className="paper-fill-layer paper-fill-img" src={ASSETS.cardBg} alt="" style={{ opacity }} />
      <div
        className="paper-fill-layer"
        style={{ backgroundColor: baseColor, opacity: 0.2, mixBlendMode: 'soft-light' }}
      />
    </div>
  )
}
