/**
 * Book-accurate drill scenes.
 *
 * A scene is a few key moments ("steps"). Each player has a position per
 * step (optionally with waypoints for a curved run). Each ball has an owner
 * (player id), a point, or 0 (not on the pitch) per step.
 *
 * The static diagram is derived from the same data, so the picture and the
 * animation always agree:
 *   run without the ball  → solid arrow
 *   run with the ball     → wavy arrow
 *   pass or shot          → dashed arrow
 * (the line key used in the EPYSA and FIFA books).
 */
export type Pt = [number, number]
/** A position, or waypoints ending at the position (curved run). */
export type Step = Pt | Pt[]
export type Team = 'r' | 'w' | 'b' | 'y' | 'k' | 'c' | 'g' | 'o'
/**
 * owner id, a point, a shot ([x, y, 1]: the book's dotted shot line),
 * a lofted ball ([x, y, 2]: curved line) or 0 (no ball)
 */
export type BallStep = string | Pt | Shot | 0
export type Shot = [number, number, 1 | 2]

export interface Player {
  id: string
  t: Team
  p: Step[]
  /** label inside the circle (A, B, 1…) */
  l?: string
  /** this player keeps their own ball the whole time */
  ball?: boolean
  /** draw no arrows for this player in the static diagram (e.g. followers) */
  quiet?: boolean
}

export type Item =
  | ['area', number, number, number, number, CornerCones?]
  | ['cone', number, number, ConeColor?]
  | ['cones', ConeColor, number[]]
  | ['goal', number, number, Dir, number?]
  | ['mini', number, number, Dir, number?]
  | ['line', number, number, number, number, boolean?]
  | ['zone', number, number, number, number, string?]
  | ['text', number, number, string]
  | ['circle', number, number, number]
  | ['pole', number, number]
  | ['hurdle', number, number, boolean?]
  | ['ladder', number, number, number, number]
  | ['pitch', 'full' | 'right' | 'left']
  /** a ball lying on the pitch (ball pile, spare balls) */
  | ['ball', number, number]
  /** traffic light held by the coach (red/yellow/green light games) */
  | ['traffic', number, number]
  /** corner-style flag on a pole */
  | ['flag', number, number]
  /** coordination hoop */
  | ['hoop', number, number, ConeColor?]
  /** flat disc marker */
  | ['disc', number, number, ConeColor?]
  /** training mannequin */
  | ['dummy', number, number]
  /** training bib lying on the pitch */
  | ['bib', number, number, ConeColor?]
  /** small arch (mini hurdle) */
  | ['arc', number, number]
  /**
   * a line drawn by the coach on the tactics board (not animated). style = type + end + colour + width:
   * type s solid, d dashed, w wavy, c curved, e curved dashed; end a arrow, x cross, b stop bar, n none;
   * colour k black, w white, r red, b blue, y yellow; width 1–4 (e.g. 'dak2')
   */
  | ['mark', number, number, number, number, string]
export type Dir = 'l' | 'r' | 'u' | 'd'
export type ConeColor = 'o' | 'y' | 'r' | 'b' | 'w'
/** cones on the corners (c) or corners + middles (m) of an area */
export type CornerCones = '' | 'c' | 'm' | `c${ConeColor}` | `m${ConeColor}`

export interface BookScene {
  steps: number
  field: Item[]
  players: Player[]
  balls?: BallStep[][]
  /** seconds per step (default 1.15) */
  speed?: number
  /**
   * Line key of the source book. epysa (default): run = red solid, pass = white dashed.
   * fifa: run = dashed, pass = solid (as in the FIFA manuals).
   */
  key?: 'epysa' | 'fifa'
  /**
   * Steps drawn in the book. When a scene is extended (see extend), the steps after
   * these continue the drill in the animation only; the drawing stays as in the book.
   */
  book?: number
}

/**
 * Continuation of a drill after the moment drawn in the book (next passes, rotation,
 * the next pair starting), so the animation shows more of the drill in action.
 * n: extra steps; p: extra positions per player id (others stay where they are);
 * b: extra entries per ball track (a track past the existing ones is a new ball).
 */
export interface More { n: number; p: Record<string, Step[]>; b?: BallStep[][] }

export function extend(sc: BookScene, m: More): BookScene {
  const n0 = sc.steps, n = n0 + m.n
  const players = sc.players.map((p) => (m.p[p.id] ? { ...p, p: [...pad(p.p, n0), ...m.p[p.id]] } : p))
  const old = sc.balls ?? []
  const balls = [...old, ...(m.b ?? []).slice(old.length).map(() => [] as BallStep[])].map((t, i) => {
    const base = i < old.length ? pad(t, n0) : (Array(n0).fill(0) as BallStep[])
    return m.b?.[i]?.length ? [...base, ...m.b[i]] : base
  })
  return { ...sc, steps: n, book: sc.book ?? n0, players, balls }
}
export const bookSteps = (sc: BookScene) => sc.book ?? sc.steps

