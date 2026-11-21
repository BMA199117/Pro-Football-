import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useT, useDrills, sessionMinutes } from '../hooks';
import { useData, setPrefs } from '../store';
import { addDays, iso, monday } from '../dates';
import { SessionForm } from './SessionForm';
export function Calendar() {
    const { t, days, months } = useT();
    const data = useData();
    const drills = useDrills();
    const [offset, setOffset] = useState(0);
    const [newOn, setNewOn] = useState(null);
    const start = addDays(monday(new Date()), offset * 7);
    const today = iso(new Date());
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "head", children: [_jsxs("div", { children: [_jsx("h1", { children: t('cal') }), _jsx("p", { className: "sub", children: t('calSub') })] }), _jsxs("div", { className: "row", children: [_jsxs("button", { className: "btn ghost small", onClick: () => setOffset(offset - 1), children: ["\u2039 ", t('prevWeek')] }), _jsx("button", { className: "btn ghost small", onClick: () => setOffset(0), children: t('today') }), _jsxs("button", { className: "btn ghost small", onClick: () => setOffset(offset + 1), children: [t('nextWeek'), " \u203A"] })] })] }), _jsx("div", { className: "week", children: days.map((name, i) => {
                    const d = addDays(start, i), k = iso(d);
                    const ev = data.sessions.filter((s) => s.date === k).sort((a, b) => a.time.localeCompare(b.time));
                    return (_jsxs("div", { className: 'day' + (k === today ? ' today' : ''), children: [_jsxs("h4", { children: [_jsx("span", { children: name }), _jsxs("span", { className: "muted", children: [d.getDate(), " ", months[d.getMonth()]] })] }), ev.map((s) => (_jsxs("button", { className: "ev", onClick: () => setPrefs({ selected: s.id, tab: 'plan' }), children: [_jsxs("b", { children: [s.time, " \u00B7 ", s.group] }), s.goal, " \u00B7 ", sessionMinutes(s, drills), " ", t('min')] }, s.id))), _jsx("button", { className: "add-day", onClick: () => setNewOn(k), "aria-label": t('newS'), children: "+" })] }, k));
                }) }), newOn && _jsx(SessionForm, { defaultDate: newOn, onClose: () => setNewOn(null) })] }));
}
