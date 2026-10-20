import { IconFeather, IconLibrary } from '../icons'

interface EmptyStateProps {
  icon: 'feather' | 'books'
  title: string
  ctaText: string
  onCta: () => void
}

export function EmptyState({ icon, title, ctaText, onCta }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon === 'feather' ? (
        <IconFeather size={64} className="empty-state-icon" />
      ) : (
        <IconLibrary size={64} className="empty-state-icon" />
      )}
      <p className="empty-state-title">{title}</p>
      {ctaText.trim() ? (
        <button type="button" className="empty-state-cta" onClick={onCta}>
          {ctaText}
        </button>
      ) : null}
    </div>
  )
}
