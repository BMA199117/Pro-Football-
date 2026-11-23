import type { BookScene, Item, Player, Pt, Team } from './scene'

/**
 * RFS "Programme for players aged 6–9" (methodical recommendations).
 * Stages «Ball» (6 years) and «Ball + Goal» (7 years).
 * The text edition we have has no pictures, so each scene is drawn from the
 * book's organisation text: field size, where players start, how they move.
 */
const P = (id: string, t: Team, p: (Pt | Pt[])[], l?: string): Player => ({ id, t, p, l })
const B = (id: string, t: Team, p: (Pt | Pt[])[], l?: string): Player => ({ id, t, p, l, ball: true })
const coach = (x: number, y: number): Player => ({ id: 'co', t: 'c', l: 'T', p: [[x, y]] })
const rad = (d: number) => (d * Math.PI) / 180
/** point on a circle */
const on = (cx: number, cy: number, r: number, deg: number): Pt => [Math.round(cx + r * Math.cos(rad(deg))), Math.round(cy + r * Math.sin(rad(deg)))]
/** waypoints along an arc, ending at a1 */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 3): Pt[] =>
  Array.from({ length: n }, (_, i) => on(cx, cy, r, a0 + ((a1 - a0) * (i + 1)) / n))
const CIRCLE: Item = ['circle', 100, 55, 42]

// 1 · Relays – 3–4 teams, 10–15 m course with 1–4 cones; each runner goes out and back in the way the coach shows
const relays: BookScene = {
  steps: 4, speed: 1.3,
  field: [...[30, 55, 80].flatMap((y): Item[] => [['cone', 70, y, 'y'], ['cone', 100, y, 'y'], ['cone', 130, y, 'y'], ['cone', 156, y, 'r']]), ['line', 40, 18, 40, 92, true]],
  players: [30, 55, 80].flatMap((y, i): Player[] => {
    const t: Team = (['r', 'w', 'b'] as Team[])[i]
    return [
      P('a' + i, t, [[36, y], [[70, y - 4], [100, y - 4], [150, y - 4]], [[164, y], [150, y + 7], [100, y + 7], [44, y + 7]], [30, y + 9]]),
      { ...P('b' + i, t, [[28, y], [28, y], [36, y], [[70, y - 4], [100, y - 4], [150, y - 4]]]), quiet: true },
      { ...P('c' + i, t, [[20, y], [20, y], [28, y], [28, y]]), quiet: true },
      { ...P('d' + i, t, [[12, y], [12, y], [20, y], [20, y]]), quiet: true },
    ]
  }),
}

// 2 · Mirror – pairs move together over 15–20 m, facing or side by side, copying each other exactly
const mirror: BookScene = {
  steps: 4, speed: 1.3,
  field: [['line', 44, 14, 44, 96, true], ['line', 160, 14, 160, 96, true], ['cones', 'y', [44, 14, 44, 96, 160, 14, 160, 96]]],
  players: [
    coach(100, 100),
    P('a1', 'r', [[44, 26], [[70, 20], [96, 26]], [[122, 20], [150, 26]], [150, 26]], '1'),
    P('a2', 'w', [[44, 38], [[70, 32], [96, 38]], [[122, 32], [150, 38]], [150, 38]], '1'),
    P('b1', 'r', [[30, 58], [44, 58], [[70, 52], [96, 58]], [[122, 52], [150, 58]]], '2'),
    P('b2', 'w', [[30, 70], [44, 70], [[70, 64], [96, 70]], [[122, 64], [150, 70]]], '2'),
    { ...P('c1', 'r', [[20, 84], [30, 84], [44, 84], [[70, 80], [96, 84]]], '3'), quiet: true },
    { ...P('c2', 'w', [[20, 94], [30, 94], [44, 94], [[70, 90], [96, 94]]], '3'), quiet: true },
  ],
}

