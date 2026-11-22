/*
 * Sync between a coach's devices through Supabase (auth + Postgres + realtime).
 * The merge rules live in syncCore.ts; this file only moves rows to and from the server.
 *
 * - Every local edit is saved on the device first, so the app works without internet.
 * - Changed items are uploaded shortly after the edit (or when the internet comes back).
 * - Other devices get the change at once through realtime, and also catch up on open/focus.
 */
import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import { clearLocal, getData, replaceFromRemote, setLocalChangeHandler } from './store'
import {
  adoptUntracked, applyRows, emptyMeta, markPushed, pendingCount, recordChanges, rowsToPush,
  type Meta, type Row,
} from './syncCore'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

const TABLE = 'coach_items'
const META_KEY = 'pf-sync-v1'
const PAGE = 1000
const BATCH = 300
/** Re-read a little before the last cursor, in case a slow write committed late. Merging twice is harmless. */
const OVERLAP_MS = 60_000

/* ---------- observable state for the UI ---------- */
export type SyncState = 'disabled' | 'signedOut' | 'syncing' | 'synced' | 'offline' | 'error'
interface State { status: SyncState; email: string | null; pending: number; lastSync: number | null }
let state: State = { status: supabase ? 'signedOut' : 'disabled', email: null, pending: 0, lastSync: null }
const listeners = new Set<() => void>()
const set = (s: Partial<State>) => { state = { ...state, ...s }; listeners.forEach((l) => l()) }
export const useSync = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)

/* ---------- per-device sync bookkeeping ---------- */
function loadMeta(): Meta {
  try {
    const m = JSON.parse(localStorage.getItem(META_KEY) || 'null') as Meta | null
    if (m && m.v === 1) return { ...emptyMeta(), ...m }
  } catch { /* ignore */ }
  return emptyMeta()
}
let meta: Meta = loadMeta()
function saveMeta() {
  try { localStorage.setItem(META_KEY, JSON.stringify(meta)) } catch { /* storage unavailable */ }
  if (state.pending !== pendingCount(meta)) set({ pending: pendingCount(meta) })
}

let userId: string | null = null
let channel: RealtimeChannel | null = null
let pushTimer: ReturnType<typeof setTimeout> | undefined
let running: Promise<void> | null = null
let again = false

const failed = () => set({ status: navigator.onLine ? 'error' : 'offline' })
// If an edit arrived during the upload, another upload is already scheduled.
const done = () => set({ status: pendingCount(meta) ? 'syncing' : 'synced', lastSync: Date.now() })

function merge(rows: Row[]) {
  const next = applyRows(getData(), meta, rows)
  if (next) replaceFromRemote(next)
  saveMeta()
}

async function pull(): Promise<boolean> {
  if (!supabase || !userId) return false
  const since = meta.cursor ? new Date(Date.parse(meta.cursor) - OVERLAP_MS).toISOString() : null
  let after = since
  let newest = meta.cursor
  for (;;) {
    let q = supabase.from(TABLE).select('kind,id,data,deleted,updated_at,server_at').eq('user_id', userId)
    if (after) q = q.gt('server_at', after)
    const { data, error } = await q.order('server_at', { ascending: true }).limit(PAGE)
    if (error) return false
    const rows = (data ?? []) as (Row & { server_at: string })[]
    if (rows.length) {
      merge(rows)
      after = rows[rows.length - 1].server_at
      if (!newest || Date.parse(after) > Date.parse(newest)) newest = after
    }
    if (rows.length < PAGE) break
  }
  meta.cursor = newest
  saveMeta()
  return true
}

async function push(): Promise<boolean> {
  if (!supabase || !userId) return false
  const rows = rowsToPush(getData(), meta)
  saveMeta()
  for (let i = 0; i < rows.length; i += BATCH) {
    const part = rows.slice(i, i + BATCH)
    const { error } = await supabase.from(TABLE).upsert(part.map((r) => ({ ...r, user_id: userId })), { onConflict: 'user_id,kind,id' })
    if (error) return false
    markPushed(meta, part)
    saveMeta()
  }
  return true
}

/** One full round: download what changed, then upload local changes. Calls are queued, never parallel. */
export function syncNow(): Promise<void> {
  if (!supabase || !userId) return Promise.resolve()
  if (running) { again = true; return running }
  running = (async () => {
    do {
      again = false
      set({ status: 'syncing' })
      const ok = (await pull()) && (await push())
      if (!ok) { failed(); break }
      done()
    } while (again)
  })().finally(() => { running = null })
  return running
}

function pushSoon() {
  clearTimeout(pushTimer)
  pushTimer = setTimeout(async () => {
    if (!userId) return
    if (running) { again = true; return }
    set({ status: 'syncing' })
    if (await push()) done(); else failed()
  }, 700)
}

