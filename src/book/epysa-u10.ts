import type { BookScene, Item } from './scene'

/** EPYSA "Under 10 – Ten week plan". Goals at the top/bottom as in the book. */

// W1 · Free dribble & 1v1 moves – moves on the coach's call
const freeMoves: BookScene = {
  steps: 3, speed: 1.4,
  field: [['area', 24, 6, 152, 98, 'co'], ['cone', 100, 104, 'o'], ['cone', 24, 55, 'o'], ['cone', 176, 55, 'o']],
  players: [
    { id: 'a', t: 'w', ball: true, p: [[44, 14], [[46, 22], [40, 30]], [[48, 36], [44, 46]]] },
    { id: 'b', t: 'r', ball: true, p: [[84, 26], [[96, 22], [104, 16]], [[110, 26], [118, 34]]] },
    { id: 'c', t: 'r', ball: true, p: [[136, 14], [[130, 22], [138, 28]], [[132, 36], [140, 44]]] },
    { id: 'd', t: 'w', ball: true, p: [[96, 54], [[86, 50], [78, 44]], [[70, 48], [64, 42]]] },
    { id: 'e', t: 'r', ball: true, p: [[38, 82], [[40, 72], [34, 64]], [[42, 58], [38, 50]]] },
    { id: 'f', t: 'w', ball: true, p: [[158, 84], [[150, 80], [154, 70]], [[146, 66], [150, 58]]] },
    { id: 'g', t: 'w', ball: true, p: [[110, 76], [[120, 70], [116, 62]], [[126, 58], [122, 50]]] },
  ],
}

// W1 · 4v4 end-zone soccer – score by dribbling into the end zone
const endzone: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'mo'], ['line', 24, 16, 176, 16], ['zone', 24, 6, 152, 10, 'rgba(255,255,255,.12)'], ['cones', 'y', [24, 16, 100, 16, 176, 16, 24, 94, 100, 94, 176, 94]], ['line', 24, 94, 176, 94], ['zone', 24, 94, 152, 10, 'rgba(255,255,255,.12)']],
  players: [
    { id: 'r1', t: 'r', p: [[84, 88], [84, 88], [86, 80]] },
    { id: 'r2', t: 'r', p: [[100, 34], [100, 34], [[120, 36], [138, 52]], [140, 34], [142, 10]] },
    { id: 'r3', t: 'r', p: [[54, 48], [56, 44]] },
    { id: 'r4', t: 'r', p: [[148, 62], [148, 62], [150, 56]] },
    { id: 'w1', t: 'w', p: [[76, 60], [80, 66]] },
    { id: 'w2', t: 'w', p: [[86, 34], [92, 36], [110, 44], [128, 40], [136, 20]] },
    { id: 'w3', t: 'w', p: [[114, 32], [114, 32], [126, 44], [134, 40]] },
    { id: 'w4', t: 'w', p: [[60, 34]] },
  ],
  balls: [['r1', 'r1', 'r2', 'r2', 'r2']],
}

// W1 · 5v5 – one big goal (with GK) against three small cone goals
const fiveTwoGoals: BookScene = {
  steps: 4, speed: 1.15,
  field: [['line', 16, 6, 184, 6], ['line', 16, 6, 16, 104], ['line', 184, 6, 184, 104], ['goal', 100, 6, 'd', 24], ['line', 70, 6, 70, 26], ['line', 130, 6, 130, 26], ['line', 70, 26, 130, 26], ['cones', 'y', [30, 104, 40, 104, 95, 104, 105, 104, 160, 104, 170, 104]]],
  players: [
    { id: 'k', t: 'k', p: [[100, 12], [100, 12], [104, 12], [94, 12]] },
    { id: 'r1', t: 'r', p: [[50, 52], [76, 40], [86, 34]] },
    { id: 'r2', t: 'r', p: [[96, 44], [96, 44], [100, 40]] },
    { id: 'r3', t: 'r', p: [[78, 66], [78, 66], [86, 60]] },
    { id: 'r4', t: 'r', p: [[150, 74], [150, 74], [[160, 62], [152, 48]], [138, 30]] },
    { id: 'r5', t: 'r', p: [[110, 92], [104, 90]] },
    { id: 'w1', t: 'w', p: [[60, 54], [70, 50]] },
    { id: 'w2', t: 'w', p: [[114, 46], [114, 48]] },
    { id: 'w3', t: 'w', p: [[66, 70], [72, 70]] },
    { id: 'w4', t: 'w', p: [[136, 64], [140, 60], [144, 54]] },
    { id: 'w5', t: 'w', p: [[88, 80], [92, 76]] },
  ],
  balls: [['r5', 'r5', 'r4', 'r4', [96, 7, 1]]],
}