// 3 · Minefield – 8–12 players move inside the centre circle among 10–15 marker "mines" without touching mines or each other
const MINES: Item = ['cones', 'y', [84, 36, 112, 32, 128, 48, 74, 58, 98, 54, 120, 70, 88, 76, 106, 84, 136, 62, 66, 42, 70, 74, 110, 44]]
const minefield: BookScene = {
  steps: 3, speed: 1.5,
  field: [CIRCLE, MINES],
  players: [
    coach(40, 55),
    P('a', 'r', [[78, 26], [[92, 42], [104, 40]], [[118, 38], [124, 30]]]),
    P('b', 'r', [[136, 40], [[124, 56], [116, 50]], [[106, 64], [96, 64]]]),
    P('c', 'r', [[134, 78], [[118, 80], [112, 74]], [[100, 72], [92, 66]]]),
    P('d', 'r', [[76, 84], [[80, 66], [86, 64]], [[78, 48], [80, 44]]]),
    P('e', 'r', [[64, 52], [[74, 46], [82, 46]], [[92, 30], [100, 24]]]),
    P('f', 'r', [[100, 64], [[112, 60], [126, 58]], [[132, 74], [126, 84]]]),
  ],
}

// 4 · Little train – players on the centre circle run one behind another, copying the coach; 1 whistle stop, 2 whistles turn back
const train: BookScene = {
  steps: 4, speed: 1.25,
  field: [CIRCLE],
  players: [
    coach(100, 55),
    ...Array.from({ length: 10 }, (_, i): Player => {
      const a = i * 36
      return { ...P('p' + i, i % 2 ? 'w' : 'r', [on(100, 55, 42, a), arc(100, 55, 42, a, a + 40), arc(100, 55, 42, a + 40, a + 80), arc(100, 55, 42, a + 80, a + 40)]), quiet: i > 0 }
    }),
  ],
}

// 5 · Little houses – 2–3 taggers; a tagged player freezes with arms out until a team-mate touches their hand
const houses: BookScene = {
  steps: 4, speed: 1.3,
  field: [CIRCLE],
  players: [
    P('t1', 'y', [[100, 55], [[90, 46], [80, 40]], [[92, 32], [104, 28]], [118, 34]]),
    P('t2', 'y', [[112, 62], [[124, 70], [128, 78]], [[118, 82], [108, 80]], [96, 82]]),
    P('a', 'r', [[74, 36], [78, 38], [78, 38], [[70, 50], [66, 62]]]),
    P('b', 'r', [[116, 26], [[106, 22], [96, 22]], [[86, 30], [80, 36]], [[88, 24], [100, 18]]]),
    P('c', 'r', [[138, 54], [[134, 66], [130, 74]], [[136, 62], [140, 52]], [132, 40]]),
    P('d', 'r', [[90, 80], [[96, 88], [108, 92]], [[120, 90], [130, 84]], [126, 72]]),
    P('e', 'r', [[64, 66], [[70, 76], [78, 84]], [[72, 72], [68, 64]], [62, 52]]),
  ],
}

// 6 · Catch-up (with the ball) – everyone dribbles round the centre circle the same way and tries to tag the dribbler in front
const chase: BookScene = {
  steps: 3, speed: 1.6,
  field: [CIRCLE],
  players: Array.from({ length: 8 }, (_, i): Player => {
    const a = i * 45, fast = i === 0 ? 70 : 40
    return { ...B('p' + i, i % 2 ? 'w' : 'r', [on(100, 55, 42, a), arc(100, 55, 42, a, a + fast / 2 + 20), arc(100, 55, 42, a + fast / 2 + 20, a + fast + 40)]), quiet: i > 1 }
  }),
}

