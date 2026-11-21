import { usePrefs, useData } from './store';
import { dict, tr } from './i18n';
import { LIBRARY } from './library';
import { PHASES } from './types';
export function useT() {
    const { lang } = usePrefs();
    return {
        lang,
        t: (k) => tr(lang, k),
        L: (x) => x[lang] || x.uz,
        days: dict[lang].days,
        months: dict[lang].months,
    };
}
export function useDrills() {
    const data = useData();
    return [...data.customDrills, ...LIBRARY];
}
export function sessionMinutes(s, drills) {
    const byId = new Map(drills.map((d) => [d.id, d]));
    return PHASES.reduce((a, p) => a + s.phases[p].reduce((b, id) => b + (byId.get(id)?.min ?? 0), 0), 0);
}
export const PHASE_COLOR = { warm: 'var(--cone)', main: 'var(--pitch)', cool: 'var(--blue)' };
