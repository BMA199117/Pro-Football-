import { useEffect, useState } from 'react'
import { supabase, signIn, signOut, useSync } from '../sync'
import { refreshContent, type Kind } from '../content'
import { useIsAdmin } from './api'
import { Dashboard } from './Dashboard'
import { Coaches, Admins } from './Coaches'
import { ContentList } from './ContentList'
import { History } from './History'
import { KIND_LABEL } from './labels'

export type Section = 'home' | 'coaches' | Kind | 'history' | 'admins'
const NAV: [Section, string, string][] = [
  ['home', "Umumiy ko'rinish", '📊'],
  ['coaches', 'Murabbiylar', '👥'],
  ['drill', KIND_LABEL.drill.many, '⚽'],
  ['plan', KIND_LABEL.plan.many, '📋'],
  ['card', KIND_LABEL.card.many, '💡'],
  ['stage', KIND_LABEL.stage.many, '📈'],
  ['principle', KIND_LABEL.principle.many, '🧭'],
  ['source', KIND_LABEL.source.many, '📖'],
  ['history', "O'zgarishlar tarixi", '🕘'],
  ['admins', 'Adminlar', '🔑'],
]

const back = () => { location.hash = '' }

function Gate({ children }: { children: React.ReactNode }) {
  const { status, email } = useSync()
  const admin = useIsAdmin()
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!supabase) return <Center><h1>Admin panel</h1><p>Server (Supabase) ulanmagan, shuning uchun admin panel ishlamaydi.</p><button className="btn ghost" onClick={back}>← Ilovaga qaytish</button></Center>
  if (!email && status === 'signedOut') {
    return (
      <Center>
        <h1>Admin panel</h1>
        <p className="muted">Admin hisobingiz bilan kiring.</p>
        <form className="form" style={{ gridTemplateColumns: '1fr' }} onSubmit={async (e) => {
          e.preventDefault(); setBusy(true); setErr(null)
          const r = await signIn(f.email.trim(), f.password)
          setBusy(false)
          if (r) setErr(r === 'badLogin' ? "Email yoki parol noto'g'ri." : r === 'noNet' ? "Internet yo'q." : "Kirib bo'lmadi. Qayta urinib ko'ring.")
        }}>
          <label>Email<input type="email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required autoFocus /></label>
          <label>Parol<input type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></label>
          {err && <p className="note err">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Kirilmoqda…' : 'Kirish'}</button>
        </form>
        <p className="muted small">Parol o'rnatmagan bo'lsangiz: ilovada «Sinxronlash» → emailga kod bilan kiring → «Parol o'rnatish».</p>
        <button className="linkish" onClick={back}>← Ilovaga qaytish</button>
      </Center>
    )
  }
  if (admin === null) return <Center><p className="muted">Tekshirilmoqda…</p></Center>
  if (!admin) {
    return (
      <Center>
        <h1>Ruxsat yo'q</h1>
        <p><b>{email}</b> hisobida admin huquqi yo'q.</p>
        <p className="muted small">Agar bu sizning asosiy hisobingiz bo'lsa: Supabase'da admin.sql faylining oxiridagi qadamni bajaring (emailingizni yozib, Run bosing). Keyin bu sahifani yangilang.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn ghost" onClick={back}>← Ilovaga qaytish</button>
          <button className="btn ghost" onClick={() => signOut(true)}>Boshqa hisob bilan kirish</button>
        </div>
      </Center>
    )
  }
  return <>{children}</>
}

const Center = ({ children }: { children: React.ReactNode }) => <div className="adm-center"><div className="panel">{children}</div></div>

export default function AdminApp() {
  const [sec, setSec] = useState<Section>(() => (sessionStorage.getItem('pf-admin-sec') as Section) || 'home')
  const { email } = useSync()
  useEffect(() => { try { sessionStorage.setItem('pf-admin-sec', sec) } catch { /* ignore */ } window.scrollTo(0, 0) }, [sec])
  useEffect(() => { refreshContent() }, [])
  useEffect(() => { document.title = 'Admin · Pro Football' }, [])
  return (
    <Gate>
      <div className="adm">
        <aside className="adm-nav">
          <div className="brand">Pro Football<small>Admin panel</small></div>
          <nav>
            {NAV.map(([k, l, ic]) => (
              <button key={k} aria-current={sec === k} onClick={() => setSec(k)}><span aria-hidden="true">{ic}</span>{l}</button>
            ))}
          </nav>
          <div className="adm-foot">
            <span className="small">{email}</span>
            <button className="btn light ghost small" onClick={back}>← Ilovaga qaytish</button>
          </div>
        </aside>
        <main><div className="wrap" key={sec}>
          {sec === 'home' && <Dashboard go={setSec} />}
          {sec === 'coaches' && <Coaches />}
          {sec === 'history' && <History />}
          {sec === 'admins' && <Admins />}
          {sec !== 'home' && sec !== 'coaches' && sec !== 'history' && sec !== 'admins' && <ContentList kind={sec} />}
        </div></main>
      </div>
    </Gate>
  )
}
