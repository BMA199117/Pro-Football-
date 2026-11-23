import type { BookScene, More } from './scene'
import { persp } from './barca-util'
import { replay } from './more-util'

/**
 * Barça Academy Coaching U7–U12: dribbling, duels and finishing; shooting; tactical; 7v7 chapters.
 * Ids bc-<book page>; the book's perspective pictures mapped onto our pitch with persp().
 */
const S = { speed: 1.2 }

// p89 1v1 mini duels: many pairs in one area, two goals, no bibs; beat your partner and score
const d89 = persp([[300, 340], [790, 340], [122, 790], [962, 790]], [40, 8, 160, 102])
const bc89: BookScene = {
  ...S, steps: 4,
  notes: { 0: ["Hamma juftlar bir maydonda: nimcha yo'q, raqibingni o'zing taniysan", 'Все пары в одной зоне: манишек нет, своего соперника узнаёшь сам'] },
  field: [d89.area('c'), d89.goal([550, 335], 'd', 14), d89.goal([545, 785], 'u', 14), d89.ball([195, 550])],
  players: [
    d89.pl('co', 'c', 'T', [[205, 505]]),
    d89.pl('a1', 'b', undefined, [[545, 455], [[520, 430], [500, 405]], [508, 385]]), d89.pl('d1', 'b', undefined, [[520, 420], [495, 400], [482, 388]]),
    d89.pl('a2', 'b', undefined, [[690, 440], [[700, 470], [715, 480]], [[730, 495], [735, 505]], [745, 525]]), d89.pl('d2', 'b', undefined, [[668, 470], [690, 490], [715, 512], [730, 530]]),
    d89.pl('a3', 'b', undefined, [[460, 515], [[430, 520], [412, 540]], [[405, 560], [400, 585]], [395, 610]]), d89.pl('d3', 'b', undefined, [[478, 485], [450, 505], [430, 540], [418, 575]]),
    d89.pl('a4', 'b', undefined, [[615, 565], [[608, 590], [602, 615]], [600, 640]]), d89.pl('d4', 'b', undefined, [[628, 595], [625, 615], [622, 640]]),
    d89.pl('a5', 'b', undefined, [[405, 635], [[408, 670], [415, 700]], [420, 718]]), d89.pl('d5', 'b', undefined, [[462, 660], [450, 680], [445, 700]]),
    d89.pl('a6', 'b', undefined, [[770, 735], [[790, 700], [805, 665]], [[812, 640], [815, 615]], [818, 595]]), d89.pl('d6', 'b', undefined, [[772, 615], [785, 630], [800, 640], [808, 620]]),
  ],
  balls: d89.balls([
    ['a1', 'a1', 'a1', ['s', [550, 338]]], ['a2', 'a2', 'a2', 'a2'], ['a3', 'a3', 'a3', 'a3'],
    ['a4', 'a4', 'a4', ['s', [585, 785]]], ['a5', 'a5', 'a5', ['s', [548, 785]]], ['a6', 'a6', 'a6', 'a6'],
  ]),
}

// p93 5v5, score by dribbling through any of the 4 pole gates; after a goal keep the ball and attack another gate
const d93 = persp([[300, 335], [790, 335], [118, 705], [962, 705]], [40, 6, 160, 104], false)
const bc93: BookScene = {
  ...S, steps: 7,
  notes: { 4: ["Gol! Darvozachadan to'p bilan o'tdi — to'p jamoada qoladi, endi boshqa darvozachaga hujum", 'Гол! Прошёл с мячом через воротца — мяч остаётся у команды, теперь атака других воротец'] },
  field: [d93.area('cr'), d93.pole([548, 335]), d93.pole([592, 335]), d93.pole([258, 445]), d93.pole([224, 512]), d93.pole([835, 445]), d93.pole([862, 515]), d93.pole([472, 690]), d93.pole([620, 690]),
    d93.zone([275, 398], [445, 398], [275, 500], [445, 500], 'rgba(255,255,255,.15)'), d93.zone([565, 425], [680, 425], [565, 488], [680, 488], 'rgba(255,255,255,.15)'), d93.ball([798, 762])],
  players: [
    d93.pl('co', 'c', 'T', [[845, 718]]),
    d93.pl('r', 'b', undefined, [[872, 610], [872, 610], [850, 590], [820, 560], [780, 520], [740, 490], [700, 470]], true),
    d93.pl('m', 'b', undefined, [[668, 512], [668, 512], [[650, 490], [612, 458]], [612, 455], [[600, 410], [570, 375], [565, 345]], [560, 360], [500, 400]]),
    d93.pl('c', 'b', undefined, [[553, 575], [553, 575], [553, 578], [555, 560], [560, 520], [540, 480], [500, 470]], true),
    d93.pl('t', 'b', undefined, [[507, 480], [520, 485], [540, 490], [580, 470], [600, 440], [560, 420], [520, 420]], true),
    d93.pl('l', 'b', undefined, [[255, 595], [255, 590], [265, 560], [[290, 510], [310, 470]], [[330, 450], [355, 438]], [362, 435], [[320, 470], [262, 495], [235, 490]]]),
    d93.pl('w1', 'w', undefined, [[535, 458], [560, 480], [590, 500], [600, 470], [590, 420], [520, 400], [420, 440]], true),
    d93.pl('w2', 'w', undefined, [[683, 485], [670, 495], [640, 510], [630, 480], [610, 430], [560, 410], [460, 450]], true),
    d93.pl('w3', 'w', undefined, [[478, 568], [500, 560], [530, 560], [540, 520], [520, 470], [440, 470], [360, 480]], true),
    d93.pl('w4', 'w', undefined, [[745, 622], [790, 625], [760, 590], [720, 560], [680, 520], [620, 500], [560, 500]], true),
    d93.pl('w5', 'w', undefined, [[815, 560], [800, 560], [740, 540], [700, 500], [660, 460], [600, 440], [520, 450]], true),
  ],
  balls: d93.balls([['r', 'm', 'c', 'm', 'm', 'l', 'l']]),
}

