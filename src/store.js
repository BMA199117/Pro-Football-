import { useSyncExternalStore } from 'react';
import { emptyData } from './sample';
const DATA_KEY = 'pf-data-v1';
const PREFS_KEY = 'pf-prefs-v1';
function read(key) {
    try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : null;
    }
    catch {
        return null;
    }
}
function write(key, v) {
    try {
        localStorage.setItem(key, JSON.stringify(v));
    }
    catch { /* storage unavailable */ }
}
/* ---------- synced data ---------- */
let data = read(DATA_KEY) ?? emptyData();
const listeners = new Set();
let onLocalChange = null;
const notify = () => listeners.forEach((l) => l());
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
export const getData = () => data;
/** Apply a local edit: stamps updatedAt, saves, and asks sync to push. */
export function update(fn) {
    data = { ...fn(data), updatedAt: Date.now() };
    write(DATA_KEY, data);
    notify();
    onLocalChange?.(data);
}
/** Replace with data that came from the server (no push back). */
export function replaceFromRemote(d) {
    data = d;
    write(DATA_KEY, data);
    notify();
}
export function setLocalChangeHandler(fn) { onLocalChange = fn; }
export const useData = () => useSyncExternalStore(subscribe, getData);
let prefs = { lang: 'uz', tab: 'plan', selected: null, ...(read(PREFS_KEY) ?? {}) };
const prefListeners = new Set();
export function setPrefs(p) {
    prefs = { ...prefs, ...p };
    write(PREFS_KEY, prefs);
    prefListeners.forEach((l) => l());
}
export const usePrefs = () => useSyncExternalStore((l) => { prefListeners.add(l); return () => prefListeners.delete(l); }, () => prefs);
