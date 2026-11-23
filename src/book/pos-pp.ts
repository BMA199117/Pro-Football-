import type { BookScene, More } from './scene'
import { frame } from './pos-util'

/**
 * "Positional Play" (Phase of Play): sample drills for the Professional section, drawn after the
 * book's diagrams: blue in possession, black defending, green neutrals (our yellow), book pages in the ids.
 * Book key: ball movement = solid line, player movement = dashed line (FIFA key).
 */
const K = { key: 'fifa' as const, speed: 1.2 }

// p19 7v4 build-up rondo: from the goalkeeper to number 9 without black touching the ball (2 touches)
const f19 = frame([537, 180, 725, 385], [50, 18, 150, 92])
const pp19: BookScene = {
  ...K, steps: 4,
  field: [f19.area([537, 180], [725, 385]), f19.mini([518, 405], 'u'), f19.mini([630, 415], 'u'), f19.mini([740, 405], 'u')],
  players: [
    f19.pl('gk', 'b', '1', [[664, 377]]),
    f19.pl('b4', 'b', '4', [[714, 322]]),
    f19.pl('b6', 'b', '6', [[640, 298]]),
    f19.pl('b9', 'b', '9', [[632, 188]]),
    f19.pl('b3', 'b', '3', [[546, 247]]), f19.pl('b2', 'b', '2', [[717, 242]]), f19.pl('b5', 'b', '5', [[552, 332]]),
    f19.pl('c8', 'c', '8', [[607, 259], [607, 252], [610, 236], [616, 214]]),
    f19.pl('c7', 'c', '7', [[667, 259], [667, 252], [662, 234], [654, 216]]),
    f19.pl('c11', 'c', '11', [[601, 317]]),
    f19.pl('c10', 'c', '10', [[654, 332]]),
  ],
  balls: f19.balls([['gk', 'b4', 'b6', 'b9']]),
}

// p26 7v4 positional rondo: wide players may not pass along the same vertical line; black scores in the corner goals
const f26 = frame([68, 131, 313, 376], [60, 15, 140, 95])
const pp26: BookScene = {
  ...K, steps: 6,
  field: [f26.area([68, 131], [313, 376]), f26.line([103, 131], [103, 376]), f26.line([278, 131], [278, 376]),
    f26.mini([46, 110], 'd'), f26.mini([336, 110], 'd'), f26.mini([46, 396], 'u'), f26.mini([336, 396], 'u')],
  players: [
    f26.pl('b7', 'b', '7', [[268, 171]]),
    f26.pl('b2', 'b', '2', [[312, 278]]),
    f26.pl('b6', 'b', '6', [[197, 251]]),
    f26.pl('b5', 'b', '5', [[187, 378]]),
    f26.pl('b3', 'b', '3', [[72, 327]]),
    f26.pl('b11', 'b', '11', [[117, 183]]),
    f26.pl('b9', 'b', '9', [[169, 132]]),
    f26.pl('c4', 'c', '4', [[211, 204], [211, 204], [211, 204], [211, 204], [211, 204], [190, 186]]),
    f26.pl('c11', 'c', '11', [[151, 253], [151, 253], [151, 253], [151, 253], [151, 253], [135, 230]]),
    f26.pl('c8', 'c', '8', [[229, 298]]),
    f26.pl('c10', 'c', '10', [[149, 320]]),
  ],
  balls: f26.balls([['b7', 'b2', 'b6', 'b5', 'b3', 'b11']]),
}

// p29 3v3+4 rotations rondo: two midfield trios inside four grids, neutrals outside; in possession nobody stays in the same grid
const f29 = frame([520, 76, 739, 352], [60, 22, 140, 88])
const pp29: BookScene = {
  ...K, steps: 3,
  field: [f29.area([520, 76], [739, 352]), f29.line([630, 76], [630, 352]), f29.line([520, 213], [739, 213])],
  players: [
    f29.pl('n5', 'y', '5', [[625, 375]]), f29.pl('n3', 'y', '3', [[511, 197]]), f29.pl('n9', 'y', '9', [[575, 71]]), f29.pl('n2', 'y', '2', [[745, 327]]),
    f29.pl('b6', 'b', '6', [[690, 298]]),
    f29.pl('b10', 'b', '10', [[557, 284]]),
    f29.pl('b8', 'b', '8', [[670, 133]]),
    f29.pl('c6', 'c', '6', [[630, 165], [630, 165], [585, 184]]),
    f29.pl('c8', 'c', '8', [[614, 231], [614, 231], [585, 255]]),
    f29.pl('c10', 'c', '10', [[683, 258]]),
  ],
  balls: f29.balls([['n5', 'b6', 'b10']]),
}