function listen(id: string) {
  if (!supabase) return
  if (channel) supabase.removeChannel(channel)
  channel = supabase
    .channel('coach_items:' + id)
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE, filter: `user_id=eq.${id}` }, (payload) => {
      const r = payload.new as Partial<Row> | undefined
      if (r && r.kind && r.id && r.updated_at !== undefined) {
        merge([{ kind: r.kind, id: r.id, data: r.data ?? null, deleted: !!r.deleted, updated_at: Number(r.updated_at) }])
        if (state.status !== 'syncing') set({ lastSync: Date.now() })
      }
    })
    .subscribe((s) => {
      // (Re)connected: catch up on anything sent while the connection was down.
      if (s === 'SUBSCRIBED') syncNow()
    })
}

function onSignedIn(id: string, email: string | null) {
  if (meta.user && meta.user !== id) {
    // Another account used this device before: do not mix its data into this account.
    clearLocal()
    meta = emptyMeta()
  }
  meta.user = id
  adoptUntracked(getData(), meta)
  saveMeta()
  userId = id
  set({ email, status: 'syncing' })
  listen(id)
  syncNow()
}

function onSignedOut() {
  userId = null
  if (channel && supabase) supabase.removeChannel(channel)
  channel = null
  set({ status: supabase ? 'signedOut' : 'disabled', email: null })
}

export function initSync() {
  // Track every local edit, even before signing in, so nothing is missed later.
  setLocalChangeHandler((prev, next) => {
    if (recordChanges(prev, next, meta)) { saveMeta(); pushSoon() }
  })
  state = { ...state, pending: pendingCount(meta) }
  if (!supabase) return
  supabase.auth.onAuthStateChange((_event, session) => {
    const id = session?.user.id ?? null
    if (id === userId) { if (session?.user.email && session.user.email !== state.email) set({ email: session.user.email }); return }
    // Supabase advises not to call it again inside this callback; run on the next tick.
    setTimeout(() => (id ? onSignedIn(id, session?.user.email ?? null) : onSignedOut()), 0)
  })
  window.addEventListener('online', () => syncNow())
  window.addEventListener('offline', () => { if (userId) set({ status: 'offline' }) })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow() })
}

/* ---------- account actions (return null on success, or an error key for the UI) ---------- */
export type AuthError = 'badLogin' | 'exists' | 'weakPass' | 'tooMany' | 'badCode' | 'noNet' | 'confirmEmail' | 'pending' | 'unknown'

function errKey(e: { code?: string; message?: string; status?: number } | null): AuthError | null {
  if (!e) return null
  const c = e.code || ''
  const m = (e.message || '').toLowerCase()
  if (!navigator.onLine || m.includes('fetch')) return 'noNet'
  if (c === 'invalid_credentials' || m.includes('invalid login')) return 'badLogin'
  if (c === 'user_already_exists' || c === 'email_exists' || m.includes('already registered')) return 'exists'
  if (c === 'weak_password' || m.includes('password should')) return 'weakPass'
  if (c.startsWith('over_') || e.status === 429) return 'tooMany'
  if (c === 'otp_expired' || m.includes('token has expired') || m.includes('invalid')) return 'badCode'
  if (c === 'email_not_confirmed') return 'confirmEmail'
  return 'unknown'
}

export async function signIn(email: string, password: string): Promise<AuthError | null> {
  if (!supabase) return 'unknown'
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return errKey(error)
}

export async function signUp(email: string, password: string): Promise<AuthError | null> {
  if (!supabase) return 'unknown'
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } })
  if (error) return errKey(error)
  // Supabase hides "already registered" behind an empty identities list.
  if (data.user && data.user.identities && data.user.identities.length === 0) return 'exists'
  return data.session ? null : 'confirmEmail'
}

/** Sign in without a password: a one-time code is sent to the email. Also used when the password is forgotten. */
export async function sendCode(email: string): Promise<AuthError | null> {
  if (!supabase) return 'unknown'
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } })
  return errKey(error)
}

export async function verifyCode(email: string, code: string): Promise<AuthError | null> {
  if (!supabase) return 'unknown'
  const { error } = await supabase.auth.verifyOtp({ email, token: code.replace(/\D/g, ''), type: 'email' })
  return errKey(error)
}

export async function setPassword(password: string): Promise<AuthError | null> {
  if (!supabase) return 'unknown'
  const { error } = await supabase.auth.updateUser({ password })
  return errKey(error)
}

/** Upload what is left, then sign out and clear this device. Refuses if changes could not be saved yet. */
export async function signOut(force = false): Promise<AuthError | null> {
  if (!supabase) return null
  clearTimeout(pushTimer)
  await syncNow()
  if (pendingCount(meta) && !force) return 'pending'
  await supabase.auth.signOut({ scope: 'local' })
  onSignedOut()
  clearLocal()
  meta = emptyMeta()
  saveMeta()
  return null
}
