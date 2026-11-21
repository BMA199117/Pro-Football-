import { useState } from 'react'
import { useT, useDrills, sessionMinutes, PHASE_COLOR } from '../hooks'
import { update, useData, usePrefs, setPrefs } from '../store'
import { Pitch } from '../components/Pitch'
import { Modal, ConfirmButton } from '../components/Modal'
import { SessionForm } from './SessionForm'
import { DrillDetail } from '../components/DrillDetail'
import { RunSession } from '../components/RunSession'
import { sampleData } from '../sample'
import { parse, weekdayIndex } from '../dates'
import { PHASES, type Drill, type Phase, type Template } from '../types'
import { TEMPLATES } from '../templates'

export function Plan() {
  const { t, L, days, months } = useT()
  const data = useData()
  const { selected } = usePrefs()
  const drills = useDrills()
  const byId = new Map(drills.map((d) => [d.id, d]))
  const [form, setForm] = useState<'new' | 'edit' | null>(null)
  const [picking, setPicking] = useState<Phase | null>(null)
  const [detail, setDetail] = useState<Drill | null>(null)
  const [running, setRunning] = useState(false)
  const [tplOpen, setTplOpen] = useState(false)
  const [tpl, setTpl] = useState<Template | null>(null)

  const sorted = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const s = sorted.find((x) => x.id === selected) ?? sorted[0]
  const fmt = (d: string) => { const x = parse(d); return { d: x.getDate(), m: months[x.getMonth()], w: days[weekdayIndex(x)] } }

  const head = (
    <div className="head">
      <div><h1>{t('plan')}</h1><p className="sub">{t('planSub')}</p></div>
      <div className="row">
        <button className="btn ghost" onClick={() => setTplOpen(true)}>📋 {t('fromTemplate')}</button>
        <button className="btn" onClick={() => setForm('new')}>+ {t('newS')}</button>
      </div>
    </div>
  )
  const tplMins = (x: Template) => PHASES.reduce((a, p) => a + x.phases[p].reduce((b, id) => b + (byId.get(id)?.min ?? 0), 0), 0)
  const modals = (
    <>
      {tplOpen && (
        <Modal title={t('templates')} onClose={() => setTplOpen(false)}>
          <p className="sub" style={{ margin: 0 }}>{t('templatesSub')}</p>
          {['10–14', '15–17'].map((age) => (
            <div key={age} className="list">
              <h3 className="label">{age} {t('ages')}</h3>
              {TEMPLATES.filter((x) => x.ages === age).map((x) => (
                <button key={x.id} className="pick tpl" onClick={() => { setTpl(x); setTplOpen(false) }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{L(x.title)}</b>
                    <div className="m">{L(x.focus)}</div>
                  </div>
                  <span className="chip cone">{tplMins(x)} {t('min')}</span>
                </button>
              ))}
            </div>
          ))}
          <div className="row"><button className="btn ghost" onClick={() => setTplOpen(false)}>{t('close')}</button></div>
        </Modal>
      )}
      {tpl && <SessionForm template={tpl} onClose={() => setTpl(null)} />}
    </>
  )

  if (!s) return (
    <>
      {head}
      <div className="panel empty-state">
        <p>{t('noSessions')}</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn ghost" onClick={() => update(() => sampleData())}>{t('loadSample')}</button>
        </div>
      </div>
      {form && <SessionForm onClose={() => setForm(null)} />}
      {modals}
    </>
  )

  const total = sessionMinutes(s, drills)
  const came = Object.values(s.att).filter(Boolean).length
  const groupSize = data.players.filter((p) => p.group === s.group).length
  const f = fmt(s.date)
  const editPhase = (p: Phase, fn: (ids: string[]) => string[]) =>
    update((d) => ({ ...d, sessions: d.sessions.map((x) => (x.id === s.id ? { ...x, phases: { ...x.phases, [p]: fn(x.phases[p]) } } : x)) }))

  return (
    <>
      {head}
      <div className="grid2">
        <div className="list">
          {sorted.map((x) => {
            const g = fmt(x.date)
            return (
              <button key={x.id} className="sess" aria-current={x.id === s.id} onClick={() => setPrefs({ selected: x.id })}>
                <div className="date"><b>{g.d}</b><span>{g.m}</span></div>
                <div><div className="t">{x.goal}</div><div className="m">{g.w}, {x.time} · {x.group} · {sessionMinutes(x, drills)} {t('min')}</div></div>
              </button>
            )
          })}
        </div>
        <div className="panel">
          <div className="head">
            <div>
              <h2>{s.goal}</h2>
              <div className="meta" style={{ marginTop: 8 }}>
                <span className="chip">{f.w}, {f.d} {f.m} · {s.time}</span>
                <span className="chip">{t('group')}: {s.group}</span>
                <span className="chip cone">{t('total')}: {total} {t('min')}</span>
                {came > 0 && <span className="chip">{came}/{groupSize} {t('present')}</span>}
              </div>
              {s.notes && <p className="sub">{s.notes}</p>}
            </div>
            <div className="row">
              {total > 0 && <button className="btn small cone-btn" onClick={() => setRunning(true)}>▶ {t('start')}</button>}
              <button className="btn ghost small" onClick={() => setForm('edit')}>{t('edit')}</button>
              <ConfirmButton label={t('del')} confirmLabel={t('yes')} onConfirm={() => update((d) => ({ ...d, sessions: d.sessions.filter((x) => x.id !== s.id) }))} />
            </div>
          </div>
          <div className="bar">
            {total > 0 && PHASES.map((p) => {
              const m = s.phases[p].reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0)
              return <i key={p} style={{ width: `${(m / total) * 100}%`, background: PHASE_COLOR[p] }} title={`${t(p)} ${m}`} />
            })}
          </div>
          {PHASES.map((p) => {
            const m = s.phases[p].reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0)
            return (
              <div className="phase" key={p}>
                <div className="phase-h">
                  <h3><span className="dot" style={{ background: PHASE_COLOR[p] }} />{t(p)} <span className="muted">{m} {t('min')}</span></h3>
                  <button className="btn ghost small" onClick={() => setPicking(p)}>+ {t('add')}</button>
                </div>
                {s.phases[p].length === 0 && <div className="empty">{t('empty')}</div>}
                {s.phases[p].map((id, i) => {
                  const d = byId.get(id)
                  if (!d) return null
                  return (
                    <div className="drow" key={id + i}>
                      <Pitch type={d.dia} maxHeight={44} />
                      <button className="drow-main" onClick={() => setDetail(d)}><div className="n">{L(d.name)}</div><div className="m">{t(d.cat)} · {L(d.equip)}</div></button>
                      <span className="mins">{d.min}′</span>
                      <button className="x" aria-label={t('del')} onClick={() => editPhase(p, (ids) => ids.filter((_, j) => j !== i))}>×</button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
      {form && <SessionForm session={form === 'edit' ? s : undefined} onClose={() => setForm(null)} />}
      {detail && <DrillDetail drill={detail} onClose={() => setDetail(null)} />}
      {running && <RunSession session={s} onClose={() => setRunning(false)} />}
      {modals}
      {picking && (
        <Modal title={`${t('choose')} · ${t(picking)}`} onClose={() => setPicking(null)}>
          <div className="list">
            {drills.map((d) => (
              <button key={d.id} className="pick" onClick={() => { editPhase(picking, (ids) => [...ids, d.id]); setPicking(null) }}>
                <div style={{ width: 70, flex: 'none' }}><Pitch type={d.dia} maxHeight={40} /></div>
                <div style={{ flex: 1 }}><b>{L(d.name)}</b><div className="m">{t(d.cat)} · {d.min} {t('min')}</div></div>
              </button>
            ))}
          </div>
          <div className="row"><button className="btn ghost" onClick={() => setPicking(null)}>{t('cancel')}</button></div>
        </Modal>
      )}
    </>
  )
}
