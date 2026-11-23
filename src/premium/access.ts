/*
 * Who may open what.
 *  - free items: table free_items (kind drill | plan | season), chosen by the administrator;
 *  - premium: table subscriptions (given by the administrator now, by the payment system later);
 *  - drill details: table drill_details. The server returns only the rows this coach may open
 *    (free ones, or all of them with premium), so the lock cannot be bypassed in the browser.
 * Everything is cached on the device, so the app works offline with what the coach already had.
 * Without a server (local use) nothing is locked.
 */
import { useSyncExternalStore } from 'react'
import { supabase } from '../sync'
import { PAYWALL_BUILD } from '../content-source'
import type { Details } from './split'
import FREE_DEFAULTS from '../generated/free-defaults.json'

export type FreeKind = 'drill' | 'plan' | 'season'
export const FREE_KINDS: FreeKind[] = ['drill', 'plan', 'season']

export interface Access {
  /** the paid version is active (there is a server) */
  on: boolean
  uid: string | null
  premium: boolean
  /** premium end (ISO), null = without end */
  until: string | null
  plan: string | null
  admin: boolean
  free: Record<FreeKind, Set<string>>
  /** the server answered at least once for this account */
  checked: boolean
}

const KEY = 'pf-access-v1'
const DKEY = 'pf-details-v1'
interface Saved { uid: string | null; premium: boolean; until: string | null; plan: string | null; admin: boolean; free: Record<FreeKind, string[]> }
interface SavedDetails { uid: string | null; premium: boolean; rows: Record<string, Details>; cursor: string | null }

const toSets = (f: Record<FreeKind, string[]>) => Object.fromEntries(FREE_KINDS.map((k) => [k, new Set(f[k] ?? [])])) as Access['free']
const load = <T,>(k: string): T | null => { try { return JSON.parse(localStorage.getItem(k) || 'null') as T | null } catch { return null } }
const save = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage full or unavailable */ } }

const saved = load<Saved>(KEY)
let access: Access = {
  on: !!supabase,
  uid: saved?.uid ?? null,
  premium: !!saved?.premium,
  until: saved?.until ?? null,
  plan: saved?.plan ?? null,
  admin: !!saved?.admin,
  free: toSets(saved?.free ?? (FREE_DEFAULTS as Record<FreeKind, string[]>)),
  checked: false,
}
let saved0: SavedDetails = load<SavedDetails>(DKEY) ?? { uid: null, premium: false, rows: {}, cursor: null }
let details: Record<string, Details> = saved0.rows ?? {}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
export const subscribeAccess = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
export const getAccess = () => access
export const useAccess = () => useSyncExternalStore(subscribeAccess, getAccess)

/** Premium (or admin), still valid now. */
const active = (a: Access) => a.admin || (a.premium && (!a.until || Date.parse(a.until) > Date.now()))
export const hasPremium = (a: Access = access) => !a.on || active(a)

/** Is this item closed for the coach? The coach's own drills never are. */
export function isLocked(kind: FreeKind, id: string, a: Access = access): boolean {
  if (!a.on || active(a)) return false
  return !a.free[kind].has(id)
}

/** Details of a drill from the server (only the ones this coach may open). */
export const serverDetails = (id: string): Details | undefined => details[id]

function persist() {
  save(KEY, { uid: access.uid, premium: access.premium, until: access.until, plan: access.plan, admin: access.admin, free: Object.fromEntries(FREE_KINDS.map((k) => [k, [...access.free[k]]])) as Record<FreeKind, string[]> } satisfies Saved)
}

/* ---------- loading ---------- */
let running: Promise<void> | null = null

async function loadDetails(full: boolean) {
  if (!supabase || !PAYWALL_BUILD) return
  const owner = { uid: access.uid, premium: active(access) }
  // a new owner or new rights: read everything again; otherwise only what changed since the last time
  const incremental = !full && saved0.uid === owner.uid && saved0.premium === owner.premium && Object.keys(details).length > 0 && !!saved0.cursor
  const rows: Record<string, Details> = incremental ? { ...details } : {}
  let cursor = incremental ? saved0.cursor : null
  for (let from = 0; ; from += 1000) {
    let q = supabase.from('drill_details').select('id,data,updated_at')
    if (incremental && saved0.cursor) q = q.gt('updated_at', saved0.cursor)
    const { data, error } = await q.order('id').range(from, from + 999)
    if (error || !data) return // keep what we had
    for (const r of data as { id: string; data: Details; updated_at: string }[]) {
      rows[r.id] = r.data
      if (!cursor || r.updated_at > cursor) cursor = r.updated_at
    }
    if (data.length < 1000) break
  }
  details = rows
  saved0 = { ...owner, rows, cursor }
  save(DKEY, saved0)
}

/** Ask the server again (on start, sign-in/out, coming back to the app). */
export function refreshAccess(): Promise<void> {
  if (!supabase) return Promise.resolve()
  if (running) return running
  const sb = supabase
  running = (async () => {
    const before = JSON.stringify([access.uid, active(access), [...access.free.drill].sort()])
    const { data: s } = await sb.auth.getSession()
    const uid = s.session?.user.id ?? null
    let next: Partial<Access> = { uid }
    if (uid) {
      const { data, error } = await sb.rpc('my_access')
      if (!error && data) {
        const d = data as { premium: boolean; until: string | null; plan: string | null; admin: boolean }
        next = { ...next, premium: !!d.premium, until: d.until, plan: d.plan, admin: !!d.admin, checked: true }
      } else if (uid !== access.uid) next = { ...next, premium: false, until: null, plan: null, admin: false }
    } else next = { ...next, premium: false, until: null, plan: null, admin: false, checked: true }
    const { data: f, error: fe } = await sb.from('free_items').select('kind,id')
    if (!fe && f && f.length) {
      const free: Record<FreeKind, string[]> = { drill: [], plan: [], season: [] }
      for (const r of f as { kind: FreeKind; id: string }[]) free[r.kind]?.push(r.id)
      next.free = toSets(free)
    }
    access = { ...access, ...next }
    persist()
    const after = JSON.stringify([access.uid, active(access), [...access.free.drill].sort()])
    await loadDetails(before !== after)
    emit()
  })().finally(() => { running = null })
  return running
}

export function initAccess() {
  if (!supabase) return
  refreshAccess()
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') setTimeout(() => refreshAccess(), 0)
  })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshAccess() })
  window.addEventListener('online', () => refreshAccess())
  // premium that ends while the app is open
  setInterval(emit, 10 * 60_000)
}
