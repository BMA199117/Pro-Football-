import type { BookScene, Item, Player, Pt, Team } from './scene'

/**
 * RFS "Programme for players aged 6–9" – stage «Ball + Goal + Opponent» (8 years):
 * 1×1 games, dribbling with feints, winning the ball, shooting.
 * Drawn from the book's organisation text (field size, start positions, movement).
 */
const P = (id: string, t: Team, p: (Pt | Pt[])[], l?: string): Player => ({ id, t, p, l })
const Q = (id: string, t: Team, at: Pt): Player => ({ id, t, p: [at], quiet: true })
const coach = (x: number, y: number): Player => ({ id: 'co', t: 'c', l: 'T', p: [[x, y]] })
/** 12–15 × 8–10 m field with 1 m zones on both end lines */
const LINE_FIELD: Item[] = [['area', 56, 30, 88, 50, 'c'], ['zone', 56, 30, 5, 50], ['zone', 139, 30, 5, 50]]
const QUEUES: Player[] = [Q('r2', 'r', [48, 46]), Q('r3', 'r', [48, 58]), Q('w2', 'w', [152, 46]), Q('w3', 'w', [152, 58])]

// FIFA 11+ running block – pairs jog along two lines of 6 cones, with hip rotations at each cone pair, and jog back
const fifa11: BookScene = {
  steps: 4, speed: 1.4,
  field: [['cones', 'o', [40, 44, 64, 44, 88, 44, 112, 44, 136, 44, 160, 44, 40, 66, 64, 66, 88, 66, 112, 66, 136, 66, 160, 66]]],
  players: [
    P('a', 'r', [[32, 40], [[52, 40], [64, 40]], [[100, 40], [160, 40]], [[172, 30], [100, 24], [30, 28]]]),
    P('b', 'w', [[32, 70], [[52, 70], [64, 70]], [[100, 70], [160, 70]], [[172, 80], [100, 86], [30, 82]]]),
    { ...P('c', 'r', [[22, 40], [22, 40], [40, 40], [[64, 40], [100, 40]]]), quiet: true },
    { ...P('d', 'w', [[22, 70], [22, 70], [40, 70], [[64, 70], [100, 70]]]), quiet: true },
  ],
}

// 1×1 take the line – attacker facing: both start on the end lines; beat the defender with a feint and stop the ball in the zone
const face: BookScene = {
  steps: 4, speed: 1.2,
  field: LINE_FIELD,
  players: [
    P('a', 'r', [[62, 55], [[76, 54], [90, 55]], [[98, 48], [100, 46], [112, 68]], [[126, 70], [141, 66]]], 'A'),
    P('d', 'w', [[136, 55], [112, 54], [106, 50], [116, 64]], 'D'),
    ...QUEUES,
  ],
  balls: [['a', 'a', 'a', 'a']],
}

// 1×1 take the line – attacker side-on: starts on the side line in the middle and dribbles across with the foot away from the defender
const side: BookScene = {
  steps: 4, speed: 1.2,
  field: LINE_FIELD,
  players: [
    P('a', 'r', [[100, 84], [[100, 72], [102, 62]], [[98, 54], [104, 50], [116, 42]], [[130, 40], [141, 42]]], 'A'),
    P('d', 'w', [[136, 55], [118, 58], [108, 54], [122, 50]], 'D'),
    Q('r2', 'r', [92, 90]), Q('r3', 'r', [108, 90]), Q('w2', 'w', [152, 46]), Q('w3', 'w', [152, 58]),
  ],
  balls: [['a', 'a', 'a', 'a']],
}

// 1×1 take the line – attacker with back to the defender: both start in the middle; turn with a feint and go
const back: BookScene = {
  steps: 4, speed: 1.2,
  field: LINE_FIELD,
  players: [
    P('a', 'r', [[96, 55], [[92, 58], [94, 62]], [[104, 70], [116, 70]], [[130, 66], [141, 62]]], 'A'),
    P('d', 'w', [[106, 55], [104, 58], [108, 62], [118, 62]], 'D'),
    ...QUEUES,
  ],
  balls: [['a', 'a', 'a', 'a']],
}

