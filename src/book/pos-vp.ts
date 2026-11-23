import type { BookScene, Item, More } from './scene'
import { frame, type Px } from './pos-util'

/**
 * "Vertical Play in 4-2-3-1" (Phase of Play, Hansi Flick): sample drills for the Professional section,
 * drawn after the book's diagrams: light blue (our blue) against navy (our black), positions as labels,
 * book pages in the ids. Book key: ball movement = solid line, player movement = dashed line.
 */
const K = { key: 'fifa' as const, speed: 1.2 }
type F = ReturnType<typeof frame>
const dummy = (f: F, q: Px): Item => { const a = f.pt(q); return ['dummy', a[0], a[1]] }
const circle = (f: F, q: Px, r: number): Item => { const a = f.pt(q); return ['circle', a[0], a[1], r] }

// p7 5+2 v 5+2 differential game: narrow pitch, goals only after combining with an outside player in the corner zones
const f7 = frame([401, 535, 672, 965], [45, 20, 155, 89])
const vp7: BookScene = {
  ...K, steps: 7,
  field: [f7.area([401, 546], [672, 951]), f7.goal([534, 546], 'd'), f7.goal([534, 951], 'u'),
    f7.line([401, 610], [465, 546]), f7.line([601, 546], [672, 610]), f7.line([401, 885], [465, 951]), f7.line([601, 951], [672, 885])],
  players: [
    f7.pl('gk', 'b', 'GK', [[558, 934]]), f7.pl('bdm1', 'b', 'DM', [[470, 843]]), f7.pl('bdm2', 'b', 'DM', [[573, 773]]),
    f7.pl('bam', 'b', 'AM', [[445, 734]]), f7.pl('bst', 'b', 'ST', [[532, 650]]), f7.pl('blw', 'b', 'LW', [[424, 569]]), f7.pl('brw', 'b', 'RW', [[653, 575]]),
    f7.pl('gr', 'c', 'GK', [[536, 575]]), f7.pl('cdm1', 'c', 'DM', [[478, 666]]), f7.pl('cdm2', 'c', 'DM', [[565, 730]]),
    f7.pl('cam', 'c', 'AM', [[481, 795]]), f7.pl('cst', 'c', 'ST', [[557, 832]]), f7.pl('crw', 'c', 'RW', [[424, 931]]), f7.pl('clw', 'c', 'LW', [[653, 922]]),
  ],
  balls: f7.balls([['gk', 'bdm1', 'bdm2', 'bam', 'blw', 'bst', ['s', [511, 556]]]]),
}

// p14 6v4 building centrally: through the pressure to the attacking midfielder, one-touch bounce,
// the pivot runs on and finishes in a small goal
const f14 = frame([418, 105, 660, 470], [47, 20, 153, 90])
const vp14: BookScene = {
  ...K, steps: 6,
  field: [f14.area([418, 127], [660, 457]), f14.mini([470, 118], 'd'), f14.mini([604, 118], 'd'), f14.goal([538, 460], 'u')],
  players: [
    f14.pl('gk', 'b', 'GK', [[543, 441]]), f14.pl('bcb1', 'b', 'CB', [[476, 368]]), f14.pl('bcb2', 'b', 'CB', [[604, 397]]),
    f14.pl('bdm2', 'b', 'DM', [[606, 311]]), f14.pl('bam', 'b', 'AM', [[538, 121]]),
    f14.pl('bdm1', 'b', 'DM', [[495, 292], [495, 292], [495, 292], [490, 255], [483, 206]]),
    f14.pl('cam', 'c', 'AM', [[550, 264]]),
    f14.pl('crw', 'c', 'RW', [[481, 312], [481, 330], [481, 345]]),
    f14.pl('cst', 'c', 'ST', [[545, 357], [538, 372], [532, 388]]),
    f14.pl('clw', 'c', 'LW', [[605, 341], [600, 356], [594, 370]]),
  ],
  balls: f14.balls([['gk', 'bcb1', 'bdm2', 'bam', 'bdm1', ['s', [473, 132]]]]),
}

// p16 3v2 to 4v4 artificial transition: the press is triggered, a long pass finds the four forwards in zone 2
const f16 = frame([398, 140, 700, 440], [48, 2, 153, 108])
const vp16: BookScene = {
  ...K, steps: 6,
  field: [f16.area([398, 147], [700, 430]), f16.line([398, 254], [700, 254]), f16.area([439, 349], [646, 430]), f16.goal([541, 430], 'u'),
    ...([398, 468, 539, 610, 680] as number[]).map((x) => f16.mini([x, 158], 'd'))],
  players: [
    f16.pl('gk', 'b', 'GK', [[544, 416]]), f16.pl('bcb1', 'b', 'CB', [[490, 374]]), f16.pl('bcb2', 'b', 'CB', [[607, 384]]),
    f16.pl('blw', 'b', 'LW', [[449, 236]]), f16.pl('bst', 'b', 'ST', [[552, 195]]), f16.pl('bam', 'b', 'AM', [[586, 243]]), f16.pl('brw', 'b', 'RW', [[662, 235]]),
    f16.pl('cam', 'c', 'AM', [[509, 327]]),
    f16.pl('cst', 'c', 'ST', [[578, 344], [585, 355], [592, 366]]),
    f16.pl('crb', 'c', 'RB', [[466, 218]]), f16.pl('ccb1', 'c', 'CB', [[535, 208]]), f16.pl('ccb2', 'c', 'CB', [[584, 222]]), f16.pl('clb', 'c', 'LB', [[631, 211]]),
  ],
  balls: f16.balls([['cam', 'gk', 'bcb2', 'bam', 'bst', ['s', [540, 165]]]]),
}

