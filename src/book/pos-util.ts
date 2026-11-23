import type { BallStep, Dir, Item, More, Player, Pt, Step, Team } from './scene'

/**
 * Drawing helper for the positional-play books (Phase of Play: "Positional Play", "Xabi Alonso:
 * Positionism and Relationism", "4-3-3 In Possession"). Positions are read off the book's diagram
 * (picture coordinates) and mapped onto our pitch, so the scene follows the drawing exactly.
 * The books draw the pitch upright (attack upwards); rot turns it so the attack goes to the right:
 * book top → our right, book left → our top.
 */
export type Px = [number, number]
type PxStep = Px | Px[]
type PxBall = string | Px | 0 | ['s' | 'l', Px]

const ROT: Record<Dir, Dir> = { u: 'r', r: 'd', d: 'l', l: 'u' }
const r1 = (n: number) => Math.round(n * 2) / 2

export function frame(b: [number, number, number, number], o: [number, number, number, number], rot = true) {
  const [bx0, by0, bx1, by1] = b
  const [ox0, oy0, ox1, oy1] = o
  const pt = (q: Px): Pt => rot
    ? [r1(ox1 - ((q[1] - by0) / (by1 - by0)) * (ox1 - ox0)), r1(oy0 + ((q[0] - bx0) / (bx1 - bx0)) * (oy1 - oy0))]
    : [r1(ox0 + ((q[0] - bx0) / (bx1 - bx0)) * (ox1 - ox0)), r1(oy0 + ((q[1] - by0) / (by1 - by0)) * (oy1 - oy0))]
  const step = (s: PxStep): Step => (Array.isArray(s[0]) ? (s as Px[]).map(pt) : pt(s as Px))
  const dir = (d: Dir): Dir => (rot ? ROT[d] : d)
  const ball = (x: PxBall): BallStep => {
    if (x === 0 || typeof x === 'string') return x
    if (typeof x[0] === 'string') { const q = pt((x as ['s' | 'l', Px])[1]); return [q[0], q[1], x[0] === 's' ? 1 : 2] }
    return pt(x as Px)
  }
  return {
    pt,
    /** a player: id, team, label (book number or role), positions per step */
    pl: (id: string, t: Team, l: string | undefined, p: PxStep[], quiet?: boolean): Player => ({ id, t, l, p: p.map(step), ...(quiet ? { quiet } : {}) }),
    area: (q0: Px, q1: Px): Item => { const a = pt(q0), c = pt(q1); return ['area', Math.min(a[0], c[0]), Math.min(a[1], c[1]), Math.abs(c[0] - a[0]), Math.abs(c[1] - a[1])] },
    /** small goal; d = the side its mouth faces in the book picture */
    mini: (q: Px, d: Dir): Item => { const a = pt(q); return ['mini', a[0], a[1], dir(d), 9] },
    goal: (q: Px, d: Dir, w = 14): Item => { const a = pt(q); return ['goal', a[0], a[1], dir(d), w] },
    line: (q0: Px, q1: Px, dashed = true): Item => { const a = pt(q0), c = pt(q1); return ['line', a[0], a[1], c[0], c[1], dashed] },
    balls: (tr: PxBall[][]): BallStep[][] => tr.map((t) => t.map(ball)),
    /** continuation after the book moment (animation only) */
    more: (n: number, p: Record<string, PxStep[]>, b?: PxBall[][]): More =>
      ({ n, p: Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v.map(step)])), ...(b ? { b: b.map((t) => t.map(ball)) } : {}) }),
  }
}
