import { useMemo, useState } from 'react'
import { useT } from '../hooks'
import { update, useData } from '../store'
import { dict } from '../i18n'
import { iso, parse, uid, addDays } from '../dates'
import { SOURCES } from '../sources'
import { TEMPLATES } from '../templates'
import { ConfirmButton } from '../components/Modal'
import { SessionForm } from './SessionForm'
import { SEASON_AGES, SEASON_PROGRAMS, defaultStart, microcycle, planWeeks, programOf, type PlanWeek, type SeasonPlan, type SeasonProgram } from '../season'
import type { Template } from '../types'

/** Season plan: the book's programme laid out on the calendar, month by month, week by week. */
export function Season() {
  const { t, L } = useT()
  const data = useData()
  const plans = data.seasons ?? []
  const [sel, setSel] = useState<string | null>(plans[0]?.id ?? null)
  const [creating, setCreating] = useState(plans.length === 0)
  const plan = plans.find((p) => p.id === sel) ?? (creating ? null : plans[0] ?? null)
  const prog = plan ? programOf(plan.program) : undefined

  return (
    <>
      {plans.length > 0 && (
        <div className="filters" role="group">
          {plans.map((p) => {
            const pr = programOf(p.program)
            return <button key={p.id} aria-pressed={!creating && plan?.id === p.id} onClick={() => { setSel(p.id); setCreating(false) }}>{p.group} · {pr ? L(pr.title) : p.program}</button>
          })}
          <button aria-pressed={creating} onClick={() => setCreating(true)}>+ {t('newSeason')}</button>
        </div>
      )}
      {creating || !plan || !prog
        ? <NewSeason onSaved={(id) => { setSel(id); setCreating(false) }} />
        : <PlanView plan={plan} prog={prog} key={plan.id} />}
    </>
  )
}

function NewSeason({ onSaved }: { onSaved: (id: string) => void }) {
  const { t, L } = useT()
  const data = useData()
  const [age, setAge] = useState(SEASON_AGES[3])
  const list = SEASON_PROGRAMS.filter((p) => p.ages === age)
  const [pid, setPid] = useState(list[0]?.id ?? '')
  const prog = programOf(pid) ?? list[0]
  const [start, setStart] = useState(prog ? defaultStart(prog) : iso(new Date()))
  const [group, setGroup] = useState(data.groups[0] ?? 'U12')
  const [bw, setBw] = useState<number | undefined>(undefined)
  const [repeat, setRepeat] = useState(false)
  const pick = (p: SeasonProgram) => { setPid(p.id); setStart(defaultStart(p)); setBw(undefined); setRepeat(false) }
  const chooseAge = (a: string) => { setAge(a); const first = SEASON_PROGRAMS.find((p) => p.ages === a); if (first) pick(first) }

  const save = () => {
    if (!prog) return
    const id = uid()
    const plan: SeasonPlan = { id, program: prog.id, group, start, ...(bw ? { blockWeeks: bw } : {}), ...(repeat ? { repeat } : {}) }
    update((d) => ({ ...d, groups: d.groups.includes(group) ? d.groups : [...d.groups, group], seasons: [...(d.seasons ?? []), plan] }))
    onSaved(id)
  }

  return (
    <div className="panel season-new">
      {(data.seasons ?? []).length === 0 && <p className="sub" style={{ margin: 0 }}>{t('seasonEmpty')}</p>}
      <div>
        <h3 className="label">{t('pickAge')}</h3>
        <div className="ages" role="group">
          {SEASON_AGES.map((a) => <button key={a} aria-pressed={age === a} onClick={() => chooseAge(a)}>{a} {t('ages')}</button>)}
        </div>
      </div>
      <div className="list">
        <h3 className="label">{t('pickProgram')}</h3>
        {list.map((p) => (
          <button key={p.id} className="pick prog" aria-pressed={prog?.id === p.id} onClick={() => pick(p)}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{L(p.title)}</b>
              <div className="m">{L(p.summary)}</div>
              <div className="m src">📖 {SOURCES[p.source]?.title}</div>
            </div>
          </button>
        ))}
      </div>
      {prog && (
        <div className="form">
          <label>{t('seasonStart')}<input id="ss-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} required /></label>
          <label>{t('group')}
            <input id="ss-group" list="ss-groups" value={group} onChange={(e) => setGroup(e.target.value)} />
            <datalist id="ss-groups">{data.groups.map((g) => <option key={g} value={g} />)}</datalist>
          </label>
          {prog.blockWeeks && (
            <label>{t('blockLen')}
              <select id="ss-bw" value={bw ?? prog.units[0].weeks} onChange={(e) => setBw(+e.target.value)}>
                {prog.blockWeeks.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          )}
          {prog.canRepeat && <label className="check full"><input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} /> {t('repeatBlocks')}</label>}
          <div className="row full"><button className="btn" onClick={save} disabled={!start || !group.trim()}>{t('savePlan')}</button></div>
        </div>
      )}
    </div>
  )
}

