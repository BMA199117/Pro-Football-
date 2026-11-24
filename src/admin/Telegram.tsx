import { useEffect, useState } from 'react'
import { supabase } from '../sync'

interface Status {
  error?: string
  missing?: string[]
  detail?: string
  shape?: { length: number; colon: boolean; digitsBefore: number; spaces: boolean; quotes: boolean; tail?: string }
  bot?: { username: string; name: string }
  webhook?: { ok: boolean; url: string; error: string | null }
  users?: { total: number | null; subscribed: number | null; linked: number | null }
  tableMissing?: boolean
  appUrl?: string
}
type Msg = { text: string; err?: boolean } | null

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } }
  const r = await fetch('/api/tg/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (data.session?.access_token || '') },
    body: JSON.stringify(body),
  })
  const j = await r.json().catch(() => null)
  if (!j) throw new Error(r.status === 404 ? 'no_function' : 'bad_response')
  return j as T
}

const NEWS_UZ = "⚽ Yangi mashqlar qo'shildi!\n\nPro Football'da yangi mashqlar paydo bo'ldi. Ko'rish uchun pastdagi tugmani bosing."

export function Telegram() {
  const [st, setSt] = useState<Status | null>(null)
  const [msg, setMsg] = useState<Msg>(null)
  const [busy, setBusy] = useState(false)
  const [text, setText] = useState('')
  const [button, setButton] = useState(true)
  const [progress, setProgress] = useState<{ sent: number; failed: number; done: boolean } | null>(null)

  const load = () => call<Status>({ action: 'status' }).then(setSt, (e: Error) => setSt({ error: e.message }))
  useEffect(() => { load() }, [])

  const setup = async () => {
    setBusy(true); setMsg(null)
    try {
      const r = await call<{ ok: boolean; failed?: string[]; error?: string }>({ action: 'setup' })
      setMsg(r.ok ? { text: 'Bot sozlandi: menyu tugmasi, buyruqlar va tavsif qo\'yildi, xabarlar endi saytga keladi.' } : { text: 'Sozlab bo\'lmadi: ' + (r.failed?.join('; ') || r.error), err: true })
      load()
    } catch { setMsg({ text: "Serverga ulanib bo'lmadi.", err: true }) }
    setBusy(false)
  }

  const send = async () => {
    const body = text.trim()
    if (!body) return
    setBusy(true); setMsg(null)
    let after: number | null = 0
    const p = { sent: 0, failed: 0, done: false }
    setProgress({ ...p })
    try {
      while (after !== null) {
        const r: { sent?: number; failed?: number; next?: number | null; error?: string } = await call({ action: 'broadcast', text: body, button, after })
        if (r.error) throw new Error(r.error)
        p.sent += r.sent || 0; p.failed += r.failed || 0
        setProgress({ ...p })
        after = r.next ?? null
      }
      setProgress({ ...p, done: true })
      setMsg({ text: `Yuborildi: ${p.sent} ta murabbiyga.` + (p.failed ? ` ${p.failed} tasiga yetmadi (botni bloklagan).` : '') })
      setText('')
      load()
    } catch { setMsg({ text: `Yuborish to'xtadi. ${p.sent} tasiga yuborildi. Qayta urinib ko'ring.`, err: true }) }
    setBusy(false)
  }

  const head = (
    <div className="head">
      <div><h1>Telegram bot</h1><p className="sub">Bot ichida ilova (Mini App), Telegram bilan kirish, murabbiylarga xabar yuborish</p></div>
    </div>
  )
  if (!st) return <>{head}<p className="muted">Yuklanmoqda…</p></>

  if (st.error === 'no_function' || st.error === 'bad_response') {
    return <>{head}<p className="note err">Bot serveri topilmadi. Sayt Cloudflare'da yangilanganini tekshiring (bu bo'lim faqat pro-football.pages.dev manzilida ishlaydi).</p></>
  }
  if (st.error === 'not_configured') {
    return (
      <>{head}
        <section className="panel">
          <h2 className="label">Sozlash kerak</h2>
          <p>Cloudflare'da quyidagi maxfiy kalitlar hali qo'shilmagan:</p>
          <ul>{(st.missing || []).map((m) => <li key={m}><code>{m}</code></li>)}</ul>
          <p className="muted small">Cloudflare → Workers & Pages → pro-football → Settings → Variables and Secrets → Add (turi: Secret). Qo'shgandan keyin saytni qayta deploy qiling va shu sahifani yangilang.</p>
        </section>
      </>
    )
  }
  if (st.error === 'bad_token') {
    const sh = st.shape
    return (
      <>{head}
        <p className="note err">Bot tokeni noto'g'ri: Telegram uni qabul qilmadi ({st.detail || 'xato'}). BotFather'dan tokenni qayta nusxalab, Cloudflare'dagi TELEGRAM_BOT_TOKEN ni yangilang va saytni qayta deploy qiling.</p>
        {sh && <p className="muted small">Cloudflare'dagi qiymat: {sh.length} belgi, «:» {sh.colon ? 'bor' : "yo'q"}, undan oldin {sh.digitsBefore} ta raqam{sh.spaces ? ', bo\'sh joy bor' : ''}{sh.quotes ? ', qo\'shtirnoq bor' : ''}. To'g'ri token taxminan 46 belgi, «:» dan oldin 10 ta raqam bo'ladi.{sh.tail && <> Sayt ishlatayotgan tokenning oxirgi 4 belgisi: <b>…{sh.tail}</b>. BotFather bergan yangi token ham shu belgilar bilan tugashini solishtiring.</>}</p>}
        <p className="muted small">«Unauthorized» chiqsa, token eskirgan: BotFather'da /mybots → bot → API Token → Revoke qilib, yangisini qo'ying.</p>
      </>
    )
  }
  if (st.error) return <>{head}<p className="note err">Holatni olib bo'lmadi ({st.error}).</p></>

  const link = st.bot ? `https://t.me/${st.bot.username}` : ''
  return (
    <>
      {head}
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')} role="status">{msg.text}</p>}
      <section className="panel">
        <h2 className="label">Holat</h2>
        <p>Bot: <a href={link} target="_blank" rel="noreferrer"><b>@{st.bot?.username}</b></a> ({st.bot?.name})</p>
        <p>{st.webhook?.ok ? '✅ Bot saytga ulangan' : '⚠️ Bot hali saytga ulanmagan: «Botni sozlash» tugmasini bosing.'}
          {st.webhook?.error && <span className="muted small"> · oxirgi xato: {st.webhook.error}</span>}</p>
        {st.tableMissing
          ? <p className="note err">Supabase'da tg_users jadvali yo'q: telegram.sql faylini SQL Editor'da ishga tushiring.</p>
          : <p>Botga «Start» bosganlar: <b>{st.users?.total ?? 0}</b> · xabar oladiganlar: <b>{st.users?.subscribed ?? 0}</b> · ilovaga Telegram bilan kirganlar: <b>{st.users?.linked ?? 0}</b></p>}
        <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <button className="btn" disabled={busy} onClick={setup}>{st.webhook?.ok ? 'Qayta sozlash' : 'Botni sozlash'}</button>
          <button className="btn ghost" disabled={busy} onClick={load}>Yangilash</button>
          {link && <a className="btn ghost" href={link} target="_blank" rel="noreferrer">Botni ochish</a>}
        </div>
        <p className="muted small">«Botni sozlash» Telegram'ga sayt manzilini ({st.appUrl}), menyu tugmasini, buyruqlarni (/start, /help, /stop) va o'zbekcha/ruscha tavsifni yuboradi. Domen o'zgarsa, qayta bosing.</p>
      </section>

      <section className="panel">
        <h2 className="label">Murabbiylarga xabar yuborish</h2>
        <p className="muted small">Botga «Start» bosgan va xabarlarni o'chirmagan hamma murabbiyga boradi. Masalan, yangi mashqlar qo'shilganda.</p>
        <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <button className="btn ghost small" onClick={() => setText(NEWS_UZ)}>Namuna: yangi mashqlar</button>
        </div>
        <label className="full" style={{ display: 'block', marginTop: 8 }}>
          Xabar matni
          <textarea rows={6} maxLength={3500} value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%' }} placeholder="Masalan: 20 ta yangi Barça mashqi qo'shildi…" />
        </label>
        <label className="check"><input type="checkbox" checked={button} onChange={(e) => setButton(e.target.checked)} /> Ostida «Ilovani ochish» tugmasi</label>
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <button className="btn" disabled={busy || !text.trim() || !st.users?.subscribed} onClick={send}>
            {busy && progress ? `Yuborilmoqda… ${progress.sent}` : `Yuborish (${st.users?.subscribed ?? 0} ta)`}
          </button>
        </div>
      </section>
    </>
  )
}
