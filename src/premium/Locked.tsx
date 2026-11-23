import { useEffect, useState } from 'react'
import { useT } from '../hooks'
import { useSync } from '../sync'
import { useContent } from '../content'
import { academyMembers, getAccess, hasPremium, payWithClick, refreshAccess, setAcademyMembers, startTrial, useAccess, type Plan, type Price } from './access'
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

const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''))

/** What the coach sees instead of closed content: what Premium gives, the plans and how to pay. */
export function PaywallBody({ why }: { why: 'drill' | 'plan' | 'generic' }) {
  const { t } = useT()
  const { email } = useSync()
  const { drills } = useContent()
  const a = useAccess()
  const [busy, setBusy] = useState<string | null>(null)
  const [note, setNote] = useState<{ text: string; err?: boolean } | null>(null)
  const o = a.offer
  const on = hasPremium(a)
  const check = async () => {
    setBusy('check'); setNote(null)
    await refreshAccess()
    setBusy(null)
    if (!hasPremium(getAccess())) setNote({ text: t('pwNotYet'), err: true })
  }
  const trial = async () => {
    setBusy('trial'); setNote(null)
    const r = await startTrial()
    setBusy(null)
    setNote(r === 'ok' ? { text: t('trialOn') } : r === 'used' ? { text: t('trialUsedNote'), err: true } : r === 'signin' ? null : { text: t('payErr'), err: true })
    if (r === 'signin') openAccount()
  }
  const pay = async (plan: Plan) => {
    if (!email) { openAccount(); return }
    setBusy(plan); setNote(null)
    const r = await payWithClick(plan)
    setBusy(null)
    if (r === 'notReady') setNote({ text: t('pwSoon') })
    else if (r === 'error') setNote({ text: t('payErr'), err: true })
  }
  const card = (plan: Plan, title: string, price: Price, unit: string, extra?: React.ReactNode, best?: boolean) => (
    <div className={'pw-plan' + (best ? ' best' : '')}>
      <b>{title}</b>
      <div className="pw-amount">
        {price.promo && <s>{fmt(price.base)}</s>} <span>{fmt(price.amount)}</span> <small>{unit}</small>
      </div>
      {extra}
      <button className={'btn' + (best ? '' : ' ghost')} disabled={!!busy} onClick={() => pay(plan)}>{busy === plan ? '…' : t('payClick')}</button>
    </div>
  )
  return (
    <div className="paywall">
      <div className="pw-head"><Lock size={28} /><div><b>{t('pwTitle')}</b>{PRICE_TEXT && !o && <span className="pw-price">{PRICE_TEXT}</span>}</div></div>
      <p>{t(why === 'drill' ? 'pwDrill' : why === 'plan' ? 'pwPlan' : 'pwGeneric')}</p>
      <h3 className="label">{t('pwGet')}</h3>
      <ul className="pw-list">
        <li>{t('pw1')} ({drills.length})</li>
        <li>{t('pw2')}</li>
        <li>{t('pw3')}</li>
        <li>{t('pw4')}</li>
      </ul>
      {o && !on && (
        <div className="pw-plans">
          {card('month', t('planMonth'), o.month, t('perMonth'))}
          {card('year', t('planYear'), o.year, t('perYear'), <>
            {o.year.promo && <span className="pw-promo">{fill(t('promoBadge'), { n: o.pricing.promoLimit, p: o.pricing.promoYearPercent })} · {o.year.left} {t('promoLeft')}</span>}
            <small className="muted">{fill(t('yearNote'), { m: fmt(Math.round(o.year.amount / 12)) })}</small>
          </>, true)}
          {card('academy', t('planAcademy'), o.academy, t('perMonth'), <small className="muted">{fill(t('academyNote'), { n: o.pricing.academySeats })}</small>)}
        </div>
      )}
      {!email ? (
        <>
          <p className="sub">{t('pwSignIn')}</p>
          <button className="btn" onClick={openAccount}>{t('pwSignInBtn')}</button>
        </>
      ) : !on && (
        <>
          {o?.trialAvailable && !a.trialUsed && <button className="btn trial-btn" disabled={!!busy} onClick={trial}>{busy === 'trial' ? '…' : fill(t('trialBtn'), { n: o.pricing.trialDays })}</button>}
          <p className="sub">{t('pwYourAcc')}: <b>{email}</b></p>
          <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            {CONTACT_URL && <a className="btn ghost" href={CONTACT_URL} target="_blank" rel="noreferrer">{t('pwContact')}</a>}
            <button className="btn ghost" onClick={check} disabled={!!busy}>{busy === 'check' ? '…' : t('pwCheck')}</button>
          </div>
        </>
      )}
      {note && <p className={'note' + (note.err ? ' err' : ' ok')}>{note.text}</p>}
    </div>
  )
}

export function PaywallModal({ title, why, onClose }: { title?: string; why: 'drill' | 'plan' | 'generic'; onClose: () => void }) {
  const { t } = useT()
  return <Modal title={title ?? t('pwTitle')} onClose={onClose}><PaywallBody why={why} /><button className="btn ghost" onClick={onClose}>{t('close')}</button></Modal>
}

/** Premium state line for the account panel (and the academy owner's coach list). */
export function PremiumLine() {
  const { t, months } = useT()
  const a = useAccess()
  const [open, setOpen] = useState(false)
  if (!a.on) return null
  const on = hasPremium(a)
  const d = a.until ? new Date(a.until) : null
  const name = a.plan === 'trial' ? t('planTrial') : a.plan === 'month' ? t('planMonth') : a.plan === 'year' ? t('planYear') : a.plan === 'academy' ? t('planAcademy') : a.plan === 'academy-member' ? t('planMember') : t('premiumOn')
  return (
    <>
      <div className={'premium-line' + (on ? ' on' : '')}>
        <span>{on ? <>★ {a.admin ? t('premiumOn') : name}{d && !a.admin ? ` · ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${t('premiumTill')}` : ''}</> : t('premiumOff')}</span>
        {!on && <button className="linkish" onClick={() => setOpen(true)}>{t('premiumMore')}</button>}
        {open && <PaywallModal why="generic" onClose={() => setOpen(false)} />}
      </div>
      {on && a.plan === 'academy' && <AcademyMembers seats={a.offer?.pricing.academySeats ?? 10} />}
    </>
  )
}

function AcademyMembers({ seats }: { seats: number }) {
  const { t } = useT()
  const [text, setText] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  useEffect(() => { academyMembers().then((l) => setText((l ?? []).join('\n'))) }, [])
  if (text === null) return null
  const list = text.split(/[\s,;]+/).filter((x) => x.includes('@'))
  return (
    <div className="acad">
      <b>{t('acadTitle')} ({list.length}/{seats})</b>
      <p className="sub">{t('acadHint')}</p>
      <textarea rows={4} value={text} onChange={(e) => { setText(e.target.value); setMsg(null) }} placeholder="murabbiy@gmail.com" />
      <button className="btn small" disabled={list.length > seats} onClick={async () => {
        const r = await setAcademyMembers(list)
        setMsg(r === 'ok' ? { text: t('acadSaved') } : r === 'too_many' ? { text: t('acadTooMany'), err: true } : { text: t('payErr'), err: true })
      }}>{t('acadSave')}</button>
      {list.length > seats && <p className="note err">{t('acadTooMany')}</p>}
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
    </div>
  )
}