// 7 · Minefield with the ball – dribble inside the circle; your ball must not touch other balls or leave the circle
const mineBall: BookScene = {
  steps: 3, speed: 1.6,
  field: [CIRCLE],
  players: [
    B('a', 'r', [[80, 32], [[94, 40], [104, 34]], [[116, 38], [124, 48]]]),
    B('b', 'w', [[130, 44], [[122, 58], [112, 56]], [[100, 64], [90, 60]]]),
    B('c', 'r', [[124, 76], [[112, 82], [102, 76]], [[92, 80], [82, 74]]]),
    B('d', 'w', [[72, 72], [[76, 60], [70, 52]], [[76, 42], [86, 38]]]),
    B('e', 'r', [[96, 54], [[104, 62], [116, 68]], [[126, 64], [134, 56]]]),
    B('f', 'w', [[90, 20], [[80, 24], [70, 36]], [[64, 50], [66, 62]]]),
  ],
}

// 8 · Freeze – dribble for 30–40 s; on the whistle stop the ball with the sole (then knee, head, chest or sit on it); "unfreeze" and go on
const AREA8: Item = ['area', 30, 10, 140, 90, 'c']
const freeze: BookScene = {
  notes: { 1: ["Hushtak — «to'xta!»: to'pni oyoq tagi bilan to'xtatib, unga tizza, peshona yoki ko'krak bilan tegadi", 'Свисток — «замри»: остановить мяч подошвой и коснуться его коленом, лбом или грудью'], 2: ["«Yur!» — olib yurish davom etadi", '«Отомри» — ведение продолжается'] },
  steps: 4, speed: 1.3,
  field: [AREA8],
  players: [
    coach(18, 55),
    ...([[50, 26], [92, 22], [140, 30], [60, 60], [110, 54], [150, 74], [80, 88], [128, 90]] as Pt[]).map(([x, y], i): Player =>
      B('p' + i, i % 2 ? 'w' : 'r', [[x, y], [[x + 8, y + (i % 3) * 3 - 3], [x + 14, y + 4]], [x + 14, y + 4], [[x + 6, y + 10], [x - 2, y + 8]]])),
  ],
}

// 9 · Hunters – 2–3 taggers without a ball; the rest dribble from one end line to the other; a tagged player stands with a foot on the ball until freed
const hunters: BookScene = {
  steps: 4, speed: 1.3,
  field: [['area', 20, 16, 160, 78, 'c']],
  players: [
    P('h1', 'y', [[96, 36], [86, 32], [[80, 30], [78, 34]], [96, 30]]),
    P('h2', 'y', [[104, 70], [112, 66], [118, 70], [128, 76]]),
    B('a', 'r', [[24, 26], [[48, 22], [70, 28]], [74, 32], [74, 32]]),
    B('b', 'w', [[24, 44], [[50, 48], [72, 44]], [[100, 46], [130, 42]], [[124, 36], [80, 34]]]),
    B('c', 'r', [[24, 62], [[52, 58], [86, 64]], [[110, 60], [140, 62]], [[160, 60], [176, 58]]]),
    B('d', 'w', [[24, 82], [[52, 86], [84, 80]], [[110, 84], [146, 86]], [[164, 82], [176, 84]]]),
  ],
}

// 10 · 1×1 "cross the line" – 10–15 × 8–10 m; the attacker scores by dribbling over the defender's end line; queues at both ends
const F1: Item = ['area', 60, 30, 80, 50, 'c']
const crossLine: BookScene = {
  steps: 4, speed: 1.2,
  field: [F1],
  players: [
    P('a', 'r', [[64, 55], [[80, 52], [94, 56]], [[108, 44], [118, 38]], [[132, 38], [144, 40]]], 'A'),
    P('d', 'w', [[136, 55], [116, 54], [112, 48], [116, 44]], 'D'),
    { ...P('r2', 'r', [[52, 50]]), quiet: true }, { ...P('r3', 'r', [[52, 60]]), quiet: true },
    { ...P('w2', 'w', [[148, 50]]), quiet: true }, { ...P('w3', 'w', [[148, 60]]), quiet: true },
  ],
  balls: [['a', 'a', 'a', 'a']],
}

