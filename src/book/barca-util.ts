import type { BallStep, CornerCones, Dir, Item, More, Player, Pt, Step, Team } from './scene'

/**
 * Drawing helper for "Barça Academy Coaching U7-12" (SoccerTutor). The book draws every practice in
 * perspective: a trapezoid area seen from behind one end line. Player feet, cones and goals are read off
 * the page picture (1080 px wide) and mapped back onto a flat area with a homography fitted to the four
 * corner cones, so the scene keeps the book's layout. rot: the book's far end (top of the picture) becomes
 * our right, as in the other book helpers, so the attack goes to the right.
 */
export type Px = [number, number]
type PxStep = Px | Px[]
type PxBall = string | Px | 0 | ['s' | 'l', Px]

const ROT: Record<Dir, Dir> = { u: 'r', r: 'd', d: 'l', l: 'u' }
const r1 = (n: number) => Math.round(n * 2) / 2

/** 3×3 homography taking the unit square corners (0,0) (1,0) (0,1) (1,1) to the picture points tl tr bl br, inverted. */
function inverseHomography(tl: Px, tr: Px, bl: Px, br: Px) {
  // square → quad (Heckbert): (0,0)→tl, (1,0)→tr, (1,1)→br, (0,1)→bl
  const [x0, y0] = tl, [x1, y1] = tr, [x2, y2] = br, [x3, y3] = bl
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dx2 * dy1
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, c = x0
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3, f = y0
  // inverse of [[a b c][d e f][g h 1]] (adjugate)
  const A = e - f * h, B = c * h - b, C = b * f - c * e
  const D = f * g - d, E = a - c * g, F = c * d - a * f
  const G = d * h - e * g, H = b * g - a * h, I = a * e - b * d
  return (q: Px): [number, number] => {
    const w = G * q[0] + H * q[1] + I
    return [(A * q[0] + B * q[1] + C) / w, (D * q[0] + E * q[1] + F) / w]
  }
}

/**
 * corners: picture points of the area's four corners [top-left, top-right, bottom-left, bottom-right];
 * o: where that area goes on our 200×110 pitch [x0, y0, x1, y1].
 */
export function persp(corners: [Px, Px, Px, Px], o: [number, number, number, number], rot = true) {
  const inv = inverseHomography(...corners)
  const [ox0, oy0, ox1, oy1] = o
  const pt = (q: Px): Pt => {
    const [u, v] = inv(q)
    return rot ? [r1(ox1 - v * (ox1 - ox0)), r1(oy0 + u * (oy1 - oy0))] : [r1(ox0 + u * (ox1 - ox0)), r1(oy0 + v * (oy1 - oy0))]
  }
  const step = (s: PxStep): Step => (Array.isArray(s[0]) ? (s as Px[]).map(pt) : pt(s as Px))
  const dir = (d: Dir): Dir => (rot ? ROT[d] : d)
  const ball = (x: PxBall): BallStep => {
    if (x === 0 || typeof x === 'string') return x
    if (typeof x[0] === 'string') { const q = pt((x as ['s' | 'l', Px])[1]); return [q[0], q[1], x[0] === 's' ? 1 : 2] }
    return pt(x as Px)
  }
  const box = (q0: Px, q1: Px, q2: Px, q3: Px) => {
    const ps = [q0, q1, q2, q3].map(pt)
    const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1])
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
  }
  return {
    pt,
    /** the whole area (the four corners), with cones on the corners or also the middles */
    area: (cones: CornerCones = 'c'): Item => ['area', ox0, oy0, ox1 - ox0, oy1 - oy0, cones],
    /** a smaller area inside, from four picture corners */
    sub: (q0: Px, q1: Px, q2: Px, q3: Px, cones: CornerCones = ''): Item => { const [a, b, c, d] = box(q0, q1, q2, q3); return ['area', a, b, c - a, d - b, cones] },
    ball: (q: Px): Item => { const a = pt(q); return ['ball', a[0], a[1]] },
    zone: (q0: Px, q1: Px, q2: Px, q3: Px, color?: string): Item => { const [a, b, c, d] = box(q0, q1, q2, q3); return ['zone', a, b, c - a, d - b, color] },
    pl: (id: string, t: Team, l: string | undefined, p: PxStep[], quiet?: boolean): Player => ({ id, t, l, p: p.map(step), ...(quiet ? { quiet } : {}) }),
    /** a player who keeps their own ball the whole time */
    own: (id: string, t: Team, l: string | undefined, p: PxStep[]): Player => ({ id, t, l, p: p.map(step), ball: true }),
    cone: (q: Px, c?: 'o' | 'y' | 'r' | 'b' | 'w'): Item => { const a = pt(q); return c ? ['cone', a[0], a[1], c] : ['cone', a[0], a[1]] },
    pole: (q: Px): Item => { const a = pt(q); return ['pole', a[0], a[1]] },
    /** small goal; d = the side its mouth faces in the picture */
    mini: (q: Px, d: Dir, w = 9): Item => { const a = pt(q); return ['mini', a[0], a[1], dir(d), w] },
    goal: (q: Px, d: Dir, w = 16): Item => { const a = pt(q); return ['goal', a[0], a[1], dir(d), w] },
    line: (q0: Px, q1: Px, dashed = true): Item => { const a = pt(q0), c = pt(q1); return ['line', a[0], a[1], c[0], c[1], dashed] },
    balls: (tr: PxBall[][]): BallStep[][] => tr.map((t) => t.map(ball)),
    /** continuation after the book moment (animation only) */
    more: (n: number, p: Record<string, PxStep[]>, b?: PxBall[][]): More =>
      ({ n, p: Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v.map(step)])), ...(b ? { b: b.map((t) => t.map(ball)) } : {}) }),
  }
}
