import type { BookScene, More } from './scene'
import { frame } from './pos-util'

/**
 * "Xabi Alonso: Positionism and Relationism" (Phase of Play): sample drills for the Professional
 * section after the book's diagrams: red in possession, black defending, green neutrals (our yellow).
 * Players carry the book's role labels: CB, DM, AM (AMC), WB (wing-back), ST. Book key: ball = solid, player = dashed.
 */
const K = { key: 'fifa' as const, speed: 1.2 }

// p12 5v5+3 positional rondo: narrow area, from one end to the other with at least 3 passes (neutral CBs at the ends, DM inside)
const f12 = frame([502, 48, 798, 518], [30, 25, 170, 85])
const xa12: BookScene = {
  ...K, steps: 6,
  field: [f12.area([502, 48], [798, 518])],
  players: [
    f12.pl('n2', 'y', 'CB', [[657, 516]]), f12.pl('nd', 'y', 'DM', [[657, 305]]), f12.pl('n1', 'y', 'CB', [[645, 47]]),
    f12.pl('rAM', 'r', 'AM', [[548, 349]]), f12.pl('rCB', 'r', 'CB', [[581, 211]]), f12.pl('rWB', 'r', 'WB', [[706, 143]]),
    f12.pl('rDM', 'r', 'DM', [[747, 378]]), f12.pl('rST', 'r', 'ST', [[694, 432]]),
    f12.pl('cWB', 'c', 'WB', [[645, 180]]), f12.pl('cDM', 'c', 'DM', [[712, 241]]), f12.pl('cAM', 'c', 'AM', [[555, 282]]),
    f12.pl('cCB', 'c', 'CB', [[670, 352]]), f12.pl('cST', 'c', 'ST', [[624, 425]]),
  ],
  balls: f12.balls([['n2', 'rAM', 'nd', 'rCB', 'n1', [687, 115]]]),
}

// p23 5v3 positional rondo vs the mid-block: 3 centre-backs + double pivot, 10 passes = a point; black counters into 2 small goals
const f23 = frame([341, 105, 554, 370], [40, 20, 160, 90])
const xa23: BookScene = {
  ...K, steps: 4,
  field: [f23.area([341, 105], [554, 370]), f23.mini([393, 376], 'u'), f23.mini([502, 376], 'u')],
  players: [
    f23.pl('cb3', 'r', 'CB', [[445, 337]]), f23.pl('cb2', 'r', 'CB', [[522, 274]]), f23.pl('cb1', 'r', 'CB', [[358, 279]]),
    f23.pl('dm1', 'r', 'DM', [[381, 133]]), f23.pl('dm2', 'r', 'DM', [[519, 139]]),
    f23.pl('am1', 'c', 'AM', [[409, 197]]), f23.pl('am2', 'c', 'AM', [[497, 218]]), f23.pl('st', 'c', 'ST', [[435, 283]]),
  ],
  balls: f23.balls([['cb3', 'cb2', 'dm1', 'dm2']]),
}

// p25 wide pattern play (book: patterns A and B side by side, passes numbered 1–5); the defenders press passively until the wing-back gets the ball
const f25 = frame([36, 140, 779, 711], [0, 0, 200, 106], false)
const xa25: BookScene = {
  ...K, steps: 6, speed: 1.3,
  field: [f25.area([36, 160], [779, 711]), f25.goal([184, 160], 'd', 20), f25.goal([626, 160], 'd', 20),
    f25.line([36, 431], [779, 431], false), ['circle', 100, 56, 19],
    ...[186, 307, 509, 628].map((x) => f25.line([x, 160], [x, 711])), f25.line([36, 228], [779, 228]), f25.line([36, 622], [779, 622]),
    ['text', 14, 8, 'A'], ['text', 186, 8, 'B']],
  players: [
    // pattern A: CB → DM → CB → AM → DM → LWB running into space
    f25.pl('aCB1', 'r', 'CB', [[290, 675]]), f25.pl('aDM', 'r', 'DM', [[243, 562]]), f25.pl('aCB2', 'r', 'CB', [[140, 637]]),
    f25.pl('aAM', 'r', 'AM', [[229, 466]]), f25.pl('aWB', 'r', 'WB', [[68, 492], [68, 492], [68, 492], [68, 492], [80, 460], [110, 382]]),
    f25.pl('gk', 'c', undefined, [[179, 187]]), f25.pl('kDM', 'c', 'DM', [[230, 432]]), f25.pl('kAM', 'c', 'AM', [[168, 502]]), f25.pl('kST', 'c', 'ST', [[225, 606]]),
    // pattern B: CB → AM → DM → ST → AM (has moved up) → RWB running into space
    f25.pl('bCB', 'r', 'CB', [[630, 690]]), f25.pl('bAM', 'r', 'AM', [[522, 575], [522, 575], [522, 575], [540, 545], [553, 517]]),
    f25.pl('bDM', 'r', 'DM', [[676, 586]]), f25.pl('bST', 'r', 'ST', [[597, 446]]),
    f25.pl('bWB', 'r', 'WB', [[750, 502], [750, 502], [750, 502], [750, 502], [742, 470], [727, 418]]),
    f25.pl('gr', 'c', undefined, [[642, 195]]), f25.pl('mDM', 'c', 'DM', [[606, 414]]), f25.pl('mAM', 'c', 'AM', [[668, 530]]), f25.pl('mST', 'c', 'ST', [[597, 614]]),
  ],
  balls: f25.balls([['aCB1', 'aDM', 'aCB2', 'aAM', 'aDM', [110, 375]], ['bCB', 'bAM', 'bDM', 'bST', 'bAM', [722, 405]]]),
}