// W2 · 2v0 combination play – dribble at a wall-man, then take-over / overlap / give-and-go
const twoV0: BookScene = {
  steps: 5, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'mo'], ['pole', 100, 50], ['ball', 30, 98], ['ball', 170, 98], ['ball', 30, 12]],
  players: [
    { id: 'a', t: 'r', p: [[36, 92], [[50, 84], [66, 72]], [78, 62], [[86, 36], [92, 8]], [92, 8]] },
    { id: 'b', t: 'r', p: [[166, 92], [158, 80], [150, 66], [140, 50], [[136, 30], [140, 10]]] },
    { id: 'a2', t: 'r', p: [[24, 100]] },
    { id: 'b2', t: 'r', p: [[176, 100]] },
    { id: 'c', t: 'w', p: [[24, 10]] },
    { id: 'd', t: 'w', p: [[176, 10]] },
  ],
  balls: [['a', 'a', 'a', 'b', 'b']],
}

// W2 + U12 W1 · 3v2 to two dribble gates on each end line
const gates2 = (y: number): Item => ['cones', 'y', [44, y, 56, y, 144, y, 156, y]]
const threeV2: BookScene = {
  steps: 5, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'mo'], gates2(6), gates2(104)],
  players: [
    { id: 'a', t: 'r', p: [[132, 86], [[124, 80], [114, 74]], [112, 72]] },
    { id: 'b', t: 'r', p: [[56, 82], [[46, 74], [40, 62]], [42, 54], [[46, 36], [48, 20]], [50, 6]] },
    { id: 'c', t: 'r', p: [[150, 56], [148, 50]] },
    { id: 'd1', t: 'w', p: [[92, 56], [96, 60], [86, 54], [70, 34]] },
    { id: 'd2', t: 'w', p: [[110, 38], [108, 42], [104, 40]] },
  ],
  balls: [['a', 'a', 'b', 'b', 'b']],
}

// W2 · 5v5 to goal – commit a defender, then pass into the space in front of the teammate
const fiveGoal: BookScene = {
  steps: 4, speed: 1.15,
  field: [['area', 16, 6, 168, 98, 'co'], ['goal', 100, 6, 'd', 18], ['goal', 100, 104, 'u', 18]],
  players: [
    { id: 'r1', t: 'r', p: [[110, 92], [110, 92], [112, 88]] },
    { id: 'r2', t: 'r', p: [[96, 58], [100, 54]] },
    { id: 'r3', t: 'r', p: [[166, 68], [[160, 54], [146, 46]], [134, 40], [126, 32]] },
    { id: 'r4', t: 'r', p: [[56, 40], [56, 40], [70, 28], [82, 22]] },
    { id: 'r5', t: 'r', p: [[30, 60]] },
    { id: 'w1', t: 'w', p: [[84, 52], [88, 54]] },
    { id: 'w2', t: 'w', p: [[130, 32], [138, 40], [126, 36]] },
    { id: 'w3', t: 'w', p: [[78, 70], [82, 72]] },
    { id: 'w4', t: 'w', p: [[102, 30], [100, 32]] },
    { id: 'w5', t: 'w', p: [[60, 52], [64, 46]] },
  ],
  balls: [['r1', 'r3', 'r3', 'r4']],
}

// W3 · Sequential passing – groups of 4, pass 1-2-3-4 and move to new space
const sequential: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'mo']],
  players: [
    { id: 'p1', t: 'r', l: '1', p: [[140, 18], [140, 18], [[120, 14], [96, 12]]] },
    { id: 'p2', t: 'r', l: '2', p: [[34, 40], [34, 40], [34, 40], [34, 30]] },
    { id: 'p3', t: 'r', l: '3', p: [[74, 94], [74, 94], [74, 94], [74, 94], [106, 92]] },
    { id: 'p4', t: 'r', l: '4', p: [[166, 40], [166, 40], [166, 40], [[160, 48], [154, 50]], [152, 50]] },
  ],
  balls: [['p1', 'p2', 'p3', 'p4', 'p4']],
}