// p20 4+1 v 4+1 progressing centrally against a mid-block: score only after a one-touch bounce off the attacking midfielder
const f20 = frame([441, 100, 654, 475], [47, 25, 152, 85])
const vp20: BookScene = {
  ...K, steps: 6,
  field: [f20.area([441, 125], [654, 445]), f20.line([441, 282], [654, 282], false), circle(f20, [551, 282], 23),
    f20.mini([486, 117], 'd'), f20.mini([603, 117], 'd'), f20.mini([486, 453], 'u'), f20.mini([603, 453], 'u')],
  players: [
    f20.pl('bcb2', 'b', 'CB', [[600, 392]]), f20.pl('bcb1', 'b', 'CB', [[489, 381]]), f20.pl('bdm2', 'b', 'DM', [[599, 263]]),
    f20.pl('bdm1', 'b', 'DM', [[493, 225], [493, 225], [493, 225], [478, 195], [463, 164]]), f20.pl('bam', 'b', 'AM', [[544, 111]]),
    f20.pl('ccb1', 'c', 'CB', [[507, 185]]), f20.pl('ccb2', 'c', 'CB', [[606, 210]]), f20.pl('cdm1', 'c', 'DM', [[509, 305]]), f20.pl('cdm2', 'c', 'DM', [[595, 333]]),
    f20.pl('cam', 'c', 'AM', [[546, 463]]),
  ],
  balls: f20.balls([['bcb2', 'bcb1', 'bdm2', 'bam', 'bdm1', ['s', [481, 130]]]]),
}

// p28 5v3+GK wide diagonal combination: 1 winger to full-back, 2 diagonal to the AM, 3 into the winger's run,
// 4 cut-back, 5 finish
const f28 = frame([368, 105, 718, 480], [45, 4, 154, 105])
const vp28: BookScene = {
  ...K, steps: 6,
  field: [f28.area([368, 129], [718, 480]), f28.area([481, 129], [718, 259]), f28.area([571, 129], [718, 171]), f28.goal([645, 129], 'd'),
    f28.line([368, 190], [482, 129], false), f28.line([603, 480], [718, 348], false),
    ...([[428, 350], [498, 412], [570, 303], [653, 308]] as Px[]).map((q) => dummy(f28, q))],
  players: [
    f28.pl('blb', 'b', 'LB', [[417, 385]]),
    f28.pl('blw', 'b', 'LW', [[515, 455], [517, 395], [519, 300], [521, 197]]),
    f28.pl('bam', 'b', 'AM', [[566, 345], [566, 345], [566, 345], [585, 300], [604, 264]]),
    f28.pl('bst', 'b', 'ST', [[673, 331], [673, 331], [673, 331], [668, 276], [663, 221]]),
    f28.pl('gr', 'c', 'GK', [[638, 145]]),
    f28.pl('crb', 'c', 'RB', [[492, 297], [480, 313], [468, 330]]),
    f28.pl('ccb1', 'c', 'CB', [[552, 215], [552, 215], [552, 215], [581, 266]]),
    f28.pl('ccb2', 'c', 'CB', [[632, 235], [632, 235], [632, 235], [649, 264]]),
  ],
  balls: f28.balls([['blw', 'blb', 'bam', 'blw', 'bst', ['s', [667, 137]]]]),
}

// p33 6v4+2 possession transfer: navy keep it 6v4; blue win it and transfer at once into the next zone to their two team-mates
const f33 = frame([377, 117, 709, 449], [47, 2, 153, 108])
const vp33a: BookScene = {
  ...K, steps: 6,
  field: [f33.area([377, 117], [709, 449]), f33.line([377, 283], [709, 283], false)],
  players: [
    f33.pl('cst', 'c', 'ST', [[416, 171]]), f33.pl('cdm1', 'c', 'DM', [[514, 135]]), f33.pl('cdm2', 'c', 'DM', [[635, 163]]),
    f33.pl('clw', 'c', 'LW', [[408, 266]]), f33.pl('cam', 'c', 'AM', [[535, 228]]),
    f33.pl('crw', 'c', 'RW', [[607, 268], [607, 268], [607, 268], [607, 268], [597, 283], [588, 298]]),
    f33.pl('bst', 'b', 'ST', [[560, 168]]), f33.pl('bam', 'b', 'AM', [[463, 208], [463, 208], [466, 194], [469, 180]]),
    f33.pl('brw', 'b', 'RW', [[529, 200]]), f33.pl('blw', 'b', 'LW', [[494, 250]]),
    f33.pl('bdm1', 'b', 'DM', [[454, 429]]), f33.pl('bdm2', 'b', 'DM', [[622, 414]]),
  ],
  balls: f33.balls([['clw', 'cst', 'cdm1', 'brw', 'blw', 'bdm1']]),
}