// p30 8v8+GK vs a low block: red in a 3-2-3 penetrates centrally; black has 5 seconds to score in 3 small goals after winning the ball
const f30 = frame([17, 29, 421, 387], [20, 8, 180, 102])
const xa30: BookScene = {
  ...K, steps: 7,
  field: [f30.area([17, 29], [421, 387]), f30.goal([217, 29], 'd'), ...[70, 218, 363].map((x) => f30.mini([x, 393], 'u')),
    f30.line([126, 29], [126, 387]), f30.line([310, 29], [310, 387]), f30.line([17, 209], [421, 209])],
  players: [
    f30.pl('cb1', 'r', 'CB', [[113, 312]]), f30.pl('cb2', 'r', 'CB', [[218, 351]]), f30.pl('cb3', 'r', 'CB', [[330, 330]]),
    f30.pl('dm1', 'r', 'DM', [[276, 229]]), f30.pl('dm2', 'r', 'DM', [[215, 244]]),
    f30.pl('am1', 'r', 'AM', [[64, 154]]), f30.pl('st', 'r', 'ST', [[225, 138]]),
    f30.pl('am2', 'r', 'AM', [[375, 162], [375, 162], [375, 162], [375, 162], [360, 130], [339, 90]]),
    f30.pl('gk', 'c', undefined, [[235, 46]]), f30.pl('k1', 'c', 'CB', [[227, 111]]), f30.pl('k2', 'c', 'CB', [[114, 140]]), f30.pl('k3', 'c', 'CB', [[328, 142]]),
    f30.pl('k4', 'c', 'DM', [[276, 192]]), f30.pl('k5', 'c', 'DM', [[195, 210]]), f30.pl('k6', 'c', 'AM', [[137, 262]]), f30.pl('k7', 'c', 'AM', [[300, 253]]),
    f30.pl('k8', 'c', 'ST', [[223, 292]]),
  ],
  balls: f30.balls([['cb1', 'cb2', 'dm1', 'dm2', 'st', 'am2', ['s', [262, 40]]]]),
}

// p34 5v5+GK finishing from wide play: coach → central player → wide to the wing-back, then cross early or drive in; the rest attack the box
const f34 = frame([452, 90, 872, 410], [20, 5, 192, 105])
const xa34: BookScene = {
  ...K, steps: 5,
  field: [f34.area([452, 90], [872, 410]), f34.goal([662, 90], 'd'), ...[571, 661, 752].map((x) => f34.mini([x, 414], 'u')),
    f34.line([537, 90], [537, 410], false), f34.line([788, 90], [788, 410], false), f34.line([452, 189], [872, 189]), f34.line([452, 300], [872, 300])],
  players: [
    f34.pl('co', 'c', 'T', [[573, 353]]),
    f34.pl('am', 'r', 'AM', [[623, 233]]), f34.pl('dm', 'r', 'DM', [[664, 302]]),
    f34.pl('rw', 'r', 'WB', [[828, 218], [828, 218], [828, 218], [828, 218], [810, 175]]),
    f34.pl('lw', 'r', 'WB', [[492, 218], [492, 218], [492, 218], [492, 218], [548, 180]]),
    f34.pl('st', 'r', 'ST', [[704, 226], [704, 226], [704, 226], [704, 226], [697, 180]]),
    f34.pl('gk', 'k', undefined, [[671, 106]]), f34.pl('k1', 'c', 'CB', [[588, 210]]), f34.pl('k2', 'c', 'CB', [[653, 202]]), f34.pl('k3', 'c', 'CB', [[708, 204]]),
    f34.pl('k4', 'c', 'WB', [[776, 206]]), f34.pl('k5', 'c', 'DM', [[667, 262]]),
  ],
  balls: f34.balls([['co', 'am', 'dm', 'rw', 'rw']]),
}