// p105 Shooting technique in pairs: strike the held ball into the partner's hands, then half-volleys, then further apart
const d105 = persp([[210, 378], [855, 378], [118, 815], [962, 815]], [30, 8, 170, 104], false)
type Px = [number, number]
const pairs105: [Px, Px, boolean][] = [
  [[300, 405], [435, 400], false], [[290, 495], [428, 500], true], [[260, 605], [418, 605], false], [[255, 700], [400, 710], true],
  [[612, 410], [790, 400], true], [[637, 500], [803, 495], false], [[645, 610], [840, 600], false], [[635, 715], [850, 720], true],
]
const near = (a: Px, b: Px): Px => [a[0] + (b[0] - a[0]) * 0.1, a[1] + (b[1] - a[1]) * 0.1]
const bc105: BookScene = {
  ...S, steps: 4,
  notes: { 0: ["To'pni qo'lda ushlab, sherigining qo'liga aniq urib beradi (ikkala oyoq bilan)", 'Держа мяч в руках, точно пробивает партнёру в руки (обеими ногами)'] },
  field: [d105.area(''), d105.line([372, 378], [300, 815], false), d105.line([695, 378], [765, 815], false),
    d105.cone([355, 476], 'r'), d105.cone([340, 572], 'r'), d105.cone([318, 692], 'r'), d105.cone([712, 476], 'r'), d105.cone([727, 572], 'r'), d105.cone([745, 692], 'r')],
  players: [
    d105.pl('co', 'c', 'T', [[477, 775]]),
    ...pairs105.flatMap(([a, b], i) => [d105.pl('l' + i, 'b', undefined, [a]), d105.pl('r' + i, 'b', undefined, [b])]),
  ],
  balls: d105.balls(pairs105.map(([a, b, ltr], i) => (ltr
    ? ['l' + i, ['l', near(b, a)], 'r' + i, ['l', near(a, b)]]
    : ['r' + i, ['l', near(a, b)], 'l' + i, ['l', near(b, a)]]))),
}

// p109 Deep arched run to open the shooting angle: pass between the poles, run round the mannequin, shoot first time
const d109 = persp([[300, 333], [790, 333], [115, 845], [965, 845]], [25, 18, 175, 92])
const dm = (q: Px) => { const a = d109.pt(q); return ['dummy', a[0], a[1]] as never }
const bc109: BookScene = {
  ...S, steps: 3,
  field: [d109.area(''), d109.goal([545, 335], 'd', 16), d109.goal([545, 840], 'u', 16), d109.pole([230, 500]), d109.pole([233, 570]), d109.pole([862, 485]), d109.pole([866, 560]),
    dm([280, 545]), dm([300, 520]), dm([788, 505]), dm([813, 548]), d109.ball([815, 385]), d109.ball([455, 828])],
  players: [
    d109.pl('gt', 'k', undefined, [[560, 385], [560, 385], [585, 370]]), d109.pl('gb', 'k', undefined, [[545, 735], [545, 735], [520, 740]]),
    d109.pl('a', 'b', undefined, [[205, 548], [[260, 600], [330, 605]], [[420, 590], [488, 550]]]),
    d109.pl('b', 'b', undefined, [[885, 548], [[840, 515], [780, 510]], [[700, 515], [632, 550]]]),
    d109.pl('q1', 'b', undefined, [[155, 545]]), d109.pl('q2', 'b', undefined, [[132, 598]]), d109.pl('q3', 'b', undefined, [[240, 430]]),
    d109.pl('q4', 'b', undefined, [[862, 430]]), d109.pl('q5', 'b', undefined, [[888, 485]]), d109.pl('q6', 'b', undefined, [[942, 600]]),
  ],
  balls: d109.balls([['a', [470, 548], [490, 550], ['s', [598, 338]]], ['b', [650, 550], [630, 552], ['s', [430, 832]]]]),
}