// 1×1 into 2 small goals (1–2 m wide) – the defender steps out to the middle for the duel; if they win the ball they score in the attacker's goal
const small: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50, 'c'], ['mini', 56, 55, 'r', 9], ['mini', 144, 55, 'l', 9]],
  players: [
    P('a', 'r', [[62, 55], [[76, 56], [90, 54]], [[98, 46], [110, 40]], [122, 46]], 'A'),
    P('d', 'w', [[138, 55], [112, 55], [106, 50], [116, 52]], 'D'),
    Q('r2', 'r', [48, 44]), Q('w2', 'w', [152, 44]), Q('w3', 'w', [152, 66]),
  ],
  balls: [['a', 'a', 'a', [144, 55, 1]]],
}

// 1×1 with different tasks – the attacker tries to take the zone on the defender's line; here the defender wins the ball and scores in the attacker's small goal
const tasks: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 60, 30, 80, 50, 'c'], ['mini', 60, 55, 'r', 9], ['zone', 135, 30, 5, 50]],
  players: [
    P('a', 'r', [[66, 55], [[80, 54], [92, 56]], [[104, 64], [108, 66]], [108, 66]], 'A'),
    P('d', 'w', [[132, 55], [114, 56], [108, 64], [[96, 62], [84, 58]]], 'D'),
    Q('r2', 'r', [52, 44]), Q('w2', 'w', [148, 48]), Q('w3', 'w', [148, 62]),
  ],
  balls: [['a', 'a', 'd', [60, 55, 1]]],
}

// 1 + GK × 1, defender facing – 25–30 × 15 m; attacker dribbles at speed from the line, the defender steps out from 16 m to block or win the ball
const gkFace: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 30, 22, 140, 66], ['mini', 30, 40, 'r', 9], ['mini', 30, 72, 'r', 9], ['goal', 170, 55, 'l', 22]],
  players: [
    P('a', 'r', [[36, 55], [[56, 56], [78, 54]], [[96, 50], [110, 40]], [124, 40]], 'A'),
    P('d', 'w', [[96, 56], [98, 54], [102, 48], [118, 46]], 'D'),
    P('k', 'k', [[166, 55], [166, 55], [164, 50], [166, 47]]),
    Q('r2', 'r', [22, 50]), Q('r3', 'r', [22, 60]),
  ],
  balls: [['a', 'a', 'a', [170, 46, 1]]],
}

// 1 + GK × 1, defender from the side – pairs in 2 columns 20–25 m out; the attacker dribbles at full speed, the defender chases from 3–5 m
const gkSide: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 30, 22, 140, 66], ['mini', 30, 40, 'r', 9], ['mini', 30, 72, 'r', 9], ['goal', 170, 55, 'l', 22]],
  players: [
    P('a', 'r', [[66, 48], [[90, 50], [110, 50]], [[126, 50], [136, 52]], [140, 52]], 'A'),
    P('d', 'w', [[62, 64], [[84, 64], [104, 62]], [[120, 60], [130, 58]], [138, 58]], 'D'),
    P('k', 'k', [[166, 55], [166, 55], [162, 54], [165, 62]]),
    Q('r2', 'r', [56, 44]), Q('r3', 'r', [48, 44]), Q('w2', 'w', [54, 68]), Q('w3', 'w', [46, 68]),
  ],
  balls: [['a', 'a', 'a', [170, 64, 1]]],
}

// 1×1 into 2 small goals with 2 zones – nobody may enter the 3 m zone in front of either goal
const small2z: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 50, 30, 100, 50, 'c'], ['mini', 50, 55, 'r', 9], ['mini', 150, 55, 'l', 9], ['zone', 50, 30, 14, 50], ['zone', 136, 30, 14, 50]],
  players: [
    P('a', 'r', [[68, 55], [[82, 54], [94, 56]], [[104, 66], [114, 68]], [120, 64]], 'A'),
    P('d', 'w', [[132, 55], [114, 56], [108, 60], [118, 62]], 'D'),
    Q('r2', 'r', [42, 44]), Q('w2', 'w', [158, 44]), Q('w3', 'w', [158, 66]),
  ],
  balls: [['a', 'a', 'a', [150, 56, 1]]],
}

