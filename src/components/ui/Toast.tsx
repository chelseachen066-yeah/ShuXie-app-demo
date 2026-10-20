import { useEffect } from 'react'
import { IconCheck } from '../icons'
import { PhonePortal } from '../PhonePortal'

interface ToastProps {
  message: string
  onHide: () => void
  showIcon?: boolean
}

function formatToastMessage(message: string) {
  return message.replace(/^√\s*/, '').replace(/\s*✓\s*$/, '').trim()
}

export function Toast({ message, onHide, showIcon = true }: ToastProps) {
  const displayMessage = formatToastMessage(message)

  useEffect(() => {
    const timer = window.setTimeout(onHide, 2250)
    return () => window.clearTimeout(timer)
  }, [onHide, message])

  return (
    <PhonePortal>
      <div className="toast">
        <div className="toast-inner">
          {showIcon ? <IconCheck size={15} strokeWidth={2.25} /> : null}
          <span className="toast-text">{displayMessage}</span>
        </div>
      </div>
    </PhonePortal>
  )
}
