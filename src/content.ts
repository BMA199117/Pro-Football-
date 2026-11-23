/*
 * App content (drills, Bilim cards, ready plans, age stages, principles, books) = the built-in
 * content shipped in the code + the administrator's changes from Supabase (table content_items).
 *
 * A change row can replace a built-in item, hide it (coaches no longer see it) or add a new item.
 * Rows are cached on the device, so the app shows the admin's content offline too, and new
 * changes arrive live (realtime) or when the app comes back to the foreground.
 */
import { useSyncExternalStore } from 'react'
import { supabase } from './sync'
import type { Drill, KnowledgeCard, Template } from './types'
import { CATALOG, localDetails } from './content-source'
import type { BookScene } from './book/scene'
import type { BodyProgram } from './body/program'
import type { Benefit } from './skills'
import { getAccess, isLocked, serverDetails, subscribeAccess, hasPremium } from './premium/access'
import { toCatalog, type Details } from './premium/split'
import { KNOWLEDGE } from './knowledge'
import { TEMPLATES, TEMPLATE_AGES } from './templates'
import { SOURCES } from './sources'
import { DEV_PRINCIPLES, DEV_STAGES, type DevPrinciple, type DevStage } from './development'

export type Kind = 'drill' | 'card' | 'plan' | 'stage' | 'principle' | 'source'
export const KINDS: Kind[] = ['drill', 'card', 'plan', 'stage', 'principle', 'source']

/** A drill as the admin stores it: the drill plus its "why useful" (scene is optional: the book scene stays if absent). */
export type DrillData = Drill & { benefit?: Benefit }
export interface SourceData { id: string; title: string; author: string }

export interface ItemOf {
  drill: DrillData
  card: KnowledgeCard
  plan: Template
  stage: DevStage
  principle: DevPrinciple
  source: SourceData
}

export interface ContentRow { kind: Kind; id: string; data: unknown; hidden: boolean; deleted: boolean; updated_at: string; updated_by?: string | null }

/* ---------- built-in content ---------- */
const sourceList: SourceData[] = Object.entries(SOURCES).map(([id, s]) => ({ id, ...s }))
export const BUILTIN: { [K in Kind]: ItemOf[K][] } = {
  drill: CATALOG,
  card: KNOWLEDGE,
  plan: TEMPLATES,
  stage: DEV_STAGES,
  principle: DEV_PRINCIPLES,
  source: sourceList,
}
const builtinIds: Record<Kind, Set<string>> = Object.fromEntries(KINDS.map((k) => [k, new Set(BUILTIN[k].map((x) => x.id))])) as Record<Kind, Set<string>>
export const isBuiltin = (kind: Kind, id: string) => builtinIds[kind].has(id)

/* ---------- validation: a broken row must never break the app ---------- */
const isText = (x: unknown) => !!x && typeof x === 'object' && typeof (x as { uz?: unknown }).uz === 'string'
const isPair = (x: unknown) => Array.isArray(x) && typeof x[0] === 'string'
function valid(kind: Kind, d: unknown): boolean {
  if (!d || typeof d !== 'object') return false
  const o = d as Record<string, unknown>
  if (typeof o.id !== 'string') return false
  switch (kind) {
    case 'drill': return isText(o.name) && isText(o.desc) && typeof o.cat === 'string' && typeof o.age === 'string'
    case 'card': return isText(o.title) && isText(o.idea) && Array.isArray(o.tips)
    case 'plan': return isText(o.title) && !!o.phases && typeof o.ages === 'string'
    case 'stage': return isPair(o.title) && !!o.focus && Array.isArray(o.profile)
    case 'principle': return isPair(o.title) && Array.isArray(o.tips)
    case 'source': return typeof o.title === 'string'
  }
}

/* ---------- the admin's rows, cached on the device ---------- */
const CACHE_KEY = 'pf-content-v1'
const OVERLAP_MS = 60_000
interface Cache { v: 1; cursor: string | null; rows: Record<string, ContentRow> }
const rk = (kind: string, id: string) => kind + ':' + id

function loadCache(): Cache {
  try {
    const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') as Cache | null
    if (c && c.v === 1 && c.rows) return c
  } catch { /* ignore */ }
  return { v: 1, cursor: null, rows: {} }
}
let cache = loadCache()
const saveCache = () => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch { /* storage full or unavailable */ } }

/* ---------- merged view ---------- */
export interface Entry<K extends Kind> { item: ItemOf[K]; builtin: boolean; changed: boolean; hidden: boolean; row?: ContentRow }

