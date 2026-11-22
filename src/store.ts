import { useSyncExternalStore } from 'react'
import type { AppData, Lang } from './types'
import { emptyData } from './sample'

const DATA_KEY = 'pf-data-v1'
const PREFS_KEY = 'pf-prefs-v1'

function read<T>(key: string): T | null {
  try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : null } catch { return null }
}
function write(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ }
}

/* ---------- synced data ---------- */
let data: AppData = read<AppData>(DATA_KEY) ?? emptyData()
const listeners = new Set<() => void>()
let onLocalChange: ((prev: AppData, next: AppData) => void) | null = null

const notify = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l) }

export const getData = () => data

/** Apply a local edit: stamps updatedAt, saves, and asks sync to push. */
export function update(fn: (d: AppData) => AppData) {
  const prev = data
  data = { ...fn(data), updatedAt: Date.now() }
  write(DATA_KEY, data)
  notify()
  onLocalChange?.(prev, data)
}

/** Replace with data that came from the server (no push back). */
export function replaceFromRemote(d: AppData) {
  data = d
  write(DATA_KEY, data)
  notify()
}

export function setLocalChangeHandler(fn: (prev: AppData, next: AppData) => void) { onLocalChange = fn }

/** Forget this device's copy (after signing out; the account keeps everything). */
export const clearLocal = () => replaceFromRemote(emptyData())

export const useData = () => useSyncExternalStore(subscribe, getData)

/* ---------- per-device preferences ---------- */
export type Tab = 'plan' | 'drills' | 'team' | 'cal' | 'know'
export interface Prefs { lang: Lang; tab: Tab; selected: string | null; theme?: 'light' | 'dark' }
let prefs: Prefs = { lang: 'uz', tab: 'plan', selected: null, ...(read<Prefs>(PREFS_KEY) ?? {}) }
const prefListeners = new Set<() => void>()
export function setPrefs(p: Partial<Prefs>) {
  prefs = { ...prefs, ...p }
  write(PREFS_KEY, prefs)
  prefListeners.forEach((l) => l())
}
export const usePrefs = () =>
  useSyncExternalStore((l) => { prefListeners.add(l); return () => prefListeners.delete(l) }, () => prefs)
