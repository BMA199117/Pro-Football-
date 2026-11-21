import type { BookScene, Item, Player, Pt, Team } from './scene'

/**
 * RFS "Programme for players aged 6–9" – stage «Ball + Goal + Opponent + Partner» (9 years):
 * passing, receiving, feints, defending in pairs, shooting and heading in 1×1, 2×1 and 2×2 games.
 * Drawn from the book's organisation text (field size, start positions, movement).
 */
const P = (id: string, t: Team, p: (Pt | Pt[])[], l?: string): Player => ({ id, t, p, l })
const Q = (id: string, t: Team, at: Pt): Player => ({ id, t, p: [at], quiet: true })
const ZL: Item = ['zone', 56, 30, 5, 50]
const ZR: Item = ['zone', 139, 30, 5, 50]

// 1×1 passing for accuracy – a 1 m cone gate in the middle; pass through it to the partner behind the other end line
const accuracy: BookScene = {
  steps: 4, speed: 1.1,
  field: [['area', 60, 40, 80, 30], ['cones', 'r', [100, 51, 100, 59]]],
  players: [P('a', 'r', [[52, 55]], 'A'), P('b', 'w', [[148, 57], [148, 57], [148, 54], [148, 54]], 'B'), Q('a2', 'r', [44, 64]), Q('b2', 'w', [156, 46])],
  balls: [['a', 'b', 'a', 'b']],
}

// 2×1 with different tasks – the pair attacks the zone on the defender's line; the defender, on winning the ball, scores in the pair's small goal
const twoOneTasks: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 60, 30, 80, 50, 'c'], ['mini', 60, 55, 'r', 9], ZR],
  players: [
    P('a1', 'r', [[68, 44], [[80, 44], [92, 46]], [100, 46], [[112, 38], [118, 36]]], '1'),
    P('a2', 'r', [[68, 66], [[82, 68], [96, 70]], [[110, 72], [126, 70]], [141, 66]], '2'),
    P('d', 'w', [[132, 55], [112, 52], [108, 60], [118, 64]], 'D'),
    Q('r3', 'r', [52, 40]), Q('r4', 'r', [52, 70]), Q('w2', 'w', [148, 48]), Q('w3', 'w', [148, 62]),
  ],
  balls: [['a1', 'a1', 'a2', 'a2']],
}

// 2×1 keep the ball – the pair passes and moves into space behind the defender; the defender scores in either small goal after winning it
const twoOne: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50], ['mini', 56, 55, 'r', 9], ['mini', 144, 55, 'l', 9]],
  players: [
    P('a1', 'r', [[76, 42], [76, 42], [[86, 66], [98, 72]], [100, 70]], '1'),
    P('a2', 'r', [[122, 66], [[130, 52], [128, 40]], [128, 40], [128, 40]], '2'),
    P('d', 'w', [[100, 55], [106, 50], [112, 46], [104, 62]], 'D'),
  ],
  balls: [['a1', 'a2', 'a2', 'a1']],
}

// 2×2 with different tasks – attackers take the zone on the defenders' line after a pass; defenders score in one of 2 small goals
const twoTwoTasks: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 25, 120, 60, 'c'], ['mini', 40, 38, 'r', 8], ['mini', 40, 72, 'r', 8], ['zone', 155, 25, 5, 60]],
  players: [
    P('a1', 'r', [[50, 40], [[70, 40], [88, 44]], [96, 46], [104, 44]], '1'),
    P('a2', 'r', [[50, 70], [[70, 72], [94, 74]], [[112, 76], [126, 72]], [157, 68]], '2'),
    P('d1', 'w', [[140, 42], [124, 44], [116, 48], [114, 48]]),
    P('d2', 'w', [[140, 68], [124, 66], [120, 70], [136, 70]]),
    Q('r3', 'r', [32, 50]), Q('r4', 'r', [32, 60]), Q('w3', 'w', [168, 50]), Q('w4', 'w', [168, 60]),
  ],
  balls: [['a1', 'a1', 'a2', 'a2']],
}