// W3 · 3v3 + 1 to one goal each – score by passing into the goal
const threePlusOne: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 100, 6, 'd', 16], ['goal', 100, 104, 'u', 16]],
  players: [
    { id: 'r1', t: 'r', p: [[128, 88], [128, 88], [128, 88]] },
    { id: 'r2', t: 'r', p: [[92, 56], [96, 54], [96, 54], [98, 40]] },
    { id: 'n', t: 'b', p: [[150, 46], [140, 50], [140, 50]] },
    { id: 'r3', t: 'r', p: [[56, 80]] },
    { id: 'w1', t: 'w', p: [[116, 30], [116, 30], [128, 40], [134, 44]] },
    { id: 'w2', t: 'w', p: [[114, 66], [112, 68]] },
    { id: 'w3', t: 'w', p: [[60, 44], [64, 44]] },
  ],
  balls: [['r1', 'n', 'r2', 'r2', [100, 7, 1]]],
}

// W3 + W9 · 4v4 – red to one big goal, white to two counter goals of cones
const counterGoals: BookScene = {
  steps: 5, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 80, 104, 'u', 16], ['cones', 'o', [24, 14, 24, 26, 176, 14, 176, 26]], ['cones', 'y', [24, 6, 176, 6]]],
  players: [
    { id: 'r1', t: 'r', p: [[60, 14], [60, 14], [64, 18]] },
    { id: 'r2', t: 'r', p: [[150, 26], [[148, 34], [138, 40]], [148, 56], [152, 60]] },
    { id: 'r3', t: 'r', p: [[160, 62], [160, 62], [160, 62]] },
    { id: 'r4', t: 'r', p: [[40, 54]] },
    { id: 'w1', t: 'w', p: [[70, 26], [74, 26]] },
    { id: 'w2', t: 'w', p: [[120, 46], [[130, 40], [142, 34]], [146, 40]] },
    { id: 'w3', t: 'w', p: [[74, 54], [80, 56]] },
    { id: 'w4', t: 'w', p: [[98, 80], [[110, 66], [126, 56]], [132, 60]] },
  ],
  balls: [['r1', 'r2', 'r2', 'r3', [80, 103, 1]]],
}

// W4 · Stay & play – A and B support across, C plays forward to D, A and B move up to support D
const stayPlay: BookScene = {
  steps: 5, speed: 1.2,
  field: [['area', 24, 6, 152, 98]],
  players: [
    { id: 'A', t: 'r', l: 'A', p: [[60, 70], [60, 70], [60, 70], [60, 70], [[70, 50], [86, 26]]] },
    { id: 'B', t: 'r', l: 'B', p: [[126, 68], [126, 68], [126, 68], [126, 68], [[120, 50], [112, 26]]] },
    { id: 'C', t: 'r', l: 'C', p: [[100, 92], [100, 92], [96, 88]] },
    { id: 'D', t: 'r', l: 'D', p: [[100, 14]] },
  ],
  balls: [['A', 'B', 'C', 'D', 'D']],
}

// W4 · 3v3 knock over the cone – two tall cones on each end line are the targets
const knockCones: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'mo'], ['pole', 70, 6], ['pole', 130, 6], ['pole', 70, 104], ['pole', 130, 104]],
  players: [
    { id: 'r1', t: 'r', p: [[110, 94], [110, 94], [110, 94]] },
    { id: 'r2', t: 'r', p: [[108, 50], [112, 54], [112, 54]] },
    { id: 'r3', t: 'r', p: [[40, 62], [40, 62], [40, 62], [[46, 54], [52, 40]], [60, 32]] },
    { id: 'w1', t: 'w', p: [[86, 44], [92, 46], [80, 52], [64, 52]] },
    { id: 'w2', t: 'w', p: [[124, 46], [120, 48]] },
    { id: 'w3', t: 'w', p: [[94, 76], [100, 72]] },
  ],
  balls: [['r1', 'r2', 'r3', 'r3', [70, 8, 1]]],
}

