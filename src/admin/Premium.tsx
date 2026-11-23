import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../sync'
import { useContent, BUILTIN } from '../content'
import { CATALOG, PAYWALL_BUILD, localDetails } from '../content-source'
import { BANDS, fitsBand } from '../ages'
import { SEASON_AGES, SEASON_PROGRAMS } from '../season'
import { FREE_PER_BAND } from '../premium/defaults'
import { refreshAccess, useAccess, type FreeKind } from '../premium/access'
import { toDetails, type Details } from '../premium/split'
import FREE_DEFAULTS from '../generated/free-defaults.json'
import { when } from './api'

interface Sub { user_id: string; email: string | null; plan: string; until: string | null; note: string | null; updated_at: string }
type Msg = { text: string; err?: boolean } | null
const CAT_UZ: Record<string, string> = { tech: 'Texnika', tact: 'Taktika', phys: 'Jismoniy', gk: 'Darvozabon' }

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('no server')
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

export function Premium() {
  const [tab, setTab] = useState<'subs' | 'free' | 'server'>('subs')
  return (
    <>
      <div className="head">
        <div><h1>Obuna (Premium)</h1><p className="sub">Kimda obuna bor, nimalar bepul va serverdagi mashq ma'lumotlari</p></div>
      </div>
      <div className="filters">
        <button aria-pressed={tab === 'subs'} onClick={() => setTab('subs')}>⭐ Obunachilar</button>
        <button aria-pressed={tab === 'free'} onClick={() => setTab('free')}>🎁 Bepul mashqlar va rejalar</button>
        <button aria-pressed={tab === 'server'} onClick={() => setTab('server')}>☁️ Serverdagi ma'lumot</button>
      </div>
      {tab === 'subs' && <Subs />}
      {tab === 'free' && <FreeItems />}
      {tab === 'server' && <ServerData />}
    </>
  )
}

