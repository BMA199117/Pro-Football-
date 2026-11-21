import { useState } from 'react'
import { useT, useDrills } from '../hooks'
import { update, useData } from '../store'
import { DrillDetail } from '../components/DrillDetail'
import { Pitch } from '../components/Pitch'
import { Modal, ConfirmButton } from '../components/Modal'
import { uid } from '../dates'
import { CATEGORIES, type Category, type Diagram, type Drill } from '../types'

const CAT_COLOR: Record<Category, string> = { tech: 'var(--pitch)', tact: 'var(--blue)', phys: 'var(--cone)', gk: 'var(--purple)' }
const DIAGRAMS: Diagram[] = ['pass', 'dribble', 'rondo', 'smallgame', 'shoot', 'sprint', 'warmup', 'gk']

export function Drills() {
  const { t, L } = useT()
  const drills = useDrills()
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [age, setAge] = useState('')
  const [onlyFav, setOnlyFav] = useState(false)
  const [onlyBooks, setOnlyBooks] = useState(false)
  const [detail, setDetail] = useState<Drill | null>(null)
  const favs = useData().favorites ?? []
  const ages = ['U8', 'U10', 'U12', 'U14', 'U16']
  // "U8–U12" covers U8, U10 and U12
  const fitsAge = (range: string) => {
    if (!age) return true
    const n = range.match(/\d+/g)?.map(Number) ?? []
    const a = Number(age.slice(1))
    return n.length === 0 || (a >= n[0] && a <= (n[1] ?? n[0]))
  }
  const shown = drills.filter((d) => (cat === 'all' || d.cat === cat) && fitsAge(d.age) && (!onlyFav || favs.includes(d.id)) && (!onlyBooks || !!d.source) &&
    (q === '' || (d.name.uz + ' ' + d.name.ru).toLowerCase().includes(q.toLowerCase())))

  return (
    <>
      <div className="head">
        <div><h1>{t('lib')}</h1><p className="sub">{t('libSub')}</p></div>
        <button className="btn" onClick={() => setAdding(true)}>+ {t('own')}</button>
      </div>
      <div className="filters">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{t(c)}</button>
        ))}
        <button aria-pressed={onlyFav} onClick={() => setOnlyFav(!onlyFav)}>★ {t('favs')}</button>
        <button aria-pressed={onlyBooks} onClick={() => setOnlyBooks(!onlyBooks)}>📖 {t('fromBooks')}</button>
        <select className="sel small" id="drill-age" value={age} onChange={(e) => setAge(e.target.value)} aria-label={t('age')}>
          <option value="">{t('allAges')}</option>
          {ages.map((a) => <option key={a}>{a}</option>)}
        </select>
        <input className="search" id="drill-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
      </div>
      <div className="cards">
        {shown.map((d) => (
          <article className="card" key={d.id}>
            <button className="card-open" onClick={() => setDetail(d)} aria-label={L(d.name)}><Pitch type={d.dia} maxHeight={110} /></button>
            <div className="b">
              <button className="n link" onClick={() => setDetail(d)}>{favs.includes(d.id) && <span className="fav">★ </span>}{L(d.name)}</button>
              <p>{L(d.desc)}</p>
              <p className="eq">{t('equip')}: {L(d.equip)}</p>
              <div className="meta">
                <span className="chip" style={{ boxShadow: `inset 3px 0 0 ${CAT_COLOR[d.cat]}` }}>{t(d.cat)}</span>
                <span className="chip">{d.age}</span>
                <span className="chip cone">{d.min} {t('min')}</span>
                {d.source && <span className="chip book" title={t('source')}>📖</span>}
              </div>
              {d.custom && (
                <ConfirmButton label={t('del')} confirmLabel={t('yes')}
                  onConfirm={() => update((x) => ({ ...x, customDrills: x.customDrills.filter((y) => y.id !== d.id) }))} />
              )}
            </div>
          </article>
        ))}
      </div>
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
