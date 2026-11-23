import { useState } from 'react'
import { useT, useDrills, sessionMinutes } from '../hooks'
import { update, useData, setPrefs, setIntent } from '../store'
import { addDays, iso, monday, parse, weekdayIndex, uid } from '../dates'
import { RunSession } from '../components/RunSession'
import { Board } from '../components/Board'
import { SessionForm } from './SessionForm'
import { KNOWLEDGE } from '../knowledge'
import { PHASES, type Drill } from '../types'
import { dict } from '../i18n'

const DAYS_UZ = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
const DAYS_RU = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const MONTHS_RU_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/** phase colours that stay visible on the green card */
const BAR = { warm: '#F59E5B', main: '#7EE2A8', cool: '#8DB6F0' } as const

const I = {
  plan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>,
  att: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12.5l5 5L20 6.5" /></svg>,
  board: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M12 5v14" /></svg>,
}

/** Start screen: today's (or the next) session with a big start button, quick actions, this week and a tip. */
export function Home() {
  const { t, L, days, months, lang } = useT()
  const data = useData()
  const drills = useDrills()
  const byId = new Map(drills.map((d) => [d.id, d]))
  const [running, setRunning] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [newOn, setNewOn] = useState<string | null>(null)

  const now = new Date()
  const today = iso(now)
  const sorted = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const next = sorted.find((s) => s.date >= today)
  const start = monday(now)
  const week = Array.from({ length: 7 }, (_, i) => iso(addDays(start, i)))
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 864e5)
  const tip = KNOWLEDGE[dayOfYear % KNOWLEDGE.length]
  const wd = (lang === 'ru' ? DAYS_RU : DAYS_UZ)[weekdayIndex(now)]
  const mf = dict[lang].monthsFull[now.getMonth()]
  const fullDate = lang === 'ru' ? `${wd}, ${now.getDate()} ${MONTHS_RU_GEN[now.getMonth()]}` : `${wd}, ${now.getDate()}-${mf.toLowerCase()}`

  const openPlan = (id: string) => setPrefs({ selected: id, tab: 'plan' })

  let card
  if (next) {
    const total = sessionMinutes(next, drills)
    const count = PHASES.reduce((a, p) => a + next.phases[p].length, 0)
    const size = data.players.filter((p) => p.group === next.group).length
    const d = parse(next.date)
    const when = next.date === today ? t('today') : `${days[weekdayIndex(d)]}, ${d.getDate()} ${months[d.getMonth()]}`
    card = (
      <section className="hm-today">
        <p className="hm-kicker">{next.date === today ? t('todayS') : t('nextS')} · {when} · {next.time} · {next.group}</p>
        <h2 className="hm-title">{next.goal}</h2>
        <p className="hm-facts">{count} {t('drillsShort')} · {total} {t('min')}{size > 0 && <> · {size} {t('playersShort')}</>}</p>
        {total > 0 && (
          <div className="hm-bar" aria-hidden="true">
            {PHASES.map((p) => {
              const m = next.phases[p].reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0)
              return <i key={p} style={{ width: `${(m / total) * 100}%`, background: BAR[p] }} />
            })}
          </div>
        )}
        <div className="hm-actions">
          {total > 0 && <button className="btn big cone-btn" onClick={() => setRunning(true)}>▶ {t('start')}</button>}
          <button className="btn ghost light" onClick={() => openPlan(next.id)}>{t('openS')}</button>
        </div>
      </section>
    )
  } else {
    card = (
      <section className="hm-today">
        <h2 className="hm-title">{t('noSessions').split('.')[0]}</h2>
        <p className="hm-facts">{t('noPlanYet')}</p>
        <div className="hm-actions">
          <button className="btn big cone-btn" onClick={() => { setIntent('templates'); setPrefs({ tab: 'plan' }) }}>{t('fromTemplate')}</button>
          <button className="btn ghost light" onClick={() => setNewOn(today)}>+ {t('newS')}</button>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="head">
        <div><p className="hm-date">{fullDate}</p><h1>{t('hello')}</h1></div>
      </div>
      <div className="hm-grid">
        <div className="hm-col">
          {card}
          <div className="hm-quick">
            <button onClick={() => { setIntent('templates'); setPrefs({ tab: 'plan' }) }}>{I.plan}<span>{t('fromTemplate')}</span></button>
            <button onClick={() => setPrefs({ tab: 'team' })}>{I.att}<span>{t('attendance')}</span></button>
            <button onClick={() => setDrawing(true)}>{I.board}<span>{t('board')}</span></button>
          </div>
        </div>
        <div className="hm-col">
          <div className="hm-sec"><h2>{t('thisWeek')}</h2><button className="link" onClick={() => setPrefs({ tab: 'cal' })}>{t('cal')} ›</button></div>
          <div className="hm-week">
            {week.map((dIso, i) => {
              const list = sorted.filter((s) => s.date === dIso)
              const d = parse(dIso)
              return (
                <button key={dIso} className={dIso === today ? 'on' : ''} aria-label={`${days[i]} ${d.getDate()}${list.length ? ' · ' + list.map((s) => s.goal).join(', ') : ''}`}
                  onClick={() => (list[0] ? openPlan(list[0].id) : setNewOn(dIso))}>
                  <span>{days[i]}</span><b>{d.getDate()}</b>{list.length > 0 ? <i /> : <em>+</em>}
                </button>
              )
            })}
          </div>
          {tip && (
            <article className="hm-tip">
              <p className="hm-kicker">{t('tipDay')} · {t('know')}</p>
              <h3>{L(tip.title)}</h3>
              <p>{L(tip.idea)}</p>
              <button className="link" onClick={() => setPrefs({ tab: 'know' })}>{t('allTips')} ›</button>
            </article>
          )}
        </div>
      </div>
      {running && next && <RunSession session={next} onClose={() => setRunning(false)} />}
      {newOn && <SessionForm defaultDate={newOn} onClose={() => setNewOn(null)} />}
      {drawing && <Board onClose={() => setDrawing(false)} onSave={(scene, name) => {
        const both = { uz: name, ru: name }
        const d: Drill = { id: uid(), cat: 'tact', dia: 'smallgame', age: 'U8–U17', min: 10, name: both, desc: { uz: '', ru: '' }, equip: { uz: '—', ru: '—' }, points: [], custom: true, scene }
        update((x) => ({ ...x, customDrills: [d, ...x.customDrills] }))
        setDrawing(false); setPrefs({ tab: 'drills' })
      }} />}
    </>
  )
}
