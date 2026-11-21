import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useT } from '../hooks';
import { update, useData, usePrefs, setPrefs } from '../store';
import { Modal } from '../components/Modal';
import { parse, uid } from '../dates';
export function Team() {
    const { t, months } = useT();
    const data = useData();
    const { selected } = usePrefs();
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(null);
    const sorted = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const s = sorted.find((x) => x.id === selected) ?? sorted[0];
    const [groupPick, setGroupPick] = useState(data.groups[0] ?? 'U12');
    const group = s?.group ?? groupPick;
    const players = data.players.filter((p) => p.group === group).sort((a, b) => a.num - b.num);
    const marked = data.sessions.filter((x) => x.group === group && Object.keys(x.att).length > 0);
    const rate = (pid) => marked.length ? Math.round((marked.filter((x) => x.att[pid]).length / marked.length) * 100) : 0;
    const came = s ? players.filter((p) => s.att[p.id]).length : 0;
    const toggle = (pid) => s && update((d) => ({ ...d, sessions: d.sessions.map((x) => (x.id === s.id ? { ...x, att: { ...x.att, [pid]: !x.att[pid] } } : x)) }));
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "head", children: [_jsxs("div", { children: [_jsxs("h1", { children: [t('team'), " \u00B7 ", group] }), _jsx("p", { className: "sub", children: t('teamSub') })] }), _jsxs("button", { className: "btn", onClick: () => setAdding(true), children: ["+ ", t('addPlayer')] })] }), _jsxs("div", { className: "panel", children: [_jsxs("div", { className: "head", children: [s ? (_jsxs("label", { className: "inline", children: [t('session'), ":", _jsx("select", { className: "sel", id: "att-session", value: s.id, onChange: (e) => setPrefs({ selected: e.target.value }), children: sorted.map((x) => { const d = parse(x.date); return _jsxs("option", { value: x.id, children: [d.getDate(), " ", months[d.getMonth()], " \u00B7 ", x.group, " \u00B7 ", x.goal] }, x.id); }) })] })) : (_jsxs("label", { className: "inline", children: [t('group'), ":", _jsx("select", { className: "sel", id: "team-group", value: groupPick, onChange: (e) => setGroupPick(e.target.value), children: data.groups.map((g) => _jsx("option", { children: g }, g)) })] })), s && _jsxs("span", { className: "chip", children: [came, "/", players.length, " ", t('present')] })] }), players.length === 0 ? _jsx("div", { className: "empty", children: t('noPlayers') }) : (_jsx("div", { className: "tw", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: t('num') }), _jsx("th", { children: t('pname') }), _jsx("th", { children: t('pos') }), s && _jsx("th", { children: t('session') }), _jsx("th", { children: t('rate') })] }) }), _jsx("tbody", { children: players.map((p) => {
                                        const on = !!s?.att[p.id];
                                        const r = rate(p.id);
                                        return (_jsxs("tr", { children: [_jsx("td", { className: "num", children: p.num }), _jsx("td", { children: _jsx("button", { className: "link", onClick: () => setEditing(p), children: p.name }) }), _jsx("td", { children: p.pos }), s && _jsx("td", { children: _jsx("button", { className: "tog", "aria-pressed": on, onClick: () => toggle(p.id), children: on ? t('came') : t('absent') }) }), _jsx("td", { children: _jsxs("div", { className: "pct", children: [_jsx("div", { className: "bar", children: _jsx("i", { style: { width: `${r}%`, background: 'var(--ok)' } }) }), _jsxs("span", { className: "num", children: [r, "%"] })] }) })] }, p.id));
                                    }) })] }) }))] }), (adding || editing) && _jsx(PlayerForm, { player: editing ?? undefined, group: group, onClose: () => { setAdding(false); setEditing(null); } })] }));
}
function PlayerForm({ player, group, onClose }) {
    const { t } = useT();
    const data = useData();
    const [name, setName] = useState(player?.name ?? '');
    const [num, setNum] = useState(player?.num ?? 10);
    const [pos, setPos] = useState(player?.pos ?? 'MF');
    const [grp, setGrp] = useState(player?.group ?? group);
    const submit = (e) => {
        e.preventDefault();
        const next = { id: player?.id ?? uid(), name: name.trim(), num, pos, group: grp };
        update((d) => ({ ...d, players: player ? d.players.map((p) => (p.id === next.id ? next : p)) : [...d.players, next] }));
        onClose();
    };
    const remove = () => { if (player)
        update((d) => ({ ...d, players: d.players.filter((p) => p.id !== player.id) })); onClose(); };
    return (_jsx(Modal, { title: player ? t('edit') : t('addPlayer'), onClose: onClose, children: _jsxs("form", { className: "form", onSubmit: submit, children: [_jsxs("label", { className: "full", children: [t('fullName'), _jsx("input", { id: "fp-name", value: name, onChange: (e) => setName(e.target.value), required: true, autoFocus: true })] }), _jsxs("label", { children: [t('num'), _jsx("input", { id: "fp-num", type: "number", min: 1, max: 99, value: num, onChange: (e) => setNum(Number(e.target.value)) })] }), _jsxs("label", { children: [t('pos'), _jsx("select", { id: "fp-pos", value: pos, onChange: (e) => setPos(e.target.value), children: ['GK', 'DF', 'MF', 'FW'].map((p) => _jsx("option", { children: p }, p)) })] }), _jsxs("label", { className: "full", children: [t('group'), _jsx("select", { id: "fp-group", value: grp, onChange: (e) => setGrp(e.target.value), children: data.groups.map((g) => _jsx("option", { children: g }, g)) })] }), _jsxs("div", { className: "row full", children: [player && _jsx("button", { type: "button", className: "btn ghost danger", onClick: remove, children: t('del') }), _jsx("button", { type: "button", className: "btn ghost", onClick: onClose, children: t('cancel') }), _jsx("button", { className: "btn", children: t('save') })] })] }) }));
}
