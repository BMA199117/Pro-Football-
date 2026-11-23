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

export interface Price { amount: number; base: number; promo: boolean; left: number }
export interface Offer {
  pricing: { month: number; year: number; academy: number; academySeats: number; trialDays: number; promoYearPercent: number; promoLimit: number }
  month: Price; year: Price; academy: Price
  click: { service_id: string; merchant_id: string }
  trialAvailable: boolean
}

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
  trialUsed: boolean
  /** prices, promo and payment settings (null until the server answers) */
  offer: Offer | null
}

const KEY = 'pf-access-v1'
const DKEY = 'pf-details-v1'
interface Saved { uid: string | null; premium: boolean; until: string | null; plan: string | null; admin: boolean; free: Record<FreeKind, string[]>; offer?: Offer | null; trialUsed?: boolean }
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
  trialUsed: !!saved?.trialUsed,
  offer: saved?.offer ?? null,
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
  save(KEY, { uid: access.uid, premium: access.premium, until: access.until, plan: access.plan, admin: access.admin, free: Object.fromEntries(FREE_KINDS.map((k) => [k, [...access.free[k]]])) as Record<FreeKind, string[]>, offer: access.offer, trialUsed: access.trialUsed } satisfies Saved)
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
        const d = data as { premium: boolean; until: string | null; plan: string | null; admin: boolean; trialUsed?: boolean }
        next = { ...next, premium: !!d.premium, until: d.until, plan: d.plan, admin: !!d.admin, trialUsed: !!d.trialUsed, checked: true }
      } else if (uid !== access.uid) next = { ...next, premium: false, until: null, plan: null, admin: false }
    } else next = { ...next, premium: false, until: null, plan: null, admin: false, checked: true }
    const { data: o, error: oe } = await sb.rpc('my_offer')
    if (!oe && o) next.offer = o as Offer
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

/* ---------- buying ---------- */
export type Plan = 'month' | 'year' | 'academy'

/** Start the free trial (once per account). */
export async function startTrial(): Promise<'ok' | 'used' | 'signin' | 'error'> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.rpc('start_trial')
  if (error) return 'error'
  if (data === 'ok') await refreshAccess()
  return data as 'ok' | 'used' | 'signin'
}

/** Make an order on the server (it decides the amount) and open Click's payment page. */
export async function payWithClick(plan: Plan): Promise<'ok' | 'notReady' | 'error'> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.rpc('create_order', { p: plan })
  if (error || !data) return 'error'
  const o = data as { id: number; amount: number; click: { service_id: string; merchant_id: string } }
  if (!o.click?.service_id || !o.click?.merchant_id) return 'notReady'
  const back = location.href.split('#')[0]
  const q = new URLSearchParams({ service_id: o.click.service_id, merchant_id: o.click.merchant_id, amount: String(o.amount), transaction_param: String(o.id), return_url: back })
  location.href = 'https://my.click.uz/services/pay?' + q.toString()
  return 'ok'
}

/** Academy owner: the coaches the subscription covers. */
export async function academyMembers(): Promise<string[] | null> {
  if (!supabase || !access.uid) return null
  const { data, error } = await supabase.from('academy_members').select('member_email').eq('owner', access.uid).order('added_at')
  return error ? null : (data as { member_email: string }[]).map((r) => r.member_email)
}
export async function setAcademyMembers(emails: string[]): Promise<'ok' | 'too_many' | 'not_academy' | 'error'> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.rpc('academy_set_members', { emails })
  return error ? 'error' : (data as 'ok' | 'too_many' | 'not_academy')
}
