import { useState } from 'react'
import { Modal } from './Modal'
import { DrillViews } from './AnimatedPitch'
import { LineKey } from './BookPitch'
import { sceneOf } from '../scene-of'
import { useT } from '../hooks'
import { update, useData } from '../store'
import { parse } from '../dates'
import { PHASES, type Drill, type Phase } from '../types'
import { SOURCES } from '../sources'
import { BENEFITS } from '../benefits'
import { SKILLS } from '../skills'
import { DrillForm } from './DrillForm'

export function DrillDetail({ drill: drill0, onClose }: { drill: Drill; onClose: () => void }) {
  const { t, L, months, lang } = useT()
  const data = useData()
  // a drill the coach edits here shows its new version at once
  const drill = data.customDrills.find((x) => x.id === drill0.id) ?? drill0
  const ben = BENEFITS[drill.id]
  const fav = (data.favorites ?? []).includes(drill.id)
  const upcoming = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const [sid, setSid] = useState(upcoming[0]?.id ?? '')
  const [phase, setPhase] = useState<Phase>('main')
  const [added, setAdded] = useState(false)
  const [editing, setEditing] = useState(false)

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
      <DrillViews id={drill.id} type={drill.dia} />
      {sceneOf(drill.id) && <LineKey scene={sceneOf(drill.id)!} label={(k) => t(({ run: 'kRun', drib: 'kDrib', pass: 'kPass', shot: 'kShot', lob: 'kLob' } as const)[k])} />}
      <div className="meta">
        <span className="chip">{t(drill.cat)}</span>
        <span className="chip">{drill.age}</span>
        <span className="chip cone">{drill.min} {t('min')}</span>
        {drill.players && <span className="chip">{t('playersCount')}: {drill.players}</span>}
        <button className={'star' + (fav ? ' on' : '')} onClick={toggleFav} aria-pressed={fav} aria-label={t('favs')}>★</button>
      </div>
      {L(drill.desc) && <p className="lead">{L(drill.desc)}</p>}
      {ben && (
        <div className="benefit">
          <h3 className="label">💡 {t('why')}</h3>
          <p>{lang === 'ru' ? ben[2] : ben[1]}</p>
          <div className="skills"><span className="skills-l">{t('develops')}:</span>{ben[0].map((k) => <span key={k} className="skill">{SKILLS[k][lang === 'ru' ? 1 : 0]}</span>)}</div>
        </div>
      )}
      <p className="sub"><b>{t('equip')}:</b> {L(drill.equip)}</p>
      {drill.source && SOURCES[drill.source] && (
        <p className="source">📖 {t('source')}: {SOURCES[drill.source].author}, «{SOURCES[drill.source].title}»</p>
      )}
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
      <div className="row">
        {drill.custom && <button className="btn ghost" onClick={() => setEditing(true)}>✏️ {t('edit')}</button>}
        <button className="btn ghost" onClick={onClose}>{t('close')}</button>
      </div>
      {editing && <DrillForm drill={drill} onClose={() => setEditing(false)} />}
    </Modal>
  )
}
