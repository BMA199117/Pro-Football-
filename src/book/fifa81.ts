import type { BookScene, Item, Player, Pt, Team } from './scene'

/**
 * FIFA coaching manual, part 8.1 "Physical preparation / development and training".
 * The book describes these exercises in words and tables (no pitch drawings), so the diagrams
 * follow its text: distances, times, numbers of players. FIFA line key, as in part 8.2.
 */
const FULL: Item = ['pitch', 'full']
const HALF: Item = ['pitch', 'right']
const GOAL_R: Item = ['goal', 196, 55, 'l', 14]
const ZONES: Item[] = [['line', 196, 50, 191, 50], ['line', 196, 60, 191, 60]]
const P = (id: string, t: Team, p: (Pt | Pt[])[], l?: string): Player => ({ id, t, p, l })
const fifa = (s: Omit<BookScene, 'key'>): BookScene => ({ ...s, key: 'fifa' })

// Norwegian intervals: 4 × 4 min running at 90–95% of max HR, 3 min jogging between (two sessions a week)
const LAP: Pt[] = [[12, 10], [188, 10], [188, 100], [12, 100]]
const lapRun = (from: number, start: Pt): (Pt | Pt[])[] => {
  // quarter laps clockwise, starting at `start` on side `from`
  const out: (Pt | Pt[])[] = [start]
  let side = from
  for (let i = 0; i < 4; i++) {
    const c = LAP[(side + 1) % 4]
    const nx = LAP[(side + 2) % 4]
    const t = 0.35
    const next: Pt = [c[0] + (nx[0] - c[0]) * t, c[1] + (nx[1] - c[1]) * t]
    out.push([c, next])
    side = (side + 1) % 4
  }
  return out
}
const norway = fifa({
  steps: 5, speed: 1.6,
  field: [FULL, ...LAP.map(([x, y]): Item => ['cone', x, y, 'r']), ['text', 100, 50, '4 × 4′'], ['text', 100, 62, '90–95%']],
  players: [
    P('r1', 'b', lapRun(0, [60, 10])), P('r2', 'b', lapRun(0, [76, 10])),
    P('r3', 'y', lapRun(2, [140, 100])), P('r4', 'y', lapRun(2, [124, 100])),
    P('co', 'c', [[100, 80]], 'T'),
  ],
})

// Swedish studies: 3v3 with small goals and no goalkeepers on 33 × 20 m (work : rest 3:2, 70 s : 20 s, 4:1)
const threeV3 = fifa({
  steps: 5, speed: 1.15,
  field: [['area', 70, 36, 60, 38, 'c'], ['mini', 70, 55, 'r'], ['mini', 130, 55, 'l'], ['ball', 98, 80], ['ball', 104, 80]],
  players: [
    P('co', 'c', [[100, 82]], 'T'),
    P('b1', 'b', [[80, 50], [80, 50], [86, 54], [92, 56]]),
    P('b2', 'b', [[94, 66], [96, 64], [100, 62], [104, 64]]),
    P('b3', 'b', [[104, 44], [108, 44], [[112, 46], [120, 50]], [122, 52]]),
    P('y1', 'y', [[120, 56], [118, 52], [120, 52], [124, 54]]),
    P('y2', 'y', [[106, 58], [100, 60], [108, 52], [114, 52]]),
    P('y3', 'y', [[90, 44], [86, 48], [92, 50]]),
  ],
  balls: [['b1', 'b2', 'b3', 'b3', [130, 54, 1]]],
})

// Max HR field test (Dr. P. Balsom): after a 400 m jog, six pitch lengths faster and faster; 3rd–4th sprint, 5th–6th flat out
const lengths = (y: number): Pt[] => [[12, y], [188, y], [12, y], [188, y], [12, y], [188, y], [12, y]]
const hrTest = fifa({
  steps: 7, speed: 1.35,
  field: [FULL, ['cones', 'r', [12, 24, 12, 55, 12, 86, 188, 24, 188, 55, 188, 86]], ['text', 100, 14, '1 → 6']],
  players: [P('a', 'b', lengths(30)), P('b', 'b', lengths(55)), P('c', 'b', lengths(80)), P('co', 'c', [[100, 104]], 'T')],
})

