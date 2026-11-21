// ---------- helpers ----------
const pad = (a, n) => [...a, ...Array(Math.max(0, n - a.length)).fill(a[a.length - 1])];
export const end = (s) => (Array.isArray(s[0]) ? s[s.length - 1] : s);
const via = (s) => (Array.isArray(s[0]) ? s.slice(0, -1) : []);
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
export function steps(sc, p) { return pad(p.p, sc.steps); }
export function posAt(sc, p, k) { return end(steps(sc, p)[Math.min(k, sc.steps - 1)]); }
/** All ball tracks, including the "own ball" shorthand. */
export function tracks(sc) {
    const own = sc.players.filter((p) => p.ball).map((p) => [p.id]);
    return [...(sc.balls ?? []), ...own].map((t) => pad(t, sc.steps));
}
/** Route of player p from step k to k+1 (start, waypoints, end). */
export function route(sc, p, k) {
    const st = steps(sc, p);
    const a = end(st[k]), s = st[Math.min(k + 1, sc.steps - 1)];
    return [a, ...via(s), end(s)];
}
/** Smooth a polyline (Catmull–Rom) into many points. */
export function smooth(pts, per = 10) {
    if (pts.length < 3) {
        const [a, b] = [pts[0], pts[pts.length - 1]];
        const n = Math.max(2, Math.ceil(dist(a, b) / 2));
        return Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]);
    }
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        const n = Math.max(per, Math.ceil(dist(p1, p2) / 2));
        for (let j = 0; j < n; j++) {
            const t = j / n, t2 = t * t, t3 = t2 * t;
            const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
            out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
        }
    }
    out.push(pts[pts.length - 1]);
    return out;
}
/** Point at fraction f (0…1) of the length of a dense polyline. */
export function along(pts, f) {
    if (pts.length === 1 || f <= 0)
        return pts[0];
    const seg = pts.slice(1).map((p, i) => dist(pts[i], p));
    const total = seg.reduce((a, b) => a + b, 0);
    if (total === 0 || f >= 1)
        return pts[pts.length - 1];
    let d = f * total;
    for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i]) {
            const g = seg[i] ? d / seg[i] : 0;
            return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * g, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * g];
        }
        d -= seg[i];
    }
    return pts[pts.length - 1];
}
export const isShot = (b) => Array.isArray(b) && b.length === 3 && b[2] === 1;
export const isLob = (b) => Array.isArray(b) && b.length === 3 && b[2] === 2;
/** Control point of a lofted ball's arc (bulges to the left of the flight). */
export const arcCtl = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1]; return [(a[0] + b[0]) / 2 + dy * 0.3, (a[1] + b[1]) / 2 - dx * 0.3]; };
const owner = (sc, id) => sc.players.find((p) => p.id === id);
/** Direction the player faces during step k (for placing the ball at the feet). */
function facing(sc, p, k) {
    for (const kk of [k, k - 1, k + 1, k - 2]) {
        if (kk < 0 || kk >= sc.steps - 1)
            continue;
        const r = route(sc, p, kk);
        const a = r[0], b = r[1] ?? r[0];
        const d = dist(a, b);
        if (d > 1)
            return [(b[0] - a[0]) / d, (b[1] - a[1]) / d];
    }
    return [0.6, 0.8];
}
const feet = (at, dir) => [at[0] + dir[0] * 4.6, at[1] + dir[1] * 4.6];
/** Ball position at the start of step k on track tr. */
export function ballAt(sc, tr, k) {
    const b = tr[Math.min(k, sc.steps - 1)];
    if (b === 0)
        return null;
    if (typeof b !== 'string')
        return [b[0], b[1]];
    const p = owner(sc, b);
    return p ? feet(posAt(sc, p, k), facing(sc, p, k)) : null;
}
/** Arrows for the static diagram: every move of every step. */
export function marks(sc) {
    const out = [];
    const trs = tracks(sc);
    for (const p of sc.players) {
        if (p.quiet)
            continue;
        let cur = null;
        for (let k = 0; k < sc.steps - 1; k++) {
            const r = route(sc, p, k);
            const moved = dist(r[0], r[r.length - 1]) > 1.5 || r.length > 2;
            if (!moved) {
                cur = null;
                continue;
            }
            const drib = trs.some((t) => t[k] === p.id && t[k + 1] === p.id);
            const kind = drib ? 'drib' : 'run';
            if (cur && cur.kind === kind)
                cur.pts.push(...r.slice(1));
            else {
                cur = { kind, pts: [...r] };
                out.push(cur);
            }
        }
    }
    for (const t of trs) {
        for (let k = 0; k < sc.steps - 1; k++) {
            if (t[k] === t[k + 1] && typeof t[k] === 'string')
                continue;
            const a = ballAt(sc, t, k), b = ballAt(sc, t, k + 1);
            if (a && b && dist(a, b) > 4)
                out.push({ kind: isShot(t[k + 1]) ? 'shot' : isLob(t[k + 1]) ? 'lob' : 'pass', pts: [a, b] });
        }
    }
    return out;
}
// ---------- the animation ----------
const ease = (f) => (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2);
const clamp = (f) => Math.max(0, Math.min(1, f));
/** Positions of players and balls at time t (0 … steps-1). */
export function frameAt(sc, t) {
    const k = Math.max(0, Math.min(Math.floor(t), sc.steps - 1));
    const raw = k >= sc.steps - 1 ? 0 : clamp(t - k);
    const f = ease(raw);
    const players = sc.players.map((p) => ({ p, at: k >= sc.steps - 1 ? posAt(sc, p, k) : along(smooth(route(sc, p, k)), f) }));
    const atOf = (id) => players.find((x) => x.p.id === id)?.at;
    const balls = [], trails = [];
    for (const tr of tracks(sc)) {
        const b0 = tr[k], b1 = tr[Math.min(k + 1, sc.steps - 1)];
        if (typeof b0 === 'string' && b0 === b1) {
            const pl = owner(sc, b0), at = atOf(b0);
            if (pl && at)
                balls.push(feet(at, facing(sc, pl, k)));
            continue;
        }
        const a = ballAt(sc, tr, k), b = ballAt(sc, tr, k + 1);
        if (!a && !b)
            continue;
        if (!a) {
            if (raw > 0.5)
                balls.push(b);
            continue;
        }
        if (!b) {
            if (raw < 0.5)
                balls.push(a);
            continue;
        }
        // the ball is played: it leaves a moment later and arrives before the step ends
        const g = clamp((raw - 0.1) / 0.75);
        let cur = [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g];
        if (isLob(b1)) {
            const c = arcCtl(a, b), u = 1 - g;
            cur = [u * u * a[0] + 2 * u * g * c[0] + g * g * b[0], u * u * a[1] + 2 * u * g * c[1] + g * g * b[1]];
        }
        balls.push(cur);
        if (g > 0 && g < 1 && dist(a, b) > 12 && !isLob(b1))
            trails.push([a, cur, isShot(b1)]);
    }
    return { players, balls, trails };
}