// W4 · 4v4 to one goal – the goal is worth as many points as passes before it
const fourPasses: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 100, 6, 'd', 16], ['goal', 90, 104, 'u', 16]],
  players: [
    { id: 'r1', t: 'r', p: [[60, 14], [60, 14], [62, 18]] },
    { id: 'r2', t: 'r', p: [[150, 22], [150, 22], [[148, 30], [138, 38]], [142, 42]] },
    { id: 'r3', t: 'r', p: [[110, 50], [118, 42], [124, 36], [130, 40]] },
    { id: 'r4', t: 'r', p: [[160, 62], [160, 62], [160, 62], [158, 58]] },
    { id: 'w1', t: 'w', p: [[74, 26], [78, 26]] },
    { id: 'w2', t: 'w', p: [[46, 50], [48, 50]] },
    { id: 'w3', t: 'w', p: [[86, 82], [[100, 70], [116, 58]], [120, 56]] },
    { id: 'w4', t: 'w', p: [[96, 56], [100, 56], [110, 50]] },
  ],
  balls: [['r1', 'r2', 'r2', 'r4', [90, 103, 1]]],
}

// W5 · Numbered shooting – a goal on each side; on your number, finish into the nearest or farthest goal
const numbered: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'co'], ['mini', 100, 6, 'd', 12], ['mini', 100, 104, 'u', 12], ['mini', 24, 55, 'r', 12], ['mini', 176, 55, 'l', 12]],
  players: [
    { id: 'a', t: 'w', l: '2', ball: true, p: [[44, 14], [[52, 22], [60, 28]], [[66, 34], [74, 36]], [80, 38]] },
    { id: 'b', t: 'r', l: '2', ball: true, p: [[96, 30], [[106, 26], [114, 20]], [[122, 26], [128, 18]], [134, 22]] },
    { id: 'c', t: 'r', l: '1', p: [[76, 70], [80, 74], [84, 78]] },
    { id: 'd', t: 'w', l: '1', p: [[132, 40], [[140, 44], [148, 50]], [152, 52]] },
    { id: 'e', t: 'r', l: '3', ball: true, p: [[150, 86], [[142, 80], [136, 84]], [[128, 88], [120, 84]], [114, 86]] },
    { id: 'f', t: 'w', l: '3', ball: true, p: [[46, 84], [[54, 80], [60, 86]], [[66, 92], [72, 88]], [78, 90]] },
  ],
  balls: [['c', 'c', [100, 103, 1]], ['d', 'd', [175, 55, 1]]],
}

// W5 · 2v2 continuous with goalkeepers – the ball always restarts from the GK of the team in possession
const twoV2Gk: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 100, 6, 'd', 18], ['goal', 100, 104, 'u', 18], ['ball', 112, 8], ['ball', 116, 9], ['ball', 88, 102]],
  players: [
    { id: 'k1', t: 'k', p: [[100, 12], [100, 12], [100, 12], [100, 12], [92, 12]] },
    { id: 'k2', t: 'k', p: [[100, 98]] },
    { id: 'r1', t: 'r', p: [[40, 56], [40, 56], [[52, 48], [64, 38]], [74, 30]] },
    { id: 'r2', t: 'r', p: [[132, 66], [130, 62], [128, 58]] },
    { id: 'w1', t: 'w', p: [[78, 36], [74, 40], [70, 40], [78, 30]] },
    { id: 'w2', t: 'w', p: [[130, 24], [[124, 34], [112, 46]], [108, 50]] },
  ],
  balls: [['k2', 'r1', 'r1', 'r1', [94, 7, 1]]],
}

// W5 · 5v5 to goal with goalkeepers (40×50 yd)
const fiveGk: BookScene = {
  steps: 4, speed: 1.15,
  field: [['area', 16, 6, 168, 98, 'co'], ['goal', 100, 104, 'u', 22], ['line', 66, 104, 66, 88], ['line', 134, 104, 134, 88], ['line', 66, 88, 134, 88], ['goal', 100, 6, 'd', 22]],
  players: [
    { id: 'k', t: 'k', p: [[100, 98], [100, 98], [100, 98], [106, 98]] },
    { id: 'k2', t: 'k', p: [[100, 12]] },
    { id: 'r1', t: 'r', p: [[124, 34], [124, 34], [124, 34]] },
    { id: 'r2', t: 'r', p: [[40, 60], [[44, 56], [50, 60]], [52, 62]] },
    { id: 'r3', t: 'r', p: [[64, 18]] }, { id: 'r4', t: 'r', p: [[150, 20]] }, { id: 'r5', t: 'r', p: [[146, 60]] },
    { id: 'w1', t: 'w', p: [[112, 22]] }, { id: 'w2', t: 'w', p: [[52, 24]] }, { id: 'w3', t: 'w', p: [[106, 54], [100, 58], [92, 66]] },
    { id: 'w4', t: 'w', p: [[46, 72], [48, 68]] }, { id: 'w5', t: 'w', p: [[136, 72]] },
  ],
  balls: [['r1', 'r2', 'r2', [112, 103, 1]]],
}

