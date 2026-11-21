import { useEffect, useState } from 'react'
import { usePrefs, setPrefs, type Tab } from './store'
import { useT } from './hooks'
import { Plan } from './pages/Plan'
import { Drills } from './pages/Drills'
import { Team } from './pages/Team'
import { Calendar } from './pages/Calendar'
import { Knowledge } from './pages/Knowledge'
import { SyncBadge, SyncPanel } from './components/SyncPanel'

const ICON: Record<Tab, React.ReactNode> = {
  plan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>,
  drills: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l7 15H5z" /><path d="M8 13h8" /></svg>,
  team: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1.5-4.5 4-4.5" /></svg>,
  know: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h6" /></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>,
}
const TABS: Tab[] = ['plan', 'drills', 'know', 'team', 'cal']

export default function App() {
  const { tab, lang } = usePrefs()
  const { t } = useT()
  const [sync, setSync] = useState(false)
  useEffect(() => { document.documentElement.lang = lang; document.title = t('appName') }, [lang, t])
  const Page = { plan: Plan, drills: Drills, team: Team, cal: Calendar, know: Knowledge }[tab]
  return (
    <div className="app">
      <aside className="rail">
        <div className="brand">{t('appName')}<small>{t('sub')}</small></div>
        <nav className="nav">
          {TABS.map((k) => (
            <button key={k} aria-current={tab === k} onClick={() => setPrefs({ tab: k })}>{ICON[k]}<span>{t(k)}</span></button>
          ))}
        </nav>
        <div className="rail-foot">
          <SyncBadge onClick={() => setSync(true)} />
          <div className="lang" role="group" aria-label="Til / Язык">
            {(['uz', 'ru'] as const).map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setPrefs({ lang: l })}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </aside>
      <main><div className="wrap"><Page /></div></main>
      {sync && <SyncPanel onClose={() => setSync(false)} />}
    </div>
  )
}
