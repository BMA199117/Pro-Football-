import { useState } from 'react'
import { Modal } from './Modal'
import { useT } from '../hooks'
import { useSync, sendMagicLink, signOut } from '../sync'

export function SyncBadge({ onClick }: { onClick: () => void }) {
  const { t } = useT()
  const { status } = useSync()
  const label = status === 'synced' ? t('syncOn') : status === 'syncing' ? t('syncing') : t('syncOff')
  return <button className={'sync-badge s-' + status} onClick={onClick} aria-label={label} title={label}><span className="sdot" /><span className="slabel">{label}</span></button>
}

export function SyncPanel({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const { status, email } = useSync()
  const [mail, setMail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = await sendMagicLink(mail.trim())
    setMsg(err ? err : t('linkSent'))
  }
  return (
    <Modal title={t('sync')} onClose={onClose}>
      {status === 'disabled' ? <p>{t('syncNotSet')}</p> : email ? (
        <>
          <p>{t('signedAs')} <b>{email}</b></p>
          <div className="row"><button className="btn ghost" onClick={() => signOut()}>{t('signOut')}</button></div>
        </>
      ) : (
        <form className="form" onSubmit={submit}>
          <p className="full">{t('syncHelp')}</p>
          <label className="full">{t('email')}<input id="sync-email" type="email" value={mail} onChange={(e) => setMail(e.target.value)} required /></label>
          {msg && <p className="full note">{msg}</p>}
          <div className="row full"><button className="btn">{t('sendLink')}</button></div>
        </form>
      )}
      <div className="row"><button className="btn ghost" onClick={onClose}>{t('close')}</button></div>
    </Modal>
  )
}