// 11 · Wolves and hares – the hare runs across the field with feints; the wolf from the other end tries to touch them
const wolves: BookScene = {
  steps: 3, speed: 1.3,
  field: [F1],
  players: [
    P('h', 'r', [[62, 55], [[78, 48], [88, 62], [98, 56]], [[110, 42], [124, 36], [142, 38]]]),
    P('w', 'k', [[138, 55], [116, 56], [110, 62]]),
    { ...P('h2', 'r', [[52, 45]]), quiet: true }, { ...P('h3', 'r', [[52, 55]]), quiet: true }, { ...P('h4', 'r', [[52, 65]]), quiet: true },
  ],
}

// 12 · Snake – columns walk forward in step; the coach shows a movement (side steps, high knees, hops) and the whole column copies it
const snake: BookScene = {
  steps: 4, speed: 1.4,
  field: [['line', 20, 14, 20, 96, true], ['line', 180, 14, 180, 96, true]],
  players: [
    coach(100, 102),
    ...[28, 55, 82].flatMap((y, c): Player[] => Array.from({ length: 5 }, (_, i): Player => {
      const x = 52 - i * 9
      return { ...P(`s${c}${i}`, (['r', 'w', 'b'] as Team[])[c], [[x, y], [x + 34, y], [x + 34, y - 8], [x + 70, y - 8]]), quiet: i > 0 }
    })),
  ],
}

// 13 · Chain – the first runs round the cone and back, takes the next by the hand, and so on until the whole team runs together
const chain: BookScene = {
  steps: 3, speed: 1.6,
  field: [['cone', 140, 32, 'r'], ['cone', 140, 78, 'r'], ['line', 40, 14, 40, 96, true]],
  players: [32, 78].flatMap((y, c): Player[] => {
    const t: Team = c ? 'w' : 'r'
    const round: Pt[] = [[90, y - 4], [146, y - 4], [150, y + 2], [90, y + 3]]
    return [
      P('a' + c, t, [[36, y], [...round, [40, y + 1]], [[90, y - 12], [150, y - 12], [158, y + 2], [150, y + 14], [90, y + 13], [44, y + 10]]]),
      { quiet: true, ...P('b' + c, t, [[28, y], [36, y], [[90, y - 8], [148, y - 8], [154, y + 2], [148, y + 9], [90, y + 9], [44, y + 4]]]) },
      { quiet: true, ...P('c' + c, t, [[20, y], [28, y], [36, y]]) },
      { ...P('d' + c, t, [[12, y], [20, y], [28, y]]), quiet: true },
    ]
  }),
}

// 14 · Quick feet relays – 6–8 markers 30–40 cm apart, then a sprint to a cone 5 m on
const quick: BookScene = {
  steps: 4, speed: 1.2,
  field: [...[30, 55, 80].flatMap((y): Item[] => [['cones', 'y', [56, y, 62, y, 68, y, 74, y, 80, y, 86, y]], ['cone', 124, y, 'r']])],
  players: [30, 55, 80].flatMap((y, i): Player[] => {
    const t: Team = (['r', 'w', 'b'] as Team[])[i]
    return [
      P('a' + i, t, [[44, y], [[59, y - 3], [65, y + 3], [71, y - 3], [77, y + 3], [88, y]], [124, y], [[124, y + 9], [70, y + 9], [24, y + 9]]]),
      P('b' + i, t, [[36, y], [44, y], [44, y], [[59, y - 3], [65, y + 3], [71, y - 3], [77, y + 3], [88, y]]]),
      { ...P('c' + i, t, [[28, y], [36, y], [36, y], [44, y]]), quiet: true },
    ]
  }),
}

