import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useT } from '../hooks';
import { KNOWLEDGE, TOPICS } from '../knowledge';
import { SOURCES } from '../sources';
import { DEV_AREA_LABELS, DEV_PRINCIPLES, DEV_SOURCES, DEV_STAGES } from '../development';
const TOPIC_COLOR = { method: 'var(--pitch)', game: 'var(--blue)', kids: 'var(--cone)', physical: 'var(--purple)' };
export function Knowledge() {
    const { t, L } = useT();
    const [topic, setTopic] = useState('all');
    const [open, setOpen] = useState(null);
    const [view, setView] = useState('tips');
    const shown = KNOWLEDGE.filter((k) => topic === 'all' || k.topic === topic);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "head", children: _jsxs("div", { children: [_jsx("h1", { children: t('know') }), _jsx("p", { className: "sub", children: t('knowSub') })] }) }), _jsx("div", { className: "libtabs", role: "group", children: ['tips', 'stages', 'principles'].map((v) => (_jsx("button", { "aria-pressed": view === v, onClick: () => setView(v), children: t(v) }, v))) }), view === 'stages' && _jsx(Stages, {}), view === 'principles' && _jsx(Principles, {}), view === 'tips' && _jsxs(_Fragment, { children: [_jsx("div", { className: "filters", children: ['all', ...TOPICS].map((c) => (_jsx("button", { "aria-pressed": topic === c, onClick: () => setTopic(c), children: t(c) }, c))) }), _jsx("div", { className: "know-list", children: shown.map((k) => {
                            const isOpen = open === k.id;
                            const src = SOURCES[k.source];
                            return (_jsxs("article", { className: "know", style: { borderLeftColor: TOPIC_COLOR[k.topic] }, children: [_jsxs("button", { className: "know-h", "aria-expanded": isOpen, onClick: () => setOpen(isOpen ? null : k.id), children: [_jsx("span", { className: "know-topic", style: { color: TOPIC_COLOR[k.topic] }, children: t(k.topic) }), _jsx("span", { className: "know-title", children: L(k.title) }), _jsx("span", { className: "know-arrow", children: isOpen ? '−' : '+' })] }), _jsx("p", { className: "know-idea", children: L(k.idea) }), isOpen && (_jsxs("div", { className: "know-more", children: [_jsx("h3", { className: "label", children: t('howTo') }), _jsx("ul", { className: "points", children: k.tips.map((tip, i) => _jsx("li", { children: L(tip) }, i)) })] })), src && _jsxs("p", { className: "source", children: ["\uD83D\uDCD6 ", src.author, ", \u00AB", src.title, "\u00BB"] })] }, k.id));
                        }) })] })] }));
}
const D = (lang, x) => (lang === 'uz' ? x[0] : x[1]);
const AREAS = ['technical', 'tactical', 'physical', 'mental'];
function SourceLinks({ ids }) {
    const { t } = useT();
    const list = DEV_SOURCES.filter((s) => ids.includes(s.id));
    if (!list.length)
        return null;
    return (_jsxs("p", { className: "source", children: ["\uD83D\uDD17 ", t('source'), ": ", list.map((s, i) => (_jsxs("span", { children: [i > 0 && ' · ', _jsxs("a", { href: s.url, target: "_blank", rel: "noreferrer", children: [s.org, ": ", s.title] })] }, s.id)))] }));
}
function Stages() {
    const { t, lang } = useT();
    const [id, setId] = useState(DEV_STAGES[0].id);
    const st = DEV_STAGES.find((s) => s.id === id) ?? DEV_STAGES[0];
    const L = (x) => D(lang, x);
    return (_jsxs(_Fragment, { children: [_jsx("p", { className: "sub", children: t('stagesSub') }), _jsx("div", { className: "ages", role: "group", children: DEV_STAGES.map((s) => (_jsxs("button", { "aria-pressed": s.id === id, onClick: () => setId(s.id), children: [s.ages, " ", t('years'), _jsx("span", { className: "yrs", children: L(s.title) })] }, s.id))) }), _jsxs("article", { className: "stage", children: [_jsxs("h2", { className: "band-h", children: [L(st.title), " ", _jsxs("span", { children: ["\u00B7 ", st.ages, " ", t('years')] })] }), _jsxs("p", { className: "lead", children: ["\uD83C\uDFAF ", L(st.goal)] }), _jsx("h3", { className: "label", children: t('profile') }), _jsx("ul", { className: "points", children: st.profile.map((x, i) => _jsx("li", { children: L(x) }, i)) }), _jsx("div", { className: "stage-grid", children: AREAS.map((a) => (_jsxs("div", { className: "stage-area", children: [_jsx("h3", { className: "label", children: L(DEV_AREA_LABELS[a]) }), _jsx("ul", { className: "points", children: st.focus[a].map((x, i) => _jsx("li", { children: L(x) }, i)) })] }, a))) }), _jsx("h3", { className: "label", children: t('formats') }), _jsx("ul", { className: "points", children: st.formats.map((x, i) => _jsx("li", { children: L(x) }, i)) }), _jsx("h3", { className: "label", children: t('sessionModel') }), _jsx("p", { children: L(st.session) }), _jsxs("div", { className: "stage-grid two", children: [_jsxs("div", { className: "stage-area do", children: [_jsxs("h3", { className: "label", children: ["\u2713 ", t('coachDo')] }), _jsx("ul", { className: "points", children: st.coachDo.map((x, i) => _jsx("li", { children: L(x) }, i)) })] }), _jsxs("div", { className: "stage-area avoid", children: [_jsxs("h3", { className: "label", children: ["\u2715 ", t('coachAvoid')] }), _jsx("ul", { className: "points", children: st.coachAvoid.map((x, i) => _jsx("li", { children: L(x) }, i)) })] })] }), _jsx("h3", { className: "label", children: t('heading') }), _jsx("p", { children: L(st.heading) }), _jsx(SourceLinks, { ids: st.sources })] })] }));
}
function Principles() {
    const { t, lang } = useT();
    const [open, setOpen] = useState(null);
    const L = (x) => D(lang, x);
    return (_jsx("div", { className: "know-list", children: DEV_PRINCIPLES.map((p) => {
            const isOpen = open === p.id;
            return (_jsxs("article", { className: "know", children: [_jsxs("button", { className: "know-h", "aria-expanded": isOpen, onClick: () => setOpen(isOpen ? null : p.id), children: [_jsx("span", { className: "know-topic", style: { color: 'var(--pitch)' }, children: t('principles') }), _jsx("span", { className: "know-title", children: L(p.title) }), _jsx("span", { className: "know-arrow", children: isOpen ? '−' : '+' })] }), _jsx("p", { className: "know-idea", children: L(p.idea) }), isOpen && _jsxs("div", { className: "know-more", children: [_jsx("h3", { className: "label", children: t('howTo') }), _jsx("ul", { className: "points", children: p.tips.map((x, i) => _jsx("li", { children: L(x) }, i)) })] }), _jsx(SourceLinks, { ids: p.sources })] }, p.id));
        }) }));
}