// p33 5v6+GK coordinated high press: the back pass to the keeper is the trigger, the wingers press with a curved run
// (shadow cover), the 10 and the striker close the middle, the pivot covers
const f33b = frame([377, 575, 709, 940], [47, 7, 153, 103])
const vp33b: BookScene = {
  ...K, steps: 3,
  field: [f33b.area([377, 595], [709, 926]), f33b.area([468, 595], [618, 638]), f33b.goal([543, 595], 'd'), f33b.line([377, 727], [709, 727], false),
    f33b.mini([431, 930], 'u'), f33b.mini([543, 930], 'u'), f33b.mini([651, 930], 'u')],
  players: [
    f33b.pl('gr', 'c', 'GK', [[540, 606]]), f33b.pl('ccb1', 'c', 'CB', [[458, 659]]), f33b.pl('ccb2', 'c', 'CB', [[630, 664]]),
    f33b.pl('crb', 'c', 'RB', [[388, 751]]), f33b.pl('clb', 'c', 'LB', [[697, 749]]), f33b.pl('cdm1', 'c', 'DM', [[515, 804]]), f33b.pl('cdm2', 'c', 'DM', [[599, 801]]),
    f33b.pl('blw', 'b', 'LW', [[465, 707], [465, 707], [478, 680], [493, 661]]),
    f33b.pl('brw', 'b', 'RW', [[632, 691], [632, 691], [622, 670], [605, 652]]),
    f33b.pl('bam', 'b', 'AM', [[493, 775]]), f33b.pl('bst', 'b', 'ST', [[600, 771]]), f33b.pl('bdm', 'b', 'DM', [[540, 850]]),
  ],
  balls: f33b.balls([['ccb1', 'gr', 'gr']]),
}

export const VP_SCENES: Record<string, BookScene> = {
  'vp-7': vp7, 'vp-14': vp14, 'vp-16': vp16, 'vp-20': vp20, 'vp-28': vp28, 'vp-33a': vp33a, 'vp-33b': vp33b,
}

export const MORE_VP: Record<string, More> = {
  // the keeper restarts for navy: through their pivot to the outside player in the corner
  'vp-7': f7.more(3, {
    bst: [[540, 670], [530, 690]], bam: [[460, 720], [470, 700]],
  }, [['gr', 'cdm1', 'crw']]),
  // keeper restarts on the other side: right centre-back into the pivot, the press comes again
  'vp-14': f14.more(3, {
    clw: [[600, 380], [605, 360], [606, 335]], cst: [[540, 400], [560, 395]], bdm1: [[490, 230], [500, 260]],
  }, [['gk', 'bcb2', 'bdm2']]),
  // navy win it back: the forwards counter-press straight away
  'vp-16': f16.more(3, {
    bst: [[548, 205], [540, 210]], blw: [[455, 225], [462, 220]], bam: [[575, 230], [560, 225]],
  }, [['ccb1', 'crb', 'crb']]),
  // the other team's turn: navy build through their pivots to their attacking midfielder at the far end
  'vp-20': f20.more(3, {
    bdm1: [[475, 190], [490, 230], [500, 260]], bdm2: [[590, 280], [585, 300]],
  }, [['ccb1', 'cdm2', 'cam']]),
  // keeper parries, the attacking midfielder follows in
  'vp-28': f28.more(2, {
    bam: [[615, 190], [622, 165]],
  }, [[[622, 165], ['s', [650, 135]]]]),
  // the transfer: three blues follow the ball into the other zone, four navy go with them to press
  'vp-33a': f33.more(3, {
    blw: [[480, 300], [470, 330], [465, 345]], brw: [[540, 300], [585, 335], [600, 345]], bam: [[480, 260], [520, 330], [540, 365]],
    cam: [[535, 280], [535, 350], [535, 380]], crw: [[588, 330], [590, 360]], cdm1: [[520, 200], [510, 300], [500, 380]], clw: [[420, 300], [440, 360], [450, 385]],
  }, [['bdm1', 'blw', 'brw']]),
  // the keeper is forced wide to the right-back, the winger closes him down, the press locks that side
  'vp-33b': f33b.more(3, {
    blw: [[470, 690], [430, 720], [405, 740]], bam: [[480, 760], [470, 755]], bdm: [[520, 830], [505, 815]], bst: [[560, 740], [520, 700]],
  }, [['crb', 'crb', 'crb']]),
}
