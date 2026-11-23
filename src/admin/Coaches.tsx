import { useEffect, useState } from 'react'
import { deleteCoach, getCoaches, setAdmin, ago, when, type Coach } from './api'

type Sort = 'seen' | 'new' | 'sessions'

export function Coaches() {
  const [list, setList] = useState<Coach[] | null>(null)
  const [err, setErr] = useState(false)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('seen')
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  const [ask, setAsk] = useState<string | null>(null)
  const load = () => getCoaches().then((l) => { setList(l); setErr(false) }, () => setErr(true))
  useEffect(() => { load() }, [])

  const shown = (list ?? [])
    .filter((c) => q === '' || (c.email ?? '').toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'new' ? b.created_at.localeCompare(a.created_at)
      : sort === 'sessions' ? b.sessions - a.sessions
        : (b.last_seen ?? b.created_at).localeCompare(a.last_seen ?? a.created_at))

  const csv = () => {
    const head = ['email', "ro'yxatdan o'tgan", 'oxirgi kirish', 'faol kunlar', "mashg'ulotlar", "o'yinchilar", "o'z mashqlari", 'admin']
    const rows = (list ?? []).map((c) => [c.email ?? '', when(c.created_at), when(c.last_seen), c.days_active, c.sessions, c.players, c.own_drills, c.is_admin ? 'ha' : ''])
    const text = [head, ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv' }))
    a.download = `murabbiylar-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <>
      <div className="head">
        <div><h1>Murabbiylar</h1><p className="sub">Ro'yxatdan o'tgan hisoblar va ularning faolligi</p></div>
        <button className="btn ghost small" onClick={csv} disabled={!list?.length}>⬇ Excel uchun (CSV)</button>
      </div>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      {err && <p className="note err">Ro'yxatni yuklab bo'lmadi.</p>}
      <div className="filters">
        <input className="search" placeholder="Email bo'yicha qidirish…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Qidirish" />
        {([['seen', 'Oxirgi kirgan'], ['new', 'Yangi'], ['sessions', "Ko'p mashg'ulot"]] as [Sort, string][]).map(([k, l]) => (
          <button key={k} aria-pressed={sort === k} onClick={() => setSort(k)}>{l}</button>
        ))}
      </div>
      {list && <p className="muted small">{shown.length} ta murabbiy</p>}
      <div className="adm-list">
        {shown.map((c) => (
          <article key={c.user_id} className="adm-row coach">
            <div className="adm-main">
              <b>{c.email ?? '(email yo\'q)'} {c.is_admin && <span className="badge cone">admin</span>}</b>
              <span className="muted small">Ro'yxatdan o'tgan: {when(c.created_at, false)} · Oxirgi kirish: {ago(c.last_seen)} · Faol kunlar: {c.days_active}</span>
              <span className="badges">
                <span className="badge">{c.sessions} mashg'ulot</span>
                <span className="badge">{c.players} o'yinchi</span>
                <span className="badge">{c.own_drills} o'z mashqi</span>
              </span>
            </div>
            <div className="adm-act">
              {!c.is_admin && ask !== c.user_id && <button className="btn ghost small danger" onClick={() => setAsk(c.user_id)}>Hisobni o'chirish</button>}
              {ask === c.user_id && (
                <span className="confirm-inline">
                  <span className="small">Hisob va uning barcha ma'lumotlari (mashg'ulotlar, o'yinchilar) butunlay o'chadi. Rostdanmi?</span>
                  <button className="btn small danger-fill" onClick={async () => {
                    setAsk(null)
                    try {
                      const r = await deleteCoach(c.user_id)
                      setMsg(r === 'ok' ? { text: `${c.email} hisobi o'chirildi.` } : { text: "Adminni yoki o'zingizni o'chirib bo'lmaydi.", err: true })
                      load()
                    } catch { setMsg({ text: "O'chirib bo'lmadi.", err: true }) }
                  }}>Ha, o'chirish</button>
                  <button className="btn ghost small" onClick={() => setAsk(null)}>Yo'q</button>
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
      {list && list.length === 0 && <p className="muted">Hali murabbiy yo'q.</p>}
    </>
  )
}

export function Admins() {
  const [list, setList] = useState<Coach[] | null>(null)
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  const load = () => getCoaches().then((l) => setList(l.filter((c) => c.is_admin)), () => setMsg({ text: "Ro'yxatni yuklab bo'lmadi.", err: true }))
  useEffect(() => { load() }, [])
  const run = async (e: string, make: boolean) => {
    try {
      const r = await setAdmin(e, make)
      setMsg(r === 'ok' ? { text: make ? `${e} endi admin.` : `${e} endi admin emas.` }
        : r === 'no_user' ? { text: "Bu email bilan hisob topilmadi. Avval u ilovada ro'yxatdan o'tsin.", err: true }
          : { text: "O'zingizni adminlikdan olib bo'lmaydi.", err: true })
      if (r === 'ok') { setEmail(''); load() }
    } catch { setMsg({ text: 'Xatolik. Qayta urinib ko\'ring.', err: true }) }
  }
  return (
    <>
      <div className="head"><div><h1>Adminlar</h1><p className="sub">Admin panelga kira oladigan va kontentni o'zgartira oladigan odamlar</p></div></div>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      <div className="adm-list">
        {(list ?? []).map((c) => (
          <article key={c.user_id} className="adm-row">
            <div className="adm-main"><b>{c.email}</b><span className="muted small">Oxirgi kirish: {ago(c.last_seen)}</span></div>
            <div className="adm-act"><button className="btn ghost small danger" onClick={() => c.email && run(c.email, false)}>Adminlikdan olish</button></div>
          </article>
        ))}
      </div>
      <form className="panel add-admin" onSubmit={(e) => { e.preventDefault(); if (email.trim()) run(email.trim(), true) }}>
        <b>Yangi admin qo'shish</b>
        <p className="muted small">U avval ilovada shu email bilan ro'yxatdan o'tgan bo'lishi kerak. Admin hamma kontentni o'zgartira oladi va murabbiylar ro'yxatini ko'radi.</p>
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <input className="search wide" type="email" placeholder="email@misol.uz" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
          <button className="btn">Admin qilish</button>
        </div>
      </form>
    </>
  )
}
