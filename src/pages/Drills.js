import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useT, useDrills } from '../hooks';
import { update, useData } from '../store';
import { DrillDetail } from '../components/DrillDetail';
import { Pitch } from '../components/Pitch';
import { DrillPitch } from '../components/AnimatedPitch';
import { BOOK_SCENES } from '../book';
import { Modal, ConfirmButton } from '../components/Modal';
import { uid } from '../dates';
import { CATEGORIES } from '../types';
const CAT_COLOR = { tech: 'var(--pitch)', tact: 'var(--blue)', phys: 'var(--cone)', gk: 'var(--purple)' };
const BANDS = [
    { id: 'u8', label: 'U6–U8', from: 6, to: 8 },
    { id: 'u10', label: 'U9–U10', from: 9, to: 10 },
    { id: 'u12', label: 'U11–U12', from: 11, to: 12 },
    { id: 'u14', label: 'U13–U14', from: 13, to: 14 },
    { id: 'u17', label: 'U15–U17', from: 15, to: 17 },
];
/** "U9–U12" → "U9, U10, U11, U12" (long ranges stay short) */
const ageList = (r) => {
    const n = r.match(/\d+/g)?.map(Number) ?? [];
    if (n.length < 2 || n[1] - n[0] > 3)
        return r;
    return Array.from({ length: n[1] - n[0] + 1 }, (_, i) => 'U' + (n[0] + i)).join(', ');
};
const DIAGRAMS = ['pass', 'dribble', 'rondo', 'smallgame', 'shoot', 'duel', 'overload', 'sprint', 'warmup', 'gk'];
export function Drills() {
    const { t, L } = useT();
    // drills drawn from the books first, so every card looks like its own exercise
    const drills = [...useDrills()].sort((a, b) => Number(!BOOK_SCENES[a.id]) - Number(!BOOK_SCENES[b.id]));
    const [cat, setCat] = useState('all');
    const [q, setQ] = useState('');
    const [adding, setAdding] = useState(false);
    const [age, setAge] = useState('');
    const [view, setView] = useState('base');
    const [onlyBooks, setOnlyBooks] = useState(false);
    const [detail, setDetail] = useState(null);
    const favs = useData().favorites ?? [];
    const range = (r) => {
        const n = r.match(/\d+/g)?.map(Number) ?? [];
        return n.length ? [n[0], n[1] ?? n[0]] : [0, 99];
    };
    const fitsBand = (r, b) => { const [a, z] = range(r); return a <= b.to && z >= b.from; };
    const base = drills.filter((d) => (cat === 'all' || d.cat === cat) && (view !== 'fav' || favs.includes(d.id)) && (view !== 'mine' || !!d.custom) && (!onlyBooks || !!d.source) &&
        (q === '' || (d.name.uz + ' ' + d.name.ru).toLowerCase().includes(q.toLowerCase())));
    const band = BANDS.find((b) => b.id === age);
    const shown = band ? base.filter((d) => fitsBand(d.age, band)) : base;
    // "all ages": one section per age band, each drill under the youngest band it suits
    const sections = band ? [{ band, list: shown }] : BANDS.map((b) => ({ band: b, list: base.filter((d) => BANDS.find((x) => fitsBand(d.age, x)) === b) })).filter((s) => s.list.length);
    const card = (d) => (_jsxs("article", { className: "card", children: [_jsxs("button", { className: "card-open", onClick: () => setDetail(d), "aria-label": L(d.name), children: [_jsx(DrillPitch, { id: d.id, type: d.dia, maxHeight: 110 }), _jsx("span", { className: "play-badge", "aria-hidden": "true", children: "\u25B6" })] }), _jsxs("div", { className: "b", children: [_jsxs("button", { className: "n link", onClick: () => setDetail(d), children: [favs.includes(d.id) && _jsx("span", { className: "fav", children: "\u2605 " }), L(d.name)] }), _jsx("p", { children: L(d.desc) }), _jsxs("dl", { className: "facts", children: [d.players && _jsxs(_Fragment, { children: [_jsx("dt", { children: t('playersCount') }), _jsx("dd", { children: d.players })] }), _jsx("dt", { children: t('ageCat') }), _jsx("dd", { children: ageList(d.age) }), _jsx("dt", { children: t('equip') }), _jsx("dd", { children: L(d.equip) })] }), _jsxs("div", { className: "meta", children: [_jsx("span", { className: "chip", style: { boxShadow: `inset 3px 0 0 ${CAT_COLOR[d.cat]}` }, children: t(d.cat) }), _jsxs("span", { className: "chip cone", children: [d.min, " ", t('min')] }), d.source && _jsx("span", { className: "chip book", title: t('source'), children: "\uD83D\uDCD6" })] }), d.custom && (_jsx(ConfirmButton, { label: t('del'), confirmLabel: t('yes'), onConfirm: () => update((x) => ({ ...x, customDrills: x.customDrills.filter((y) => y.id !== d.id) })) }))] })] }, d.id));
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "head", children: [_jsxs("div", { children: [_jsx("h1", { children: t('lib') }), _jsx("p", { className: "sub", children: t('libSub') })] }), _jsxs("button", { className: "btn", onClick: () => setAdding(true), children: ["+ ", t('own')] })] }), _jsx("div", { className: "libtabs", role: "group", children: ['base', 'fav', 'mine'].map((v) => (_jsx("button", { "aria-pressed": view === v, onClick: () => setView(v), children: v === 'fav' ? '★ ' + t('favs') : t(v) }, v))) }), _jsxs("div", { className: "ages", role: "group", "aria-label": t('age'), children: [_jsxs("button", { "aria-pressed": age === '', onClick: () => setAge(''), children: [t('allAges'), _jsx("small", { children: base.length })] }), BANDS.map((b) => (_jsxs("button", { "aria-pressed": age === b.id, onClick: () => setAge(b.id), children: [b.label, _jsxs("span", { className: "yrs", children: [b.from, "\u2013", b.to, " ", t('years')] }), _jsx("small", { children: base.filter((d) => fitsBand(d.age, b)).length })] }, b.id)))] }), _jsxs("div", { className: "filters", children: [['all', ...CATEGORIES].map((c) => (_jsx("button", { "aria-pressed": cat === c, onClick: () => setCat(c), children: t(c) }, c))), _jsxs("button", { "aria-pressed": onlyBooks, onClick: () => setOnlyBooks(!onlyBooks), children: ["\uD83D\uDCD6 ", t('fromBooks')] }), _jsx("input", { className: "search", id: "drill-search", type: "search", value: q, onChange: (e) => setQ(e.target.value), placeholder: t('search'), "aria-label": t('search') })] }), sections.map(({ band: b, list }) => (_jsxs("section", { className: "band", children: [_jsxs("h2", { className: "band-h", children: [b.label, " ", _jsxs("span", { children: ["\u00B7 ", b.from, "\u2013", b.to, " ", t('years'), " \u00B7 ", list.length, " ", t('drillsN')] })] }), _jsx("div", { className: "cards", children: list.map(card) })] }, b.id))), shown.length === 0 && _jsx("p", { className: "empty", children: t('noDrills') }), adding && _jsx(DrillForm, { onClose: () => setAdding(false) }), detail && _jsx(DrillDetail, { drill: detail, onClose: () => setDetail(null) })] }));
}
function DrillForm({ onClose }) {
    const { t } = useT();
    const [f, setF] = useState({ name: '', desc: '', cat: 'tech', dia: 'pass', min: 10, age: 'U10–U14', equip: '', points: '' });
    const set = (k) => (e) => setF({ ...f, [k]: k === 'min' ? Number(e.target.value) : e.target.value });
    const both = (s) => ({ uz: s, ru: s });
    const submit = (e) => {
        e.preventDefault();
        update((d) => ({ ...d, customDrills: [{ id: uid(), cat: f.cat, dia: f.dia, age: f.age, min: f.min || 10, name: both(f.name.trim()), desc: both(f.desc.trim()), equip: both(f.equip.trim() || '—'), points: f.points.split('\n').map((x) => x.trim()).filter(Boolean).map(both), custom: true }, ...d.customDrills] }));
        onClose();
    };
    return (_jsx(Modal, { title: t('own'), onClose: onClose, children: _jsxs("form", { className: "form", onSubmit: submit, children: [_jsxs("label", { className: "full", children: [t('name'), _jsx("input", { id: "fd-name", value: f.name, onChange: set('name'), required: true, autoFocus: true })] }), _jsxs("label", { className: "full", children: [t('desc'), _jsx("textarea", { id: "fd-desc", rows: 3, value: f.desc, onChange: set('desc') })] }), _jsxs("label", { children: [t('cat'), _jsx("select", { id: "fd-cat", value: f.cat, onChange: set('cat'), children: CATEGORIES.map((c) => _jsx("option", { value: c, children: t(c) }, c)) })] }), _jsxs("label", { children: [t('min'), _jsx("input", { id: "fd-min", type: "number", min: 1, value: f.min, onChange: set('min') })] }), _jsxs("label", { children: [t('age'), _jsx("input", { id: "fd-age", value: f.age, onChange: set('age') })] }), _jsxs("label", { children: [t('equip'), _jsx("input", { id: "fd-eq", value: f.equip, onChange: set('equip') })] }), _jsxs("label", { className: "full", children: [t('points'), _jsx("textarea", { id: "fd-points", rows: 3, value: f.points, onChange: set('points'), placeholder: "1 qator = 1 maslahat" })] }), _jsx("div", { className: "full", children: _jsx("div", { className: "dia-pick", children: DIAGRAMS.map((d) => (_jsx("button", { type: "button", "aria-pressed": f.dia === d, onClick: () => setF({ ...f, dia: d }), children: _jsx(Pitch, { type: d, maxHeight: 50 }) }, d))) }) }), _jsxs("div", { className: "row full", children: [_jsx("button", { type: "button", className: "btn ghost", onClick: onClose, children: t('cancel') }), _jsx("button", { className: "btn", children: t('save') })] })] }) }));
}