// W6 · Partner defending technique – 1v1 against the dribble, 1v1 no turn, 1v2 intercept the pass
const partnerDef: BookScene = {
  steps: 4, speed: 1.25,
  field: [['line', 16, 104, 184, 104], ['line', 16, 6, 184, 6], ['cones', 'o', [30, 30, 60, 28, 120, 28, 170, 30, 50, 100, 140, 100]]],
  players: [
    // 1v1 – the defender closes down fast, then short steps
    { id: 'a1', t: 'w', ball: true, p: [[40, 92], [44, 80], [[38, 70], [44, 60]], [48, 52]] },
    { id: 'd1', t: 'r', p: [[58, 34], [52, 58], [48, 64], [50, 58]] },
    // 1v1 – no turn: the defender stays tight behind
    { id: 'a2', t: 'w', p: [[100, 40], [100, 40], [94, 46], [100, 48]] },
    { id: 'd2', t: 'r', p: [[108, 50], [104, 48], [98, 52], [104, 54]] },
    { id: 's2', t: 'w', p: [[90, 16]] },
    // 1v2 – the defender reads the pass and intercepts
    { id: 'a3', t: 'w', p: [[148, 82], [148, 82]] },
    { id: 'b3', t: 'w', p: [[156, 42], [156, 42]] },
    { id: 'd3', t: 'r', p: [[132, 62], [138, 64], [[146, 62], [152, 56]], [154, 50]] },
  ],
  balls: [['s2', 'a2', 'a2', 'a2'], ['a3', 'a3', 'd3', 'd3']],
}

// W6 · 2v2 to four corner goals – the team not receiving the coach's ball runs on to defend
const twoV2Def: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 24, 6, 152, 98], ['cones', 'r', [30, 6, 42, 6, 158, 6, 170, 6]], ['mini', 36, 104, 'u', 12], ['mini', 164, 104, 'u', 12], ['ball', 14, 30], ['ball', 18, 34]],
  players: [
    { id: 'co', t: 'c', l: 'T', p: [[16, 40]] },
    { id: 'w1', t: 'w', p: [[90, 24], [88, 30], [80, 38], [66, 58]] },
    { id: 'w2', t: 'w', p: [[120, 22], [120, 22], [122, 26], [128, 32]] },
    { id: 'r1', t: 'r', p: [[84, 96], [86, 62], [84, 48], [74, 54]] },
    { id: 'r2', t: 'r', p: [[124, 96], [116, 70], [112, 56], [116, 50]] },
  ],
  balls: [['co', 'w1', 'w1', 'w1', [36, 102, 1]]],
}

// W6 · 4v4 – red defends the big goal, white defends two cone goals
const fourDef: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 100, 104, 'u', 22], ['cones', 'o', [24, 12, 24, 24, 176, 12, 176, 24]]],
  players: [
    { id: 'k', t: 'k', p: [[100, 98]] },
    { id: 'w1', t: 'w', p: [[64, 14], [64, 14], [66, 18]] },
    { id: 'w2', t: 'w', p: [[156, 22], [[154, 30], [146, 36]], [150, 52], [152, 56]] },
    { id: 'w3', t: 'w', p: [[160, 64], [160, 64], [160, 64], [158, 60]] },
    { id: 'w4', t: 'w', p: [[38, 60]] },
    { id: 'r1', t: 'r', p: [[62, 28], [66, 30]] },
    { id: 'r2', t: 'r', p: [[108, 48], [118, 40], [128, 34], [134, 38]] },
    { id: 'r3', t: 'r', p: [[124, 70], [134, 62], [146, 58], [150, 62]] },
    { id: 'r4', t: 'r', p: [[56, 64], [60, 62]] },
  ],
  balls: [['w1', 'w2', 'w2', 'w3']],
}