// p38 7v7+GK man-to-man high press: the black centre-back plays back to the goalkeeper (trigger), red presses with everyone on his man
const f38 = frame([57, 45, 396, 480], [15, 8, 185, 102])
const xa38: BookScene = {
  ...K, steps: 3,
  field: [f38.area([57, 45], [396, 480]), f38.goal([226, 45], 'd'), ...[101, 226, 348].map((x) => f38.mini([x, 486], 'u')),
    f38.line([150, 45], [150, 117], false), f38.line([303, 45], [303, 117], false), f38.line([150, 117], [303, 117], false),
    f38.line([57, 181], [396, 181], false), f38.line([57, 330], [396, 330]), f38.line([150, 181], [150, 480]), f38.line([303, 181], [303, 480])],
  players: [
    f38.pl('gk', 'c', undefined, [[221, 60]]), f38.pl('cb1', 'c', 'CB', [[102, 166]]), f38.pl('cb2', 'c', 'CB', [[316, 173]]),
    f38.pl('dm1', 'c', 'DM', [[190, 240]]), f38.pl('dm2', 'c', 'DM', [[273, 286]]), f38.pl('am1', 'c', 'AM', [[88, 283]]),
    f38.pl('am2', 'c', 'AM', [[374, 279]]), f38.pl('st', 'c', 'ST', [[187, 384]]),
    f38.pl('rAM', 'r', 'AM', [[113, 199], [140, 165], [163, 138]]), f38.pl('rST', 'r', 'ST', [[317, 201]]), f38.pl('rA2', 'r', 'AM', [[190, 270]]),
    f38.pl('rLW', 'r', 'WB', [[90, 306]]), f38.pl('rDM', 'r', 'DM', [[279, 313]]), f38.pl('rRW', 'r', 'WB', [[380, 306]]), f38.pl('rD2', 'r', 'DM', [[190, 410]]),
  ],
  balls: f38.balls([['cb1', 'gk', 'gk']]),
}

// p39 5v5+1 counter-pressing game: 10 passes with the neutral = a point; the team that loses the ball counter-presses at once (4 small goals)
const f39 = frame([556, 72, 822, 338], [50, 5, 150, 105])
const xa39: BookScene = {
  ...K, steps: 5,
  field: [f39.area([556, 72], [822, 338]), f39.mini([689, 66], 'd'), f39.mini([689, 344], 'u'), f39.mini([550, 205], 'r'), f39.mini([828, 205], 'l')],
  players: [
    f39.pl('st', 'r', 'ST', [[727, 322]]), f39.pl('dm2', 'r', 'DM', [[594, 279]]), f39.pl('ac', 'y', 'AM', [[697, 226]]),
    f39.pl('am', 'r', 'AM', [[690, 106]]), f39.pl('wb', 'r', 'WB', [[600, 122]]), f39.pl('dm1', 'r', 'DM', [[790, 177]]),
    f39.pl('k1', 'c', 'DM', [[652, 177], [652, 177], [652, 177], [652, 177], [631, 142]]),
    f39.pl('k2', 'c', 'WB', [[616, 226], [616, 226], [616, 226], [616, 226], [603, 172]]),
    f39.pl('k3', 'c', 'AM', [[743, 188]]), f39.pl('k4', 'c', 'ST', [[674, 272]]), f39.pl('k5', 'c', 'DM', [[732, 266]]),
  ],
  balls: f39.balls([['st', 'dm2', 'ac', 'am', 'wb']]),
}