export interface Content {
  /** What coaches see. */
  drills: Drill[]
  cards: KnowledgeCard[]
  plans: Template[]
  planAges: string[]
  stages: DevStage[]
  principles: DevPrinciple[]
  sources: Record<string, { title: string; author: string }>
  scene: (id: string) => BookScene | undefined
  /** the drawing from the book (not the admin's), for the admin editor */
  bookScene: (id: string) => BookScene | undefined
  body: (id: string) => BodyProgram | undefined
  benefit: (id: string) => Benefit | undefined
  /** the drill is closed for this coach (paid) */
  locked: (id: string) => boolean
  /** Everything incl. hidden items, with their state (for the admin panel). */
  all: { [K in Kind]: Entry<K>[] }
}

/** Drill rows of the admin this coach may not read in full: only their catalog part (server function content_drill_meta). */
let metaRows: Record<string, ContentRow> = {}

function entries<K extends Kind>(kind: K): Entry<K>[] {
  const own = Object.values(cache.rows).filter((r) => r.kind === kind && !r.deleted)
  const ids = new Set(own.map((r) => r.id))
  const rows = kind === 'drill' ? [...own, ...Object.values(metaRows).filter((r) => !r.deleted && !ids.has(r.id))] : own
  const byId = new Map(rows.map((r) => [r.id, r]))
  const out: Entry<K>[] = []
  // items the admin added come first (newest first), then the built-in ones in their order
  const added = rows.filter((r) => !builtinIds[kind].has(r.id) && valid(kind, r.data)).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
  for (const r of added) out.push({ item: r.data as ItemOf[K], builtin: false, changed: true, hidden: r.hidden, row: r })
  for (const base of BUILTIN[kind] as ItemOf[K][]) {
    const r = byId.get(base.id)
    const ok = r && r.data != null && valid(kind, r.data)
    out.push({ item: ok ? ({ ...(r!.data as object), id: base.id } as ItemOf[K]) : base, builtin: true, changed: !!ok, hidden: !!r?.hidden, row: r })
  }
  return out
}

/** The details of a drill: the admin's version, else the server's (paid version), else the book's (shipped). */
const detailsOf = (id: string): Details | undefined => serverDetails(id) ?? localDetails(id)

function build(): Content {
  const all = Object.fromEntries(KINDS.map((k) => [k, entries(k)])) as Content['all']
  const locked = (id: string) => isLocked('drill', id)
  // a closed drill keeps only its catalog part; an open built-in one gets its details
  all.drill = all.drill.map((e) => {
    const id = e.item.id
    if (locked(id)) return { ...e, item: toCatalog(e.item) as DrillData }
    if (e.changed) return e
    const d = detailsOf(id)
    if (!d) return e
    const item: DrillData = { ...e.item }
    if (d.desc) item.desc = d.desc
    if (d.points) item.points = d.points
    if (d.video) item.video = d.video
    if (d.benefit) item.benefit = d.benefit
    return { ...e, item }
  })
  const visible = <K extends Kind>(k: K) => all[k].filter((e) => !e.hidden).map((e) => e.item)
  const drillMap = new Map(all.drill.map((e) => [e.item.id, e.item]))
  const plans = visible('plan')
  const planAges = [...TEMPLATE_AGES, ...new Set(plans.map((p) => p.ages).filter((a) => !TEMPLATE_AGES.includes(a)))]
  return {
    drills: visible('drill').map(({ benefit: _b, ...d }) => d as Drill),
    cards: visible('card'),
    plans,
    planAges,
    stages: visible('stage'),
    principles: visible('principle'),
    sources: Object.fromEntries(all.source.map((e) => [e.item.id, { title: e.item.title, author: e.item.author }])),
    scene: (id) => (locked(id) ? undefined : drillMap.get(id)?.scene ?? detailsOf(id)?.scene),
    bookScene: (id) => (locked(id) ? undefined : detailsOf(id)?.scene),
    body: (id) => (locked(id) ? undefined : detailsOf(id)?.body),
    benefit: (id) => drillMap.get(id)?.benefit,
    locked,
    all,
  }
}

let content = build()
const listeners = new Set<() => void>()
function changed() { content = build(); listeners.forEach((l) => l()) }

