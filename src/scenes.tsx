import type { ReactNode } from 'react'
import type { Diagram } from './types'
import { BLUE, C, PURPLE, RED, goal } from './components/Pitch'

/**
 * Animated drill scenes. Each scene is a list of key moments ("steps").
 * Players walk between their positions; the ball is either at a point or
 * at the feet of a player (by id). The pitch draws everything in between.
 */
export type Pt = [number, number]
export interface Actor { id: string; color: string; path: Pt[] }
export interface Scene {
  steps: number
  actors: Actor[]
  ball?: (string | Pt)[]
  field: () => ReactNode[]
  /** seconds per step (default 1.1) */
  speed?: number
}

const line = (x1: number, y1: number, x2: number, y2: number, k: string, dash?: string) =>
  <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeOpacity={0.6} strokeDasharray={dash} />
const box = (x: number, y: number, w: number, h: number, k: string) =>
  <rect key={k} x={x} y={y} width={w} height={h} fill="none" stroke="#fff" strokeOpacity={0.7} />

/** Repeat the last value until the list has n items. */
const pad = <T,>(a: T[], n: number) => [...a, ...Array(Math.max(0, n - a.length)).fill(a[a.length - 1])] as T[]

// ---------- scenes ----------

const dribble: Scene = (() => {
  const cones = Array.from({ length: 6 }, (_, i): Pt => [40 + i * 28, 55 + (i % 2 ? -10 : 10)])
  const path: Pt[] = [[16, 55], ...cones.map(([x], i): Pt => [x, i % 2 ? 61 : 49]), [194, 55]]
  return {
    steps: path.length, speed: 0.75,
    field: () => cones.map(([x, y], i) => C(x, y, 'c' + i)),
    actors: [{ id: 'a', color: RED, path }],
    ball: ['a'],
  }
})()

const pass: Scene = {
  steps: 5,
  field: () => [],
  actors: [
    { id: 'A', color: RED, path: [[50, 35], [50, 35], [44, 38], [44, 38], [50, 35]] },
    { id: 'B', color: RED, path: [[150, 35], [150, 35], [150, 35], [156, 38], [156, 38]] },
    { id: 'C', color: BLUE, path: [[50, 75], [44, 72], [44, 72], [50, 75], [50, 75]] },
    { id: 'D', color: BLUE, path: [[150, 75], [150, 75], [150, 75], [150, 75], [150, 75]] },
  ],
  ball: ['A', 'B', 'D', 'C', 'A'],
}

const rondo: Scene = (() => {
  const reds: Pt[] = [[100, 18], [137, 55], [100, 92], [63, 55]]
  const order = [0, 1, 3, 2, 1, 0]
  const center: Pt = [100, 55]
  const chase = order.map((r): Pt => [center[0] + (reds[r][0] - center[0]) * 0.45, center[1] + (reds[r][1] - center[1]) * 0.45])
  return {
    steps: order.length,
    field: () => [box(60, 15, 80, 80, 'r'), ...([[60, 15], [140, 15], [60, 95], [140, 95]] as Pt[]).map(([x, y], i) => C(x, y, 'c' + i))],
    actors: [...reds.map((p, i) => ({ id: 'r' + i, color: RED, path: [p] })), { id: 'd', color: BLUE, path: [center, ...chase.slice(1)] }],
    ball: order.map((r) => 'r' + r),
  }
})()

const smallgame: Scene = {
  steps: 6,
  field: () => [goal(8, 42, 26, 'g1'), goal(186, 42, 26, 'g2'), line(100, 8, 100, 102, 'l')],
  actors: [
    { id: 'r0', color: RED, path: [[45, 30], [85, 28], [120, 26], [126, 28], [128, 30]] },
    { id: 'r1', color: RED, path: [[45, 80], [60, 82], [80, 80], [95, 78]] },
    { id: 'r2', color: RED, path: [[75, 55], [92, 56], [130, 64], [158, 62], [162, 58]] },
    { id: 'r3', color: RED, path: [[30, 55], [40, 55], [55, 55]] },
    { id: 'u0', color: BLUE, path: [[155, 30], [150, 30], [138, 30], [134, 32]] },
    { id: 'u1', color: BLUE, path: [[155, 80], [155, 76], [160, 72], [165, 66], [168, 62]] },
    { id: 'u2', color: BLUE, path: [[125, 55], [118, 48], [124, 50], [140, 56]] },
    { id: 'u3', color: BLUE, path: [[176, 55], [176, 55], [178, 52], [180, 56], [182, 48]] },
  ],
  ball: ['r2', 'r0', 'r0', 'r2', [191, 47], [191, 47]],
}

const sprint: Scene = {
  steps: 6, speed: 0.8,
  field: () => [C(30, 30, 'a'), C(170, 30, 'b'), C(30, 80, 'c'), C(170, 80, 'd')],
  actors: [
    { id: 'r', color: RED, path: [[22, 30], [100, 30], [165, 30], [165, 30], [95, 30], [22, 30]] },
    { id: 'u', color: BLUE, path: [[22, 80], [90, 80], [150, 80], [165, 80], [110, 80], [32, 80]] },
  ],
}