// ---------- helpers ----------

const pad = <T,>(a: T[], n: number): T[] => [...a, ...Array(Math.max(0, n - a.length)).fill(a[a.length - 1])]
export const end = (s: Step): Pt => (Array.isArray(s[0]) ? (s as Pt[])[(s as Pt[]).length - 1] : (s as Pt))
const via = (s: Step): Pt[] => (Array.isArray(s[0]) ? (s as Pt[]).slice(0, -1) : [])
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1])

export function steps(sc: BookScene, p: Player): Step[] { return pad(p.p, sc.steps) }
export function posAt(sc: BookScene, p: Player, k: number): Pt { return end(steps(sc, p)[Math.min(k, sc.steps - 1)]) }

/** All ball tracks, including the "own ball" shorthand. */
export function tracks(sc: BookScene): BallStep[][] {
  const own = sc.players.filter((p) => p.ball).map((p) => [p.id])
  return [...(sc.balls ?? []), ...own].map((t) => pad(t, sc.steps))
}

/** Route of player p from step k to k+1 (start, waypoints, end). */
export function route(sc: BookScene, p: Player, k: number): Pt[] {
  const st = steps(sc, p)
  const a = end(st[k]), s = st[Math.min(k + 1, sc.steps - 1)]
  return [a, ...via(s), end(s)]
}

/** Smooth a polyline (Catmull–Rom) into many points. */
export function smooth(pts: Pt[], per = 10): Pt[] {
  if (pts.length < 3) {
    const [a, b] = [pts[0], pts[pts.length - 1]]
    const n = Math.max(2, Math.ceil(dist(a, b) / 2))
    return Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as Pt)
  }
  const out: Pt[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    const n = Math.max(per, Math.ceil(dist(p1, p2) / 2))
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/** Point at fraction f (0…1) of the length of a dense polyline. */
export function along(pts: Pt[], f: number): Pt {
  if (pts.length === 1 || f <= 0) return pts[0]
  const seg = pts.slice(1).map((p, i) => dist(pts[i], p))
  const total = seg.reduce((a, b) => a + b, 0)
  if (total === 0 || f >= 1) return pts[pts.length - 1]
  let d = f * total
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i]) { const g = seg[i] ? d / seg[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * g, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * g] }
    d -= seg[i]
  }
  return pts[pts.length - 1]
}

export const isShot = (b: BallStep) => Array.isArray(b) && b.length === 3 && b[2] === 1
export const isLob = (b: BallStep) => Array.isArray(b) && b.length === 3 && b[2] === 2
/** Control point of a lofted ball's arc (bulges to the left of the flight). */
export const arcCtl = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1]; return [(a[0] + b[0]) / 2 + dy * 0.3, (a[1] + b[1]) / 2 - dx * 0.3] }
const owner = (sc: BookScene, id: string) => sc.players.find((p) => p.id === id)

/** Direction the player faces during step k (for placing the ball at the feet). */
function facing(sc: BookScene, p: Player, k: number): Pt {
  for (const kk of [k, k - 1, k + 1, k - 2]) {
    if (kk < 0 || kk >= sc.steps - 1) continue
    const r = route(sc, p, kk)
    const a = r[0], b = r[1] ?? r[0]
    const d = dist(a, b)
    if (d > 1) return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]
  }
  return [0.6, 0.8]
}
const feet = (at: Pt, dir: Pt): Pt => [at[0] + dir[0] * 4.6, at[1] + dir[1] * 4.6]

/** Ball position at the start of step k on track tr. */
export function ballAt(sc: BookScene, tr: BallStep[], k: number): Pt | null {
  const b = tr[Math.min(k, sc.steps - 1)]
  if (b === 0) return null
  if (typeof b !== 'string') return [b[0], b[1]]
  const p = owner(sc, b)
  return p ? feet(posAt(sc, p, k), facing(sc, p, k)) : null
}

// ---------- the static diagram ----------

export interface Mark { kind: 'run' | 'drib' | 'pass' | 'shot' | 'lob'; pts: Pt[] }