// p32 4v4+4 vertical rondo: narrow area, quick combinations from one end to the other (2 touches, neutrals 1)
const f32 = frame([991, 80, 1161, 408], [40, 35, 160, 75])
const pp32: BookScene = {
  ...K, steps: 5,
  field: [f32.area([991, 80], [1161, 408])],
  players: [
    f32.pl('n5', 'y', '5', [[1064, 412]]), f32.pl('n3', 'y', '3', [[995, 271]]), f32.pl('n9', 'y', '9', [[1047, 78]]), f32.pl('n2', 'y', '2', [[1157, 357]]),
    f32.pl('b6', 'b', '6', [[1056, 308]]),
    f32.pl('b11', 'b', '11', [[1037, 167]]),
    f32.pl('b10', 'b', '10', [[1131, 138]]), f32.pl('b8', 'b', '8', [[1106, 237]]),
    f32.pl('c4', 'c', '4', [[1088, 153], [1088, 153], [1088, 153], [1088, 153], [1072, 122]]),
    f32.pl('c7', 'c', '7', [[1043, 238]]),
    f32.pl('c8', 'c', '8', [[1110, 283]]),
    f32.pl('c10', 'c', '10', [[1090, 344]]),
  ],
  balls: f32.balls([['n5', 'b6', 'n3', 'b11', 'n9']]),
}

// p35 5v4 compactness: black attacks in a 2-3 shape, blue defends in a 2-2 shape and shifts across as one block
const f35 = frame([1389, 52, 1685, 349], [50, 5, 150, 105])
const pp35: BookScene = {
  ...K, steps: 3,
  field: [f35.area([1389, 52], [1685, 349]),
    ...[1432, 1537, 1638].map((x) => f35.mini([x, 44], 'd')), ...[1432, 1537, 1638].map((x) => f35.mini([x, 357], 'u'))],
  players: [
    f35.pl('c10', 'c', '10', [[1498, 130]]), f35.pl('c8', 'c', '8', [[1593, 144]]), f35.pl('c7', 'c', '7', [[1662, 205]]),
    f35.pl('c11', 'c', '11', [[1418, 211]]), f35.pl('c9', 'c', '9', [[1546, 242]]),
    f35.pl('b6', 'b', '6', [[1504, 204], [1528, 205], [1548, 207]]),
    f35.pl('b8', 'b', '8', [[1586, 201], [1606, 202], [1626, 204]]),
    f35.pl('b5', 'b', '5', [[1500, 278], [1520, 278], [1540, 278]]),
    f35.pl('b4', 'b', '4', [[1578, 278], [1600, 270], [1620, 262]]),
  ],
  balls: f35.balls([['c10', 'c8', 'c7']]),
}

// p39 7v4 rondo with transitions (FC Barcelona): black keeps the ball; blue wins it and may only score from the finishing zones
const f39 = frame([112, 28, 322, 447], [20, 15, 180, 95])
const pp39: BookScene = {
  ...K, steps: 4,
  field: [f39.area([112, 28], [322, 447]), f39.line([112, 127], [322, 127], false), f39.line([112, 336], [322, 336], false),
    ...[151, 217, 284].map((x) => f39.mini([x, 20], 'd')), ...[151, 217, 284].map((x) => f39.mini([x, 455], 'u'))],
  players: [
    f39.pl('c5', 'c', '5', [[218, 337]]), f39.pl('c6', 'c', '6', [[222, 235]]), f39.pl('c7', 'c', '7', [[320, 183]]),
    f39.pl('c4', 'c', '4', [[219, 125]]),
    f39.pl('c9', 'c', '9', [[115, 175]]), f39.pl('c3', 'c', '3', [[113, 288]]), f39.pl('c2', 'c', '2', [[322, 296]]),
    f39.pl('b9', 'b', '9', [[180, 183], [180, 183], [180, 183], [205, 147]]),
    f39.pl('b11', 'b', '11', [[262, 191], [262, 191], [262, 191], [250, 158]]),
    f39.pl('b10', 'b', '10', [[171, 268]]),
    f39.pl('b7', 'b', '7', [[266, 281]]),
  ],
  balls: f39.balls([['c5', 'c6', 'c7', 'c4']]),
}

