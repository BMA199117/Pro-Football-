import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useT, useDrills, sessionMinutes, PHASE_COLOR } from '../hooks';
import { update, useData, usePrefs, setPrefs } from '../store';
import { DrillPitch } from '../components/AnimatedPitch';
import { Modal, ConfirmButton } from '../components/Modal';
import { SessionForm } from './SessionForm';
import { DrillDetail } from '../components/DrillDetail';
import { RunSession } from '../components/RunSession';
import { sampleData } from '../sample';
import { parse, weekdayIndex } from '../dates';
import { PHASES } from '../types';
import { TEMPLATES } from '../templates';
export function Plan() {
    const { t, L, days, months } = useT();
    const data = useData();
    const { selected } = usePrefs();
    const drills = useDrills();
    const byId = new Map(drills.map((d) => [d.id, d]));
    const [form, setForm] = useState(null);
    const [picking, setPicking] = useState(null);
    const [detail, setDetail] = useState(null);
    const [running, setRunning] = useState(false);
    const [tplOpen, setTplOpen] = useState(false);
    const [tpl, setTpl] = useState(null);
    const sorted = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const s = sorted.find((x) => x.id === selected) ?? sorted[0];
    const fmt = (d) => { const x = parse(d); return { d: x.getDate(), m: months[x.getMonth()], w: days[weekdayIndex(x)] }; };
    const head = (_jsxs("div", { className: "head", children: [_jsxs("div", { children: [_jsx("h1", { children: t('plan') }), _jsx("p", { className: "sub", children: t('planSub') })] }), _jsxs("div", { className: "row", children: [_jsxs("button", { className: "btn ghost", onClick: () => setTplOpen(true), children: ["\uD83D\uDCCB ", t('fromTemplate')] }), _jsxs("button", { className: "btn", onClick: () => setForm('new'), children: ["+ ", t('newS')] })] })] }));
    const tplMins = (x) => PHASES.reduce((a, p) => a + x.phases[p].reduce((b, id) => b + (byId.get(id)?.min ?? 0), 0), 0);
    const modals = (_jsxs(_Fragment, { children: [tplOpen && (_jsxs(Modal, { title: t('templates'), onClose: () => setTplOpen(false), children: [_jsx("p", { className: "sub", style: { margin: 0 }, children: t('templatesSub') }), ['10–14', '15–17'].map((age) => (_jsxs("div", { className: "list", children: [_jsxs("h3", { className: "label", children: [age, " ", t('ages')] }), TEMPLATES.filter((x) => x.ages === age).map((x) => (_jsxs("button", { className: "pick tpl", onClick: () => { setTpl(x); setTplOpen(false); }, children: [_jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("b", { children: L(x.title) }), _jsx("div", { className: "m", children: L(x.focus) })] }), _jsxs("span", { className: "chip cone", children: [tplMins(x), " ", t('min')] })] }, x.id)))] }, age))), _jsx("div", { className: "row", children: _jsx("button", { className: "btn ghost", onClick: () => setTplOpen(false), children: t('close') }) })] })), tpl && _jsx(SessionForm, { template: tpl, onClose: () => setTpl(null) })] }));
    if (!s)
        return (_jsxs(_Fragment, { children: [head, _jsxs("div", { className: "panel empty-state", children: [_jsx("p", { children: t('noSessions') }), _jsx("div", { className: "row", style: { justifyContent: 'center' }, children: _jsx("button", { className: "btn ghost", onClick: () => update(() => sampleData()), children: t('loadSample') }) })] }), form && _jsx(SessionForm, { onClose: () => setForm(null) }), modals] }));
    const total = sessionMinutes(s, drills);
    const came = Object.values(s.att).filter(Boolean).length;
    const groupSize = data.players.filter((p) => p.group === s.group).length;
    const f = fmt(s.date);
    const editPhase = (p, fn) => update((d) => ({ ...d, sessions: d.sessions.map((x) => (x.id === s.id ? { ...x, phases: { ...x.phases, [p]: fn(x.phases[p]) } } : x)) }));
    return (_jsxs(_Fragment, { children: [head, _jsxs("div", { className: "grid2", children: [_jsx("div", { className: "list", children: sorted.map((x) => {
                            const g = fmt(x.date);
                            return (_jsxs("button", { className: "sess", "aria-current": x.id === s.id, onClick: () => setPrefs({ selected: x.id }), children: [_jsxs("div", { className: "date", children: [_jsx("b", { children: g.d }), _jsx("span", { children: g.m })] }), _jsxs("div", { children: [_jsx("div", { className: "t", children: x.goal }), _jsxs("div", { className: "m", children: [g.w, ", ", x.time, " \u00B7 ", x.group, " \u00B7 ", sessionMinutes(x, drills), " ", t('min')] })] })] }, x.id));
                        }) }), _jsxs("div", { className: "panel", children: [_jsxs("div", { className: "head", children: [_jsxs("div", { children: [_jsx("h2", { children: s.goal }), _jsxs("div", { className: "meta", style: { marginTop: 8 }, children: [_jsxs("span", { className: "chip", children: [f.w, ", ", f.d, " ", f.m, " \u00B7 ", s.time] }), _jsxs("span", { className: "chip", children: [t('group'), ": ", s.group] }), _jsxs("span", { className: "chip cone", children: [t('total'), ": ", total, " ", t('min')] }), came > 0 && _jsxs("span", { className: "chip", children: [came, "/", groupSize, " ", t('present')] })] }), s.notes && _jsx("p", { className: "sub", children: s.notes })] }), _jsxs("div", { className: "row", children: [total > 0 && _jsxs("button", { className: "btn small cone-btn", onClick: () => setRunning(true), children: ["\u25B6 ", t('start')] }), _jsx("button", { className: "btn ghost small", onClick: () => setForm('edit'), children: t('edit') }), _jsx(ConfirmButton, { label: t('del'), confirmLabel: t('yes'), onConfirm: () => update((d) => ({ ...d, sessions: d.sessions.filter((x) => x.id !== s.id) })) })] })] }), _jsx("div", { className: "bar", children: total > 0 && PHASES.map((p) => {
                                    const m = s.phases[p].reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0);
                                    return _jsx("i", { style: { width: `${(m / total) * 100}%`, background: PHASE_COLOR[p] }, title: `${t(p)} ${m}` }, p);
                                }) }), PHASES.map((p) => {
                                const m = s.phases[p].reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0);
                                return (_jsxs("div", { className: "phase", children: [_jsxs("div", { className: "phase-h", children: [_jsxs("h3", { children: [_jsx("span", { className: "dot", style: { background: PHASE_COLOR[p] } }), t(p), " ", _jsxs("span", { className: "muted", children: [m, " ", t('min')] })] }), _jsxs("button", { className: "btn ghost small", onClick: () => setPicking(p), children: ["+ ", t('add')] })] }), s.phases[p].length === 0 && _jsx("div", { className: "empty", children: t('empty') }), s.phases[p].map((id, i) => {
                                            const d = byId.get(id);
                                            if (!d)
                                                return null;
                                            return (_jsxs("div", { className: "drow", children: [_jsx(DrillPitch, { id: d.id, type: d.dia, maxHeight: 44 }), _jsxs("button", { className: "drow-main", onClick: () => setDetail(d), children: [_jsx("div", { className: "n", children: L(d.name) }), _jsxs("div", { className: "m", children: [t(d.cat), " \u00B7 ", L(d.equip)] })] }), _jsxs("span", { className: "mins", children: [d.min, "\u2032"] }), _jsx("button", { className: "x", "aria-label": t('del'), onClick: () => editPhase(p, (ids) => ids.filter((_, j) => j !== i)), children: "\u00D7" })] }, id + i));
                                        })] }, p));
                            })] })] }), form && _jsx(SessionForm, { session: form === 'edit' ? s : undefined, onClose: () => setForm(null) }), detail && _jsx(DrillDetail, { drill: detail, onClose: () => setDetail(null) }), running && _jsx(RunSession, { session: s, onClose: () => setRunning(false) }), modals, picking && (_jsxs(Modal, { title: `${t('choose')} · ${t(picking)}`, onClose: () => setPicking(null), children: [_jsx("div", { className: "list", children: drills.map((d) => (_jsxs("button", { className: "pick", onClick: () => { editPhase(picking, (ids) => [...ids, d.id]); setPicking(null); }, children: [_jsx("div", { style: { width: 70, flex: 'none' }, children: _jsx(DrillPitch, { id: d.id, type: d.dia, maxHeight: 40 }) }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("b", { children: L(d.name) }), _jsxs("div", { className: "m", children: [t(d.cat), " \u00B7 ", d.min, " ", t('min')] })] })] }, d.id))) }), _jsx("div", { className: "row", children: _jsx("button", { className: "btn ghost", onClick: () => setPicking(null), children: t('cancel') }) })] }))] }));
}