// p125 Barça Academy 7v7: both teams in 3-2-1; the coach stops play to correct positions (open wide and long, overlap)
const d125 = persp([[300, 338], [790, 338], [120, 845], [965, 845]], [4, 4, 196, 106])
const bc125: BookScene = {
  ...S, steps: 6, ps: 0.95,
  field: [['pitch', 'full'], d125.ball([955, 515])],
  players: [
    d125.pl('co', 'c', 'T', [[945, 480]]),
    d125.pl('bg', 'k', undefined, [[560, 770]]),
    d125.pl('bcb', 'b', 'CB', [[550, 655], [548, 645], [560, 640], [570, 630], [570, 620], [560, 600]]),
    d125.pl('blb', 'b', 'LB', [[195, 620], [200, 610], [210, 600], [230, 590], [250, 570], [280, 540]]),
    d125.pl('brb', 'b', 'RB', [[898, 620], [890, 615], [880, 605], [860, 590], [[850, 520], [840, 450]], [830, 420]]),
    d125.pl('bcm1', 'b', 'CM', [[398, 570], [405, 560], [420, 550], [430, 530], [450, 500], [470, 470]]),
    d125.pl('bcm2', 'b', 'CM', [[697, 575], [697, 575], [700, 570], [690, 560], [680, 545], [640, 500]]),
    d125.pl('bf', 'b', 'F', [[545, 520], [545, 515], [548, 505], [560, 490], [575, 470], [570, 440]]),
    d125.pl('wg', 'k', undefined, [[548, 340]]),
    d125.pl('wcb', 'w', 'CB', [[550, 395], [552, 400], [560, 405], [580, 410], [600, 410], [620, 400]]),
    d125.pl('wrb', 'w', 'RB', [[320, 405], [320, 410], [330, 415], [350, 420], [380, 425], [400, 430]]),
    d125.pl('wlb', 'w', 'LB', [[775, 405], [775, 412], [785, 425], [800, 440], [815, 455], [825, 460]]),
    d125.pl('wcm1', 'w', 'CM', [[432, 452], [440, 460], [460, 470], [480, 480], [500, 480], [510, 470]]),
    d125.pl('wcm2', 'w', 'CM', [[667, 452], [672, 465], [690, 480], [720, 500], [740, 520], [720, 500]]),
    d125.pl('wf', 'w', 'F', [[563, 490], [560, 540], [580, 580], [620, 590], [660, 580], [650, 560]]),
  ],
  balls: d125.balls([['bg', 'bcb', 'brb', 'bcm2', 'brb', 'bf']]),
  notes: { 3: ["Chetki himoyachi markaziy yarim himoyachi ortidan o'tib ketadi (overlap): endi himoyada muammo", 'Крайний защитник забегает за спину центрального полузащитника (обгон): теперь у обороны проблема'] },
}

export const BC_C: Record<string, BookScene> = { 'bc-89': bc89, 'bc-93': bc93, 'bc-105': bc105, 'bc-109': bc109, 'bc-125': bc125 }
export const MORE_BC_C: Record<string, More> = {
  // the next player from each queue goes; the shooters switch sides
  'bc-109': replay(bc109, { a: 'q1', b: 'q5', gt: 'gt', gb: 'gb' }),
  // the pairs keep striking to each other (half-volleys)
  'bc-105': d105.more(2, {}, pairs105.map(([a, b, ltr], i) => (ltr ? ['l' + i, ['l', near(b, a)]] : ['r' + i, ['l', near(a, b)]]) as never)),
  // new duel in every pair: the defender now has the ball
  'bc-89': replay(bc89, { a1: 'd1', d1: 'a1', a2: 'd2', d2: 'a2', a3: 'd3', d3: 'a3', a4: 'd4', d4: 'a4', a5: 'd5', d5: 'a5', a6: 'd6', d6: 'a6' }),
}