// 15 · Circuit – 4–5 stations of 3–5 players: quick feet over markers, running backwards between cones, hoops, ladder, sprint between poles
const circuit: BookScene = {
  steps: 3, speed: 1.5,
  field: [
    ['cones', 'y', [26, 26, 32, 26, 38, 26, 44, 26, 50, 26, 56, 26]],
    ['cones', 'o', [84, 26, 94, 26, 104, 26, 114, 26, 124, 26]],
    ['hoop', 146, 26], ['hoop', 154, 26], ['hoop', 162, 26], ['hoop', 170, 26], ['hoop', 178, 26],
    ['ladder', 30, 82, 80, 82],
    ['pole', 110, 74], ['pole', 122, 86], ['pole', 134, 74], ['pole', 146, 86], ['pole', 158, 74], ['pole', 170, 86],
    ['text', 40, 14, '1'], ['text', 104, 14, '2'], ['text', 162, 14, '3'], ['text', 52, 98, '4'], ['text', 140, 100, '5'],
  ],
  players: [
    P('s1', 'r', [[18, 26], [[29, 23], [35, 29], [41, 23], [47, 29], [53, 23], [62, 26]], [62, 26]]),
    P('s2', 'w', [[78, 26], [[89, 30], [99, 22], [109, 30]], [[119, 22], [130, 26]]]),
    P('s3', 'b', [[138, 26], [[146, 26], [154, 26], [162, 26]], [[170, 26], [178, 26], [186, 26]]]),
    P('s4', 'y', [[22, 82], [[38, 82], [52, 82]], [[66, 82], [88, 82]]]),
    P('s5', 'r', [[100, 80], [[110, 80], [122, 80], [134, 80]], [[146, 80], [158, 80], [176, 80]]]),
  ],
}

// 16 · Little houses with the ball – 2 taggers with balls; a dribbler whose ball they touch freezes with a foot on the ball until a team-mate touches it
const housesBall: BookScene = {
  steps: 4, speed: 1.3,
  field: [['area', 50, 10, 100, 90, 'c']],
  players: [
    B('t1', 'y', [[100, 50], [[92, 40], [80, 34]], [[90, 26], [104, 24]], [116, 30]]),
    B('t2', 'y', [[110, 64], [[122, 72], [128, 80]], [[118, 86], [106, 84]], [96, 86]]),
    B('a', 'r', [[72, 30], [76, 32], [76, 32], [[68, 46], [66, 60]]]),
    B('b', 'w', [[118, 20], [[104, 16], [94, 18]], [[86, 26], [80, 32]], [[90, 20], [104, 16]]]),
    B('c', 'r', [[138, 52], [[136, 64], [132, 74]], [[138, 62], [140, 50]], [132, 38]]),
    B('d', 'w', [[84, 82], [[94, 92], [108, 94]], [[120, 92], [130, 86]], [124, 72]]),
  ],
}

// 17 · Traffic light – gates of three colours; the coach calls a colour order and a number of laps
const G = (x: number, y: number, c: 'b' | 'w' | 'y'): Item => ['cones', c, [x, y - 4, x, y + 4]]
const traffic: BookScene = {
  steps: 4, speed: 1.3,
  field: [['area', 34, 8, 132, 94], G(60, 26, 'b'), G(118, 22, 'b'), G(150, 70, 'b'), G(76, 82, 'b'), G(92, 44, 'w'), G(140, 40, 'w'), G(54, 62, 'w'), G(116, 88, 'w'), G(84, 22, 'y'), G(122, 58, 'y'), G(70, 50, 'y'), G(150, 92, 'y')],
  players: [
    coach(22, 55),
    B('a', 'r', [[44, 22], [[54, 24], [64, 26]], [[80, 34], [96, 44]], [[110, 54], [126, 58]]]),
    B('b', 'w', [[110, 30], [[116, 26], [124, 20]], [[134, 30], [144, 40]], [[138, 50], [126, 56]]]),
    B('c', 'r', [[46, 86], [[64, 84], [80, 82]], [[64, 74], [50, 62]], [[60, 56], [74, 50]]]),
    B('d', 'w', [[140, 84], [[146, 76], [154, 70]], [[136, 80], [112, 88]], [[132, 92], [154, 92]]]),
  ],
}