// Cooper test: as far as possible in 12 minutes on a marked lap of 350–450 m; count laps + the last part
const COOP: Pt[] = [[14, 8], [100, 8], [186, 8], [186, 55], [186, 102], [100, 102], [14, 102], [14, 55]]
const coopRun = (k: number): (Pt | Pt[])[] => [0, 2, 4, 6, 8].map((d, i) => {
  const at = (j: number) => COOP[(k + j) % 8]
  return i === 0 ? at(0) : [at(d - 1), at(d)]
})
const cooper = fifa({
  steps: 5, speed: 1.5,
  field: [FULL, ...COOP.map(([x, y]): Item => ['cone', x, y, 'o']), ['text', 100, 55, '12′']],
  players: [P('r1', 'b', coopRun(0)), P('r2', 'b', coopRun(2)), P('r3', 'y', coopRun(4)), P('r4', 'y', coopRun(6)), P('r5', 'b', coopRun(1)), P('co', 'c', [[100, 70]], 'T')],
})

// Speed session (table 17): 1) accelerations 40–50 m; 2) sprints 20–30–40–30–20 m; 3) start on the coach's call, slalom with or without the ball; 4) 1v1 + shot (10–15 s)
const speedPyramid = fifa({
  steps: 5, speed: 1.3,
  field: [FULL, GOAL_R, ['cones', 'r', [24, 16, 110, 16, 24, 40, 61, 40, 79, 40, 97, 40]], ['text', 18, 18, '1'], ['text', 18, 42, '2'], ['text', 18, 66, '3'], ['text', 118, 92, '4'],
    ['pole', 44, 62], ['pole', 56, 68], ['pole', 68, 62], ['pole', 80, 68], ['pole', 92, 62], ['ball', 26, 70]],
  players: [
    P('a', 'b', [[24, 20], [[60, 20], [110, 20]]]),
    P('b', 'b', [[24, 44], [24, 44], [[60, 44], [97, 44]]]),
    P('c', 'b', [[24, 66], [24, 66], [24, 66], [[44, 70], [56, 64], [68, 70], [80, 64], [92, 68]], [104, 66]]),
    P('co', 'c', [[34, 80]], 'T'),
    P('d', 'b', [[130, 88], [130, 88], [130, 88], [130, 88], [[150, 82], [168, 70]]]),
    P('e', 'y', [[150, 78], [150, 78], [150, 78], [150, 78], [164, 66]]),
    P('g', 'r', [[190, 55], [190, 55], [190, 55], [190, 55], [190, 58]]),
  ],
  balls: [[0, 0, 0, 'c', 'c'], ['d', 'd', 'd', 'd', [196, 59, 1]]],
})

// Contrast strength (example from the book): 3 squats at 90% of max, then six hurdle jumps and a shot on goal
const HURDLES: Item[] = [122, 128, 134, 140, 146, 152].map((x): Item => ['hurdle', x, 44, true])
const contrast = fifa({
  steps: 4, speed: 1.25,
  field: [HALF, GOAL_R, ['zone', 104, 34, 14, 14], ['text', 111, 30, '3 × 90%'], ...HURDLES, ['ball', 162, 50]],
  players: [
    P('a', 'b', [[111, 41], [[122, 44], [137, 44], [154, 44]], [161, 49], [163, 50]]),
    P('g', 'r', [[190, 55], [190, 55], [190, 55], [190, 52]]),
    P('q', 'b', [[104, 54]]),
  ],
  balls: [[[162, 50], [162, 50], 'a', [196, 51, 1]]],
})

// Coordination (book examples): back to goal, receive and control on the turn, shoot into the zone named in advance
const turnShoot = fifa({
  steps: 4, speed: 1.2,
  field: [HALF, GOAL_R, ...ZONES, ['ball', 112, 62], ['ball', 112, 66]],
  players: [
    P('S', 'y', [[120, 55]], 'S'),
    P('A', 'b', [[150, 55], [148, 55], [[152, 52], [156, 50]], [158, 50]], 'A'),
    P('q', 'b', [[116, 64]]), P('co', 'c', [[178, 92]], 'T'),
  ],
  balls: [['S', 'A', 'A', [196, 46, 1]]],
})

