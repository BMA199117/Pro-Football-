import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js'
import { useSyncExternalStore } from 'react'
import type { AppData } from './types'
import { getData, replaceFromRemote, setLocalChangeHandler } from './store'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

export type SyncState = 'disabled' | 'signedOut' | 'syncing' | 'synced' | 'offline' | 'error'
let state: { status: SyncState; email: string | null } = { status: supabase ? 'signedOut' : 'disabled', email: null }
const listeners = new Set<() => void>()
const set = (s: Partial<typeof state>) => { state = { ...state, ...s }; listeners.forEach((l) => l()) }
export const useSync = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => state)

let userId: string | null = null
let channel: RealtimeChannel | null = null
let pushTimer: ReturnType<typeof setTimeout> | undefined

async function push(d: AppData) {
  if (!supabase || !userId) return
  set({ status: 'syncing' })
  const { error } = await supabase.from('coach_data').upsert({ user_id: userId, data: d, updated_at: new Date(d.updatedAt).toISOString() })
  set({ status: error ? (navigator.onLine ? 'error' : 'offline') : 'synced' })
}

async function pull() {
  if (!supabase || !userId) return
  set({ status: 'syncing' })
  const { data: row, error } = await supabase.from('coach_data').select('data').eq('user_id', userId).maybeSingle()
  if (error) { set({ status: navigator.onLine ? 'error' : 'offline' }); return }
  const remote = row?.data as AppData | undefined
  const local = getData()
  if (remote && remote.updatedAt >= local.updatedAt) { replaceFromRemote(remote); set({ status: 'synced' }) }
  else await push(local)
}

function listen() {
  if (!supabase || !userId) return
  channel?.unsubscribe()
  channel = supabase
    .channel('coach_data_' + userId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'coach_data', filter: `user_id=eq.${userId}` }, (payload) => {
      const remote = (payload.new as { data?: AppData })?.data
      if (remote && remote.updatedAt > getData().updatedAt) replaceFromRemote(remote)
    })
    .subscribe()
}

export function initSync() {
  if (!supabase) return
  setLocalChangeHandler((d) => { clearTimeout(pushTimer); pushTimer = setTimeout(() => push(d), 800) })
  supabase.auth.onAuthStateChange((_e, session) => {
    const id = session?.user.id ?? null
    if (id === userId) return
    userId = id
    if (id) { set({ email: session?.user.email ?? null }); pull(); listen() }
    else { channel?.unsubscribe(); channel = null; set({ status: 'signedOut', email: null }) }
  })
  window.addEventListener('online', () => pull())
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull() })
}

export async function sendMagicLink(email: string) {
  if (!supabase) return 'disabled'
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } })
  return error ? error.message : null
}
export const signOut = () => supabase?.auth.signOut()
