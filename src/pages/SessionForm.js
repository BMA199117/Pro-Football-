import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from '../components/Modal';
import { useT } from '../hooks';
import { update, useData, setPrefs } from '../store';
import { iso, uid } from '../dates';
export function SessionForm({ session, defaultDate, template, onClose }) {
    const { t, L } = useT();
    const data = useData();
    const [goal, setGoal] = useState(session?.goal ?? (template ? L(template.title) : ''));
    const [date, setDate] = useState(session?.date ?? defaultDate ?? iso(new Date()));
    const [time, setTime] = useState(session?.time ?? '16:00');
    const [group, setGroup] = useState(session?.group ?? (template && data.groups.includes(template.group) ? template.group : data.groups[0] ?? 'U12'));
    const [newGroup, setNewGroup] = useState('');
    const [notes, setNotes] = useState(session?.notes ?? '');
    const submit = (e) => {
        e.preventDefault();
        const g = newGroup.trim() || group;
        const id = session?.id ?? uid();
        update((d) => {
            const groups = d.groups.includes(g) ? d.groups : [...d.groups, g];
            const phases = template ? { warm: [...template.phases.warm], main: [...template.phases.main], cool: [...template.phases.cool] } : { warm: [], main: [], cool: [] };
            const base = session ?? { id, date, time, group: g, goal, phases, att: {} };
            const next = { ...base, date, time, group: g, goal: goal.trim(), notes: notes.trim() };
            return { ...d, groups, sessions: session ? d.sessions.map((s) => (s.id === id ? next : s)) : [...d.sessions, next] };
        });
        setPrefs({ selected: id, tab: 'plan' });
        onClose();
    };
    return (_jsx(Modal, { title: session ? t('edit') : template ? `${t('fromTemplate')}: ${L(template.title)}` : t('newS'), onClose: onClose, children: _jsxs("form", { className: "form", onSubmit: submit, children: [_jsxs("label", { className: "full", children: [t('goal'), _jsx("input", { id: "fs-goal", value: goal, onChange: (e) => setGoal(e.target.value), required: true, autoFocus: true })] }), _jsxs("label", { children: [t('date'), _jsx("input", { id: "fs-date", type: "date", value: date, onChange: (e) => setDate(e.target.value), required: true })] }), _jsxs("label", { children: [t('time'), _jsx("input", { id: "fs-time", type: "time", value: time, onChange: (e) => setTime(e.target.value) })] }), _jsxs("label", { children: [t('group'), _jsx("select", { id: "fs-group", value: group, onChange: (e) => setGroup(e.target.value), children: data.groups.map((g) => _jsx("option", { children: g }, g)) })] }), _jsxs("label", { children: [t('newGroup'), _jsx("input", { id: "fs-newgroup", value: newGroup, onChange: (e) => setNewGroup(e.target.value), placeholder: "U14" })] }), _jsxs("label", { className: "full", children: [t('notes'), _jsx("textarea", { id: "fs-notes", rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) })] }), _jsxs("div", { className: "row full", children: [_jsx("button", { type: "button", className: "btn ghost", onClick: onClose, children: t('cancel') }), _jsx("button", { className: "btn", children: t('save') })] })] }) }));
}