// 2×2 into 4 small goals – each pair attacks the two small goals on the other end line
const fourGoals = (zones: boolean): BookScene => ({
  steps: 4, speed: 1.2,
  field: [['area', 40, 25, 120, 60, 'c'], ['mini', 40, 38, 'r', 8], ['mini', 40, 72, 'r', 8], ['mini', 160, 38, 'l', 8], ['mini', 160, 72, 'l', 8],
    ...(zones ? [['zone', 40, 25, 14, 60], ['zone', 146, 25, 14, 60]] as Item[] : [])],
  players: [
    P('a1', 'r', [[58, 42], [[74, 44], [90, 48]], [98, 50], [104, 50]], '1'),
    P('a2', 'r', [[58, 68], [[76, 70], [96, 74]], [[112, 78], [124, 76]], [128, 74]], '2'),
    P('d1', 'w', [[138, 42], [122, 46], [114, 52], [112, 56]]),
    P('d2', 'w', [[138, 68], [124, 64], [118, 70], [130, 66]]),
    Q('r3', 'r', [32, 55]), Q('w3', 'w', [168, 55]),
  ],
  balls: [['a1', 'a1', 'a2', [160, 72, 1]]],
})

// 1×1 receive and go aside – cones on both end lines; take the pass with the first touch past the cone
const receive: BookScene = {
  steps: 4, speed: 1.15,
  field: [['area', 60, 40, 80, 30], ['cone', 60, 55, 'r'], ['cone', 140, 55, 'r']],
  players: [
    P('a', 'r', [[52, 55], [52, 55], [52, 55], [52, 64]], 'A'),
    P('b', 'w', [[148, 55], [148, 55], [148, 46], [148, 46]], 'B'),
  ],
  balls: [['a', [148, 55], 'b', 'a']],
}

// 4×2 (2×2×2) – a pair at each end passes through the middle to the other pair; the middle pair scores in the 4 small goals after winning it
const fourTwo: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 25, 120, 60, 'c'], ['line', 70, 25, 70, 85, true], ['line', 130, 25, 130, 85, true], ['mini', 100, 25, 'd', 8], ['mini', 100, 85, 'u', 8], ['mini', 40, 55, 'r', 8], ['mini', 160, 55, 'l', 8]],
  players: [
    P('a1', 'r', [[52, 40], [56, 36], [56, 36], [56, 36]]),
    P('a2', 'r', [[52, 70], [60, 72], [60, 72], [60, 72]]),
    P('b1', 'r', [[148, 40], [148, 40], [144, 46], [140, 42]]),
    P('b2', 'r', [[148, 70], [148, 70], [148, 70], [144, 64]]),
    P('d1', 'w', [[96, 46], [92, 50], [104, 46], [112, 48]]),
    P('d2', 'w', [[104, 64], [96, 64], [108, 62], [116, 58]]),
  ],
  balls: [['a1', 'a2', 'b1', 'b2']],
}

// 1×1 "football tennis" – 5×5 m per player, a net or 3 m neutral zone; two touches: control, then over to the other side
const tennis = (pairs: boolean): BookScene => ({
  steps: 4, speed: 1.3,
  field: [['area', 36, 31, 48, 48], ['area', 116, 31, 48, 48], ['zone', 84, 31, 32, 48]],
  players: pairs ? [
    P('a1', 'r', [[56, 44], [56, 44], [58, 50], [62, 46]]), P('a2', 'r', [[56, 68], [56, 68], [62, 62], [58, 64]]),
    P('b1', 'w', [[144, 44], [136, 48], [140, 46], [140, 46]]), P('b2', 'w', [[144, 68], [144, 66], [136, 60], [140, 64]]),
  ] : [P('a', 'r', [[54, 55], [54, 55], [58, 48], [58, 48]], 'A'), P('b', 'w', [[146, 55], [136, 62], [136, 62], [140, 58]], 'B')],
  balls: pairs ? [['a1', [136, 48, 2], 'b2', [58, 50, 2]]] : [['a', [136, 62, 2], 'b', [58, 48, 2]]],
})

// Heading tennis 1×1 / 2×2 – only headers may send the ball over: toss it up for yourself (or your partner) and head it into the other box
const headTennis = (pairs: boolean): BookScene => ({
  steps: 4, speed: 1.3,
  field: [['area', 36, 31, 48, 48], ['area', 116, 31, 48, 48], ['zone', 84, 31, 32, 48]],
  players: pairs ? [
    P('a1', 'r', [[66, 44], [72, 46], [72, 46], [70, 50]]), P('a2', 'r', [[56, 66], [64, 60], [64, 60], [60, 64]]),
    P('b1', 'w', [[134, 44], [134, 46], [130, 52], [128, 52]]), P('b2', 'w', [[144, 66], [140, 62], [140, 62], [140, 60]]),
  ] : [P('a', 'r', [[64, 55], [72, 55], [70, 50], [70, 50]], 'A'), P('b', 'w', [[136, 55], [130, 60], [130, 60], [128, 56]], 'B')],
  balls: pairs ? [['a2', 'a1', [128, 52, 2], [70, 50, 2]]] : [['a', 'a', [130, 60, 2], [70, 50, 2]]],
})