// Coordination: forward roll on the ground, ball manoeuvre, accurate shot at the near or far post
const rollShoot = fifa({
  steps: 4, speed: 1.25,
  field: [HALF, GOAL_R, ...ZONES, ['zone', 124, 70, 14, 8], ['ball', 144, 74], ['cone', 150, 66, 'r'], ['cone', 158, 74, 'r']],
  players: [
    P('A', 'b', [[116, 74], [[124, 74], [140, 74]], [[146, 70], [154, 68], [162, 66]], [164, 64]], 'A'),
    P('q', 'b', [[108, 74]]),
  ],
  balls: [[[144, 74], [144, 74], 'A', [196, 59, 1]]],
})

// Coordination: quick jumps touching the rings with the right and left foot, receive, slalom round the poles, long lofted pass
const ringsLong = fifa({
  steps: 5, speed: 1.25,
  field: [FULL, ['hoop', 30, 30], ['hoop', 38, 36], ['hoop', 46, 30], ['hoop', 54, 36], ['pole', 74, 30], ['pole', 82, 38], ['pole', 90, 30], ['pole', 98, 38]],
  players: [
    P('A', 'b', [[20, 33], [[30, 30], [38, 36], [46, 30], [56, 34]], [62, 34], [[74, 34], [82, 32], [90, 36], [98, 32]], [108, 34]], 'A'),
    P('S', 'y', [[66, 18]], 'S'),
    P('R', 'b', [[168, 62], [168, 62], [168, 62], [168, 62], [170, 60]], 'B'),
    P('q', 'b', [[12, 33]]),
  ],
  balls: [['S', 'S', 'A', 'A', [170, 60, 2]]],
})

// Coordination: finishing while the opponent chases and pushes (1v1)
const pushFinish = fifa({
  steps: 4, speed: 1.15,
  field: [HALF, GOAL_R, ['ball', 150, 10], ['ball', 154, 10]],
  players: [
    P('S', 'y', [[156, 16]], 'S'),
    P('A', 'b', [[146, 62], [158, 58], [170, 54], [172, 54]], 'A'),
    P('D', 'y', [[142, 68], [154, 65], [166, 61], [167, 61]]),
    P('g', 'r', [[190, 55], [190, 55], [188, 54], [190, 50]]),
  ],
  balls: [['S', 'S', 'A', [196, 49, 1]]],
})

// Intermittent running by position: midfielders 15″:15″, full-backs and wide midfielders 10″:20″, forwards and centre-backs 5″:25″
const byPosition = fifa({
  steps: 5, speed: 1.4,
  field: [FULL, ['cones', 'r', [24, 22, 142, 22, 24, 55, 106, 55, 24, 88, 79, 88]], ['text', 36, 14, '15″ : 15″'], ['text', 36, 47, '10″ : 20″'], ['text', 34, 80, '5″ : 25″']],
  players: [
    P('m1', 'b', [[26, 24], [140, 24], [86, 24], [140, 24], [86, 24]]),
    P('m2', 'b', [[26, 30], [140, 30], [86, 30], [140, 30], [86, 30]]),
    P('w1', 'y', [[26, 57], [104, 57], [40, 57], [104, 57], [40, 57]]),
    P('w2', 'y', [[26, 63], [104, 63], [40, 63], [104, 63], [40, 63]]),
    P('f1', 'o', [[26, 90], [77, 90], [30, 90], [77, 90], [30, 90]]),
    P('f2', 'o', [[26, 96], [77, 96], [30, 96], [77, 96], [30, 96]]),
  ],
})

export const FIFA81_SCENES: Record<string, BookScene> = {
  'f81-1': norway, 'f81-2': threeV3, 'f81-3': hrTest, 'f81-4': cooper, 'f81-5': speedPyramid, 'f81-6': contrast,
  'f81-7': turnShoot, 'f81-8': rollShoot, 'f81-9': ringsLong, 'f81-10': pushFinish, 'f81-11': byPosition,
}
