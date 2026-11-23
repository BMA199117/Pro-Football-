import { PremiumLine } from '../premium/Locked'
import { useState } from 'react'
import { Modal } from './Modal'
import { useT } from '../hooks'
import type { Key } from '../i18n'
import { useSync, signIn, signUp, sendCode, verifyCode, setPassword, signOut, syncNow, type AuthError, type SyncState } from '../sync'

const STATUS_KEY: Record<SyncState, Key> = {
  disabled: 'syncOff', signedOut: 'syncOff', syncing: 'syncing', synced: 'syncOn', offline: 'syncOffline', error: 'syncErr',
}
const ERR_KEY: Record<AuthError, Key> = {
  badLogin: 'eBadLogin', exists: 'eExists', weakPass: 'eWeakPass', tooMany: 'eTooMany', badCode: 'eBadCode',
  noNet: 'eNoNet', confirmEmail: 'eConfirmEmail', pending: 'ePending', unknown: 'eUnknown',
}

export function SyncBadge({ onClick }: { onClick: () => void }) {
  const { t } = useT()
  const { status } = useSync()
  const label = t(STATUS_KEY[status])
  return <button className={'sync-badge s-' + status} onClick={onClick} aria-label={t('sync') + ': ' + label} title={label}><span className="sdot" /><span className="slabel">{label}</span></button>
}

type Mode = 'in' | 'up' | 'code'

export function SyncPanel({ onClose }: { onClose: () => void }) {
  const { t, lang } = useT()
  const { status, email, pending, lastSync } = useSync()
  const [mode, setMode] = useState<Mode>('in')
  const [mail, setMail] = useState('')
  const [pass, setPass] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<AuthError | null>(null)
  const [info, setInfo] = useState<Key | null>(null)
  const [newPass, setNewPass] = useState('')
  const [outErr, setOutErr] = useState<AuthError | null>(null)

  const run = async (fn: () => Promise<AuthError | null>, ok?: Key) => {
    setBusy(true); setErr(null); setInfo(null)
    const e = await fn()
    setBusy(false)
    if (e === 'confirmEmail') setInfo('eConfirmEmail')
    else if (e) setErr(e)
    else if (ok) setInfo(ok)
  }
  const go = (m: Mode) => { setMode(m); setErr(null); setInfo(null); setCodeSent(false); setCode('') }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const m = mail.trim()
    if (mode === 'in') run(() => signIn(m, pass))
    else if (mode === 'up') run(() => signUp(m, pass))
    else if (!codeSent) run(async () => { const r = await sendCode(m); if (!r) setCodeSent(true); return r }, 'codeSent')
    else run(() => verifyCode(m, code))
  }

  const time = lastSync ? new Date(lastSync).toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', { hour: '2-digit', minute: '2-digit' }) : null

  return (
    <Modal title={t('sync')} onClose={onClose}>
      {status === 'disabled' ? <p>{t('syncNotSet')}</p> : email ? (
        <div className="sync-in">
          <p>{t('signedAs')} <b>{email}</b></p>
          <PremiumLine />
          <p className={'sync-line s-' + status}><span className="sdot" />{t(STATUS_KEY[status])}{time && <span className="muted"> · {t('lastSync')}: {time}</span>}</p>
          {pending > 0 && <p className="note">{pending} {t('pendingN')}</p>}
          <div className="row"><button className="btn ghost" disabled={status === 'syncing'} onClick={() => syncNow()}>{t('syncNow')}</button></div>
          <details className="sync-more">
            <summary>{t('setPass')}</summary>
            <form className="form" onSubmit={(e) => { e.preventDefault(); run(async () => { const r = await setPassword(newPass); if (!r) setNewPass(''); return r }, 'passSaved') }}>
              <label className="full">{t('newPass')}<input type="password" autoComplete="new-password" minLength={6} value={newPass} onChange={(e) => setNewPass(e.target.value)} required /></label>
              <div className="row full"><button className="btn" disabled={busy}>{t('save')}</button></div>
            </form>
          </details>
          {err && <p className="note err" role="alert">{t(ERR_KEY[err])}</p>}
          {info && <p className="note" role="status">{t(info)}</p>}
          <p className="muted small">{t('signOutNote')}</p>
          {outErr && <p className="note err" role="alert">{t(ERR_KEY[outErr])}</p>}
          <div className="row">
            <button className="btn ghost danger" disabled={busy} onClick={async () => { setBusy(true); const r = await signOut(outErr === 'pending'); setBusy(false); setOutErr(r); if (!r) { go('in'); setPass('') } }}>
              {outErr === 'pending' ? t('signOutAnyway') : t('signOut')}
            </button>
          </div>
        </div>
      ) : (
        <form className="form sync-form" onSubmit={submit}>
          <p className="full">{t('syncHelp')}</p>
          {mode !== 'code' && (
            <div className="libtabs full" role="group">
              <button type="button" aria-pressed={mode === 'in'} onClick={() => go('in')}>{t('signIn')}</button>
              <button type="button" aria-pressed={mode === 'up'} onClick={() => go('up')}>{t('signUp')}</button>
            </div>
          )}
          <label className="full">{t('email')}
            <input type="email" autoComplete="email" inputMode="email" value={mail} disabled={mode === 'code' && codeSent} onChange={(e) => setMail(e.target.value)} required />
          </label>
          {mode !== 'code' && (
            <label className="full">{t('password')}
              <input type="password" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} minLength={6} value={pass} onChange={(e) => setPass(e.target.value)} required />
              {mode === 'up' && <span className="muted small">{t('passHint')}</span>}
            </label>
          )}
          {mode === 'code' && codeSent && (
            <label className="full">{t('code')}
              <input className="code-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,10}" maxLength={10} value={code} onChange={(e) => setCode(e.target.value)} required autoFocus />
            </label>
          )}
          {err && <p className="full note err" role="alert">{t(ERR_KEY[err])}</p>}
          {info && <p className="full note" role="status">{t(info)}</p>}
          <div className="row full">
            <button className="btn" disabled={busy}>
              {mode === 'in' ? t('signIn') : mode === 'up' ? t('signUp') : codeSent ? t('verify') : t('sendCode')}
            </button>
            {mode === 'code' && codeSent && <button type="button" className="btn ghost" disabled={busy} onClick={() => run(() => sendCode(mail.trim()), 'codeSent')}>{t('resend')}</button>}
          </div>
          <p className="full">
            {mode === 'code'
              ? <button type="button" className="linkish" onClick={() => go('in')}>{t('usePass')}</button>
              : <button type="button" className="linkish" onClick={() => go('code')}>{mode === 'in' ? t('forgot') : t('useCode')}</button>}
          </p>
        </form>
      )}
      <div className="row"><button className="btn ghost" onClick={onClose}>{t('close')}</button></div>
    </Modal>
  )
}