// 1×1 take the line with a pass – the attacker comes off the line, gets the ball from the partner, turns and beats the defender with a feint
const passFace: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 30, 120, 50, 'c'], ['zone', 40, 30, 5, 50], ['zone', 155, 30, 5, 50]],
  players: [
    P('p', 'r', [[34, 55]], 'P'),
    P('a', 'r', [[44, 48], [76, 52], [[88, 50], [100, 54]], [[112, 66], [157, 64]]], 'A'),
    P('d', 'w', [[154, 55], [128, 54], [118, 56], [124, 62]], 'D'),
    Q('r3', 'r', [34, 66]), Q('w2', 'w', [168, 48]), Q('w3', 'w', [168, 62]),
  ],
  balls: [['p', 'a', 'a', 'a']],
}

const passSide: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50, 'c'], ZL, ZR],
  players: [
    P('p', 'r', [[48, 55]], 'P'),
    P('a', 'r', [[100, 84], [96, 62], [[102, 52], [110, 44]], [[126, 40], [141, 42]]], 'A'),
    P('d', 'w', [[136, 55], [120, 58], [112, 52], [124, 48]], 'D'),
    Q('r3', 'r', [48, 66]), Q('r4', 'r', [108, 90]), Q('w2', 'w', [152, 46]), Q('w3', 'w', [152, 62]),
  ],
  balls: [['p', 'a', 'a', 'a']],
}

const passBack: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50, 'c'], ZL, ZR],
  players: [
    P('p', 'r', [[48, 55]], 'P'),
    P('a', 'r', [[100, 55], [[108, 50], [96, 56], [84, 56]], [[90, 64], [106, 70]], [[124, 68], [141, 62]]], 'A'),
    P('d', 'w', [[110, 55], [102, 56], [104, 64], [118, 64]], 'D'),
    Q('r3', 'r', [48, 66]), Q('w2', 'w', [152, 46]), Q('w3', 'w', [152, 62]),
  ],
  balls: [['p', 'a', 'a', 'a']],
}

// 2×2 take the line – 15–20 × 12–15 m; a pair attacks the zone on the other pair's end line
const twoTwoLine: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 25, 120, 60, 'c'], ['zone', 40, 25, 5, 60], ['zone', 155, 25, 5, 60]],
  players: [
    P('a1', 'r', [[48, 42], [[66, 42], [84, 46]], [92, 48], [96, 44]], '1'),
    P('a2', 'r', [[48, 68], [[68, 70], [90, 74]], [[108, 76], [128, 72]], [157, 68]], '2'),
    P('d1', 'w', [[150, 42], [126, 46], [116, 50], [112, 50]]),
    P('d2', 'w', [[150, 68], [126, 64], [118, 70], [138, 70]]),
    Q('r3', 'r', [32, 50]), Q('r4', 'r', [32, 60]), Q('w3', 'w', [168, 50]), Q('w4', 'w', [168, 60]),
  ],
  balls: [['a1', 'a1', 'a2', 'a2']],
}

// 2 defenders × 1 attacker, take the line – the pair works together to win the ball and counter into the attacker's zone
const twoDefLine: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 28, 88, 54, 'c'], ['zone', 56, 28, 5, 54], ['zone', 139, 28, 5, 54]],
  players: [
    P('a', 'r', [[62, 55], [[78, 54], [92, 56]], [98, 58], [104, 62]], 'A'),
    P('d1', 'w', [[136, 44], [112, 50], [100, 56], [[86, 58], [72, 54]]]),
    P('d2', 'w', [[136, 66], [116, 64], [106, 66], [[86, 72], [70, 72]]]),
    Q('r2', 'r', [48, 48]), Q('r3', 'r', [48, 60]), Q('w3', 'w', [152, 55]),
  ],
  balls: [['a', 'a', 'd1', 'd2']],
}

