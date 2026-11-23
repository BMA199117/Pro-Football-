import { useState } from 'react'
import { useT } from '../hooks'
import { useSync } from '../sync'
import { useContent } from '../content'
import { getAccess, hasPremium, refreshAccess, useAccess } from './access'
import { CONTACT_URL, PRICE_TEXT } from './config'
import { Modal } from '../components/Modal'

/** Ask the app to open the account panel (sign in / sign up). */
export const openAccount = () => window.dispatchEvent(new Event('pf-open-account'))

const Lock = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
)

/** The picture of a closed drill: a pitch with a lock. */
export function LockedPitch({ maxHeight }: { maxHeight?: number }) {
  const { t } = useT()
  return (
    <div className="locked-pitch" style={maxHeight ? { maxHeight, height: maxHeight } : undefined}>
      <Lock size={maxHeight && maxHeight < 60 ? 16 : 26} />
      {(!maxHeight || maxHeight >= 60) && <span>{t('premium')}</span>}
    </div>
  )
}

/** Small chip on a card: free / premium. */
export function AccessChip({ locked }: { locked: boolean }) {
  const { t } = useT()
  return locked ? <span className="chip lock-chip"><Lock size={12} /> {t('premium')}</span> : <span className="chip free-chip">{t('freeL')}</span>
}

/** What the coach sees instead of closed content: what Premium gives and how to get it. */
export function PaywallBody({ why }: { why: 'drill' | 'plan' | 'generic' }) {
  const { t } = useT()
  const { email } = useSync()
  const { drills } = useContent()
  useAccess()
  const [checking, setChecking] = useState(false)
  const [notYet, setNotYet] = useState(false)
  const check = async () => {
    setChecking(true); setNotYet(false)
    await refreshAccess()
    setChecking(false)
    if (!hasPremium(getAccess())) setNotYet(true)
  }
  return (
    <div className="paywall">
      <div className="pw-head"><Lock size={28} /><div><b>{t('pwTitle')}</b>{PRICE_TEXT && <span className="pw-price">{PRICE_TEXT}</span>}</div></div>
      <p>{t(why === 'drill' ? 'pwDrill' : why === 'plan' ? 'pwPlan' : 'pwGeneric')}</p>
      <h3 className="label">{t('pwGet')}</h3>
      <ul className="pw-list">
        <li>{t('pw1')} ({drills.length})</li>
        <li>{t('pw2')}</li>
        <li>{t('pw3')}</li>
        <li>{t('pw4')}</li>
      </ul>
      {!email ? (
        <>
          <p className="sub">{t('pwSignIn')}</p>
          <button className="btn" onClick={openAccount}>{t('pwSignInBtn')}</button>
        </>
      ) : (
        <>
          <p className="sub">{t('pwSoon')}</p>
          <p className="sub">{t('pwYourAcc')}: <b>{email}</b></p>
          <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            {CONTACT_URL && <a className="btn" href={CONTACT_URL} target="_blank" rel="noreferrer">{t('pwContact')}</a>}
            <button className="btn ghost" onClick={check} disabled={checking}>{checking ? '…' : t('pwCheck')}</button>
          </div>
          {notYet && <p className="note err">{t('pwNotYet')}</p>}
        </>
      )}
    </div>
  )
}

export function PaywallModal({ title, why, onClose }: { title?: string; why: 'drill' | 'plan' | 'generic'; onClose: () => void }) {
  const { t } = useT()
  return <Modal title={title ?? t('pwTitle')} onClose={onClose}><PaywallBody why={why} /></Modal>
}

/** Premium state line for the account panel. */
export function PremiumLine() {
  const { t, months } = useT()
  const a = useAccess()
  const [open, setOpen] = useState(false)
  if (!a.on) return null
  const on = hasPremium(a)
  const d = a.until ? new Date(a.until) : null
  return (
    <div className={'premium-line' + (on ? ' on' : '')}>
      <span>{on ? <>★ {t('premiumOn')}{d && !a.admin ? ` · ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${t('premiumTill')}` : ''}</> : t('premiumOff')}</span>
      {!on && <button className="linkish" onClick={() => setOpen(true)}>{t('premiumMore')}</button>}
      {open && <PaywallModal why="generic" onClose={() => setOpen(false)} />}
    </div>
  )
}
