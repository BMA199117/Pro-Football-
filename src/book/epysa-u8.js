/** EPYSA "Under 8 – Eight week plan": the drills that are new for U8. */
const AREA = ['area', 30, 8, 140, 94, 'mo'];
const coach = (x = 14, y = 55) => ({ id: 'co', t: 'c', p: [[x, y]], l: 'T' });
const snake = (id, t, trail) => 
// trail has 3 + steps points; player i walks it 3 - i points behind the leader
Array.from({ length: 4 }, (_, i) => ({ id: id + i, t, ball: true, l: i === 0 ? '1' : undefined, quiet: i > 0, p: Array.from({ length: trail.length - 3 }, (_, s) => trail[s + 3 - i]) }));
const followLeader = {
    steps: 5, speed: 1,
    field: [AREA],
    players: [
        coach(14, 40),
        ...snake('w', 'w', [[160, 40], [150, 30], [138, 22], [124, 20], [110, 24], [96, 20], [82, 26], [72, 36]]),
        ...snake('r', 'r', [[44, 96], [58, 92], [72, 88], [86, 82], [100, 76], [116, 72], [132, 64], [150, 70]]),
        ...snake('y', 'y', [[38, 98], [40, 88], [46, 78], [54, 70], [52, 60], [58, 50], [56, 40], [64, 30]]),
    ],
};
// Week 2 · Penny tag – a third of the players hold a bib and tag others, everyone dribbles
const pennyTag = {
    steps: 4, speed: 1.2,
    field: [AREA],
    players: [
        { id: 't1', t: 'b', ball: true, p: [[62, 26], [[72, 32], [84, 34]], [[92, 34], [98, 30]], [104, 26]] },
        { id: 'a', t: 'w', ball: true, p: [[90, 34], [[102, 30], [112, 22]], [[120, 16], [128, 16]], [138, 14]] },
        { id: 't2', t: 'b', ball: true, p: [[132, 46], [[124, 52], [116, 54]], [[108, 56], [100, 54]], [92, 54]] },
        { id: 'b', t: 'w', ball: true, p: [[148, 46], [[140, 54], [126, 60]], [[116, 64], [104, 62]], [94, 66]] },
        { id: 'c', t: 'w', ball: true, p: [[44, 54], [[40, 64], [46, 72]], [52, 78], [60, 80]] },
        { id: 'd', t: 'w', ball: true, p: [[100, 92], [[102, 80], [98, 70]], [[96, 62], [104, 56]], [110, 52]] },
        { id: 'e', t: 'r', ball: true, p: [[156, 90], [[152, 80], [156, 70]], [[160, 62], [158, 54]], [156, 48]] },
        { id: 't3', t: 'b', ball: true, p: [[40, 96], [[50, 92], [62, 92]], [[72, 90], [80, 86]], [86, 80]] },
    ],
};
// Week 2 · Freeze tag – taggers without a ball; a frozen player holds the ball overhead until freed
const freezeTag = {
    steps: 4, speed: 1.2,
    field: [AREA],
    players: [
        { id: 't1', t: 'b', p: [[54, 22], [76, 30], [80, 34], [84, 36]] },
        { id: 't2', t: 'b', p: [[140, 50], [126, 54], [118, 56], [114, 60]] },
        { id: 'a', t: 'w', ball: true, p: [[80, 36], [[92, 32], [100, 24]], [[108, 20], [114, 22]], [118, 26]] },
        { id: 'b', t: 'r', ball: true, p: [[124, 56], [[112, 58], [100, 54]], [[92, 52], [86, 58]], [80, 62]] },
        { id: 'f1', t: 'r', p: [[44, 46]] },
        { id: 'f2', t: 'w', p: [[150, 20]] },
        { id: 'c', t: 'w', ball: true, p: [[96, 88], [[100, 78], [98, 70]], [[96, 64], [92, 60]], [88, 54]] },
        { id: 'd', t: 'r', ball: true, p: [[156, 88], [[154, 78], [158, 68]], [[160, 58], [152, 50]], [146, 44]] },
        { id: 'e', t: 'r', ball: true, p: [[38, 96], [[40, 86], [36, 76]], [[36, 66], [40, 56]], [44, 50]] },
    ],
    balls: [[[44, 40]], [[150, 14]]],
};
// Week 2 + 8 · 2v2 to four goals – goals of cones in each corner of the end lines
const gate = (x, y) => ['cones', 'r', [x - 5, y, x + 5, y]];
const twoV2Four = {
    steps: 4, speed: 1.2,
    field: [['area', 30, 8, 140, 86], ['mini', 44, 94, 'u', 10], ['mini', 156, 94, 'u', 10], gate(44, 8), gate(156, 8), ['ball', 22, 30], ['ball', 20, 35]],
    players: [
        coach(22, 40),
        { id: 'w1', t: 'w', p: [[86, 18], [84, 24], [80, 34], [62, 52]] },
        { id: 'w2', t: 'w', p: [[118, 16], [118, 20], [118, 26], [124, 34]] },
        { id: 'r1', t: 'r', p: [[82, 66], [86, 46], [86, 40], [76, 50]] },
        { id: 'r2', t: 'r', p: [[124, 70], [116, 54], [114, 44], [118, 40]] },
        { id: 'r3', t: 'r', p: [[84, 102]] }, { id: 'r4', t: 'r', p: [[93, 102]] },
        { id: 'w3', t: 'w', p: [[107, 102]] }, { id: 'w4', t: 'w', p: [[116, 102]] },
    ],
    balls: [['co', 'w1', 'w1', 'w1', [44, 92, 1]]],
};
// Week 3 + 8 · 4 colours, 4 zones – run with the ball to the colour the coach calls
const box = (x, y, c) => ['cones', c, [x, y, x + 12, y, x, y + 10, x + 12, y + 10]];
const fourColors = {
    steps: 3, speed: 1.4,
    field: [AREA, box(56, 22, 'r'), box(132, 22, 'y'), box(56, 72, 'b'), box(132, 72, 'o')],
    players: [
        coach(14, 30),
        { id: 'a', t: 'w', ball: true, p: [[94, 24], [[104, 30], [112, 34]], [[124, 32], [137, 28]]] },
        { id: 'b', t: 'r', ball: true, p: [[80, 38], [[92, 36], [104, 40]], [[118, 34], [140, 27]]] },
        { id: 'c', t: 'w', ball: true, p: [[104, 52], [[96, 58], [86, 60]], [[74, 66], [61, 76]]] },
        { id: 'd', t: 'r', ball: true, p: [[118, 50], [[124, 42], [126, 36]], [[130, 32], [142, 32]]] },
        { id: 'e', t: 'w', ball: true, p: [[120, 88], [[108, 84], [96, 86]], [[80, 84], [66, 79]]] },
        { id: 'f', t: 'r', ball: true, p: [[76, 52], [[70, 60], [72, 66]], [[66, 72], [59, 79]]] },
    ],
};
// Week 4 · Clean your room – three channels, the middle one ("hallway") is for coaches only
const cleanRoom = {
    steps: 3, speed: 1.3,
    field: [['area', 30, 8, 140, 94], ['line', 30, 39, 170, 39], ['line', 30, 71, 170, 71], ['zone', 30, 39, 140, 32, 'rgba(0,0,0,.12)'], ['cones', 'y', [30, 39, 100, 39, 170, 39, 30, 71, 100, 71, 170, 71]], ['cones', 'o', [30, 8, 100, 8, 170, 8, 30, 102, 100, 102, 170, 102]],
        ['ball', 60, 14], ['ball', 132, 18], ['ball', 156, 30], ['ball', 52, 86], ['ball', 150, 92], ['ball', 120, 96]],
    players: [
        { id: 'c1', t: 'c', l: 'T', p: [[56, 52], [64, 60]] },
        { id: 'c2', t: 'c', l: 'T', p: [[140, 56], [144, 48]] },
        { id: 'r1', t: 'r', p: [[52, 22]] },
        { id: 'r2', t: 'r', p: [[96, 22]] },
        { id: 'r3', t: 'r', p: [[146, 18]] },
        { id: 'w1', t: 'w', p: [[80, 90]] },
        { id: 'w2', t: 'w', p: [[112, 86]] },
        { id: 'w3', t: 'w', p: [[148, 82]] },
    ],
    balls: [['r1', [118, 92]], ['w1', [82, 24]], ['w3', [144, 20]], [[64, 62], [64, 62], [70, 90]], ['r3', [150, 84]]],
};
// Week 5 + 6 · Gates passing – pairs pass to each other through as many gates as possible
const GATES = [62, 18, 72, 18, 104, 24, 112, 24, 56, 44, 64, 44, 90, 46, 98, 46, 128, 52, 136, 52, 52, 80, 60, 80, 96, 76, 104, 80, 150, 72, 156, 78, 120, 92, 128, 92];
const gatesPass = {
    steps: 4, speed: 1.25,
    field: [AREA, ['cones', 'y', GATES]],
    players: [
        { id: 'a1', t: 'w', p: [[84, 12], [84, 12], [86, 22], [92, 38]] },
        { id: 'a2', t: 'w', p: [[52, 26], [52, 26], [[50, 34], [56, 38]], [72, 40]] },
        { id: 'b1', t: 'w', p: [[100, 56], [104, 64], [104, 64], [104, 64]] },
        { id: 'b2', t: 'w', p: [[150, 84], [150, 84], [[156, 74], [154, 60]], [156, 50]] },
        { id: 'c1', t: 'r', p: [[74, 64], [74, 64], [80, 70]] },
        { id: 'c2', t: 'r', p: [[96, 94], [96, 94], [[110, 98], [124, 96]], [124, 96]] },
    ],
    balls: [['a1', 'a2', 'a2', 'a1'], ['b1', 'b1', 'b2', 'b2'], ['c1', 'c1', 'c2', 'c2']],
};
// Week 5 + 7 · 2v2 continuous – a goal of tall cones on each end line, pairs wait in the corners
const twoV2Cont = {
    steps: 4, speed: 1.2,
    field: [['area', 30, 8, 140, 94, 'co'], ['pole', 92, 8], ['pole', 108, 8], ['pole', 92, 102], ['pole', 108, 102], ['ball', 16, 40], ['ball', 19, 44], ['ball', 14, 46]],
    players: [
        coach(20, 50),
        { id: 'w1', t: 'w', p: [[24, 6], [58, 24], [64, 30], [72, 32]] },
        { id: 'w2', t: 'w', p: [[176, 6], [146, 22], [136, 32], [120, 42]] },
        { id: 'r1', t: 'r', p: [[24, 104], [60, 84], [96, 72], [100, 52]] },
        { id: 'r2', t: 'r', p: [[176, 104], [148, 84], [136, 76], [116, 60]] },
    ],
    balls: [['co', 'co', 'r1', 'r1', [100, 8, 1]]],
};
// Week 6 · Gates passing with defenders – defenders steal and keep the ball, pairs win it back
const gatesDef = {
    steps: 4, speed: 1.25,
    field: [AREA, ['cones', 'y', GATES]],
    players: [
        coach(14, 50),
        { id: 'a1', t: 'w', p: [[84, 12], [84, 12], [86, 22], [92, 38]] },
        { id: 'a2', t: 'w', p: [[52, 26], [52, 26], [[50, 34], [56, 38]], [72, 40]] },
        { id: 'd1', t: 'b', p: [[94, 30], [94, 30], [100, 38], [104, 44]] },
        { id: 'c1', t: 'r', p: [[70, 66], [70, 66], [86, 70], [90, 72]] },
        { id: 'c2', t: 'r', p: [[42, 90], [42, 90], [[52, 94], [62, 92]], [62, 92]] },
        { id: 'b1', t: 'w', p: [[112, 64], [112, 64]] },
        { id: 'd2', t: 'b', p: [[124, 74], [124, 74], [[128, 66], [124, 58]], [130, 52]] },
        { id: 'b2', t: 'w', p: [[150, 82], [150, 82], [140, 72], [134, 60]] },
    ],
    balls: [['a1', 'a2', 'a2', 'a1'], ['c1', 'c2', 'c2', 'c2'], ['b1', 'd2', 'd2', 'd2']],
};
// U8 game · 4v4 on 18×27 m
const game4 = {
    steps: 4, speed: 1.2,
    field: [['area', 20, 8, 160, 94, 'mo'], ['goal', 20, 55, 'r', 16], ['goal', 180, 55, 'l', 16]],
    players: [
        { id: 'r1', t: 'r', p: [[54, 30], [70, 26], [96, 22]] },
        { id: 'r2', t: 'r', p: [[70, 70], [84, 68], [92, 66], [128, 64]] },
        { id: 'r3', t: 'r', p: [[110, 40], [118, 40], [134, 44], [144, 48]] },
        { id: 'r4', t: 'r', p: [[150, 76], [146, 70], [150, 66]] },
        { id: 'w1', t: 'w', p: [[76, 34], [80, 32], [100, 30], [110, 34]] },
        { id: 'w2', t: 'w', p: [[92, 76], [92, 72], [104, 68], [132, 58]] },
        { id: 'w3', t: 'w', p: [[130, 50], [130, 50], [140, 52], [152, 56]] },
        { id: 'w4', t: 'w', p: [[158, 34], [156, 40], [160, 44]] },
    ],
    balls: [['r1', 'r2', 'r2', [180, 55, 1]]],
};
export const U8_SCENES = {
    'e8-1': followLeader, 'e8-2': pennyTag, 'e8-3': freezeTag, 'e8-4': twoV2Four, 'e8-5': fourColors, 'e8-6': cleanRoom,
    'e8-7': gatesPass, 'e8-8': twoV2Cont, 'e8-9': gatesDef, 'e8-10': game4,
};