// W7 · 4v2 possession & penetration – four outside, two defenders inside who may not leave the square
const fourV2: BookScene = {
  steps: 5, speed: 1.1,
  field: [['area', 64, 14, 72, 82, 'co']],
  players: [
    { id: 'n', t: 'w', p: [[100, 8]] }, { id: 's', t: 'w', p: [[100, 102]] },
    { id: 'w', t: 'w', p: [[56, 66]] }, { id: 'e', t: 'w', p: [[144, 48]] },
    { id: 'd1', t: 'r', p: [[86, 74], [92, 66], [96, 58], [104, 54], [108, 50]] },
    { id: 'd2', t: 'r', p: [[108, 44], [108, 44], [112, 36], [116, 32], [122, 40]] },
  ],
  balls: [['w', 'n', 'e', 's', 'w']],
}

// W7 · 3v3 to one goal of tall cones (5 yd) on each end line – passes on the ground only
const threeCones: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'mo'], ['pole', 90, 6], ['pole', 110, 6], ['pole', 90, 104], ['pole', 110, 104]],
  players: [
    { id: 'r1', t: 'r', p: [[70, 88], [70, 88], [72, 84]] },
    { id: 'r2', t: 'r', p: [[120, 52], [[132, 56], [146, 60]], [148, 58], [[140, 40], [116, 26]], [110, 22]] },
    { id: 'r3', t: 'r', p: [[52, 40], [58, 34], [74, 28]] },
    { id: 'w1', t: 'w', p: [[104, 40], [108, 44], [128, 50], [124, 36]] },
    { id: 'w2', t: 'w', p: [[92, 64], [96, 66]] },
    { id: 'w3', t: 'w', p: [[74, 26], [80, 24], [86, 22], [96, 20]] },
  ],
  balls: [['r1', 'r1', 'r2', 'r2', [100, 7, 1]]],
}

// W7 · 5v5 to one goal each – the second defender covers the first
const fiveCover: BookScene = {
  steps: 4, speed: 1.15,
  field: [['area', 16, 6, 168, 98, 'co'], ['goal', 100, 6, 'd', 22], ['goal', 100, 104, 'u', 22]],
  players: [
    { id: 'k', t: 'k', p: [[100, 12], [100, 12], [100, 12]] },
    { id: 'k2', t: 'k', p: [[100, 98]] },
    { id: 'w1', t: 'w', p: [[40, 40], [40, 40], [44, 44]] },
    { id: 'w2', t: 'w', p: [[146, 30]] }, { id: 'w3', t: 'w', p: [[70, 70]] }, { id: 'w4', t: 'w', p: [[34, 58]] }, { id: 'w5', t: 'w', p: [[110, 66]] },
    { id: 'r1', t: 'r', p: [[100, 50], [100, 50], [[84, 46], [62, 44]], [54, 46]] },
    { id: 'r2', t: 'r', p: [[160, 48], [160, 48], [[140, 46], [120, 50]], [104, 56]] },
    { id: 'r3', t: 'r', p: [[54, 64], [52, 62]] }, { id: 'r4', t: 'r', p: [[96, 76], [94, 72]] }, { id: 'r5', t: 'r', p: [[124, 28], [120, 30]] },
  ],
  balls: [['k', 'k', 'w1', 'w1']],
}

// W8 · Goalkeepers among field players – on eye contact the player takes a touch and shoots at the GK
const gkMix: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'co']],
  players: [
    { id: 'k1', t: 'k', p: [[60, 34], [60, 34], [60, 34], [58, 32], [58, 32]] },
    { id: 'k2', t: 'k', p: [[118, 48], [118, 48], [118, 48], [118, 48], [116, 46]] },
    { id: 'k3', t: 'k', p: [[82, 76], [82, 76], [88, 74], [94, 74]] },
    { id: 'a', t: 'r', p: [[76, 60], [76, 60], [72, 56]] },
    { id: 'b', t: 'w', p: [[42, 92], [42, 92], [42, 92]] },
    { id: 'c', t: 'w', p: [[44, 14]] },
    { id: 'd', t: 'r', p: [[104, 14], [104, 14], [110, 18]] },
    { id: 'e', t: 'w', p: [[150, 80], [150, 80]] },
    { id: 'f', t: 'w', p: [[150, 26]] },
  ],
  balls: [['a', 'a', 'a', [60, 37, 1], 'k1'], ['b', 'b', [84, 74], 'k3', 'k3'], ['d', 'd', 'd', 'd', [118, 45, 1]]],
}

