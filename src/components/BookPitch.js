import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useId } from 'react';
import { arcCtl, frameAt, marks, posAt, smooth, tracks, ballAt } from '../book/scene';
export const TEAM = {
    r: { fill: '#D9342B', stroke: '#fff', text: '#fff' },
    w: { fill: '#FFFFFF', stroke: '#1C2A22', text: '#1C2A22' },
    b: { fill: '#2F63C4', stroke: '#fff', text: '#fff' },
    y: { fill: '#F4C51C', stroke: '#1C2A22', text: '#1C2A22' },
    k: { fill: '#7E4FB3', stroke: '#fff', text: '#fff' },
    c: { fill: '#1C2A22', stroke: '#fff', text: '#fff' },
    g: { fill: '#9AA4A0', stroke: '#fff', text: '#fff' },
    o: { fill: '#F08A24', stroke: '#fff', text: '#fff' },
};
const CONE = { o: '#F28A30', y: '#F6D83A', r: '#E3463B', b: '#3D7FE6', w: '#FFFFFF' };
/** The books' line keys. EPYSA: run = red solid, dribble = black wavy, pass = white dashed, shot = dotted. */
export const LINE = { run: '#FF4A3D', drib: '#0E1C15', pass: '#FFFFFF', shot: '#0E1C15', lob: '#FFFFFF' };
const EPYSA_STYLE = {
    run: { stroke: LINE.run, width: 1, marker: 'r' },
    drib: { stroke: LINE.drib, width: 1, marker: 'k' },
    pass: { stroke: LINE.pass, dash: '2.6 1.8', width: 0.95, marker: 'w' },
    shot: { stroke: LINE.shot, dash: '0.1 2', width: 1.15, marker: 'k' },
    lob: { stroke: LINE.lob, width: 1, marker: 'w' },
};
/** FIFA manuals: run without the ball = dashed, with the ball = wavy, ball = solid line. */
const FIFA_STYLE = {
    run: { stroke: '#0E1C15', dash: '2.4 1.6', width: 0.9, marker: 'k' },
    drib: { stroke: '#0E1C15', width: 1, marker: 'k' },
    pass: { stroke: '#0E1C15', width: 1, marker: 'k' },
    shot: { stroke: '#0E1C15', width: 1.3, marker: 'k' },
    lob: { stroke: '#0E1C15', width: 1, marker: 'k' },
};
export const styleOf = (scene) => (scene.key === 'fifa' ? FIFA_STYLE : EPYSA_STYLE);
const cone = (x, y, c = 'o', k) => _jsx("path", { d: `M${x - 2.6} ${y + 2}L${x} ${y - 3}L${x + 2.6} ${y + 2}Z`, fill: CONE[c], stroke: "rgba(0,0,0,.35)", strokeWidth: 0.4 }, k);
function goalShape(x, y, dir, w, k, net, mini = false) {
    const d = mini ? 3 : 4.5;
    const horiz = dir === 'u' || dir === 'd';
    const gw = horiz ? w : d, gh = horiz ? d : w;
    const gx = horiz ? x - w / 2 : dir === 'r' ? x - d : x;
    const gy = horiz ? (dir === 'd' ? y - d : y) : y - w / 2;
    return (_jsx("g", { children: _jsx("rect", { x: gx, y: gy, width: gw, height: gh, fill: `url(#${net})`, stroke: "#fff", strokeWidth: mini ? 0.9 : 1.3 }) }, k));
}
function item(it, i, net) {
    const k = 'i' + i;
    switch (it[0]) {
        case 'area': {
            const [, x, y, w, h, cc] = it;
            const out = [_jsx("rect", { x: x, y: y, width: w, height: h, fill: "none", stroke: "#fff", strokeOpacity: 0.85, strokeWidth: 0.8 }, k)];
            if (cc) {
                const col = (cc.length > 1 ? cc[1] : 'o');
                const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]];
                if (cc[0] === 'm')
                    pts.push([x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2]);
                pts.forEach(([a, b], j) => out.push(cone(a, b, col, k + 'c' + j)));
            }
            return _jsx("g", { children: out }, k);
        }
        case 'cone': return cone(it[1], it[2], it[3], k);
        case 'cones': {
            const [, c, xs] = it;
            const out = [];
            for (let j = 0; j + 1 < xs.length; j += 2)
                out.push(cone(xs[j], xs[j + 1], c, k + j));
            return _jsx("g", { children: out }, k);
        }
        case 'goal': return goalShape(it[1], it[2], it[3], it[4] ?? 22, k, net);
        case 'mini': return goalShape(it[1], it[2], it[3], it[4] ?? 9, k, net, true);
        case 'line': return _jsx("line", { x1: it[1], y1: it[2], x2: it[3], y2: it[4], stroke: "#fff", strokeOpacity: 0.8, strokeWidth: 0.8, strokeDasharray: it[5] ? '3 2' : undefined }, k);
        case 'zone': return _jsx("rect", { x: it[1], y: it[2], width: it[3], height: it[4], fill: it[5] ?? 'rgba(255,255,255,.13)', stroke: "#fff", strokeOpacity: 0.6, strokeWidth: 0.6, strokeDasharray: "3 2" }, k);
        case 'text': return _jsx("text", { x: it[1], y: it[2], fill: "#fff", fontSize: 6, fontWeight: 700, textAnchor: "middle", style: { paintOrder: 'stroke' }, stroke: "rgba(0,0,0,.35)", strokeWidth: 1.2, children: it[3] }, k);
        case 'circle': return _jsx("circle", { cx: it[1], cy: it[2], r: it[3], fill: "none", stroke: "#fff", strokeOpacity: 0.8, strokeWidth: 0.8 }, k);
        case 'pole': return _jsxs("g", { children: [_jsx("line", { x1: it[1], y1: it[2] + 2, x2: it[1], y2: it[2] - 6, stroke: "#F6D83A", strokeWidth: 1.4 }), _jsx("circle", { cx: it[1], cy: it[2] + 2, r: 1.4, fill: "#F6D83A" })] }, k);
        case 'hurdle': return it[3]
            ? _jsx("path", { d: `M${it[1]} ${it[2] - 4}V${it[2] + 4}`, stroke: "#F6D83A", strokeWidth: 1.8, strokeLinecap: "round" }, k)
            : _jsx("path", { d: `M${it[1] - 4} ${it[2]}H${it[1] + 4}`, stroke: "#F6D83A", strokeWidth: 1.8, strokeLinecap: "round" }, k);
        case 'ladder': {
            const [, x1, y1, x2, y2] = it;
            const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 4));
            const horiz = Math.abs(x2 - x1) > Math.abs(y2 - y1);
            const out = [];
            for (let j = 0; j <= n; j++) {
                const x = x1 + ((x2 - x1) * j) / n, y = y1 + ((y2 - y1) * j) / n;
                out.push(horiz ? _jsx("line", { x1: x, y1: y - 3, x2: x, y2: y + 3 }, j) : _jsx("line", { x1: x - 3, y1: y, x2: x + 3, y2: y }, j));
            }
            return _jsxs("g", { stroke: "#F6D83A", strokeWidth: 0.8, children: [out, _jsx("line", { x1: horiz ? x1 : x1 - 3, y1: horiz ? y1 - 3 : y1, x2: horiz ? x2 : x2 - 3, y2: horiz ? y2 - 3 : y2 }), _jsx("line", { x1: horiz ? x1 : x1 + 3, y1: horiz ? y1 + 3 : y1, x2: horiz ? x2 : x2 + 3, y2: horiz ? y2 + 3 : y2 })] }, k);
        }
        case 'ball': return _jsx("circle", { cx: it[1], cy: it[2], r: 2.1, fill: "#fff", stroke: "#16231C", strokeWidth: 0.8 }, k);
        case 'traffic': return (_jsxs("g", { transform: `translate(${it[1]} ${it[2]})`, children: [_jsx("rect", { x: -3.2, y: -9, width: 6.4, height: 18, rx: 1.6, fill: "#1C2A22", stroke: "#fff", strokeWidth: 0.5 }), _jsx("circle", { cy: -5, r: 1.9, fill: "#E3463B" }), _jsx("circle", { cy: 0, r: 1.9, fill: "#F6D83A" }), _jsx("circle", { cy: 5, r: 1.9, fill: "#3CCB6B" })] }, k));
        case 'flag': return _jsxs("g", { children: [_jsx("line", { x1: it[1], y1: it[2] + 3, x2: it[1], y2: it[2] - 6, stroke: "#fff", strokeWidth: 0.8 }), _jsx("path", { d: `M${it[1]} ${it[2] - 6}l5 1.6l-5 1.6z`, fill: "#F6D83A" })] }, k);
        case 'hoop': return _jsx("circle", { cx: it[1], cy: it[2], r: 3.2, fill: "none", stroke: "#1C2A22", strokeWidth: 0.8 }, k);
        case 'pitch': {
            const s = { stroke: '#fff', strokeOpacity: 0.8, strokeWidth: 0.8, fill: 'none' };
            if (it[1] === 'full')
                return (_jsxs("g", { ...s, children: [_jsx("rect", { x: 4, y: 4, width: 192, height: 102 }), _jsx("line", { x1: 100, y1: 4, x2: 100, y2: 106 }), _jsx("circle", { cx: 100, cy: 55, r: 13 }), _jsx("rect", { x: 4, y: 30, width: 24, height: 50 }), _jsx("rect", { x: 172, y: 30, width: 24, height: 50 }), _jsx("rect", { x: 4, y: 43, width: 8, height: 24 }), _jsx("rect", { x: 188, y: 43, width: 8, height: 24 })] }, k));
            const r = it[1] === 'right';
            return (_jsxs("g", { ...s, children: [_jsx("rect", { x: 4, y: 4, width: 192, height: 102 }), r ? _jsxs(_Fragment, { children: [_jsx("path", { d: "M4 42 A13 13 0 0 1 4 68" }), _jsx("rect", { x: 150, y: 22, width: 46, height: 66 }), _jsx("rect", { x: 180, y: 39, width: 16, height: 32 }), _jsx("path", { d: "M150 44 A15 15 0 0 0 150 66" })] })
                        : _jsxs(_Fragment, { children: [_jsx("path", { d: "M196 42 A13 13 0 0 0 196 68" }), _jsx("rect", { x: 4, y: 22, width: 46, height: 66 }), _jsx("rect", { x: 4, y: 39, width: 16, height: 32 }), _jsx("path", { d: "M50 44 A15 15 0 0 1 50 66" })] })] }, k));
        }
    }
}
const toD = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
/** A wavy line along a path (the book's "dribbling" arrow). */
function wavy(pts) {
    const d = smooth(pts, 14);
    const out = [];
    let s = 0;
    const total = d.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - d[i][0], p[1] - d[i][1]), 0);
    for (let i = 0; i < d.length; i++) {
        if (i)
            s += Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]);
        const a = d[Math.max(0, i - 1)], b = d[Math.min(d.length - 1, i + 1)];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
        const tail = total - s < 4 ? (total - s) / 4 : 1; // straight end so the arrowhead points right
        const w = Math.sin(s * 0.95) * 1.35 * tail;
        out.push([d[i][0] + nx * w, d[i][1] + ny * w]);
    }
    return out;
}
/** Shorten a polyline at the end so the arrowhead does not cover the player. */
function trim(pts, by) {
    const out = [...pts];
    let left = by;
    while (out.length > 2) {
        const a = out[out.length - 2], b = out[out.length - 1];
        const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (d > left) {
            out[out.length - 1] = [b[0] - ((b[0] - a[0]) * left) / d, b[1] - ((b[1] - a[1]) * left) / d];
            return out;
        }
        out.pop();
        left -= d;
    }
    const [a, b] = out;
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d > left + 1)
        out[1] = [b[0] - ((b[0] - a[0]) * left) / d, b[1] - ((b[1] - a[1]) * left) / d];
    return out;
}
function playerDot(t, at, l, k) {
    const c = TEAM[t];
    return (_jsxs("g", { transform: `translate(${at[0].toFixed(2)} ${at[1].toFixed(2)})`, children: [_jsx("circle", { r: 4.4, fill: c.fill, stroke: c.stroke, strokeWidth: 1.1 }), l && _jsx("text", { y: 1.9, fontSize: 5, fontWeight: 800, fill: c.text, textAnchor: "middle", children: l })] }, k));
}
const ballDot = (at, k) => _jsx("circle", { cx: at[0], cy: at[1], r: 2.1, fill: "#fff", stroke: "#16231C", strokeWidth: 0.8 }, k);
/** Pitch frame with grass and the defs shared by both views. */
function Frame({ id, children, maxHeight }) {
    return (_jsxs("svg", { className: "pitch", viewBox: "0 0 200 110", style: { maxHeight }, role: "img", "aria-hidden": "true", children: [_jsxs("defs", { children: [_jsx("marker", { id: id + 'w', viewBox: "0 0 10 10", refX: "7", refY: "5", markerWidth: "4.2", markerHeight: "4.2", orient: "auto", children: _jsx("path", { d: "M0 0L10 5L0 10Z", fill: "#fff" }) }), _jsx("marker", { id: id + 'r', viewBox: "0 0 10 10", refX: "7", refY: "5", markerWidth: "4.2", markerHeight: "4.2", orient: "auto", children: _jsx("path", { d: "M0 0L10 5L0 10Z", fill: LINE.run }) }), _jsx("marker", { id: id + 'k', viewBox: "0 0 10 10", refX: "7", refY: "5", markerWidth: "4.2", markerHeight: "4.2", orient: "auto", children: _jsx("path", { d: "M0 0L10 5L0 10Z", fill: LINE.drib }) }), _jsxs("pattern", { id: id + "net", width: "1.6", height: "1.6", patternUnits: "userSpaceOnUse", children: [_jsx("rect", { width: "1.6", height: "1.6", fill: "rgba(255,255,255,.25)" }), _jsx("path", { d: "M0 0L1.6 1.6M1.6 0L0 1.6", stroke: "rgba(255,255,255,.55)", strokeWidth: 0.25 })] })] }), _jsx("rect", { width: "200", height: "110", fill: "#2E8B57" }), Array.from({ length: 10 }, (_, i) => _jsx("rect", { x: i * 20, width: 10, height: 110, fill: "#2A8050" }, i)), children] }));
}
/** The drill as in the book: start positions and every movement as arrows. */
export function BookStatic({ scene, maxHeight }) {
    const id = 'bk' + useId().replace(/:/g, '');
    const ms = marks(scene);
    const st = styleOf(scene);
    const trs = tracks(scene);
    // balls at the start; a ball that only comes later shows where it enters
    const start = trs.map((t) => ballAt(scene, t, 0) ?? (() => { const k = t.findIndex((b) => b !== 0); return k >= 0 ? ballAt(scene, t, k) : null; })()).filter(Boolean);
    return (_jsxs(Frame, { id: id, maxHeight: maxHeight, children: [scene.field.map((it, i) => item(it, i, id + 'net')), ms.map((m, i) => {
                if (m.kind === 'lob') {
                    const [a, b] = m.pts, c = arcCtl(a, b);
                    const e = trim([c, b], 2.5)[1];
                    return _jsx("path", { d: `M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`, fill: "none", stroke: st.lob.stroke, strokeWidth: st.lob.width, markerEnd: `url(#${id}${st.lob.marker})`, strokeLinecap: "round" }, 'm' + i);
                }
                const pts = m.kind === 'drib' ? wavy(trim(m.pts, 3.5)) : m.kind === 'run' ? smooth(trim(m.pts, 4.5)) : trim(m.pts, m.kind === 'shot' ? 1 : 2.5);
                const y = st[m.kind];
                return _jsx("path", { d: toD(pts), fill: "none", stroke: y.stroke, strokeWidth: y.width, strokeDasharray: y.dash, markerEnd: `url(#${id}${y.marker})`, strokeLinecap: "round", strokeLinejoin: "round" }, 'm' + i);
            }), scene.players.map((p) => playerDot(p.t, posAt(scene, p, 0), p.l, 'p' + p.id)), start.map((b, i) => ballDot(b, 'b' + i))] }));
}
/** One moment of the drill while it plays. */
export function BookFrame({ scene, t, maxHeight }) {
    const id = 'bf' + useId().replace(/:/g, '');
    const f = frameAt(scene, t);
    return (_jsxs(Frame, { id: id, maxHeight: maxHeight, children: [scene.field.map((it, i) => item(it, i, id + 'net')), f.trails.map(([a, b, shot], i) => { const y = styleOf(scene)[shot ? 'shot' : 'pass']; return _jsx("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: y.stroke, strokeOpacity: 0.75, strokeWidth: y.width, strokeDasharray: y.dash, strokeLinecap: "round" }, 't' + i); }), f.players.map(({ p, at }) => playerDot(p.t, at, p.l, 'p' + p.id)), f.balls.map((b, i) => ballDot(b, 'b' + i))] }));
}
/** The line key under a book diagram (only the line types this drill uses). */
export function LineKey({ scene, label }) {
    const st = styleOf(scene);
    const used = new Set(marks(scene).map((m) => m.kind));
    const kinds = ['run', 'drib', 'pass', 'shot', 'lob'].filter((k) => used.has(k));
    if (!kinds.length)
        return null;
    return (_jsx("ul", { className: "linekey", children: kinds.map((k) => {
            const y = st[k];
            const d = k === 'drib' ? 'M2 6 q2.5 -4 5 0 t5 0 t5 0 t5 0' : k === 'lob' ? 'M2 9 Q12 -1 22 9' : 'M2 6 H22';
            return (_jsxs("li", { children: [_jsxs("svg", { viewBox: "0 0 28 12", width: "28", height: "12", "aria-hidden": "true", children: [_jsx("rect", { width: "28", height: "12", rx: "3", fill: "#2E8B57" }), _jsx("path", { d: d, fill: "none", stroke: y.stroke, strokeWidth: y.width * 1.3, strokeDasharray: y.dash ? y.dash.split(' ').map((n) => +n * 1.3).join(' ') : undefined, strokeLinecap: "round" })] }), label(k)] }, k));
        }) }));
}
