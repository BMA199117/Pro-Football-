import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from './Modal';
import { AnimatedPitch } from './AnimatedPitch';
import { LineKey } from './BookPitch';
import { BOOK_SCENES } from '../book';
import { useT } from '../hooks';
import { update, useData } from '../store';
import { parse } from '../dates';
import { PHASES } from '../types';
import { SOURCES } from '../sources';
export function DrillDetail({ drill, onClose }) {
    const { t, L, months } = useT();
    const data = useData();
    const fav = (data.favorites ?? []).includes(drill.id);
    const upcoming = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const [sid, setSid] = useState(upcoming[0]?.id ?? '');
    const [phase, setPhase] = useState('main');
    const [added, setAdded] = useState(false);
    const toggleFav = () => update((d) => {
        const f = d.favorites ?? [];
        return { ...d, favorites: f.includes(drill.id) ? f.filter((x) => x !== drill.id) : [...f, drill.id] };
    });
    const add = () => {
        update((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === sid ? { ...s, phases: { ...s.phases, [phase]: [...s.phases[phase], drill.id] } } : s)) }));
        setAdded(true);
    };
    return (_jsxs(Modal, { title: L(drill.name), onClose: onClose, children: [_jsx("div", { className: "detail-pitch", children: _jsx(AnimatedPitch, { id: drill.id, type: drill.dia }) }), BOOK_SCENES[drill.id] && _jsx(LineKey, { scene: BOOK_SCENES[drill.id], label: (k) => t({ run: 'kRun', drib: 'kDrib', pass: 'kPass', shot: 'kShot', lob: 'kLob' }[k]) }), _jsxs("div", { className: "meta", children: [_jsx("span", { className: "chip", children: t(drill.cat) }), _jsx("span", { className: "chip", children: drill.age }), _jsxs("span", { className: "chip cone", children: [drill.min, " ", t('min')] }), drill.players && _jsxs("span", { className: "chip", children: [t('playersCount'), ": ", drill.players] }), _jsx("button", { className: 'star' + (fav ? ' on' : ''), onClick: toggleFav, "aria-pressed": fav, "aria-label": t('favs'), children: "\u2605" })] }), L(drill.desc) && _jsx("p", { className: "lead", children: L(drill.desc) }), _jsxs("p", { className: "sub", children: [_jsxs("b", { children: [t('equip'), ":"] }), " ", L(drill.equip)] }), drill.source && SOURCES[drill.source] && (_jsxs("p", { className: "source", children: ["\uD83D\uDCD6 ", t('source'), ": ", SOURCES[drill.source].author, ", \u00AB", SOURCES[drill.source].title, "\u00BB"] })), drill.points && drill.points.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "label", children: t('points') }), _jsx("ul", { className: "points", children: drill.points.map((p, i) => _jsx("li", { children: L(p) }, i)) })] })), upcoming.length > 0 && (_jsxs("div", { className: "add-to", children: [_jsx("h3", { className: "label", children: t('addTo') }), _jsxs("div", { className: "row", style: { justifyContent: 'flex-start' }, children: [_jsx("select", { className: "sel", id: "dd-session", value: sid, onChange: (e) => { setSid(e.target.value); setAdded(false); }, children: upcoming.map((s) => { const d = parse(s.date); return _jsxs("option", { value: s.id, children: [d.getDate(), " ", months[d.getMonth()], " \u00B7 ", s.group, " \u00B7 ", s.goal] }, s.id); }) }), _jsx("select", { className: "sel", id: "dd-phase", value: phase, onChange: (e) => { setPhase(e.target.value); setAdded(false); }, children: PHASES.map((p) => _jsx("option", { value: p, children: t(p) }, p)) }), _jsx("button", { className: "btn small", onClick: add, disabled: added, children: added ? '✓ ' + t('added') : '+ ' + t('addTo') })] })] })), _jsx("div", { className: "row", children: _jsx("button", { className: "btn ghost", onClick: onClose, children: t('close') }) })] }));
}
