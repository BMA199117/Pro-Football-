import { useState } from 'react'
import { useT, useDrills } from '../hooks'
import { update, useData } from '../store'
import { DrillDetail } from '../components/DrillDetail'
import { Pitch } from '../components/Pitch'
import { Modal, ConfirmButton } from '../components/Modal'
import { uid } from '../dates'
import { CATEGORIES, type Category, type Diagram, type Drill } from '../types'

const CAT_COLOR: Record<Category, string> = { tech: 'var(--pitch)', tact: 'var(--blue)', phys: 'var(--cone)', gk: 'var(--purple)' }
type Band = { id: string; label: string; from: number; to: number }
const BANDS: Band[] = [
  { id: 'u8', label: 'U6–U8', from: 6, to: 8 },
  { id: 'u10', label: 'U9–U10', from: 9, to: 10 },
  { id: 'u12', label: 'U11–U12', from: 11, to: 12 },
  { id: 'u14', label: 'U13–U14', from: 13, to: 14 },
  { id: 'u17', label: 'U15–U17', from: 15, to: 17 },
]
/** "U9–U12" → "U9, U10, U11, U12" (long ranges stay short) */
const ageList = (r: string) => {
  const n = r.match(/\d+/g)?.map(Number) ?? []
  if (n.length < 2 || n[1] - n[0] > 3) return r
  return Array.from({ length: n[1] - n[0] + 1 }, (_, i) => 'U' + (n[0] + i)).join(', ')
}
const DIAGRAMS: Diagram[] = ['pass', 'dribble', 'rondo', 'smallgame', 'shoot', 'duel', 'overload', 'sprint', 'warmup', 'gk']

export function Drills() {
  const { t, L } = useT()
  const drills = useDrills()
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [age, setAge] = useState('')
  const [view, setView] = useState<'base' | 'fav' | 'mine'>('base')
  const [onlyBooks, setOnlyBooks] = useState(false)
  const [detail, setDetail] = useState<Drill | null>(null)
  const favs = useData().favorites ?? []
  const range = (r: string): [number, number] => {
    const n = r.match(/\d+/g)?.map(Number) ?? []
    return n.length ? [n[0], n[1] ?? n[0]] : [0, 99]
  }
  const fitsBand = (r: string, b: Band) => { const [a, z] = range(r); return a <= b.to && z >= b.from }
  const base = drills.filter((d) => (cat === 'all' || d.cat === cat) && (view !== 'fav' || favs.includes(d.id)) && (view !== 'mine' || !!d.custom) && (!onlyBooks || !!d.source) &&
    (q === '' || (d.name.uz + ' ' + d.name.ru).toLowerCase().includes(q.toLowerCase())))
  const band = BANDS.find((b) => b.id === age)
  const shown = band ? base.filter((d) => fitsBand(d.age, band)) : base
  // "all ages": one section per age band, each drill under the youngest band it suits
  const sections = band ? [{ band, list: shown }] : BANDS.map((b) => ({ band: b, list: base.filter((d) => BANDS.find((x) => fitsBand(d.age, x)) === b) })).filter((s) => s.list.length)
  const card = (d: Drill) => (
          <article className="card" key={d.id}>
            <button className="card-open" onClick={() => setDetail(d)} aria-label={L(d.name)}><Pitch type={d.dia} maxHeight={110} /><span className="play-badge" aria-hidden="true">▶</span></button>
            <div className="b">
              <button className="n link" onClick={() => setDetail(d)}>{favs.includes(d.id) && <span className="fav">★ </span>}{L(d.name)}</button>
              <p>{L(d.desc)}</p>
              <dl className="facts">
                {d.players && <><dt>{t('playersCount')}</dt><dd>{d.players}</dd></>}
                <dt>{t('ageCat')}</dt><dd>{ageList(d.age)}</dd>
                <dt>{t('equip')}</dt><dd>{L(d.equip)}</dd>
              </dl>
              <div className="meta">
                <span className="chip" style={{ boxShadow: `inset 3px 0 0 ${CAT_COLOR[d.cat]}` }}>{t(d.cat)}</span>
                <span className="chip cone">{d.min} {t('min')}</span>
                {d.source && <span className="chip book" title={t('source')}>📖</span>}
              </div>
              {d.custom && (
                <ConfirmButton label={t('del')} confirmLabel={t('yes')}
                  onConfirm={() => update((x) => ({ ...x, customDrills: x.customDrills.filter((y) => y.id !== d.id) }))} />
              )}
            </div>
          </article>
  )

  return (
    <>
      <div className="head">
        <div><h1>{t('lib')}</h1><p className="sub">{t('libSub')}</p></div>
        <button className="btn" onClick={() => setAdding(true)}>+ {t('own')}</button>
      </div>
      <div className="libtabs" role="group">
        {(['base', 'fav', 'mine'] as const).map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'fav' ? '★ ' + t('favs') : t(v)}</button>
        ))}
      </div>
      <div className="ages" role="group" aria-label={t('age')}>
        <button aria-pressed={age === ''} onClick={() => setAge('')}>{t('allAges')}<small>{base.length}</small></button>
        {BANDS.map((b) => (
          <button key={b.id} aria-pressed={age === b.id} onClick={() => setAge(b.id)}>
            {b.label}<span className="yrs">{b.from}–{b.to} {t('years')}</span><small>{base.filter((d) => fitsBand(d.age, b)).length}</small>
          </button>
        ))}
      </div>
      <div className="filters">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{t(c)}</button>
        ))}
        <button aria-pressed={onlyBooks} onClick={() => setOnlyBooks(!onlyBooks)}>📖 {t('fromBooks')}</button>
        <input className="search" id="drill-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
      </div>
      {sections.map(({ band: b, list }) => (
        <section key={b.id} className="band">
          <h2 className="band-h">{b.label} <span>· {b.from}–{b.to} {t('years')} · {list.length} {t('drillsN')}</span></h2>
          <div className="cards">{list.map(card)}</div>
        </section>
      ))}
      {shown.length === 0 && <p className="empty">{t('noDrills')}</p>}
      {adding && <DrillForm onClose={() => setAdding(false)} />}
      {detail && <DrillDetail drill={detail} onClose={() => setDetail(null)} />}
    </>
  )
}