// 18 · Who's last? – dribble in a 10×10 m square; on the signal turn round one of the 4 outside cones and get back in
const whoLast: BookScene = {
  steps: 3, speed: 1.4,
  field: [['area', 72, 28, 56, 56, 'c'], ['cone', 54, 12, 'r'], ['cone', 146, 12, 'r'], ['cone', 54, 98, 'r'], ['cone', 146, 98, 'r']],
  players: [
    coach(20, 55),
    B('a', 'r', [[84, 40], [[70, 26], [56, 16]], [[50, 14], [60, 18], [80, 36]]]),
    B('b', 'w', [[114, 38], [[128, 26], [144, 16]], [[150, 14], [140, 20], [118, 38]]]),
    B('c', 'r', [[86, 72], [[72, 84], [58, 94]], [[50, 98], [60, 92], [82, 70]]]),
    B('d', 'w', [[116, 70], [[130, 82], [142, 94]], [[150, 98], [140, 92], [114, 72]]]),
    B('e', 'r', [[100, 54], [[118, 40], [132, 26], [142, 18]], [[150, 18], [136, 24], [106, 50]]]),
  ],
}

// 19 · Catch-up round the cones – cones on the centre circle; everyone dribbles round each cone in turn and tries to catch the one ahead
const coneRing = Array.from({ length: 8 }, (_, i) => on(100, 55, 40, i * 45))
const chaseCones: BookScene = {
  steps: 3, speed: 1.6,
  field: [['cones', 'o', coneRing.flat()]],
  players: Array.from({ length: 8 }, (_, i): Player => {
    const a = i * 45 + 22
    const loop = (from: number): Pt[] => [on(100, 55, 49, from + 18), on(100, 55, 32, from + 28), on(100, 55, 40, from + 45)]
    return { ...B('p' + i, i % 2 ? 'w' : 'r', [on(100, 55, 40, a), loop(a), loop(a + 45)]), quiet: i > 1 }
  }),
}

// 20 · 1×1 "take the line" – 12–15 × 8–10 m with 1 m end zones; score by dribbling into the zone on the opponent's end line
const F2: Item[] = [['area', 56, 30, 88, 50, 'c'], ['zone', 56, 30, 5, 50], ['zone', 139, 30, 5, 50]]
const takeLine: BookScene = {
  steps: 4, speed: 1.2,
  field: F2,
  players: [
    P('a', 'r', [[62, 55], [[78, 56], [92, 54]], [[100, 66], [112, 70]], [[126, 66], [142, 62]]], 'A'),
    P('d', 'w', [[136, 55], [114, 54], [108, 60], [118, 62]], 'D'),
    { ...P('r2', 'r', [[48, 48]]), quiet: true }, { ...P('r3', 'r', [[48, 60]]), quiet: true },
    { ...P('w2', 'w', [[152, 48]]), quiet: true }, { ...P('w3', 'w', [[152, 60]]), quiet: true },
  ],
  balls: [['a', 'a', 'a', 'a']],
}

// 21 · Dodgeball – one team in the middle, two on the end lines shoot with the laces at the players in the middle
const dodge: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 16, 120, 78, 'c'], ['line', 70, 16, 70, 94, true], ['line', 130, 16, 130, 94, true]],
  players: [
    P('r1', 'r', [[44, 34], [44, 34], [44, 34], [44, 34]]), P('r2', 'r', [[44, 56]]), P('r3', 'r', [[44, 78]]),
    P('b1', 'b', [[156, 30]]), P('b2', 'b', [[156, 54], [156, 54], [156, 54], [156, 54]]), P('b3', 'b', [[156, 78]]),
    P('w1', 'w', [[94, 30], [100, 26], [104, 34], [96, 30]]),
    P('w2', 'w', [[106, 48], [100, 44], [100, 44], [[108, 90], [116, 100]]]),
    P('w3', 'w', [[90, 64], [96, 70], [88, 74], [92, 66]]),
    P('w4', 'w', [[112, 76], [106, 80], [114, 72], [106, 60]]),
  ],
  balls: [['r1', [100, 44, 1], [100, 44], [118, 100]], [[158, 60], 'b2', 'b2', [92, 66, 1]]],
}

