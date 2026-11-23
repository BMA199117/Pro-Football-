import { useEffect, type ReactNode } from 'react'
import { useBackClose } from '../back'
import { useT } from '../hooks'

/** Dialog with a sticky title bar and a close (×) button. `sheet` makes it full-screen on a phone; `footer` stays pinned at the bottom. */
export function Modal({ title, onClose, children, sheet, footer }: { title: string; onClose: () => void; children: ReactNode; sheet?: boolean; footer?: ReactNode }) {
  const { t } = useT()
  useBackClose(onClose)
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className={'overlay' + (sheet ? ' sheet' : '')} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-h">
          <h2>{title}</h2>
          <button className="modal-x" onClick={onClose} aria-label={t('close')} title={t('close')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {children}
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </div>
  )
}

/** In-page confirmation (no window.confirm). */
export function ConfirmButton({ label, confirmLabel, onConfirm }: { label: string; confirmLabel: string; onConfirm: () => void }) {
  return (
    <details className="confirm">
      <summary className="btn ghost small danger">{label}</summary>
      <button className="btn small danger-fill" onClick={onConfirm}>{confirmLabel}</button>
    </details>
  )
}
