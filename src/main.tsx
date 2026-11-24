import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { initSync, supabase } from './sync'
import { initContent } from './content'
import { initAccess } from './premium/access'
import { initTelegram, inTelegram, tgLang, tgLink, tgSignIn } from './telegram'
import { TgWelcome } from './components/TgWelcome'
import { prefsSaved, setPrefs } from './store'
import './styles.css'

async function start() {
  // Opened from the Telegram bot: load Telegram's script first (nothing changes in a normal browser).
  await initTelegram()
  if (inTelegram() && !prefsSaved()) { const l = tgLang(); if (l) setPrefs({ lang: l }) }
  registerSW({ immediate: true })
  initSync()
  initContent()
  initAccess()
  if (inTelegram() && supabase) {
    const sb = supabase
    // Already tied to an account: open signed in. Signed in some other way: tie this Telegram to that account.
    sb.auth.getSession().then(({ data }) => { void (data.session ? tgLink(sb) : tgSignIn(sb, false)) })
    sb.auth.onAuthStateChange((event) => { if (event === 'SIGNED_IN') setTimeout(() => tgLink(sb), 0) })
  }
  createRoot(document.getElementById('root')!).render(<StrictMode><App />{inTelegram() && <TgWelcome />}</StrictMode>)
}
start()