// 2×1 into 3 small goals – here 2 defenders against 1 attacker: defenders have 2 goals to protect, the attacker 1; 2 m no-go zones in front
const def3Goals: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 28, 88, 54], ['mini', 56, 55, 'r', 9], ['mini', 144, 40, 'l', 8], ['mini', 144, 70, 'l', 8], ['zone', 56, 28, 10, 54], ['zone', 134, 28, 10, 54]],
  players: [
    P('a', 'r', [[68, 55], [[82, 54], [96, 52]], [102, 50], [106, 52]], 'A'),
    P('d1', 'w', [[130, 44], [114, 48], [104, 50], [[92, 52], [80, 54]]]),
    P('d2', 'w', [[130, 66], [116, 62], [108, 60], [102, 66]]),
    Q('r2', 'r', [48, 44]), Q('w3', 'w', [152, 55]),
  ],
  balls: [['a', 'a', 'd1', [56, 55, 1]]],
}

// 2 + GK × 2 – 25–30 × 12–15 m; both pairs start together, the defenders close down and press, the attackers combine and shoot
const pressGk: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 30, 25, 140, 60], ['mini', 30, 40, 'r', 8], ['mini', 30, 70, 'r', 8], ['goal', 170, 55, 'l', 22]],
  players: [
    P('a1', 'r', [[38, 44], [[56, 44], [74, 46]], [86, 46], [[100, 40], [112, 40]]], '1'),
    P('a2', 'r', [[38, 66], [[58, 68], [80, 68]], [[100, 70], [122, 64]], [130, 60]], '2'),
    P('d1', 'w', [[106, 44], [96, 46], [92, 48], [110, 48]]),
    P('d2', 'w', [[106, 66], [96, 64], [104, 66], [116, 62]]),
    P('k', 'k', [[166, 55], [166, 55], [164, 57], [166, 50]]),
  ],
  balls: [['a1', 'a1', 'a2', [170, 48, 1]]],
}

// 1×1 into 2 small goals with a pass – the attacker in the middle makes two movements to get free, receives, beats the defender and shoots
const passShoot: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50], ['mini', 56, 55, 'r', 9], ['mini', 144, 55, 'l', 9], ['zone', 130, 30, 14, 50]],
  players: [
    P('p', 'r', [[48, 55]], 'P'),
    P('a', 'r', [[100, 55], [[108, 48], [96, 46], [86, 50]], [[96, 64], [110, 68]], [118, 64]], 'A'),
    P('d', 'w', [[110, 56], [104, 54], [106, 62], [116, 60]], 'D'),
    Q('r3', 'r', [48, 66]), Q('w2', 'w', [152, 44]),
  ],
  balls: [['p', 'a', 'a', [144, 56, 1]]],
}

// 2×1 into 3 small goals – 2 attackers against 1 defender: attackers score in the defender's goal, not from inside its 3 m zone
const att3Goals: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 56, 30, 88, 50], ['mini', 56, 40, 'r', 8], ['mini', 56, 70, 'r', 8], ['mini', 144, 55, 'l', 9], ['zone', 130, 30, 14, 50]],
  players: [
    P('a1', 'r', [[66, 44], [[80, 44], [94, 46]], [100, 46], [104, 44]], '1'),
    P('a2', 'r', [[66, 66], [[82, 68], [98, 70]], [[110, 68], [118, 62]], [120, 60]], '2'),
    P('d', 'w', [[126, 55], [114, 52], [108, 48], [114, 56]], 'D'),
    Q('r3', 'r', [48, 50]), Q('r4', 'r', [48, 60]), Q('w2', 'w', [152, 66]),
  ],
  balls: [['a1', 'a1', 'a2', [144, 56, 1]]],
}

// 2 × goalkeeper – one player plays the ball wide and runs at goal; the winger takes it on the run and crosses; the first one finishes
const cross: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 20, 130, 70], ['mini', 40, 44, 'r', 8], ['mini', 40, 66, 'r', 8], ['goal', 170, 55, 'l', 22]],
  players: [
    P('a1', 'r', [[48, 55], [56, 55], [[90, 56], [124, 56]], [[144, 54], [152, 50]]], '1'),
    P('a2', 'r', [[70, 26], [[90, 24], [104, 26]], [[124, 26], [140, 28]], [142, 28]], '2'),
    P('k', 'k', [[166, 55], [166, 55], [164, 50], [166, 47]]),
    Q('r3', 'r', [32, 50]), Q('r4', 'r', [32, 60]),
  ],
  balls: [['a1', 'a2', 'a2', [152, 50, 2]]],
}