// W8 · 4v4 to four goals – each team's GK defends two goals
const fourGoalsGk: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 44, 6, 'd', 16], ['goal', 156, 6, 'd', 16], ['goal', 44, 104, 'u', 16], ['goal', 156, 104, 'u', 16]],
  players: [
    { id: 'k', t: 'k', p: [[100, 12], [96, 12], [70, 12], [52, 12]] },
    { id: 'k2', t: 'k', p: [[100, 98]] },
    { id: 'r1', t: 'r', p: [[146, 72], [146, 72], [146, 72]] },
    { id: 'r2', t: 'r', p: [[46, 50], [46, 50], [46, 48]] },
    { id: 'r3', t: 'r', p: [[60, 92]] },
    { id: 'w1', t: 'w', p: [[80, 44], [80, 44], [72, 44]] },
    { id: 'w2', t: 'w', p: [[130, 30]] },
    { id: 'w3', t: 'w', p: [[154, 70], [150, 70]] },
  ],
  balls: [['r1', 'r2', 'r2', [46, 7, 1]]],
}

// W8 · 4v4 to one big goal each, with GKs
const fourBigGk: BookScene = {
  steps: 5, speed: 1.15,
  field: [['area', 24, 6, 152, 98, 'co'], ['goal', 100, 6, 'd', 22], ['goal', 90, 104, 'u', 22]],
  players: [
    { id: 'k', t: 'k', p: [[90, 98], [90, 98], [90, 98], [90, 98], [80, 98]] },
    { id: 'k2', t: 'k', p: [[100, 12]] },
    { id: 'r1', t: 'r', p: [[60, 14], [60, 14], [62, 18]] },
    { id: 'r2', t: 'r', p: [[150, 22], [150, 22], [[148, 30], [138, 38]], [142, 42]] },
    { id: 'r3', t: 'r', p: [[40, 58]] },
    { id: 'r4', t: 'r', p: [[160, 62], [160, 62], [160, 62], [158, 58]] },
    { id: 'w1', t: 'w', p: [[74, 26], [78, 26]] },
    { id: 'w2', t: 'w', p: [[56, 48], [58, 48]] },
    { id: 'w3', t: 'w', p: [[86, 82], [[100, 70], [116, 58]], [120, 56]] },
    { id: 'w4', t: 'w', p: [[110, 48], [116, 44], [124, 40]] },
  ],
  balls: [['r1', 'r2', 'r2', 'r4', [84, 103, 1]]],
}

// W9 · How close can you get? – dribble at each other on "GO!", turn away at the last moment
const howClose: BookScene = {
  steps: 3, speed: 1.4,
  field: [['area', 24, 6, 152, 98, 'co']],
  players: [
    { id: 'a', t: 'r', ball: true, p: [[44, 28], [66, 40], [[70, 32], [70, 18]]] },
    { id: 'b', t: 'w', ball: true, p: [[90, 50], [74, 42], [[64, 52], [52, 64]]] },
    { id: 'c', t: 'w', ball: true, p: [[118, 30], [134, 22], [[140, 30], [140, 44]]] },
    { id: 'd', t: 'r', ball: true, p: [[156, 12], [142, 20], [[132, 12], [122, 8]]] },
    { id: 'e', t: 'r', ball: true, p: [[110, 92], [128, 82], [[136, 90], [146, 100]]] },
    { id: 'f', t: 'w', ball: true, p: [[160, 70], [138, 78], [[134, 70], [134, 58]]] },
  ],
}

