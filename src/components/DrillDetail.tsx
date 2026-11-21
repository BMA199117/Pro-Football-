import { useState } from 'react'
import { Modal } from './Modal'
import { Pitch } from './Pitch'
import { useT } from '../hooks'
import { update, useData } from '../store'
import { parse } from '../dates'
import { PHASES, type Drill, type Phase } from '../types'

export function DrillDetail({ drill, onClose }: { drill: Drill; onClose: () => void }) {
  const { t, L, months } = useT()
  const data = useData()
  const fav = (data.favorites ?? []).includes(drill.id)
  const upcoming = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const [sid, setSid] = useState(upcoming[0]?.id ?? '')
  const [phase, setPhase] = useState<Phase>('main')
  const [added, setAdded] = useState(false)

  const toggleFav = () => update((d) => {
    const f = d.favorites ?? []
    return { ...d, favorites: f.includes(drill.id) ? f.filter((x) => x !== drill.id) : [...f, drill.id] }
  })
  const add = () => {
    update((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === sid ? { ...s, phases: { ...s.phases, [phase]: [...s.phases[phase], drill.id] } } : s)) }))
    setAdded(true)
  }

  return (
    <Modal title={L(drill.name)} onClose={onClose}>
      <div className="detail-pitch"><Pitch type={drill.dia} /></div>
      <div className="meta">
        <span className="chip">{t(drill.cat)}</span>
        <span className="chip">{drill.age}</span>
        <span className="chip cone">{drill.min} {t('min')}</span>
        {drill.players && <span className="chip">{t('playersCount')}: {drill.players}</span>}
        <button className={'star' + (fav ? ' on' : '')} onClick={toggleFav} aria-pressed={fav} aria-label={t('favs')}>★</button>
      </div>
      {L(drill.desc) && <p className="lead">{L(drill.desc)}</p>}
      <p className="sub"><b>{t('equip')}:</b> {L(drill.equip)}</p>
      {drill.points && drill.points.length > 0 && (
        <div>
          <h3 className="label">{t('points')}</h3>
          <ul className="points">{drill.points.map((p, i) => <li key={i}>{L(p)}</li>)}</ul>
        </div>
      )}
      {upcoming.length > 0 && (
        <div className="add-to">
          <h3 className="label">{t('addTo')}</h3>
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <select className="sel" id="dd-session" value={sid} onChange={(e) => { setSid(e.target.value); setAdded(false) }}>
              {upcoming.map((s) => { const d = parse(s.date); return <option key={s.id} value={s.id}>{d.getDate()} {months[d.getMonth()]} · {s.group} · {s.goal}</option> })}
            </select>
            <select className="sel" id="dd-phase" value={phase} onChange={(e) => { setPhase(e.target.value as Phase); setAdded(false) }}>
              {PHASES.map((p) => <option key={p} value={p}>{t(p)}</option>)}
            </select>
            <button className="btn small" onClick={add} disabled={added}>{added ? '✓ ' + t('added') : '+ ' + t('addTo')}</button>
          </div>
        </div>
      )}
      <div className="row"><button className="btn ghost" onClick={onClose}>{t('close')}</button></div>
    </Modal>
  )
}
