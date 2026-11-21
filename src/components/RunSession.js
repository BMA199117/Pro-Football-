import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { AnimatedPitch } from './AnimatedPitch';
import { useT, useDrills, PHASE_COLOR } from '../hooks';
import { PHASES } from '../types';
/** Full-screen pitch-side mode: one drill at a time with a countdown. */
export function RunSession({ session, onClose }) {
    const { t, L } = useT();
    const drills = useDrills();
    const byId = new Map(drills.map((d) => [d.id, d]));
    const steps = PHASES.flatMap((p) => session.phases[p].map((id) => ({ phase: p, drill: byId.get(id) }))).filter((s) => s.drill);
    const [i, setI] = useState(0);
    const [left, setLeft] = useState((steps[0]?.drill?.min ?? 0) * 60);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const lock = useRef(null);
    useEffect(() => {
        const nav = navigator;
        nav.wakeLock?.request('screen').then((l) => { lock.current = l; }).catch(() => { });
        return () => { lock.current?.release().catch(() => { }); };
    }, []);
    useEffect(() => {
        if (!running)
            return;
        const id = setInterval(() => setLeft((x) => {
            if (x <= 1) {
                setRunning(false);
                try {
                    navigator.vibrate?.([300, 150, 300]);
                }
                catch { /* no vibration */ }
                return 0;
            }
            return x - 1;
        }), 1000);
        return () => clearInterval(id);
    }, [running]);
    const go = (n) => {
        if (n >= steps.length) {
            setFinished(true);
            setRunning(false);
            return;
        }
        if (n < 0)
            return;
        setI(n);
        setLeft((steps[n].drill?.min ?? 0) * 60);
        setRunning(false);
    };
    const step = steps[i];
    const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
    return (_jsxs("div", { className: "run", children: [_jsxs("div", { className: "run-top", children: [_jsxs("button", { className: "btn ghost small light", onClick: onClose, children: ["\u2715 ", t('close')] }), _jsx("span", { children: session.goal })] }), finished || !step ? (_jsxs("div", { className: "run-done", children: [_jsx("h1", { children: t('done') }), _jsx("button", { className: "btn", onClick: onClose, children: t('close') })] })) : (_jsxs("div", { className: "run-body", children: [_jsxs("div", { className: "run-meta", children: [_jsx("span", { className: "chip", style: { background: PHASE_COLOR[step.phase], color: '#fff' }, children: t(step.phase) }), _jsxs("span", { children: [i + 1, " / ", steps.length, " ", t('drillOf')] })] }), _jsx("h1", { children: L(step.drill.name) }), _jsxs("div", { className: "run-grid", children: [_jsx("div", { className: "run-pitch", children: _jsx(AnimatedPitch, { id: step.drill.id, type: step.drill.dia }) }), _jsxs("div", { className: "run-side", children: [_jsxs("div", { className: 'clock' + (left === 0 ? ' zero' : ''), "aria-live": "polite", children: [mm, ":", ss] }), _jsx("button", { className: "btn big", onClick: () => setRunning(!running), children: running ? t('pause') : left === (step.drill.min * 60) ? '▶ ' + t('startTimer') : t('resume') }), step.drill.points && _jsx("ul", { className: "points", children: step.drill.points.map((p, k) => _jsx("li", { children: L(p) }, k)) })] })] }), _jsxs("div", { className: "run-nav", children: [_jsxs("button", { className: "btn ghost light", onClick: () => go(i - 1), disabled: i === 0, children: ["\u2039 ", t('prev')] }), _jsx("button", { className: "btn ghost light", onClick: () => go(i + 1), children: i === steps.length - 1 ? t('finish') : t('next') + ' ›' })] })] }))] }));
}
