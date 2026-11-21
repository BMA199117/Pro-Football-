import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { usePrefs, setPrefs } from './store';
import { useT } from './hooks';
import { Plan } from './pages/Plan';
import { Drills } from './pages/Drills';
import { Team } from './pages/Team';
import { Calendar } from './pages/Calendar';
import { Knowledge } from './pages/Knowledge';
import { SyncBadge, SyncPanel } from './components/SyncPanel';
const ICON = {
    plan: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "4", y: "3", width: "16", height: "18", rx: "2" }), _jsx("path", { d: "M8 8h8M8 12h8M8 16h5" })] }),
    drills: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M12 4l7 15H5z" }), _jsx("path", { d: "M8 13h8" })] }),
    team: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "9", cy: "8", r: "3" }), _jsx("circle", { cx: "17", cy: "9", r: "2.5" }), _jsx("path", { d: "M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 20c0-2.5 1.5-4.5 4-4.5" })] }),
    know: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" }), _jsx("path", { d: "M4 19V5M8 7h6" })] }),
    cal: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }), _jsx("path", { d: "M3 10h18M8 3v4M16 3v4" })] }),
};
const TABS = ['plan', 'drills', 'know', 'team', 'cal'];
export default function App() {
    const { tab, lang, theme } = usePrefs();
    const { t } = useT();
    const [sync, setSync] = useState(false);
    useEffect(() => { if (theme)
        document.documentElement.dataset.theme = theme;
    else
        delete document.documentElement.dataset.theme; }, [theme]);
    useEffect(() => { document.documentElement.lang = lang; document.title = t('appName'); }, [lang, t]);
    const Page = { plan: Plan, drills: Drills, team: Team, cal: Calendar, know: Knowledge }[tab];
    return (_jsxs("div", { className: "app", children: [_jsx("header", { className: "mtop", "aria-hidden": "true", children: _jsx("span", { className: "mbrand", children: t('appName') }) }), _jsxs("aside", { className: "rail", children: [_jsxs("div", { className: "brand", children: [t('appName'), _jsx("small", { children: t('sub') })] }), _jsx("nav", { className: "nav", children: TABS.map((k) => (_jsxs("button", { "aria-current": tab === k, onClick: () => setPrefs({ tab: k }), children: [ICON[k], _jsx("span", { children: t(k) })] }, k))) }), _jsxs("div", { className: "rail-foot", children: [_jsxs("div", { className: "row-ctl", children: [_jsx(SyncBadge, { onClick: () => setSync(true) }), _jsx("button", { className: "theme-btn", "aria-label": t('theme'), title: t('theme'), onClick: () => { const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; setPrefs({ theme: dark ? 'light' : 'dark' }); }, children: "\u25D0" })] }), _jsx("div", { className: "lang", role: "group", "aria-label": "Til / \u042F\u0437\u044B\u043A", children: ['uz', 'ru'].map((l) => (_jsx("button", { "aria-pressed": lang === l, onClick: () => setPrefs({ lang: l }), children: l.toUpperCase() }, l))) })] })] }), _jsx("main", { children: _jsx("div", { className: "wrap", children: _jsx(Page, {}) }) }), sync && _jsx(SyncPanel, { onClose: () => setSync(false) })] }));
}