const warmup: Scene = (() => {
  const xs = [30, 60, 90]
  const steps = 6
  return {
    steps, speed: 0.9,
    field: () => Array.from({ length: 4 }, (_, i) => [C(40 + i * 40, 25, 'c' + i), C(40 + i * 40, 85, 'd' + i)]).flat(),
    actors: xs.map((x0, j) => ({
      id: 'p' + j, color: RED,
      path: Array.from({ length: steps }, (_, s): Pt => [x0 + s * 20, 55 + ((s + j) % 2 ? -12 : 12)]),
    })),
  }
})()

const shoot: Scene = {
  steps: 5,
  field: () => [goal(186, 35, 40, 'g'), box(140, 20, 52, 70, 'box')],
  actors: [
    { id: 'p1', color: RED, path: [[40, 55], [44, 55], [60, 52]] },
    { id: 'p2', color: BLUE, path: [[110, 40], [116, 44], [136, 48], [140, 50]] },
    { id: 'k', color: PURPLE, path: [[182, 55], [182, 55], [182, 52], [184, 43]] },
  ],
  ball: ['p1', 'p2', 'p2', [191, 40], [191, 40]],
}

const gk: Scene = {
  steps: 5,
  field: () => [goal(186, 30, 50, 'g')],
  actors: [
    { id: 'k', color: PURPLE, path: [[176, 55], [176, 40], [176, 55], [176, 70], [176, 55]] },
    { id: 'p', color: RED, path: [[110, 55], [112, 52], [110, 58], [112, 60], [110, 55]] },
  ],
  ball: ['p', [181, 39], 'p', [181, 71], 'p'],
}

const duel: Scene = {
  steps: 6,
  field: () => [goal(186, 35, 40, 'g'), line(120, 10, 120, 100, 'l', '5 4')],
  actors: [
    { id: 'k0', color: PURPLE, path: [[40, 55]] },
    { id: 'p', color: RED, path: [[85, 55], [85, 55], [104, 70], [136, 74], [150, 66]] },
    { id: 'd', color: BLUE, path: [[125, 55], [122, 56], [114, 64], [120, 70], [134, 66]] },
    { id: 'k', color: PURPLE, path: [[182, 55], [182, 55], [182, 58], [182, 60], [182, 60], [183, 50]] },
  ],
  ball: ['k0', 'p', 'p', 'p', 'p', [191, 47]],
}

const overload: Scene = {
  steps: 6,
  field: () => [goal(186, 35, 40, 'g')],
  actors: [
    { id: 'r0', color: RED, path: [[60, 30], [90, 25], [115, 22], [140, 26], [146, 30]] },
    { id: 'r1', color: RED, path: [[70, 55], [96, 55], [118, 56], [156, 56], [160, 54]] },
    { id: 'r2', color: RED, path: [[60, 80], [90, 85], [120, 84], [140, 80]] },
    { id: 'u0', color: BLUE, path: [[130, 42], [124, 48], [134, 36], [140, 40]] },
    { id: 'u1', color: BLUE, path: [[130, 68], [124, 62], [128, 60], [148, 60]] },
    { id: 'k', color: PURPLE, path: [[182, 55], [182, 55], [182, 50], [182, 54], [182, 54], [183, 62]] },
  ],
  ball: ['r1', 'r1', 'r0', 'r1', 'r1', [191, 64]],
}

export const SCENES: Record<Diagram, Scene> = { dribble, pass, rondo, smallgame, sprint, warmup, shoot, gk, duel, overload }

// ---------- motion maths ----------

const ease = (f: number) => (f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2)
const lerp = (a: Pt, b: Pt, f: number): Pt => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]

export function actorAt(a: Actor, steps: number, k: number): Pt {
  const p = pad(a.path, steps)
  return p[Math.min(k, steps - 1)]
}

function ballAt(s: Scene, k: number): Pt | null {
  if (!s.ball) return null
  const b = pad(s.ball, s.steps)[Math.min(k, s.steps - 1)]
  if (typeof b !== 'string') return b
  const owner = s.actors.find((a) => a.id === b)
  if (!owner) return null
  const [x, y] = actorAt(owner, s.steps, k)
  return [x + 5, y + 3]
}

/** Positions of all players and the ball at time t (in steps, 0 … steps-1). */
export function frame(s: Scene, t: number) {
  const k = Math.max(0, Math.min(Math.floor(t), s.steps - 1))
  const n = Math.min(k + 1, s.steps - 1)
  const f = ease(Math.max(0, Math.min(1, t - k)))
  const actors = s.actors.map((a) => ({ ...a, at: lerp(actorAt(a, s.steps, k), actorAt(a, s.steps, n), f) }))
  const b0 = ballAt(s, k), b1 = ballAt(s, n)
  const ball = b0 && b1 ? lerp(b0, b1, f) : null
  // a long ball move is a pass or a shot: show its line while it travels
  const trail = b0 && b1 && Math.hypot(b1[0] - b0[0], b1[1] - b0[1]) > 25 && f > 0 && f < 1 ? { from: b0, to: ball! } : null
  return { actors, ball, trail }
}