// p41 6v4 positional rondo: three grids, the ball may only go forward with "up, back, through"; side players move up a grid
const f41 = frame([40, 170, 312, 623], [30, 15, 170, 95])
const pp41: BookScene = {
  ...K, steps: 5,
  field: [f41.area([40, 170], [312, 623]), f41.line([40, 351], [312, 351]), f41.line([40, 409], [312, 409])],
  players: [
    f41.pl('b5', 'b', '5', [[175, 590]]),
    f41.pl('b9', 'b', '9', [[151, 287], [157, 376], [166, 340]]),
    f41.pl('b6', 'b', '6', [[231, 435]]),
    f41.pl('b2', 'b', '2', [[309, 500], [309, 460], [310, 390], [312, 317]]),
    f41.pl('b3', 'b', '3', [[47, 500], [47, 460], [50, 390], [54, 309]]),
    f41.pl('b11', 'b', '11', [[192, 176]]),
    f41.pl('c11', 'c', '11', [[113, 247]]),
    f41.pl('c4', 'c', '4', [[205, 277]]),
    f41.pl('c7', 'c', '7', [[131, 454]]),
    f41.pl('c5', 'c', '5', [[208, 505]]),
  ],
  balls: f41.balls([['b5', 'b9', 'b6', 'b2', 'b11']]),
}

// p45 overload to isolate, 2 grids: 5 passes in the overload zone, then to the winger in the isolation zone → lay-off → 2v1
const f45 = frame([453, 58, 828, 393], [0, 4, 200, 106])
const pp45: BookScene = {
  ...K, steps: 8, speed: 1.1,
  field: [['pitch', 'right'], f45.area([453, 211], [605, 340]), f45.area([715, 163], [820, 301]),
    f45.line([715, 276], [820, 276]), f45.mini([748, 160], 'd'), f45.mini([792, 160], 'd')],
  players: [
    f45.pl('b3', 'b', '3', [[471, 328]]), f45.pl('b11', 'b', '11', [[462, 246]]), f45.pl('n10', 'y', '10', [[523, 272]]),
    f45.pl('b5', 'b', '5', [[520, 329]]), f45.pl('b6', 'b', '6', [[580, 328]]), f45.pl('b8', 'b', '8', [[588, 264]]),
    f45.pl('b9', 'b', '9', [[504, 221]]),
    f45.pl('b7', 'b', '7', [[756, 217]]),
    f45.pl('b2', 'b', '2', [[743, 292], [743, 292], [743, 292], [743, 292], [743, 292], [743, 292], [743, 292], [741, 258]]),
    f45.pl('c4', 'c', '4', [[521, 245]]),
    f45.pl('c6', 'c', '6', [[562, 252]]),
    f45.pl('c3', 'c', '3', [[483, 269]]),
    f45.pl('c8', 'c', '8', [[553, 288], [553, 288], [553, 288], [553, 288], [553, 288], [570, 275]]),
    f45.pl('c11', 'c', '11', [[499, 308]]),
    f45.pl('c9', 'c', '9', [[544, 318]]),
    f45.pl('c7', 'c', '7', [[772, 203]]), f45.pl('c2', 'c', '2', [[780, 290]]),
  ],
  balls: f45.balls([['b3', 'b11', 'n10', 'b5', 'b6', 'b8', 'b7', 'b2']]),
}