// 2×1 + goalkeeper – two attackers from the small goal, one defender in the middle, a keeper in the 5×2 m goal
const twoOneGk: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 40, 28, 122, 54], ['mini', 40, 55, 'r', 9], ['goal', 162, 55, 'l', 22]],
  players: [
    P('a1', 'r', [[48, 48], [[66, 46], [84, 48]], [92, 46], [96, 44]], '1'),
    P('a2', 'r', [[48, 62], [[68, 64], [88, 66]], [[104, 68], [120, 64]], [126, 62]], '2'),
    P('d', 'w', [[104, 55], [100, 52], [96, 50], [104, 56]], 'D'),
    P('k', 'k', [[158, 55], [158, 55], [157, 58], [159, 51]]),
  ],
  balls: [['a1', 'a1', 'a2', [162, 50, 1]]],
}

// Heading at a cone – self-toss and head down and forward to hit the cone in the middle of a 10 × 5 m field
const headCone: BookScene = {
  steps: 3, speed: 1.3,
  field: [['area', 60, 30, 80, 20], ['cone', 100, 40, 'r'], ['area', 60, 62, 80, 20], ['cone', 100, 72, 'r']],
  players: [P('a', 'r', [[56, 40]]), P('b', 'w', [[144, 40]]), P('c', 'r', [[56, 72]]), P('d', 'w', [[144, 72]])],
  balls: [['a', [100, 40], 'b'], ['d', [100, 72], 'c']],
}

// Heading back to the partner's hands – one throws, the other heads it back; variants in a jump, after a bounce, after juggling
const headPass: BookScene = {
  steps: 3, speed: 1.2,
  field: [['area', 50, 30, 30, 30], ['area', 120, 30, 30, 30], ['area', 50, 66, 30, 30], ['area', 120, 66, 30, 30]],
  players: [
    P('a1', 'r', [[50, 45]]), P('b1', 'w', [[80, 45]]), P('a2', 'r', [[120, 45]]), P('b2', 'w', [[150, 45]]),
    P('a3', 'r', [[50, 81]]), P('b3', 'w', [[80, 81]]), P('a4', 'r', [[120, 81]]), P('b4', 'w', [[150, 81]]),
  ],
  balls: [['a1', [79, 45, 2], 'a1'], ['a2', [149, 45, 2], 'a2'], ['a3', [79, 81, 2], 'a3'], ['a4', [149, 81, 2], 'a4']],
}

// Heading in threes – the two outside players throw in turn to the one in the middle, who heads it back into their hands
const headThree: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 50, 40, 100, 30]],
  players: [P('a', 'r', [[50, 55]], 'A'), P('c', 'w', [[100, 55], [96, 55], [96, 55], [104, 55], [104, 55]], 'C'), P('b', 'r', [[150, 55]], 'B')],
  balls: [['a', [95, 55, 2], 'a', 'b', [105, 55, 2]]],
}

// 2×1 heading – field split into 3 zones; one throws, the other heads it back over the defender in the middle zone; 2 small goals for the defender
const headTwoOne: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 50, 30, 100, 50], ['line', 83, 30, 83, 80, true], ['line', 117, 30, 117, 80, true], ['mini', 100, 30, 'd', 8], ['mini', 100, 80, 'u', 8]],
  players: [P('a', 'r', [[66, 55]], 'A'), P('d', 'w', [[100, 55], [104, 52], [98, 56], [102, 58]], 'D'), P('b', 'r', [[134, 55], [134, 52], [134, 52], [134, 56]], 'B')],
  balls: [['a', [134, 52, 2], [66, 55], 'a']],
}

export const RFS69_C: Record<string, BookScene> = {
  'r69-43': accuracy, 'r69-44': twoOneTasks, 'r69-45': twoOne, 'r69-46': twoTwoTasks, 'r69-47': fourGoals(false), 'r69-48': receive,
  'r69-50': fourTwo, 'r69-51': tennis(false), 'r69-52': tennis(true), 'r69-53': passFace, 'r69-54': passSide, 'r69-55': passBack,
  'r69-57': twoTwoLine, 'r69-58': twoDefLine, 'r69-60': def3Goals, 'r69-62': pressGk, 'r69-63': passShoot, 'r69-64': att3Goals,
  'r69-65': fourGoals(true), 'r69-66': cross, 'r69-67': twoOneGk, 'r69-68': headCone, 'r69-69': headPass, 'r69-70': headThree,
  'r69-71': headTwoOne, 'r69-72': headTennis(false), 'r69-73': headTennis(true),
}
