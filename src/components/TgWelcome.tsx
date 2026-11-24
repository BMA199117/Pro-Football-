import { useState } from 'react'
import { Modal } from './Modal'
import { SyncPanel } from './SyncPanel'
import { useT } from '../hooks'
import { supabase, useSync } from '../sync'
import { tgName, tgSignIn, useTgAuth } from '../telegram'

const SEEN = 'pf-tg-welcome'

/** First time in the Telegram Mini App without a tied account: offer to sign in with Telegram (one tap). */
export function TgWelcome() {
  const { t } = useT()
  const auth = useTgAuth()
  const { email } = useSync()
  const [closed, setClosed] = useState(() => { try { return sessionStorage.getItem(SEEN) === '1' } catch { return false } })
  const [emailForm, setEmailForm] = useState(false)
  const close = () => { setClosed(true); try { sessionStorage.setItem(SEEN, '1') } catch { /* ignore */ } }

  if (!supabase || email || closed) return null
  if (emailForm) return <SyncPanel onClose={close} />
  if (auth !== 'unlinked' && auth !== 'signingIn' && auth !== 'error') return null
  const name = tgName()
  return (
    <Modal title={t('tgWelcome')} onClose={close}>
      <div className="tg-welcome">
        {name && <p><b>{name}</b></p>}
        <p>{t('tgWelcomeText')}</p>
        {auth === 'error' && <p className="note err" role="alert">{t('tgErr')}</p>}
        <button className="btn tg-btn" disabled={auth === 'signingIn'} onClick={() => tgSignIn(supabase!, true)}>
          <TgIcon />{auth === 'signingIn' ? '…' : t('tgSignIn')}
        </button>
        <div className="row">
          <button className="linkish" onClick={() => setEmailForm(true)}>{t('tgHaveAcc')}</button>
          <button className="linkish muted" onClick={close}>{t('tgLater')}</button>
        </div>
      </div>
    </Modal>
  )
}

export const TgIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
    <path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2 1.8 11.7c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.3z" />
  </svg>
)
