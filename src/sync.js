import { createClient } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';
import { getData, replaceFromRemote, setLocalChangeHandler } from './store';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = url && key ? createClient(url, key) : null;
let state = { status: supabase ? 'signedOut' : 'disabled', email: null };
const listeners = new Set();
const set = (s) => { state = { ...state, ...s }; listeners.forEach((l) => l()); };
export const useSync = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);
let userId = null;
let channel = null;
let pushTimer;
async function push(d) {
    if (!supabase || !userId)
        return;
    set({ status: 'syncing' });
    const { error } = await supabase.from('coach_data').upsert({ user_id: userId, data: d, updated_at: new Date(d.updatedAt).toISOString() });
    set({ status: error ? (navigator.onLine ? 'error' : 'offline') : 'synced' });
}
async function pull() {
    if (!supabase || !userId)
        return;
    set({ status: 'syncing' });
    const { data: row, error } = await supabase.from('coach_data').select('data').eq('user_id', userId).maybeSingle();
    if (error) {
        set({ status: navigator.onLine ? 'error' : 'offline' });
        return;
    }
    const remote = row?.data;
    const local = getData();
    if (remote && remote.updatedAt >= local.updatedAt) {
        replaceFromRemote(remote);
        set({ status: 'synced' });
    }
    else
        await push(local);
}
function listen() {
    if (!supabase || !userId)
        return;
    channel?.unsubscribe();
    channel = supabase
        .channel('coach_data_' + userId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'coach_data', filter: `user_id=eq.${userId}` }, (payload) => {
        const remote = payload.new?.data;
        if (remote && remote.updatedAt > getData().updatedAt)
            replaceFromRemote(remote);
    })
        .subscribe();
}
export function initSync() {
    if (!supabase)
        return;
    setLocalChangeHandler((d) => { clearTimeout(pushTimer); pushTimer = setTimeout(() => push(d), 800); });
    supabase.auth.onAuthStateChange((_e, session) => {
        const id = session?.user.id ?? null;
        if (id === userId)
            return;
        userId = id;
        if (id) {
            set({ email: session?.user.email ?? null });
            pull();
            listen();
        }
        else {
            channel?.unsubscribe();
            channel = null;
            set({ status: 'signedOut', email: null });
        }
    });
    window.addEventListener('online', () => pull());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible')
        pull(); });
}
export async function sendMagicLink(email) {
    if (!supabase)
        return 'disabled';
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname } });
    return error ? error.message : null;
}
export const signOut = () => supabase?.auth.signOut();
