import { useState } from 'react'
import { useT, useDrills } from '../hooks'
import { update, useData } from '../store'
import { DrillDetail } from '../components/DrillDetail'
import { DrillPitch } from '../components/AnimatedPitch'
import { useContent } from '../content'
import { AccessChip, PaywallModal } from '../premium/Locked'
import { hasPremium, useAccess } from '../premium/access'
import { ageText, BANDS, fitsBand, type Band } from '../ages'
import { ConfirmButton } from '../components/Modal'
import { uid } from '../dates'
import { DrillForm } from '../components/DrillForm'
import { Board } from '../components/Board'
import { CATEGORIES, type Category, type Drill } from '../types'

const CAT_COLOR: Record<Category, string> = { tech: 'var(--pitch)', tact: 'var(--blue)', phys: 'var(--cone)', gk: 'var(--purple)' }
/** "U9–U12" → "U9, U10, U11, U12" (long ranges stay short) */
const ageList = (r: string) => {
  const n = r.match(/\d+/g)?.map(Number) ?? []
  if (n.length < 2 || n[1] - n[0] > 3) return r
  return Array.from({ length: n[1] - n[0] + 1 }, (_, i) => 'U' + (n[0] + i)).join(', ')
}

export function Drills() {
  const { t, L } = useT()
  // drills drawn from the books first, so every card looks like its own exercise
  const { scene, body, locked } = useContent()
  const access = useAccess()
  const paid = !hasPremium(access) // the coach sees free and closed drills
  const [pw, setPw] = useState<Drill | null>(null)
  const open = (d: Drill) => (!d.custom && locked(d.id) ? setPw(d) : setDetail(d))
  const drills = [...useDrills()].sort((a, b) => Number(a.custom || !(scene(a.id) || body(a.id))) - Number(b.custom || !(scene(b.id) || body(b.id))))
    // without premium the free drills come first
    .sort((a, b) => Number(!a.custom && locked(a.id)) - Number(!b.custom && locked(b.id)))
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [age, setAge] = useState('')
  const [view, setView] = useState<'base' | 'fav' | 'mine'>('base')
  const [onlyBooks, setOnlyBooks] = useState(false)
  const [detail, setDetail] = useState<Drill | null>(null)
  const favs = useData().favorites ?? []
  const bandLabel = (b: Band) => (b.id === 'pro' ? t('proBand') : b.label)
  const bandYears = (b: Band) => (b.to >= 99 ? `${b.from}+` : `${b.from}–${b.to}`)
  const base = drills.filter((d) => (cat === 'all' || d.cat === cat) && (view !== 'fav' || favs.includes(d.id)) && (view !== 'mine' || !!d.custom) && (!onlyBooks || !!d.source) &&
    (q === '' || (d.name.uz + ' ' + d.name.ru).toLowerCase().includes(q.toLowerCase())))
  const band = BANDS.find((b) => b.id === age)
  // the professional band shows the drills made only for adults first
  const shown = band ? base.filter((d) => fitsBand(d.age, band)).sort((a, b) => band.id === 'pro' ? Number(a.age !== 'Pro') - Number(b.age !== 'Pro') : 0) : base
  // "all ages": one section per age band, each drill under the youngest band it suits
  const sections = band ? [{ band, list: shown }] : BANDS.map((b) => ({ band: b, list: base.filter((d) => BANDS.find((x) => fitsBand(d.age, x)) === b) })).filter((s) => s.list.length)
  const card = (d: Drill) => (
          <article className="card" key={d.id}>
            <button className="card-open" onClick={() => open(d)} aria-label={L(d.name)}><DrillPitch id={d.id} type={d.dia} maxHeight={110} /><span className="play-badge" aria-hidden="true">▶</span></button>
            <div className="b">
              <button className="n link" onClick={() => open(d)}>{favs.includes(d.id) && <span className="fav">★ </span>}{L(d.name)}</button>
              <p>{L(d.desc)}</p>
              <dl className="facts">
                {d.players && <><dt>{t('playersCount')}</dt><dd>{d.players}</dd></>}
                <dt>{t('ageCat')}</dt><dd>{ageText(ageList(d.age), t('proAges'))}</dd>
                <dt>{t('equip')}</dt><dd>{L(d.equip)}</dd>
              </dl>
              <div className="meta">
                <span className="chip" style={{ boxShadow: `inset 3px 0 0 ${CAT_COLOR[d.cat]}` }}>{t(d.cat)}</span>
                <span className="chip cone">{d.min} {t('min')}</span>
                {d.source && <span className="chip book" title={t('source')}>📖</span>}
                {paid && !d.custom && <AccessChip locked={locked(d.id)} />}
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
      <div className="libtabs" role="group">
        {(['base', 'fav', 'mine'] as const).map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'fav' ? '★ ' + t('favs') : t(v)}</button>
        ))}
      </div>
      <div className="ages" role="group" aria-label={t('age')}>
        <button aria-pressed={age === ''} onClick={() => setAge('')}>{t('allAges')}<small>{base.length}</small></button>
        {BANDS.filter((b) => b.id === age || drills.some((d) => fitsBand(d.age, b))).map((b) => (
          <button key={b.id} aria-pressed={age === b.id} onClick={() => setAge(b.id)}>
            {bandLabel(b)}<span className="yrs">{bandYears(b)} {t('years')}</span><small>{base.filter((d) => fitsBand(d.age, b)).length}</small>
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
          <h2 className="band-h">{bandLabel(b)} <span>· {bandYears(b)} {t('years')} · {list.length} {t('drillsN')}{paid && <> · {list.filter((d) => d.custom || !locked(d.id)).length} {t('freeN')}</>}</span></h2>
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
      {pw && <PaywallModal title={L(pw.name)} why="drill" onClose={() => setPw(null)} />}
      {detail && <DrillDetail drill={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