// p41 5+GK v 6 compactness in a mid central block (2-2-1): red shifts as one block with the ball, 8 seconds to score after winning it
const f41 = frame([50, 72, 418, 412], [20, 5, 180, 105])
const xa41: BookScene = {
  ...K, steps: 3,
  field: [f41.area([50, 72], [418, 412]), ...[106, 221, 339].map((x) => f41.mini([x, 72], 'd')), f41.goal([224, 412], 'u'),
    f41.line([142, 72], [142, 412]), f41.line([299, 72], [299, 412]), f41.line([50, 241], [418, 241], false), ['circle', 100, 55, 22]],
  players: [
    f41.pl('dm1', 'c', 'DM', [[123, 159]]), f41.pl('cb', 'c', 'CB', [[220, 105]]), f41.pl('dm2', 'c', 'DM', [[356, 186]]),
    f41.pl('am1', 'c', 'AM', [[129, 259]]), f41.pl('am2', 'c', 'AM', [[337, 253]]), f41.pl('st', 'c', 'ST', [[225, 282]]),
    f41.pl('rST', 'r', 'ST', [[244, 145]]),
    f41.pl('rA1', 'r', 'AM', [[178, 232], [178, 232], [212, 220]]), f41.pl('rA2', 'r', 'AM', [[285, 225], [285, 225], [308, 207]]),
    f41.pl('rD1', 'r', 'DM', [[178, 315]]), f41.pl('rD2', 'r', 'DM', [[283, 297], [283, 297], [318, 268]]),
    f41.pl('gk', 'r', undefined, [[240, 399]]),
  ],
  balls: f41.balls([['dm1', 'cb', 'dm2']]),
}

export const XA_SCENES: Record<string, BookScene> = {
  'xa-12': xa12, 'xa-23': xa23, 'xa-25': xa25, 'xa-30': xa30, 'xa-34': xa34, 'xa-38': xa38, 'xa-39': xa39, 'xa-41': xa41,
}

/** What happens after the book moment (animation only). */
export const MORE_XA: Record<string, More> = {
  // point scored: the ball comes back down through the neutral DM to the other end
  'xa-12': f12.more(4, {
    rWB: [[700, 150]], rST: [[690, 440], [680, 445]], cWB: [[680, 170], [670, 230]], cDM: [[700, 270], [690, 330]], cAM: [[600, 300], [620, 380]],
  }, [['rWB', 'nd', 'rST', 'n2']]),
  // circulation goes on: lay-off back to a centre-back, switch across the back three
  'xa-23': f23.more(3, {
    am2: [[505, 175], [480, 250], [460, 290]], st: [[480, 300], [470, 320], [420, 310]], am1: [[420, 180], [430, 200]],
  }, [['cb2', 'cb3', 'cb1']]),
  // free play: both wing-backs drive on and finish
  'xa-25': f25.more(3, {
    aWB: [[130, 300], [150, 250]], kDM: [[180, 380], [170, 300], [165, 260]], bWB: [[700, 330], [680, 270]], mDM: [[650, 380], [670, 310], [675, 280]],
  }, [['aWB', 'aWB', ['s', [184, 166]]], ['bWB', 'bWB', ['s', [626, 166]]]]),
  // black wins the ball, counters into a small goal within 5 seconds; red counter-presses
  'xa-30': f30.more(3, {
    k6: [[137, 300], [120, 350]], dm2: [[180, 280], [140, 330]], cb1: [[113, 330], [110, 350]], k1: [[200, 150]],
  }, [['gk', 'k6', ['s', [70, 388]]]]),
  // the wing-back crosses low; the striker and the far wing-back attack the box
  'xa-34': f34.more(2, {
    st: [[680, 145], [672, 138]], lw: [[600, 150], [610, 145]], rw: [[812, 165]], k2: [[660, 160], [668, 150]], k3: [[700, 170], [690, 150]],
  }, [['st', ['s', [662, 96]]]]),
  // forced to the other centre-back, red's striker wins the ball and scores within 7 seconds
  'xa-38': f38.more(3, {
    rST: [[312, 180], [290, 130], [260, 95]], cb2: [[320, 165], [300, 140]], rAM: [[175, 110], [190, 100]], gk: [[221, 60], [228, 65]],
  }, [['cb2', 'rST', ['s', [226, 52]]]]),
  // black wing-back wins the ball and shoots at a small goal, red counter-presses straight away
  'xa-39': f39.more(3, {
    k2: [[605, 130], [650, 150]], wb: [[610, 135], [630, 150]], k3: [[760, 190], [790, 200]], am: [[700, 130], [740, 170]], dm1: [[790, 177], [800, 200]],
  }, [['k2', 'k3', ['s', [822, 205]]]]),
  // red DM steps in on the next pass, plays the striker, small goal within 8 seconds
  'xa-41': f41.more(3, {
    rD2: [[330, 258], [330, 250]], am2: [[337, 253], [345, 250]], rST: [[244, 145], [240, 120]], rA2: [[320, 200]],
  }, [['rD2', 'rST', ['s', [221, 76]]]]),
}