/* access changes (sign-in, premium, free list) rebuild the view; gaining access re-reads the admin's rows in full */
const accessKey = () => { const a = getAccess(); return (a.uid ?? '-') + ':' + hasPremium(a) }
let lastAccess = accessKey()
subscribeAccess(() => {
  const k = accessKey()
  if (k !== lastAccess) { lastAccess = k; cache.cursor = null; metaRows = {}; refreshContent() }
  changed()
})
export const getContent = () => content
export const useContent = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, getContent)

function apply(rows: ContentRow[]) {
  let any = false
  for (const r of rows) {
    if (!KINDS.includes(r.kind)) continue
    const k = rk(r.kind, r.id)
    const old = cache.rows[k]
    const at = Date.parse(r.updated_at)
    if (old && Date.parse(old.updated_at) > at) continue
    if (r.deleted) delete cache.rows[k]
    else cache.rows[k] = r
    if (!cache.cursor || at > Date.parse(cache.cursor)) cache.cursor = new Date(at).toISOString()
    any = true
  }
  if (any) { saveCache(); changed() }
}

/* ---------- loading from the server ---------- */
const COLS = 'kind,id,data,hidden,deleted,updated_at,updated_by'
let loading: Promise<void> | null = null

/** Download the changes since the last time (all of them on the first run). */
export function refreshContent(): Promise<void> {
  if (!supabase) return Promise.resolve()
  if (loading) return loading
  const sb = supabase
  loading = (async () => {
    let after = cache.cursor ? new Date(Date.parse(cache.cursor) - OVERLAP_MS).toISOString() : null
    for (;;) {
      let q = sb.from('content_items').select(COLS)
      if (after) q = q.gt('updated_at', after)
      const { data, error } = await q.order('updated_at', { ascending: true }).limit(1000)
      if (error || !data) break
      apply(data as ContentRow[])
      if (data.length < 1000) break
      after = (data[data.length - 1] as ContentRow).updated_at
    }
    // drills the coach may not open: their catalog part only
    if (!hasPremium()) {
      const { data, error } = await sb.rpc('content_drill_meta')
      if (!error && Array.isArray(data)) {
        metaRows = Object.fromEntries((data as ContentRow[]).filter((r) => r.data == null || valid('drill', r.data)).map((r) => [r.id, { ...r, kind: 'drill' as const }]))
        changed()
      }
    } else if (Object.keys(metaRows).length) { metaRows = {}; changed() }
  })().finally(() => { loading = null })
  return loading
}

export function initContent() {
  if (!supabase) return
  const sb = supabase
  refreshContent()
  sb.channel('content_items')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, (p) => {
      const r = p.new as ContentRow | undefined
      if (r && r.kind && r.id) apply([r])
    })
    .subscribe((s) => { if (s === 'SUBSCRIBED') refreshContent() })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshContent() })
  window.addEventListener('online', () => refreshContent())
}

/* ---------- admin writes ---------- */
export type SaveResult = null | 'notAdmin' | 'noNet' | 'error'
async function write(row: { kind: Kind; id: string; data: unknown; hidden: boolean; deleted: boolean }): Promise<SaveResult> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.from('content_items').upsert(row, { onConflict: 'kind,id' }).select(COLS).single()
  if (error) return error.code === '42501' ? 'notAdmin' : !navigator.onLine || /fetch/i.test(error.message) ? 'noNet' : 'error'
  apply([data as ContentRow])
  return null
}

/** Save (add or change) an item. */
export function saveItem<K extends Kind>(kind: K, item: ItemOf[K], hidden = false) {
  return write({ kind, id: item.id, data: item, hidden, deleted: false })
}

/** Hide an item from coaches ("delete"; can be restored) or show it again. */
export function setHidden(kind: Kind, id: string, hidden: boolean) {
  const e = (content.all[kind] as Entry<Kind>[]).find((x) => x.item.id === id)
  const builtin = isBuiltin(kind, id)
  // a built-in item that was only hidden keeps no data, so its book version is used when shown again
  const data = e && (e.changed || !builtin) ? e.item : null
  if (!hidden && builtin && !data) return write({ kind, id, data: null, hidden: false, deleted: true })
  return write({ kind, id, data, hidden, deleted: false })
}

/** Built-in item: back to the original. Added item: removed for good. */
export function resetItem(kind: Kind, id: string) {
  return write({ kind, id, data: null, hidden: false, deleted: true })
}

export function newId(kind: Kind) {
  const p = { drill: 'ad', card: 'ac', plan: 'ap', stage: 'as', principle: 'aq', source: 'src' }[kind]
  return p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}
