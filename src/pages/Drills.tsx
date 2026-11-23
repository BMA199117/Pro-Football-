import { useState } from 'react'
import { useT, useDrills } from '../hooks'
import { update, useData } from '../store'
import { DrillDetail } from '../components/DrillDetail'
import { DrillPitch } from '../components/AnimatedPitch'
import { BOOK_SCENES } from '../book'
import { ConfirmButton } from '../components/Modal'
import { uid } from '../dates'
import { DrillForm } from '../components/DrillForm'
import { Board } from '../components/Board'
import { CATEGORIES, type Category, type Drill } from '../types'

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

export function Drills() {
  const { t, L } = useT()
  // drills drawn from the books first, so every card looks like its own exercise
  const drills = [...useDrills()].sort((a, b) => Number(!BOOK_SCENES[a.id]) - Number(!BOOK_SCENES[b.id]))
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [age, setAge] = useState('')
  const [view, setView] = useState<'base' | 'fav' | 'mine'>('base')
  const [onlyBooks, setOnlyBooks] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeFilters = Number(cat !== 'all') + Number(onlyBooks)
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
            <button className="card-open" onClick={() => setDetail(d)} aria-label={L(d.name)}><DrillPitch id={d.id} type={d.dia} maxHeight={110} /><span className="play-badge" aria-hidden="true">▶</span></button>
            <div className="b">
              <button className="n link" onClick={() => setDetail(d)}>{favs.includes(d.id) && <span className="fav">★ </span>}{L(d.name)}</button>
              <p>{L(d.desc)}</p>
              <dl className="facts">
                {d.players && <><dt>{t('playersCount')}</dt><dd>{d.players}</dd></>}
                <dt>{t('ageCat')}</dt><dd>{ageList(d.age)}</dd>
                <dt>{t('equip')}</dt><dd>{L(d.equip)}</dd>
              </dl>
              <p className="mini" aria-hidden="true">
                {d.players && <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M15 20c0-2.5 1.5-4.5 4-4.5" /></svg>{d.players}</span>}
                <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></svg>{d.min}′</span>
              </p>
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
        <div className="head-btns">
          <button className="btn" onClick={() => setDrawing(true)}>✏️ {t('board')}</button>
          <button className="btn ghost" onClick={() => setAdding(true)}>+ {t('own')}</button>
        </div>
      </div>
      <div className="dtool">
        <input className="search" id="drill-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
        <button className="filter-btn" aria-expanded={filtersOpen} aria-controls="drill-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>{t('filter')}{activeFilters > 0 && <i>{activeFilters}</i>}
        </button>
      </div>
      <div className="libtabs" role="group">
        {(['base', 'fav', 'mine'] as const).map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'fav' ? '★ ' + t('favs') : t(v)}</button>
        ))}
      </div>
      <div className="ages" role="group" aria-label={t('age')}>
        <button aria-pressed={age === ''} onClick={() => setAge('')}>{t('allAges')}<small>{base.length}</small></button>
        {BANDS.filter((b) => b.id === age || drills.some((d) => fitsBand(d.age, b))).map((b) => (
          <button key={b.id} aria-pressed={age === b.id} onClick={() => setAge(b.id)}>
            {b.label}<span className="yrs">{b.from}–{b.to} {t('years')}</span><small>{base.filter((d) => fitsBand(d.age, b)).length}</small>
          </button>
        ))}
      </div>
      <div className={'filters' + (filtersOpen ? ' open' : '')} id="drill-filters">
        {(['all', ...CATEGORIES] as const).map((c) => (
          <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{t(c)}</button>
        ))}
        <button aria-pressed={onlyBooks} onClick={() => setOnlyBooks(!onlyBooks)}>📖 {t('fromBooks')}</button>
      </div>
      {sections.map(({ band: b, list }) => (
        <section key={b.id} className="band">
          <h2 className="band-h">{b.label} <span>· {b.from}–{b.to} {t('years')} · {list.length} {t('drillsN')}</span></h2>
          <div className="cards">{list.map(card)}</div>
        </section>
      ))}
      {shown.length === 0 && <p className="empty">{t('noDrills')}</p>}
      {adding && <DrillForm onClose={() => setAdding(false)} />}
      {drawing && <Board onClose={() => setDrawing(false)} onSave={(scene, name) => {
        const both = { uz: name, ru: name }
        const d: Drill = { id: uid(), cat: 'tact', dia: 'smallgame', age: 'U8–U17', min: 10, name: both, desc: { uz: '', ru: '' }, equip: { uz: '—', ru: '—' }, points: [], custom: true, scene }
        update((x) => ({ ...x, customDrills: [d, ...x.customDrills] }))
        setDrawing(false); setView('mine'); setDetail(d)
      }} />}
      {detail && <DrillDetail drill={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