/* ------------------------------------------------------------ subscribers */
function Subs() {
  const [list, setList] = useState<Sub[] | null>(null)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<Msg>(null)
  const load = () => rpc<Sub[]>('admin_premium').then(setList, () => setMsg({ text: "Ro'yxatni yuklab bo'lmadi. paywall.sql Supabase'da ishga tushirilganmi?", err: true }))
  useEffect(() => { load() }, [])

  const give = async (target: string, days: number | null, n = note) => {
    if (!target.trim()) return
    setBusy(true); setMsg(null)
    try {
      const r = await rpc<string>('admin_set_premium', { target_email: target.trim(), days, note: n.trim() || null })
      if (r === 'no_user') setMsg({ text: `${target} email bilan hisob topilmadi. Murabbiy avval ilovada ro'yxatdan o'tishi kerak.`, err: true })
      else {
        setMsg({ text: days === 0 ? `${target}: obuna olib tashlandi.` : `${target}: obuna berildi.` })
        if (target === email) { setEmail(''); setNote('') }
        load(); refreshAccess()
      }
    } catch { setMsg({ text: "Saqlab bo'lmadi. Internetni tekshiring.", err: true }) }
    setBusy(false)
  }
  const active = (s: Sub) => !s.until || Date.parse(s.until) > Date.now()
  const daysLeft = (s: Sub) => (s.until ? Math.ceil((Date.parse(s.until) - Date.now()) / 86_400_000) : null)

  return (
    <>
      <section className="panel add-admin">
        <h2 className="label">Obuna berish</h2>
        <p className="muted small">Murabbiy to'lov qilganda shu yerda uning emailini yozing. Onlayn to'lov ulanganda bu avtomatik bo'ladi. Muddat qo'shilsa, hozirgi obunaning ustiga qo'shiladi.</p>
        <div className="form" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <label>Murabbiy emaili<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="murabbiy@gmail.com" /></label>
          <label>Izoh (ixtiyoriy)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Masalan: Click, 23.11, 49 000" /></label>
        </div>
        <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <button className="btn" disabled={busy || !email.trim()} onClick={() => give(email, 30)}>+ 1 oy</button>
          <button className="btn" disabled={busy || !email.trim()} onClick={() => give(email, 90)}>+ 3 oy</button>
          <button className="btn" disabled={busy || !email.trim()} onClick={() => give(email, 365)}>+ 1 yil</button>
          <button className="btn ghost" disabled={busy || !email.trim()} onClick={() => give(email, null)}>Muddatsiz</button>
        </div>
        {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      </section>
      <h2 className="label">Obunachilar {list && <span className="muted">· faol: {list.filter(active).length}</span>}</h2>
      {list && list.length === 0 && <p className="muted">Hali obunachi yo'q.</p>}
      <div className="adm-list">
        {(list ?? []).map((s) => (
          <article key={s.user_id} className={'adm-row' + (active(s) ? '' : ' is-hidden')}>
            <div className="adm-main">
              <b>{s.email ?? '—'} {active(s) ? <span className="badge">faol</span> : <span className="badge gray">tugagan</span>}</b>
              <span className="muted small">
                {s.until ? `${when(s.until, false)} gacha${active(s) ? ` · ${daysLeft(s)} kun qoldi` : ''}` : 'Muddatsiz'} · berilgan: {when(s.updated_at, false)}{s.note ? ` · ${s.note}` : ''}
              </span>
            </div>
            <div className="adm-act">
              <button className="btn ghost small" disabled={busy || !s.email} onClick={() => give(s.email!, 30, '')}>+1 oy</button>
              <button className="btn ghost small" disabled={busy || !s.email} onClick={() => give(s.email!, 365, '')}>+1 yil</button>
              <button className="btn ghost small danger" disabled={busy || !s.email} onClick={() => give(s.email!, 0, '')}>Olib tashlash</button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------- free items */
function FreeItems() {
  const access = useAccess()
  const { drills, plans, planAges } = useContent()
  const [free, setFree] = useState<Record<FreeKind, Set<string>> | null>(null)
  const [band, setBand] = useState(BANDS[0].id)
  const [q, setQ] = useState('')
  const [msg, setMsg] = useState<Msg>(null)
  const [busy, setBusy] = useState(false)
  const load = async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('free_items').select('kind,id')
    if (error) { setMsg({ text: "Bepul ro'yxatni o'qib bo'lmadi. paywall.sql ishga tushirilganmi?", err: true }); return }
    const f: Record<FreeKind, Set<string>> = { drill: new Set(), plan: new Set(), season: new Set() }
    for (const r of data as { kind: FreeKind; id: string }[]) f[r.kind]?.add(r.id)
    setFree(f)
  }
  useEffect(() => { load() }, [access.uid])

  const toggle = async (kind: FreeKind, id: string, on: boolean) => {
    if (!supabase || !free) return
    setBusy(true); setMsg(null)
    const { error } = on ? await supabase.from('free_items').insert({ kind, id }) : await supabase.from('free_items').delete().eq('kind', kind).eq('id', id)
    setBusy(false)
    if (error) { setMsg({ text: "Saqlab bo'lmadi.", err: true }); return }
    const next = { ...free, [kind]: new Set(free[kind]) }
    if (on) next[kind].add(id); else next[kind].delete(id)
    setFree(next); refreshAccess()
  }
  const setDefaults = async () => {
    if (!supabase) return
    setBusy(true); setMsg(null)
    const rows = (Object.entries(FREE_DEFAULTS) as [FreeKind, string[]][]).flatMap(([kind, ids]) => ids.map((id) => ({ kind, id })))
    const { error } = await supabase.from('free_items').upsert(rows, { onConflict: 'kind,id', ignoreDuplicates: true })
    setBusy(false)
    if (error) setMsg({ text: "Saqlab bo'lmadi.", err: true })
    else { setMsg({ text: `Standart ro'yxat qo'shildi: har yosh toifasida ${FREE_PER_BAND} ta mashq, har yosh guruhida 1 ta reja.` }); load(); refreshAccess() }
  }

  const b = BANDS.find((x) => x.id === band)!
  const inBand = drills.filter((d) => fitsBand(d.age, b))
  const shown = inBand.filter((d) => q === '' || (d.name.uz + ' ' + d.name.ru).toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => Number(!free?.drill.has(x.id)) - Number(!free?.drill.has(y.id)))
  const nFree = (bb: typeof b) => drills.filter((d) => fitsBand(d.age, bb) && free?.drill.has(d.id)).length

  if (!free) return msg ? <p className="note err">{msg.text}</p> : <p className="muted">Yuklanmoqda…</p>
  return (
    <>
      <p className="muted small">Belgilangan mashqlar va rejalar hamma uchun ochiq, qolganlari faqat obunachilarga. O'zgarish murabbiylarda bir necha soniyada ko'rinadi.</p>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      {free.drill.size === 0 && (
        <div className="note">Bepul ro'yxat bo'sh: hozir hamma mashq yopiq. <button className="btn small" disabled={busy} onClick={setDefaults}>Standart ro'yxatni qo'shish</button></div>
      )}
      <h2 className="label">Mashqlar</h2>
      <div className="filters">
        {BANDS.map((x) => (
          <button key={x.id} aria-pressed={band === x.id} onClick={() => setBand(x.id)}>
            {x.id === 'pro' ? 'Professional' : x.label} <span className="cnt">{nFree(x)}/{drills.filter((d) => fitsBand(d.age, x)).length}</span>
          </button>
        ))}
        <input className="search" placeholder="Qidirish…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Qidirish" />
      </div>
      <p className="small">{b.id === 'pro' ? 'Professional' : b.label}: <b>{nFree(b)}</b> ta bepul {nFree(b) < FREE_PER_BAND && <span className="danger-t">(kelishilgan {FREE_PER_BAND} tadan kam)</span>}</p>
      <div className="adm-list">
        {shown.map((d) => (
          <label key={d.id} className="adm-row free-row">
            <input type="checkbox" checked={free.drill.has(d.id)} disabled={busy} onChange={(e) => toggle('drill', d.id, e.target.checked)} />
            <div className="adm-main">
              <b>{d.name.uz}</b>
              <span className="muted small">{CAT_UZ[d.cat] ?? d.cat} · {d.age} · {d.min} daq · {d.id}</span>
            </div>
            {free.drill.has(d.id) ? <span className="badge">bepul</span> : <span className="badge cone">obunada</span>}
          </label>
        ))}
      </div>
      <h2 className="label">Tayyor mashg'ulot rejalari</h2>
      {planAges.filter((a) => plans.some((p) => p.ages === a)).map((age) => (
        <details key={age} className="panel free-group">
          <summary><b>{age === 'Pro' ? 'Professional' : `${age} yosh`}</b> <span className="muted small">· {plans.filter((p) => p.ages === age && free.plan.has(p.id)).length} bepul / {plans.filter((p) => p.ages === age).length}</span></summary>
          {plans.filter((p) => p.ages === age).map((p) => (
            <label key={p.id} className="check"><input type="checkbox" checked={free.plan.has(p.id)} disabled={busy} onChange={(e) => toggle('plan', p.id, e.target.checked)} /> {p.title.uz}</label>
          ))}
        </details>
      ))}
      <h2 className="label">Mavsum rejalari (dasturlar)</h2>
      {SEASON_AGES.map((age) => (
        <details key={age} className="panel free-group">
          <summary><b>{age === 'Pro' ? 'Professional' : `${age} yosh`}</b> <span className="muted small">· {SEASON_PROGRAMS.filter((p) => p.ages === age && free.season.has(p.id)).length} bepul / {SEASON_PROGRAMS.filter((p) => p.ages === age).length}</span></summary>
          {SEASON_PROGRAMS.filter((p) => p.ages === age).map((p) => (
            <label key={p.id} className="check"><input type="checkbox" checked={free.season.has(p.id)} disabled={busy} onChange={(e) => toggle('season', p.id, e.target.checked)} /> {p.title.uz}</label>
          ))}
        </details>
      ))}
      {free.drill.size > 0 && <p className="muted small"><button className="linkish" disabled={busy} onClick={setDefaults}>Standart ro'yxatni yana qo'shish</button> (borlarini o'chirmaydi)</p>}
    </>
  )
}

/* ------------------------------------------------------------ server data */
function ServerData() {
  const [have, setHave] = useState<{ n: number; last: string | null } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<Msg>(null)
  const total = BUILTIN.drill.length
  const load = async () => {
    if (!supabase) return
    const { count, error } = await supabase.from('drill_details').select('id', { count: 'exact', head: true })
    const { data } = await supabase.from('drill_details').select('updated_at').order('updated_at', { ascending: false }).limit(1)
    if (error) { setMsg({ text: "Serverni o'qib bo'lmadi. paywall.sql ishga tushirilganmi?", err: true }); return }
    setHave({ n: count ?? 0, last: (data?.[0] as { updated_at: string } | undefined)?.updated_at ?? null })
  }
  useEffect(() => { load() }, [])

  // in a build that still carries the books (development / no paid version) the details can be sent straight from the code
  const fromCode = useMemo(() => (PAYWALL_BUILD ? null : Object.fromEntries(CATALOG.map((d) => [d.id, toDetails(d, localDetails(d.id) ?? {})]))), [])

  const upload = async (details: Record<string, Details>) => {
    if (!supabase) return
    const rows = Object.entries(details).map(([id, data]) => ({ id, data, updated_at: new Date().toISOString() }))
    for (let i = 0; i < rows.length; i += 40) {
      setBusy(`Yuklanmoqda… ${Math.min(i + 40, rows.length)} / ${rows.length}`)
      const { error } = await supabase.from('drill_details').upsert(rows.slice(i, i + 40), { onConflict: 'id' })
      if (error) { setBusy(null); setMsg({ text: `Yuklab bo'lmadi (${error.message}).`, err: true }); return }
    }
    // the first upload also makes the default free list, so new coaches see 5 open drills per age at once
    const { count } = await supabase.from('free_items').select('id', { count: 'exact', head: true })
    if (!count) {
      const free = (Object.entries(FREE_DEFAULTS) as [FreeKind, string[]][]).flatMap(([kind, ids]) => ids.map((id) => ({ kind, id })))
      await supabase.from('free_items').upsert(free, { onConflict: 'kind,id', ignoreDuplicates: true })
    }
    setBusy(null); setMsg({ text: `${rows.length} ta mashq ma'lumoti serverga yuklandi.` }); load(); refreshAccess()
  }
  const onFile = async (f: File | undefined) => {
    if (!f) return
    setMsg(null)
    try {
      const j = JSON.parse(await f.text()) as { v?: number; details?: Record<string, Details> }
      if (!j.details || typeof j.details !== 'object') throw new Error('bad')
      await upload(j.details)
    } catch { setMsg({ text: "Bu fayl to'g'ri emas. «drill-details.json» faylini tanlang.", err: true }) }
  }

  return (
    <>
      <section className="panel">
        <h2 className="label">Mashqlarning to'liq ma'lumoti serverda</h2>
        <p className="muted small">Pullik versiyada mashqlarning tavsifi, chizmasi, animatsiyasi va maslahatlari sayt kodida yo'q: ular serverda turadi va faqat ruxsati bor murabbiyga yuboriladi. Kitoblardan yangi mashqlar qo'shilganda bu yerga yangi «drill-details.json» faylini yuklash kerak.</p>
        {have && <p>Serverda: <b>{have.n}</b> / {total} ta mashq {have.last && <span className="muted small">· oxirgi yuklash: {when(have.last)}</span>}</p>}
        {have && have.n < total && <p className="note err">Serverda hamma mashq yo'q: yetishmaganlari murabbiylarda chizmasiz ko'rinadi. Faylni yuklang.</p>}
        <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <label className="btn">
            📤 drill-details.json faylini yuklash
            <input type="file" accept="application/json,.json" hidden disabled={!!busy} onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
          </label>
          {fromCode && <button className="btn ghost" disabled={!!busy} onClick={() => upload(fromCode)}>Ilova ichidagi ma'lumotni yuklash</button>}
        </div>
        {busy && <p className="muted">{busy}</p>}
        {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      </section>
    </>
  )
}
