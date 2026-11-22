import { useEffect, useState } from 'react'
import { supabase, useSync } from '../sync'
import type { Kind } from '../content'

/** null while checking; re-checked when the signed-in account changes. */
export function useIsAdmin(): boolean | null {
  const { email } = useSync()
  const [res, setRes] = useState<{ email: string | null; ok: boolean } | null>(null)
  useEffect(() => {
    if (!supabase || !email) return
    let live = true
    supabase.rpc('is_admin').then(({ data, error }) => { if (live) setRes({ email, ok: !error && data === true }) })
    return () => { live = false }
  }, [email])
  if (!email) return false
  return res && res.email === email ? res.ok : null
}

export interface Overview {
  coaches: number; new7: number; new30: number; activeToday: number; active7: number; active30: number
  sessions: number; players: number; ownDrills: number; sessions7: number; contentEdits: number; admins: number
}
export interface Coach {
  user_id: string; email: string | null; created_at: string; last_seen: string | null
  sessions: number; players: number; own_drills: number; days_active: number; is_admin: boolean
}
export interface DayStat { day: string; active: number; signups: number; sessions: number }
export interface HistoryRow { n: number; kind: Kind; id: string; data: unknown; hidden: boolean; deleted: boolean; changed_at: string; changed_by: string | null }

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error('no server')
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

export const getOverview = () => rpc<Overview>('admin_overview')
export const getCoaches = () => rpc<Coach[]>('admin_coaches')
export const getActivity = (days = 30) => rpc<DayStat[]>('admin_activity', { days })
export const setAdmin = (email: string, make: boolean) => rpc<'ok' | 'no_user' | 'self'>('admin_set_admin', { target_email: email, make })
export const deleteCoach = (id: string) => rpc<'ok' | 'self' | 'admin'>('admin_delete_coach', { target: id })

export async function getHistory(limit = 150, kind?: Kind, id?: string): Promise<HistoryRow[]> {
  if (!supabase) return []
  let q = supabase.from('content_history').select('*')
  if (kind) q = q.eq('kind', kind)
  if (id) q = q.eq('id', id)
  const { data, error } = await q.order('n', { ascending: false }).limit(limit)
  if (error) throw error
  return data as HistoryRow[]
}

/** user id -> email, for "who changed it". */
export async function getEmails(): Promise<Map<string, string>> {
  if (!supabase) return new Map()
  const { data } = await supabase.from('profiles').select('user_id,email')
  return new Map((data ?? []).map((r: { user_id: string; email: string | null }) => [r.user_id, r.email ?? '?']))
}

const pad = (n: number) => String(n).padStart(2, '0')
const MON = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek']
/** "22-noy 2026, 17:40" in the viewer's time zone. */
export function when(iso: string | null, withTime = true) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()}-${MON[d.getMonth()]} ${d.getFullYear()}` + (withTime ? `, ${pad(d.getHours())}:${pad(d.getMinutes())}` : '')
}
export function ago(iso: string | null) {
  if (!iso) return 'hali kirmagan'
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (m < 2) return 'hozirgina'
  if (m < 60) return `${m} daqiqa oldin`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} soat oldin`
  const d = Math.round(h / 24)
  return d < 31 ? `${d} kun oldin` : when(iso, false)
}