/** Arrows for the static diagram: every move of every step (or only steps from…to-1). */
export function marks(sc: BookScene, from = 0, to = sc.steps - 1): Mark[] {
  const out: Mark[] = []
  const trs = tracks(sc)
  for (const p of sc.players) {
    if (p.quiet) continue
    let cur: Mark | null = null
    for (let k = from; k < to; k++) {
      const r = route(sc, p, k)
      const moved = dist(r[0], r[r.length - 1]) > 1.5 || r.length > 2
      if (!moved) { cur = null; continue }
      const drib = trs.some((t) => t[k] === p.id && t[k + 1] === p.id)
      const kind = drib ? 'drib' : 'run'
      if (cur && cur.kind === kind) cur.pts.push(...r.slice(1))
      else { cur = { kind, pts: [...r] }; out.push(cur) }
    }
  }
  for (const t of trs) {
    for (let k = from; k < to; k++) {
      if (t[k] === t[k + 1] && typeof t[k] === 'string') continue
      const a = ballAt(sc, t, k), b = ballAt(sc, t, k + 1)
      if (a && b && dist(a, b) > 4) out.push({ kind: isShot(t[k + 1]) ? 'shot' : isLob(t[k + 1]) ? 'lob' : 'pass', pts: [a, b] })
    }
  }
  return out
}

// ---------- the animation ----------

const ease = (f: number) => (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2)
const clamp = (f: number) => Math.max(0, Math.min(1, f))

export interface Frame { players: { p: Player; at: Pt }[]; balls: Pt[]; trails: [Pt, Pt, boolean][] }

/** Positions of players and balls at time t (0 … steps-1). */
export function frameAt(sc: BookScene, t: number): Frame {
  const k = Math.max(0, Math.min(Math.floor(t), sc.steps - 1))
  const raw = k >= sc.steps - 1 ? 0 : clamp(t - k)
  const f = ease(raw)
  const trs0 = tracks(sc)
  const players = sc.players.map((p) => ({ p, at: k >= sc.steps - 1 ? posAt(sc, p, k) : along(smooth(route(sc, p, k)), f) }))
  // players who stand still in this step stay alive: defenders edge toward the ball,
  // team-mates step sideways to open an angle (back on their mark by the end of the step)
  if (k < sc.steps - 1 && raw > 0 && raw < 1) {
    const ballNow = trs0.map((tr) => ballAt(sc, tr, k)).filter(Boolean) as Pt[]
    const holder = trs0.map((tr) => (typeof tr[k] === 'string' ? tr[k] : typeof tr[k + 1] === 'string' ? tr[k + 1] : '')).find(Boolean) as string | undefined
    const team = holder ? owner(sc, holder)?.t : undefined
    const bump = Math.sin(Math.PI * raw)
    for (const x of players) {
      const p = x.p
      if (p.t === 'c' || p.quiet || p.ball || !ballNow.length) continue
      const r = route(sc, p, k)
      if (dist(r[0], r[r.length - 1]) > 1.5 || r.length > 2) continue
      if (trs0.some((tr) => tr[k] === p.id || tr[k + 1] === p.id)) continue
      const b = ballNow.reduce((m, q) => (dist(q, x.at) < dist(m, x.at) ? q : m))
      const d = dist(b, x.at)
      if (d < 4 || d > 55) continue
      const u: Pt = [(b[0] - x.at[0]) / d, (b[1] - x.at[1]) / d]
      const side = (p.id.charCodeAt(p.id.length - 1) % 2 ? 1 : -1)
      const v: Pt = team && p.t === team ? [-u[1] * side * 1.8, u[0] * side * 1.8] : [u[0] * 2.4, u[1] * 2.4]
      x.at = [x.at[0] + v[0] * bump, x.at[1] + v[1] * bump]
    }
  }
  const atOf = (id: string) => players.find((x) => x.p.id === id)?.at
  const balls: Pt[] = [], trails: [Pt, Pt, boolean][] = []
  for (const tr of tracks(sc)) {
    const b0 = tr[k], b1 = tr[Math.min(k + 1, sc.steps - 1)]
    if (typeof b0 === 'string' && b0 === b1) {
      const pl = owner(sc, b0), at = atOf(b0)
      if (pl && at) balls.push(feet(at, facing(sc, pl, k)))
      continue
    }
    const a = ballAt(sc, tr, k), b = ballAt(sc, tr, k + 1)
    if (!a && !b) continue
    if (!a) { if (raw > 0.5) balls.push(b!); continue }
    if (!b) { if (raw < 0.5) balls.push(a); continue }
    // the ball is played: it leaves a moment later and arrives before the step ends
    const g = clamp((raw - 0.1) / 0.75)
    let cur: Pt = [a[0] + (b[0] - a[0]) * g, a[1] + (b[1] - a[1]) * g]
    if (isLob(b1)) { const c = arcCtl(a, b), u = 1 - g; cur = [u * u * a[0] + 2 * u * g * c[0] + g * g * b[0], u * u * a[1] + 2 * u * g * c[1] + g * g * b[1]] }
    balls.push(cur)
    if (g > 0 && g < 1 && dist(a, b) > 12 && !isLob(b1)) trails.push([a, cur, isShot(b1)])
  }
  return { players, balls, trails }
}