function DrillForm({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const [f, setF] = useState({ name: '', desc: '', cat: 'tech' as Category, dia: 'pass' as Diagram, min: 10, age: 'U10–U14', equip: '', points: '' })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: k === 'min' ? Number(e.target.value) : e.target.value })
  const both = (s: string) => ({ uz: s, ru: s })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    update((d) => ({ ...d, customDrills: [{ id: uid(), cat: f.cat, dia: f.dia, age: f.age, min: f.min || 10, name: both(f.name.trim()), desc: both(f.desc.trim()), equip: both(f.equip.trim() || '—'), points: f.points.split('\n').map((x) => x.trim()).filter(Boolean).map(both), custom: true }, ...d.customDrills] }))
    onClose()
  }
  return (
    <Modal title={t('own')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="full">{t('name')}<input id="fd-name" value={f.name} onChange={set('name')} required autoFocus /></label>
        <label className="full">{t('desc')}<textarea id="fd-desc" rows={3} value={f.desc} onChange={set('desc')} /></label>
        <label>{t('cat')}<select id="fd-cat" value={f.cat} onChange={set('cat')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select></label>
        <label>{t('min')}<input id="fd-min" type="number" min={1} value={f.min} onChange={set('min')} /></label>
        <label>{t('age')}<input id="fd-age" value={f.age} onChange={set('age')} /></label>
        <label>{t('equip')}<input id="fd-eq" value={f.equip} onChange={set('equip')} /></label>
        <label className="full">{t('points')}<textarea id="fd-points" rows={3} value={f.points} onChange={set('points')} placeholder="1 qator = 1 maslahat" /></label>
        <div className="full">
          <div className="dia-pick">
            {DIAGRAMS.map((d) => (
              <button type="button" key={d} aria-pressed={f.dia === d} onClick={() => setF({ ...f, dia: d })}><Pitch type={d} maxHeight={50} /></button>
            ))}
          </div>
        </div>
        <div className="row full">
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn">{t('save')}</button>
        </div>
      </form>
    </Modal>
  )
}