function PlanView({ plan, prog }: { plan: SeasonPlan; prog: SeasonProgram }) {
  const { t, L, lang, months } = useT()
  const full = dict[lang].monthsFull
  const weeks = useMemo(() => planWeeks(prog, plan), [prog, plan])
  const today = iso(new Date())
  const current = weeks.find((w) => w.monday <= today && today < iso(addDays(parse(w.monday), 7)))
  const [open, setOpen] = useState<string | null>(current?.monday ?? null)
  const [form, setForm] = useState<{ date: string; goal: string; tpl?: Template } | null>(null)
  const tplOf = (id: string) => TEMPLATES.find((x) => x.id === id)
  const range = (w: PlanWeek) => { const a = parse(w.monday), b = addDays(a, 6); return a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${months[a.getMonth()]}` : `${a.getDate()} ${months[a.getMonth()]} – ${b.getDate()} ${months[b.getMonth()]}` }
  const dayMonth = (d: string) => { const x = parse(d); return `${x.getDate()} ${months[x.getMonth()]}` }
  const weekWord = (n: number) => (lang === 'ru' ? `Неделя ${n}` : `${n}-hafta`)

  // group the weeks by the month of their Monday
  const byMonth: { key: string; m: number; y: number; weeks: PlanWeek[] }[] = []
  for (const w of weeks) {
    const d = parse(w.monday), key = `${d.getFullYear()}-${d.getMonth()}`
    const last = byMonth[byMonth.length - 1]
    if (last?.key === key) last.weeks.push(w); else byMonth.push({ key, m: d.getMonth(), y: d.getFullYear(), weeks: [w] })
  }
  const stageOnly = prog.units.every((u) => u.weeks === 0)
  const last = weeks[weeks.length - 1]

  return (
    <div className="panel season">
      <div className="head">
        <div>
          <h2>{L(prog.title)}</h2>
          <div className="meta" style={{ marginTop: 8 }}>
            <span className="chip">{t('group')}: {plan.group}</span>
            {!stageOnly && last && <span className="chip">{dayMonth(weeks[0].monday)} – {dayMonth(iso(addDays(parse(last.monday), 6)))} {parse(last.monday).getFullYear()} · {weeks.length} {t('weeksL')}</span>}
            {prog.perWeek && <span className="chip cone">{t('perWeekL')}: {prog.perWeek.split(' / ')[lang === 'ru' ? 1 : 0] ?? prog.perWeek}</span>}
            {prog.minutes && <span className="chip cone">{prog.minutes} {t('minL')}</span>}
          </div>
          <p className="sub">{L(prog.summary)}</p>
        </div>
        <ConfirmButton label={t('delPlan')} confirmLabel={t('yes')} onConfirm={() => update((d) => ({ ...d, seasons: (d.seasons ?? []).filter((x) => x.id !== plan.id) }))} />
      </div>

      {stageOnly && prog.units.map((u) => (
        <div key={u.id} className="sw-open">
          <b>{L(u.title)}</b>
          <p className="sub">{t('stageYear')}</p>
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            {(u.tpl ?? []).map((id) => { const x = tplOf(id); return x && <button key={id} className="btn ghost small" onClick={() => setForm({ date: today, goal: L(x.title), tpl: x })}>📋 {L(x.title)}</button> })}
          </div>
        </div>
      ))}

      {!stageOnly && byMonth.map((mo) => (
        <section key={mo.key} className="smonth">
          <h3 className="smonth-h">{full[mo.m]} <span className="muted">{mo.y}</span></h3>
          {mo.weeks.map((w) => {
            const isOpen = open === w.monday
            const mc = prog.months ? microcycle(weeks, w) : 0
            const row = prog.months && !w.rest ? monthRow(prog, mc) : undefined
            const title = w.rest ? L(w.rest) : w.unit ? L(w.unit.title) : row ? `${full[row.m]}: ${t('hTech').toLowerCase()} ${row.tech}, ${t('hTact').toLowerCase()} ${row.tact}, ${t('hSpec').toLowerCase()} ${row.spec} ${t('hoursL')}` : ''
            const tag = w.unit?.kind === 'block' ? `${w.k}/${plan.blockWeeks ?? w.unit.weeks}` : ''
            return (
              <div key={w.monday} className={'sweek' + (w === current ? ' now' : '') + (w.rest ? ' rest' : '') + (w.unit ? ' k-' + w.unit.kind : '')}>
                <button className="sweek-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : w.monday)} disabled={!!w.rest}>
                  <span className="sweek-d">{range(w)}</span>
                  <span className="sweek-t">
                    {prog.months && !w.rest && <small>{t('mc')} {mc}{w.unit ? ' · ' : ''}</small>}
                    {!w.unit && row ? <small className="mrow"> · {t('byBook')} {title}</small> : title}
                    {w.again && <small className="again"> · {t('again')}</small>}
                  </span>
                  {tag && <span className="chip">{tag}</span>}
                  {w === current && <span className="chip cone">{t('thisWeek')}</span>}
                </button>
                {isOpen && !w.rest && (
                  <div className="sw-open">
                    {w.unit?.focus && <p className="sub" style={{ margin: 0 }}>{L(w.unit.focus)}</p>}
                    {!w.unit && <p className="sub" style={{ margin: 0 }}>{t('noTheme')}</p>}
                    <div className="row" style={{ justifyContent: 'flex-start' }}>
                      {(w.unit?.tpl ?? []).map((id) => { const x = tplOf(id); return x && <button key={id} className="btn small" onClick={() => setForm({ date: w.monday < today ? today : w.monday, goal: L(x.title), tpl: x })}>📋 {t('readyPlan')}: {L(x.title)}</button> })}
                      <button className={'btn small' + (w.unit?.tpl ? ' ghost' : '')} onClick={() => setForm({ date: w.monday < today ? today : w.monday, goal: w.unit ? stripNo(L(w.unit.title)) : `${weekWord(w.n)}` })}>+ {t('makeSession')}</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      ))}

      {prog.months && (
        <div className="stable-wrap">
          <h3 className="label">{t('monthHours')}</h3>
          <table className="stable">
            <thead><tr><th>{t('hMonth')}</th><th>{t('mc')}</th><th>{t('hTech')}</th><th>{t('hTact')}</th><th>{t('hSpec')}</th><th>{t('hTheory')}</th><th>{t('hTotal')}</th></tr></thead>
            <tbody>
              {prog.months.map((r) => <tr key={r.m}><td>{full[r.m]}</td><td>{r.mc}</td><td>{r.tech}</td><td>{r.tact}</td><td>{r.spec}</td><td>{r.theory}</td><td><b>{r.total}</b></td></tr>)}
              <tr className="rest"><td>{full[6]}</td><td colSpan={6}>{t('summerBreak')}</td></tr>
            </tbody>
          </table>
          {prog.year && (
            <>
              <h3 className="label" style={{ marginTop: 12 }}>{t('yearHours')}</h3>
              <div className="meta">{prog.year.map((y) => <span key={y.label.uz} className="chip">{L(y.label)}: <b>{y.v}</b></span>)}</div>
            </>
          )}
        </div>
      )}

      {prog.rules.length > 0 && (
        <div>
          <h3 className="label">{t('bookRules')}</h3>
          <ul className="points">{prog.rules.map((r, i) => <li key={i}>{L(r)}</li>)}</ul>
        </div>
      )}
      {SOURCES[prog.source] && <p className="source">📖 {t('source')}: {SOURCES[prog.source].author}, «{SOURCES[prog.source].title}»</p>}
      {form && <SessionForm defaultDate={form.date} goal={form.goal} template={form.tpl} onClose={() => setForm(null)} />}
    </div>
  )
}

/** NOI: the book's month column a microcycle belongs to. */
function monthRow(p: SeasonProgram, mc: number) {
  return p.months?.find((r) => { const [a, b] = r.mc.split('–').map(Number); return mc >= a && mc <= b })
}

/** "3-blok. Texnika. Zarba" → "Texnika. Zarba" for a session goal; "Неделя 2: …" → "…". */
const stripNo = (s: string) => s.replace(/^(\d+-(blok|hafta)[.:]\s*|Блок \d+\.\s*|Неделя \d+:\s*)/, '')