// 1×1 into 4 small goals with 2 zones – two small goals on each end line, 3 m no-go zones in front of them
const small4z: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 50, 26, 100, 58], ['mini', 50, 38, 'r', 8], ['mini', 50, 72, 'r', 8], ['mini', 150, 38, 'l', 8], ['mini', 150, 72, 'l', 8], ['zone', 50, 26, 14, 58], ['zone', 136, 26, 14, 58]],
  players: [
    P('a', 'r', [[68, 55], [[82, 56], [96, 54]], [[104, 44], [114, 36]], [120, 38]], 'A'),
    P('d', 'w', [[132, 55], [114, 54], [108, 48], [118, 46]], 'D'),
    Q('r2', 'r', [42, 55]), Q('w2', 'w', [158, 55]),
  ],
  balls: [['a', 'a', 'a', [150, 38, 1]]],
}

// Starts 1×1 with a shot – the coach plays the ball forward between a pair; whoever gets there first shoots at the 3×2 m goal
const starts11: BookScene = {
  steps: 4, speed: 1.15,
  field: [['goal', 176, 55, 'l', 14], ['ball', 92, 52], ['ball', 90, 57]],
  players: [
    coach(96, 55),
    P('a', 'r', [[104, 36], [[118, 40], [130, 46]], [134, 48], [138, 44]]),
    P('b', 'w', [[104, 74], [[118, 70], [128, 62]], [132, 56], [140, 54]]),
    Q('a2', 'r', [94, 30]), Q('a3', 'r', [84, 26]), Q('b2', 'w', [94, 80]), Q('b3', 'w', [84, 84]),
  ],
  balls: [['co', [134, 50], 'a', [176, 52, 1]]],
}

// 1×1 + goalkeeper – 20–25 × 10–12 m; attacker from the small goal, defender in the middle, goalkeeper in a 5×2 m goal
const oneGk: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 28, 122, 54], ['mini', 40, 55, 'r', 9], ['goal', 162, 55, 'l', 22]],
  players: [
    P('a', 'r', [[46, 55], [[64, 54], [84, 56]], [[96, 66], [110, 70]], [120, 66]], 'A'),
    P('d', 'w', [[100, 55], [96, 56], [100, 62], [112, 62]], 'D'),
    P('k', 'k', [[158, 55], [158, 55], [156, 60], [158, 64]]),
    Q('r2', 'r', [34, 44]), Q('w2', 'w', [100, 90]),
  ],
  balls: [['a', 'a', 'a', [162, 50, 1]]],
}

// 1×1 + 2 goalkeepers – two 5×2 m goals with keepers; attacker and defender start by their own goals
const twoGk: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 34, 28, 132, 54], ['goal', 34, 55, 'r', 22], ['goal', 166, 55, 'l', 22]],
  players: [
    P('k1', 'k', [[38, 55]]),
    P('a', 'r', [[50, 50], [[70, 50], [90, 52]], [[102, 42], [116, 38]], [124, 40]], 'A'),
    P('d', 'w', [[150, 60], [120, 56], [108, 48], [120, 46]], 'D'),
    P('k2', 'k', [[162, 55], [162, 55], [160, 50], [162, 46]]),
    Q('r2', 'r', [44, 40]), Q('w2', 'w', [156, 72]),
  ],
  balls: [['a', 'a', 'a', [166, 62, 1]]],
}

export const RFS69_B: Record<string, BookScene> = {
  'r69-26': fifa11, 'r69-27': face, 'r69-28': side, 'r69-29': back, 'r69-30': small, 'r69-31': tasks,
  'r69-35': gkFace, 'r69-36': gkSide, 'r69-37': small2z, 'r69-38': small4z, 'r69-39': starts11, 'r69-40': oneGk, 'r69-41': twoGk,
}
