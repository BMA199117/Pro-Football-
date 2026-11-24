/*
 * Running inside Telegram as a Mini App (opened from the Pro Football bot).
 * - Telegram's script is loaded only when the page was opened by Telegram, so the website stays as fast as before.
 * - Sign-in with the Telegram account: functions/api/tg/auth.js checks Telegram's signature and returns a one-time
 *   Supabase link token, which becomes a normal session here (sync, premium, admin all work as with email).
 * - PDFs go to the chat with the bot (downloads do not work inside Telegram).
 */
import { useSyncExternalStore } from 'react'

interface TgWebApp {
  initData: string
  initDataUnsafe: { user?: { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string; allows_write_to_pm?: boolean } }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  ready(): void
  expand(): void
  setHeaderColor?(c: string): void
  setBackgroundColor?(c: string): void
  disableVerticalSwipes?(): void
  isVersionAtLeast(v: string): boolean
  showAlert(msg: string, cb?: () => void): void
  requestWriteAccess?(cb: (ok: boolean) => void): void
  openTelegramLink(url: string): void
  openLink(url: string): void
  HapticFeedback?: { notificationOccurred(t: 'success' | 'error' | 'warning'): void }
}
declare global { interface Window { Telegram?: { WebApp?: TgWebApp } } }

const SS_KEY = '__telegram__initParams'
/** Telegram opens the Mini App with #tgWebAppData=… in the address (and keeps it in sessionStorage on reload). */
function openedByTelegram(): boolean {
  if (/[#&]tgWebApp(Data|Version|Platform)=/.test(location.hash)) return true
  try { return /tgWebAppData/.test(sessionStorage.getItem(SS_KEY) || '') } catch { return false }
}

let app: TgWebApp | null = null
export const tgApp = () => app
/** True only inside Telegram with signed data (a plain browser never gets this). */
export const inTelegram = () => !!app?.initData

/** Load Telegram's script when needed; call before the app renders. Removes Telegram's data from the address. */
export async function initTelegram(): Promise<void> {
  if (!openedByTelegram()) return
  await new Promise<void>((ok) => {
    const s = document.createElement('script')
    s.src = 'https://telegram.org/js/telegram-web-app.js?59'
    s.onload = () => ok(); s.onerror = () => ok()
    document.head.appendChild(s)
    setTimeout(ok, 6000)
  })
  const w = window.Telegram?.WebApp
  if (!w || !w.initData) return
  app = w
  // the app uses the address hash for its own pages (#admin, shared drills)
  if (/tgWebApp/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search) } catch { /* ignore */ } }
  document.documentElement.classList.add('in-tg')
  try {
    w.ready(); w.expand()
    if (w.isVersionAtLeast('6.1')) { w.setHeaderColor?.('#1F6B4A') }
    if (w.isVersionAtLeast('7.7')) w.disableVerticalSwipes?.()
  } catch { /* old Telegram */ }
}

/** Telegram's language, for a first-time visitor without a saved choice. */
export const tgLang = (): 'uz' | 'ru' | null => {
  const c = app?.initDataUnsafe.user?.language_code
  return !c ? null : c.toLowerCase().startsWith('ru') ? 'ru' : 'uz'
}
export const tgName = () => {
  const u = app?.initDataUnsafe.user
  return u ? [u.first_name, u.last_name].filter(Boolean).join(' ') || (u.username ? '@' + u.username : '') : ''
}

/* ---------- sign-in state for the UI ---------- */
export type TgAuth = 'idle' | 'checking' | 'unlinked' | 'signingIn' | 'done' | 'error'
let auth: TgAuth = 'idle'
const subs = new Set<() => void>()
const setAuth = (a: TgAuth) => { auth = a; subs.forEach((f) => f()) }
export const useTgAuth = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => auth)

async function post(path: string, body: unknown, token?: string): Promise<{ status: number; data: Record<string, unknown> }> {
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: JSON.stringify(body),
  })
  return { status: r.status, data: await r.json().catch(() => ({})) }
}

type Sb = {
  auth: {
    verifyOtp(p: { token_hash: string; type: 'magiclink' | 'signup' }): Promise<{ error: unknown }>
    getSession(): Promise<{ data: { session: { access_token: string } | null } }>
  }
}

/**
 * Sign in with Telegram. create=false only signs in when this Telegram is already tied to an account
 * (then the coach sees nothing: the app opens signed in). create=true makes a new account if needed.
 */
export async function tgSignIn(sb: Sb, create: boolean): Promise<boolean> {
  if (!app) return false
  setAuth(create ? 'signingIn' : 'checking')
  try {
    const { status, data } = await post('/api/tg/auth', { initData: app.initData, create })
    if (data.linked === false) { setAuth('unlinked'); return false }
    if (status !== 200 || typeof data.token_hash !== 'string') { setAuth(create ? 'error' : 'unlinked'); return false }
    const { error } = await sb.auth.verifyOtp({ token_hash: data.token_hash, type: data.type === 'signup' ? 'signup' : 'magiclink' })
    if (error) { setAuth(create ? 'error' : 'unlinked'); return false }
    setAuth('done')
    return true
  } catch {
    setAuth(create ? 'error' : 'unlinked')
    return false
  }
}

/** After an email sign-in inside Telegram: remember that this Telegram belongs to that account. */
export async function tgLink(sb: Sb): Promise<void> {
  if (!app) return
  const { data } = await sb.auth.getSession()
  if (data.session) await post('/api/tg/link', { initData: app.initData }, data.session.access_token).catch(() => null)
}

/** Send a PDF to the coach's chat with the bot. Returns null on success or an error key. */
export async function sendPdfToChat(file: File, caption: string): Promise<'blocked' | 'failed' | null> {
  if (!app) return 'failed'
  const w = app
  // opened from a link without pressing Start: ask Telegram for permission to write first
  if (w.initDataUnsafe.user && !w.initDataUnsafe.user.allows_write_to_pm && w.requestWriteAccess && w.isVersionAtLeast('6.9')) {
    await new Promise<void>((ok) => w.requestWriteAccess!(() => ok()))
  }
  const form = new FormData()
  form.append('initData', w.initData)
  form.append('file', file, file.name)
  if (caption) form.append('caption', caption)
  try {
    const r = await fetch('/api/tg/send', { method: 'POST', body: form })
    if (r.ok) { w.HapticFeedback?.notificationOccurred('success'); return null }
    return r.status === 403 ? 'blocked' : 'failed'
  } catch { return 'failed' }
}

/** A placeholder email of an account made through Telegram (never shown to the coach). */
export const isTgEmail = (email: string | null | undefined) => !!email && /@telegram\.pro-football\.pages\.dev$/i.test(email)