export const PP_SCENES: Record<string, BookScene> = {
  'pp-19': pp19, 'pp-26': pp26, 'pp-29': pp29, 'pp-32': pp32, 'pp-35': pp35, 'pp-39': pp39, 'pp-41': pp41, 'pp-45': pp45,
}

/** What happens after the book moment (animation only). */
export const MORE_PP: Record<string, More> = {
  // point scored: now from 9 back to the goalkeeper, the blacks turn and press the other way
  'pp-19': f19.more(4, {
    b2: [[712, 250]], b6: [[640, 298], [630, 292]], b5: [[555, 330], [555, 332]],
    c8: [[618, 222], [640, 244], [628, 268], [600, 300]], c7: [[662, 228], [690, 246], [660, 276], [640, 300]],
    c11: [[614, 302], [618, 298], [600, 318], [580, 330]], c10: [[658, 314], [660, 310], [640, 310], [620, 330]],
  }, [['b2', 'b6', 'b5', 'gk']]),
  // circulation goes on: 11 finds 9, 9 finds 7 who has moved inside to offer a diagonal
  'pp-26': f26.more(3, {
    b9: [[169, 132], [175, 134]], b7: [[268, 171], [255, 180], [250, 185]],
    c4: [[200, 170], [215, 165], [240, 178]], c11: [[140, 210], [150, 180], [170, 170]],
  }, [['b9', 'b7', 'b7']]),
  // rotation: 10 plays the neutral, 8 leaves his grid for the free one and receives, 6 moves up into 8's old grid
  'pp-29': f29.more(3, {
    b8: [[620, 120], [580, 130], [578, 132]], b6: [[690, 260], [690, 200], [690, 160]], b10: [[557, 284], [560, 290]],
    c6: [[580, 175], [600, 145], [620, 140]], c8: [[570, 240], [590, 220], [610, 215]], c10: [[675, 250], [690, 220], [690, 195]],
  }, [['n3', 'b8', 'b6']]),
  // and back down to the other end
  'pp-32': f32.more(4, {
    b10: [[1125, 150]], b8: [[1104, 245], [1100, 250]], b11: [[1040, 180], [1050, 210]],
    c4: [[1095, 135], [1110, 150], [1112, 170]], c8: [[1105, 270], [1100, 295], [1110, 320]], c7: [[1050, 240], [1062, 255], [1070, 270]],
  }, [['b10', 'b8', 'n2', 'n5']]),
  // 7 plays into 9, blue 5 steps in and wins the ball, blue counter-attacks into a far small goal in 6 seconds
  'pp-35': f35.more(4, {
    c7: [[1660, 240]], c9: [[1556, 250], [1556, 252]], b5: [[1546, 262], [1540, 220], [1540, 220]],
    b6: [[1548, 200], [1540, 170], [1540, 120], [1537, 100]], b8: [[1626, 190], [1600, 150]],
    c10: [[1500, 160], [1520, 180], [1530, 150]], c11: [[1440, 200], [1480, 200]],
  }, [['c7', 'b5', 'b6', ['s', [1537, 48]]]]),
  // blue 9 wins the ball from 4 in the finishing zone and scores; black counter-presses
  'pp-39': f39.more(3, {
    b9: [[215, 128], [212, 90], [212, 85]], c4: [[220, 118], [215, 100], [212, 92]],
    c7: [[290, 150], [270, 120]], c9: [[140, 150], [160, 115]], b11: [[250, 140], [260, 110]],
  }, [['b9', 'b9', ['s', [217, 24]]]]),
  // 4v2 again in the new grid: 11 plays 3, 3 switches to 2
  'pp-41': f41.more(2, {
    b3: [[60, 300]], b2: [[300, 300]], b9: [[150, 260], [160, 250]], c11: [[90, 280], [140, 300]], c5: [[215, 290], [250, 300]],
  }, [['b3', 'b2']]),
  // 2v1 in the isolation zone for 5 seconds: the full-back drives on, combines with the winger, small goal
  'pp-45': f45.more(3, {
    b2: [[745, 220], [740, 215]], c2: [[765, 245], [752, 225], [770, 200]], b7: [[770, 200], [772, 186], [774, 180]],
  }, [['b2', 'b7', ['s', [792, 164]]]]),
}