// W9 · 3v3 to four goals – score by dribbling through a corner gate
const fourGates: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 24, 6, 152, 98, 'mo'], ['cones', 'y', [28, 6, 40, 6, 160, 6, 172, 6, 28, 104, 40, 104, 160, 104, 172, 104]]],
  players: [
    { id: 'r1', t: 'r', p: [[124, 72], [[132, 66], [140, 56]], [146, 70], [152, 86]] },
    { id: 'r2', t: 'r', p: [[40, 80], [40, 80], [38, 66], [[36, 40], [34, 8]]] },
    { id: 'r3', t: 'r', p: [[100, 100], [100, 100]] },
    { id: 'w1', t: 'w', p: [[98, 26], [104, 34], [118, 46], [130, 58]] },
    { id: 'w2', t: 'w', p: [[86, 40], [84, 46]] },
    { id: 'w3', t: 'w', p: [[70, 52], [64, 58], [50, 60]] },
  ],
  balls: [['r1', 'r1', 'r2', 'r2']],
}

// W10 · 4v4 festival – four games: passes = points, everyone in the attacking half, one-touch finish, free play
const festival: BookScene = {
  steps: 4, speed: 1.2,
  field: [['area', 30, 6, 140, 98, 'mo'], ['goal', 100, 6, 'd', 14], ['goal', 100, 104, 'u', 14], ['line', 30, 55, 170, 55, true]],
  players: [
    { id: 'r1', t: 'r', p: [[140, 18], [140, 18], [138, 22]] },
    { id: 'r2', t: 'r', p: [[84, 40], [84, 40], [84, 40], [90, 48]] },
    { id: 'r3', t: 'r', p: [[56, 62], [56, 62], [58, 66]] },
    { id: 'r4', t: 'r', p: [[150, 58], [146, 60]] },
    { id: 'w1', t: 'w', p: [[92, 44], [92, 44], [90, 40]] },
    { id: 'w2', t: 'w', p: [[60, 74], [60, 74], [62, 76]] },
    { id: 'w3', t: 'w', p: [[110, 60]] },
    { id: 'w4', t: 'w', p: [[130, 76]] },
  ],
  balls: [['r2', 'r3', 'r3', [100, 103, 1]]],
}

// U10 game · 7v7 – a 1-2-3-1 shape, numbered positions, build-up from the goalkeeper
const sevens: BookScene = {
  steps: 5, speed: 1.2,
  field: [['pitch', 'full']],
  players: [
    { id: 'g', t: 'k', l: '1', p: [[10, 55]] },
    { id: 'p2', t: 'r', l: '2', p: [[40, 86], [40, 86], [52, 90]] },
    { id: 'p3', t: 'r', l: '3', p: [[40, 24], [40, 24], [46, 20]] },
    { id: 'p4', t: 'r', l: '4', p: [[34, 55], [38, 58], [38, 58]] },
    { id: 'p6', t: 'r', l: '6', p: [[64, 50], [64, 50], [70, 54], [70, 54]] },
    { id: 'p10', t: 'r', l: '10', p: [[86, 66], [86, 66], [86, 66], [98, 64], [102, 62]] },
    { id: 'p9', t: 'r', l: '9', p: [[100, 46], [100, 46], [110, 44], [120, 44], [140, 50]] },
    ...([[190, 55], [160, 24], [160, 86], [166, 55], [136, 50], [116, 34], [118, 72]] as [number, number][]).map(([x, y], i) => ({ id: 'w' + i, t: (i ? 'w' : 'k') as 'w' | 'k', p: [[x, y]] as [number, number][] })),
  ],
  balls: [['g', 'p4', 'p6', 'p10', 'p9']],
}

export const U10_SCENES: Record<string, BookScene> = {
  'e10-1': freeMoves, 'e10-2': endzone, 'e10-3': fiveTwoGoals, 'e10-4': twoV0, 'e10-5': threeV2, 'e10-6': fiveGoal,
  'e10-7': sequential, 'e10-8': threePlusOne, 'e10-9': counterGoals,
  'e10-10': stayPlay, 'e10-11': knockCones, 'e10-12': fourPasses, 'e10-13': numbered, 'e10-14': twoV2Gk, 'e10-15': fiveGk,
  'e10-16': partnerDef, 'e10-17': twoV2Def, 'e10-18': fourDef, 'e10-19': fourV2, 'e10-20': threeCones, 'e10-21': fiveCover,
  'e10-22': gkMix, 'e10-23': fourGoalsGk, 'e10-24': fourBigGk, 'e10-25': howClose, 'e10-26': fourGates, 'e10-27': festival, 'e10-28': sevens,
}