// 22 · 1×1 "sniper" – 12–15 × 8 m, a cone on each end line; take turns shooting with the laces to knock over the other's cone
const sniper: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 60, 40, 80, 30], ['cone', 140, 55, 'r'], ['cone', 60, 55, 'r']],
  players: [P('a', 'r', [[52, 55]], 'A'), P('b', 'w', [[148, 55], [148, 55], [150, 62], [148, 55]], 'B')],
  balls: [['a', [140, 55, 1], [152, 62], [60, 55, 1]]],
}

// 23 · 1×1 "crossfire" – 15–18 × 8 m, one cone in the middle; players behind the end lines take turns to hit it
const crossfire: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 50, 40, 100, 30], ['cone', 100, 55, 'r']],
  players: [P('a', 'r', [[42, 52]], 'A'), P('b', 'w', [[158, 58], [158, 58], [158, 58], [158, 58]], 'B'), { ...P('a2', 'r', [[34, 62]]), quiet: true }, { ...P('b2', 'w', [[166, 48]]), quiet: true }],
  balls: [['a', [100, 55, 1], 'b', [100, 56, 1]]],
}

// 24 · Starts with a shot – pairs in 2 columns 10–15 m from a 3×2 m goal; the coach plays the ball forward, the player sprints after it and shoots
const starts: BookScene = {
  steps: 4, speed: 1.15,
  field: [['goal', 176, 55, 'l', 14], ['ball', 92, 52], ['ball', 90, 57]],
  players: [
    coach(96, 55),
    P('a', 'r', [[104, 34], [[118, 36], [134, 44]], [138, 46], [[120, 26], [104, 18]]]),
    { ...P('a2', 'r', [[94, 30]]), quiet: true }, { ...P('a3', 'r', [[84, 26]]), quiet: true },
    P('b', 'w', [[104, 76], [104, 76], [104, 76], [104, 76]]),
    { ...P('b2', 'w', [[94, 80]]), quiet: true }, { ...P('b3', 'w', [[84, 84]]), quiet: true },
  ],
  balls: [['co', [136, 46], 'a', [176, 52, 1]]],
}

// 25 · 1×1 into 2 small goals – 12–15 × 8–10 m; a 3 m zone in front of the defender's goal the defender may not enter
const small2: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 50, 30, 100, 50], ['goal', 50, 55, 'r', 14], ['goal', 150, 55, 'l', 14], ['zone', 136, 30, 14, 50]],
  players: [
    P('a', 'r', [[56, 55], [[74, 52], [88, 56]], [[104, 68], [116, 70]], [120, 66]], 'A'),
    P('d', 'w', [[144, 55], [124, 54], [118, 58], [126, 62]], 'D'),
    { ...P('r2', 'r', [[44, 40]]), quiet: true }, { ...P('w2', 'w', [[158, 40]]), quiet: true }, { ...P('w3', 'w', [[158, 70]]), quiet: true },
  ],
  balls: [['a', 'a', 'a', [150, 57, 1]]],
}

export const RFS69_A: Record<string, BookScene> = {
  'r69-1': relays, 'r69-2': mirror, 'r69-3': minefield, 'r69-4': train, 'r69-5': houses,
  'r69-6': chase, 'r69-7': mineBall, 'r69-8': freeze, 'r69-9': hunters, 'r69-10': crossLine,
  'r69-11': wolves, 'r69-12': snake, 'r69-13': chain, 'r69-14': quick, 'r69-15': circuit,
  'r69-16': housesBall, 'r69-17': traffic, 'r69-18': whoLast, 'r69-19': chaseCones, 'r69-20': takeLine,
  'r69-21': dodge, 'r69-22': sniper, 'r69-23': crossfire, 'r69-24': starts, 'r69-25': small2,
}
