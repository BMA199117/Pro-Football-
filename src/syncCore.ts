/*
 * Record-level sync logic (no network code here, so it can be tested on its own).
 *
 * Every array in AppData (sessions, players, customDrills, groups, favorites, and any array
 * added later) is synced item by item. An item is an object with a string `id`, or a plain
 * string (then the string is its id). Each item has its own edit time, so a session edited on
 * the phone and a player added on the PC are both kept. When the same item is edited on two
 * devices, the later edit wins. Deletions are kept as "tombstones" so they reach other devices.
 */
import type { AppData } from './types'

export interface Row {
  kind: string
  id: string
  data: unknown
  deleted: boolean
  updated_at: number
}

export interface Meta {
  v: 1
  /** Account this device last synced with. */
  user: string | null
  /** Edit time (ms) of each live item, by key. */
  clock: Record<string, number>
  /** Deletion time (ms) of each deleted item, by key. */
  dead: Record<string, number>
  /** Keys changed here and not yet saved on the server. */
  dirty: Record<string, true>
  /** server_at of the newest row already pulled. */
  cursor: string | null
}

export const emptyMeta = (): Meta => ({ v: 1, user: null, clock: {}, dead: {}, dirty: {}, cursor: null })

type Item = string | { id: string }
type Dict = Record<string, unknown>

export const keyOf = (kind: string, id: string) => kind + ':' + id
export function splitKey(key: string): [string, string] {
  const i = key.indexOf(':')
  return [key.slice(0, i), key.slice(i + 1)]
}

const isItem = (x: unknown): x is Item =>
  typeof x === 'string' || (!!x && typeof x === 'object' && typeof (x as { id?: unknown }).id === 'string')
const idOf = (x: Item) => (typeof x === 'string' ? x : x.id)

/** Names of the synced collections: every array field of AppData. */
export function collections(d: AppData): string[] {
  return Object.keys(d).filter((k) => Array.isArray((d as unknown as Dict)[k]))
}

function itemsOf(d: AppData, kind: string): Map<string, Item> {
  const arr = (d as unknown as Dict)[kind]
  const m = new Map<string, Item>()
  if (Array.isArray(arr)) for (const x of arr) if (isItem(x)) m.set(idOf(x), x)
  return m
}

/** A time for a new local edit that is always later than the item's previous one. */
function stamp(meta: Meta, key: string, now: number) {
  return Math.max(now, (meta.clock[key] ?? meta.dead[key] ?? 0) + 1)
}

/** Record what a local edit changed (prev -> next). Mutates meta. Returns the number of changed items. */
export function recordChanges(prev: AppData, next: AppData, meta: Meta, now = Date.now()): number {
  let n = 0
  const kinds = new Set([...collections(prev), ...collections(next)])
  for (const kind of kinds) {
    const a = itemsOf(prev, kind)
    const b = itemsOf(next, kind)
    if (a === b) continue
    for (const [id, item] of b) {
      const old = a.get(id)
      if (old !== undefined && (old === item || JSON.stringify(old) === JSON.stringify(item))) continue
      const k = keyOf(kind, id)
      meta.clock[k] = stamp(meta, k, now)
      delete meta.dead[k]
      meta.dirty[k] = true
      n++
    }
    for (const id of a.keys()) {
      if (b.has(id)) continue
      const k = keyOf(kind, id)
      meta.dead[k] = stamp(meta, k, now)
      delete meta.clock[k]
      meta.dirty[k] = true
      n++
    }
  }
  return n
}

/**
 * Items that exist locally but were never tracked (made before signing in, or on an older
 * version of the app) are marked to be uploaded, so the first sign-in merges them with the
 * account instead of losing them.
 */
export function adoptUntracked(d: AppData, meta: Meta, now = Date.now()): number {
  let n = 0
  for (const kind of collections(d)) {
    for (const id of itemsOf(d, kind).keys()) {
      const k = keyOf(kind, id)
      if (meta.clock[k] !== undefined) continue
      // An untouched new device (updatedAt 0) gets the oldest time, so the account's version wins.
      meta.clock[k] = d.updatedAt > 0 ? Math.min(now, d.updatedAt) : 1
      delete meta.dead[k]
      meta.dirty[k] = true
      n++
    }
  }
  return n
}

/** Merge rows that came from the server into local data. Mutates meta; returns new data if anything changed. */
export function applyRows(d: AppData, meta: Meta, rows: Row[]): AppData | null {
  let out: Dict | null = null
  for (const r of rows) {
    const t = Number(r.updated_at)
    const k = keyOf(r.kind, r.id)
    const local = meta.clock[k] ?? meta.dead[k]
    if (local !== undefined && t < local) { meta.dirty[k] = true; continue } // ours is newer: send it
    const src = (out ?? (d as unknown as Dict))[r.kind]
    const arr = Array.isArray(src) ? (src as unknown[]) : []
    const at = arr.findIndex((x) => isItem(x) && idOf(x) === r.id)
    if (local !== undefined && t === local) {
      // Same edit time: if it is the same content, it is our own edit coming back. Otherwise the server's copy wins.
      const same = r.deleted ? meta.dead[k] !== undefined : at >= 0 && JSON.stringify(arr[at]) === JSON.stringify(r.data)
      if (same) { delete meta.dirty[k]; continue }
    }
    if (!out) out = { ...(d as unknown as Dict) }
    if (r.deleted) {
      if (at >= 0) out[r.kind] = arr.filter((_, i) => i !== at)
      meta.dead[k] = t
      delete meta.clock[k]
    } else {
      if (!isItem(r.data)) continue
      const copy = arr.slice()
      if (at >= 0) copy[at] = r.data
      else copy.push(r.data)
      out[r.kind] = copy
      meta.clock[k] = t
      delete meta.dead[k]
    }
    delete meta.dirty[k]
  }
  return out ? ({ ...out, updatedAt: Date.now() } as unknown as AppData) : null
}

/** Rows to upload for every changed key. */
export function rowsToPush(d: AppData, meta: Meta): Row[] {
  const rows: Row[] = []
  const cache = new Map<string, Map<string, Item>>()
  for (const k of Object.keys(meta.dirty)) {
    const [kind, id] = splitKey(k)
    if (meta.dead[k] !== undefined) { rows.push({ kind, id, data: null, deleted: true, updated_at: meta.dead[k] }); continue }
    if (!cache.has(kind)) cache.set(kind, itemsOf(d, kind))
    const item = cache.get(kind)!.get(id)
    if (item === undefined || meta.clock[k] === undefined) { delete meta.dirty[k]; continue }
    rows.push({ kind, id, data: item, deleted: false, updated_at: meta.clock[k] })
  }
  return rows
}

/** After a successful upload: clear the keys that were not edited again meanwhile. */
export function markPushed(meta: Meta, rows: Row[]) {
  for (const r of rows) {
    const k = keyOf(r.kind, r.id)
    const now = r.deleted ? meta.dead[k] : meta.clock[k]
    if (now === r.updated_at) delete meta.dirty[k]
  }
}

export const pendingCount = (meta: Meta) => Object.keys(meta.dirty).length
