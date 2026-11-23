import type { BookScene, More } from './scene'
import { persp } from './barca-util'
import { replay } from './more-util'

/**
 * "Barça Academy Coaching U7-12" (SoccerTutor, 2025): warm-ups and running with the ball.
 * Drawn after the book's pictures (blue = Barça blue-garnet, white = opponents / second colour,
 * T = coach); book page in the id. Book key: pass = dashed, run = solid arrow, dribble = wavy.
 */
const S = { speed: 1.25 }
const SQ: [number, number, number, number] = [55, 8, 145, 102]

// p15 Handball passing game: 5v5, call the receiver's name, 10 throws in a row = 1 point
const h15 = persp([[285, 335], [803, 335], [125, 838], [960, 838]], SQ, false)
const bc15: BookScene = {
  ...S, steps: 4,
  field: [h15.area('cr')],
  players: [
    h15.pl('co', 'c', 'T', [[168, 575]]),
    h15.pl('b1', 'b', undefined, [[512, 430]]),
    h15.pl('b2', 'b', undefined, [[283, 490]]),
    h15.pl('b3', 'b', undefined, [[550, 640], [550, 640], [548, 630]]),
    h15.pl('b4', 'b', undefined, [[820, 550]]),
    h15.pl('b5', 'b', undefined, [[410, 795], [410, 795], [600, 757], [795, 718]]),
    h15.pl('w1', 'w', undefined, [[550, 460], [540, 470], [520, 500]]),
    h15.pl('w2', 'w', undefined, [[310, 550], [300, 525], [330, 560], [360, 590]]),
    h15.pl('w3', 'w', undefined, [[365, 690], [365, 690], [430, 680], [470, 660]]),
    h15.pl('w4', 'w', undefined, [[580, 675], [580, 675], [570, 660], [640, 640]]),
    h15.pl('w5', 'w', undefined, [[740, 600], [740, 600], [760, 590], [780, 610]]),
  ],
  balls: h15.balls([['b1', 'b2', 'b3', 'b4']]),
}

// p16 Football tennis in pairs: lobbed passes over the line, one bounce allowed
const t16 = persp([[208, 375], [855, 375], [118, 812], [965, 812]], [30, 8, 170, 102], false)
const pairs16: [number, [number, number], [number, number], boolean][] = [
  [1, [305, 420], [432, 430], false], [2, [292, 525], [440, 525], false], [3, [258, 628], [425, 628], true], [4, [225, 745], [405, 740], false],
  [5, [638, 420], [780, 410], true], [6, [640, 515], [795, 512], false], [7, [648, 630], [815, 625], true], [8, [645, 740], [832, 735], true],
]
const bc16: BookScene = {
  ...S, steps: 2,
  field: [t16.line([370, 375], [300, 812], false), t16.line([695, 375], [767, 812], false),
    t16.cone([357, 470], 'r'), t16.cone([340, 568], 'r'), t16.cone([320, 688], 'r'), t16.cone([727, 568], 'r'), t16.cone([745, 688], 'r')],
  players: [
    t16.pl('co', 'c', 'T', [[475, 800]]),
    ...pairs16.flatMap(([n, l, r]) => [t16.pl('l' + n, 'b', undefined, [l]), t16.pl('r' + n, 'b', undefined, [r])]),
  ],
  // each ball is lobbed over the line and lands at the partner's feet
  balls: t16.balls(pairs16.map(([n, l, r, ltr]) => (ltr ? ['l' + n, ['l', [r[0] - 14, r[1] + 6]]] : ['r' + n, ['l', [l[0] + 14, l[1] + 6]]]))),
}


// p21 Bib tag with the ball: everyone dribbles; take the opponents' bibs, protect your own
const g21 = persp([[283, 330], [800, 330], [125, 833], [958, 833]], SQ, false)
const bc21: BookScene = {
  ...S, steps: 4,
  notes: { 1: ["Oqlar ko'klarning nimchasini olishga yugurib, ko'klar to'pni tanasi bilan to'sib qochadi", 'Белые бегут сорвать манишки синих, синие уводят мяч, закрывая его корпусом'] },
  field: [g21.area('cr'), g21.ball([165, 572])],
  players: [
    g21.pl('co', 'c', 'T', [[183, 550]]),
    g21.own('b1', 'b', undefined, [[383, 390], [430, 370], [500, 380], [560, 420]]),
    g21.own('b2', 'b', undefined, [[668, 440], [720, 470], [760, 520], [770, 580]]),
    g21.own('b3', 'b', undefined, [[523, 550], [560, 600], [600, 640], [640, 660]]),
    g21.own('b4', 'b', undefined, [[298, 768], [260, 720], [270, 660], [320, 620]]),
    g21.own('b5', 'b', undefined, [[782, 735], [840, 760], [860, 700], [820, 650]]),
    g21.own('w1', 'w', undefined, [[330, 455], [380, 420], [450, 400], [520, 420]]),
    g21.own('w2', 'w', undefined, [[620, 410], [680, 450], [730, 500], [750, 560]]),
    g21.own('w3', 'w', undefined, [[475, 590], [500, 640], [560, 680], [600, 690]]),
    g21.own('w4', 'w', undefined, [[425, 765], [360, 740], [320, 690], [340, 650]]),
    g21.own('w5', 'w', undefined, [[748, 720], [800, 740], [830, 720], [800, 680]]),
  ],
}

// p22 "Protect the ball": all dribble inside the square and kick other balls out; who loses the ball juggles outside
const k22 = persp([[335, 367], [755, 367], [222, 783], [862, 783]], [62, 14, 138, 96], false)
const bc22: BookScene = {
  ...S, steps: 4,
  notes: { 0: ["Ko'k o'yinchi o'z to'pini saqlab, boshqa o'yinchining to'pini kvadratdan tepib chiqaradi", 'Игрок сохраняет свой мяч и выбивает чужой мяч из квадрата'], 2: ["To'pi chiqib ketgan o'yinchi tashqariga chiqadi va to'pni yerga tushirmay oyoqda o'ynatadi", 'Игрок, чей мяч выбит, выходит за квадрат и чеканит мяч'] },
  field: [['area', 62, 14, 76, 82, 'cr'], k22.line([300, 325], [805, 325], false), k22.line([805, 325], [965, 835], false), k22.line([300, 325], [122, 835], false)],
  players: [
    k22.pl('co', 'c', 'T', [[168, 610]]),
    k22.own('a', 'b', undefined, [[522, 488], [600, 505], [640, 540], [660, 590]]),
    k22.own('b', 'b', undefined, [[432, 575], [505, 537], [540, 500], [500, 460]]),
    k22.own('c', 'b', undefined, [[660, 495], [700, 470], [690, 420], [640, 410]]),
    k22.pl('d', 'b', undefined, [[603, 680], [590, 690], [560, 700], [520, 690]]),
    k22.pl('e', 'b', undefined, [[635, 680], [650, 700], [800, 790], [850, 810]]),
    k22.own('f', 'b', undefined, [[515, 792], [470, 760], [420, 720], [400, 660]]),
    k22.own('o1', 'b', undefined, [[295, 410]]), k22.own('o2', 'b', undefined, [[232, 520]]), k22.own('o3', 'b', undefined, [[170, 775]]),
    k22.own('o4', 'b', undefined, [[800, 385]]), k22.own('o5', 'b', undefined, [[850, 575]]), k22.own('o6', 'b', undefined, [[900, 735]]),
  ],
  // d keeps his ball and kicks e's ball out of the square
  balls: k22.balls([['d', 'd', 'd', 'd'], ['e', [818, 805], [830, 812], 'e']]),
}

// p25 Juggling in pairs, on GO! a 1v1: dribble through any cone gate = 1 point
const j25 = persp([[378, 328], [715, 328], [122, 780], [960, 780]], [35, 12, 165, 98], false)
const gate = (a: [number, number], b: [number, number]) => [j25.cone(a, 'r'), j25.cone(b, 'r')]
const bc25: BookScene = {
  ...S, steps: 3,
  notes: { 1: ["Murabbiy: «GO!» — juftliklar darhol 1×1 o'ynaydi", 'Тренер: «GO!» — пары сразу играют 1×1'] },
  field: [j25.area(''), ...gate([405, 365], [447, 352]), ...gate([642, 352], [685, 362]), ...gate([515, 507], [580, 512]), ...gate([240, 705], [298, 725]), ...gate([775, 713], [832, 683])],
  players: [
    j25.pl('co', 'c', 'T', [[205, 505]]),
    j25.pl('b1', 'b', undefined, [[360, 445], [360, 445], [[450, 480], [548, 510]], [580, 535]]),
    j25.pl('w1', 'w', undefined, [[455, 440], [455, 440], [520, 485], [550, 500]]),
    j25.pl('b2', 'b', undefined, [[568, 382], [568, 382], [470, 368], [430, 350]]),
    j25.pl('w2', 'w', undefined, [[508, 355], [508, 355], [490, 365], [460, 360]]),
    j25.pl('w3', 'w', undefined, [[650, 480], [650, 480], [[655, 420], [660, 360]], [660, 335]]),
    j25.pl('b3', 'b', undefined, [[720, 450], [720, 450], [670, 390], [670, 360]]),
    j25.pl('b4', 'b', undefined, [[805, 600], [805, 600], [[700, 590], [615, 580]], [580, 575]]),
    j25.pl('w4', 'w', undefined, [[708, 560], [708, 560], [615, 555], [590, 560]]),
    j25.pl('w5', 'w', undefined, [[275, 595], [275, 595], [[270, 640], [275, 690]], [270, 730]]),
    j25.pl('b5', 'b', undefined, [[380, 595], [380, 595], [305, 655], [290, 700]]),
    j25.pl('b6', 'b', undefined, [[590, 680], [590, 680], [[650, 690], [790, 700]], [830, 720]]),
    j25.pl('w6', 'w', undefined, [[475, 725], [475, 725], [700, 718], [790, 715]]),
  ],
  balls: j25.balls([
    ['b1', ['l', [440, 452]], 'b1', 'b1'], ['b2', ['l', [520, 362]], 'b2', 'b2'], ['w3', ['l', [705, 455]], 'w3', 'w3'],
    ['b4', ['l', [725, 568]], 'b4', 'b4'], ['w5', ['l', [360, 600]], 'w5', 'w5'], ['b6', ['l', [490, 720]], 'b6', 'b6'],
  ]),
}

// p26 Triple 3v1 rondo: three 10×10 squares; on the coach's call the named colour rotates anticlockwise
const r26 = persp([[245, 592], [838, 592], [148, 788], [948, 792]], [60, 74, 140, 106], false)
const bc26: BookScene = {
  ...S, steps: 4,
  notes: { 2: ["Murabbiy: «Qizil!» — uchta qizil soat miliga teskari yo'nalishda keyingi kvadratga yuguradi", 'Тренер: «Красные!» — трое красных бегут в следующий квадрат против часовой стрелки'] },
  field: [r26.sub([440, 372], [650, 372], [392, 517], [695, 517], 'cw'), r26.sub([245, 592], [493, 592], [148, 788], [477, 788], 'cw'), r26.sub([600, 592], [838, 592], [612, 792], [948, 792], 'cw')],
  players: [
    r26.pl('co', 'c', 'T', [[857, 505]]),
    // top square: white defends
    r26.pl('tb', 'b', undefined, [[447, 400]]), r26.pl('ty', 'y', undefined, [[632, 430]]),
    r26.pl('tr', 'r', undefined, [[538, 490], [538, 490], [538, 490], [[470, 560], [395, 628]]]),
    r26.pl('tw', 'w', undefined, [[565, 440], [545, 455], [500, 430], [520, 450]]),
    // bottom-left: blue defends
    r26.pl('ly', 'y', undefined, [[248, 632]]), r26.pl('lw', 'w', undefined, [[368, 740]]),
    r26.pl('lr', 'r', undefined, [[415, 632], [415, 632], [415, 632], [[520, 660], [625, 612]]]),
    r26.pl('lb', 'b', undefined, [[460, 600], [380, 625], [320, 680], [330, 660]]),
    // bottom-right: white defends
    r26.pl('ry', 'y', undefined, [[680, 725]]), r26.pl('rb', 'b', undefined, [[887, 705]]),
    r26.pl('rr', 'r', undefined, [[630, 605], [630, 605], [630, 605], [[650, 540], [560, 488]]]),
    r26.pl('rw', 'w', undefined, [[683, 640], [690, 690], [780, 700], [760, 680]]),
  ],
  balls: r26.balls([['ty', 'tr', 'tb', 'tb'], ['lr', 'ly', 'lw', 'lw'], ['rr', 'ry', 'rb', 'rb']]),
}

// p31 Turns and moves on the coach's call: everyone dribbles, the coach calls a number (3 = inside-outside)
const m31 = persp([[283, 328], [803, 328], [122, 838], [963, 838]], SQ, false)
type V = [number, number]
const turn = (id: string, a: V, d: V): ReturnType<typeof m31.own> => {
  const b: V = [a[0] + d[0], a[1] + d[1]]
  const c: V = [b[0] + d[1] * 0.9, b[1] - d[0] * 0.9]
  const e: V = [c[0] - d[0] * 0.8, c[1] - d[1] * 0.8]
  return m31.own(id, 'b', undefined, [a, b, [[b[0] + d[0] * 0.3, b[1] + d[1] * 0.3], c], e])
}
const bc31: BookScene = {
  ...S, steps: 4,
  notes: { 1: ["Murabbiy raqamni aytadi («3!» — ichki-tashqi teginish): hamma shu harakatni bajaradi", 'Тренер называет номер («3!» — внутренней-внешней): все выполняют этот приём'], 2: ['Harakatdan keyin tezlikni oshirib, yangi yo\'nalishda olib boradi', 'После приёма ускоряются в новом направлении'] },
  field: [m31.area('')],
  players: [
    m31.pl('co', 'c', 'T', [[165, 610]]),
    turn('a', [390, 410], [40, -8]), turn('b', [540, 440], [-12, 34]), turn('c', [720, 400], [16, 28]), turn('d', [505, 528], [-38, -6]),
    turn('e', [740, 553], [14, 30]), turn('f', [338, 610], [-40, -8]), turn('g', [540, 655], [-20, 34]), turn('h', [352, 745], [22, -40]),
    turn('i', [628, 765], [-38, -14]), turn('j', [750, 705], [42, -8]),
  ],
}

// p33 Star pattern: run with the ball to the station opposite, hand it over, stay there (A→B→C→D→E→A)
const st33 = persp([[283, 325], [803, 325], [122, 838], [963, 838]], SQ, false)
const bc33: BookScene = {
  ...S, steps: 6,
  field: [st33.area(''), st33.cone([320, 778], 'y'), st33.cone([402, 778], 'y'), st33.cone([808, 568], 'y'), st33.cone([292, 520], 'y'), st33.cone([280, 565], 'y'),
    st33.cone([688, 780], 'y'), st33.cone([770, 783], 'y'), st33.cone([518, 355], 'y'), st33.cone([574, 353], 'y'),
    ['text', ...st33.pt([435, 795]), 'A'] as never, ['text', ...st33.pt([847, 515]), 'B'] as never, ['text', ...st33.pt([255, 505]), 'C'] as never,
    ['text', ...st33.pt([803, 800]), 'D'] as never, ['text', ...st33.pt([473, 352]), 'E'] as never],
  players: [
    st33.pl('co', 'c', 'T', [[172, 490]]),
    st33.pl('p1', 'b', '1', [[370, 745], [[560, 640], [770, 555]], [770, 555], [770, 555], [775, 560], [[560, 565], [360, 552]]]),
    st33.pl('p2', 'b', '2', [[790, 528], [790, 528], [[560, 560], [345, 545]]]),
    st33.pl('p3', 'b', '3', [[325, 518], [325, 518], [325, 518], [[520, 640], [700, 760]]]),
    st33.pl('p4', 'b', '4', [[720, 752], [720, 752], [720, 752], [720, 752], [[620, 560], [545, 375]]]),
    st33.pl('p5', 'b', '5', [[540, 335], [540, 335], [540, 335], [540, 335], [540, 335], [[460, 560], [385, 755]]]),
    st33.pl('p6', 'b', '6', [[300, 755], [300, 755], [345, 760], [[560, 650], [765, 560]], [775, 548], [775, 548]]),
    st33.pl('p7', 'b', undefined, [[255, 780], [255, 780], [300, 765], [345, 760], [345, 760], [345, 760]]),
  ],
  balls: st33.balls([['p1', 'p1', 'p2', 'p3', 'p4', 'p5'], ['p6', 'p6', 'p6', 'p6', 'p1', 'p1']]),
}

// p35 Six turns: dribble to a central cone, do the turn the coach calls ("outside cut"), accelerate to an outside cone
const t35 = persp([[283, 333], [803, 333], [125, 840], [962, 840]], SQ, false)
const bc35: BookScene = {
  ...S, steps: 4,
  notes: { 1: ["Murabbiy: «Tashqi tomon bilan burilish!» — markaziy konusda burilib, tezlik bilan chetga", 'Тренер: «Поворот внешней стороной!» — поворот у центральной фишки и ускорение к краю'] },
  field: [t35.area(''), t35.sub([485, 503], [610, 503], [472, 600], [620, 600], 'cr'),
    ...([[400, 378], [690, 375], [325, 402], [758, 400], [238, 735], [315, 780], [770, 780], [848, 735]] as V[]).map((q) => t35.cone(q, 'y'))],
  players: [
    t35.pl('co', 'c', 'T', [[165, 500]]),
    t35.own('a', 'b', undefined, [[365, 395], [[420, 430], [462, 482]], [[440, 470], [340, 412]], [[400, 430], [465, 485]]]),
    t35.own('b', 'b', undefined, [[598, 492], [[660, 430], [728, 388]], [[640, 440], [602, 490]], [[660, 430], [740, 395]]]),
    t35.own('c', 'b', undefined, [[262, 760], [[340, 700], [425, 628]], [[360, 690], [270, 752]], [[340, 700], [430, 625]]]),
    t35.own('d', 'b', undefined, [[642, 606], [[740, 690], [822, 765]], [[730, 680], [648, 605]], [[740, 690], [830, 760]]]),
  ],
}

// p37 Running with the ball at speed to catch the opponent: blue and white 1s start in opposite corners and race round the gates
const c37 = persp([[283, 333], [803, 333], [122, 838], [963, 838]], SQ, false)
const bc37: BookScene = {
  ...S, steps: 3,
  field: [c37.area(''), c37.cone([325, 402], 'y'), c37.cone([403, 370], 'y'), c37.cone([685, 370], 'w'), c37.cone([760, 400], 'w'),
    c37.cone([237, 733], 'r'), c37.cone([315, 775], 'r'), c37.cone([772, 778], 'y'), c37.cone([848, 738], 'y')],
  players: [
    c37.pl('co', 'c', 'T', [[170, 515]]),
    c37.pl('b1', 'b', '1', [[275, 772], [[420, 800], [600, 800], [772, 790]], [[800, 690], [752, 485]]]),
    c37.pl('b2', 'b', '2', [[185, 770]]), c37.pl('b3', 'b', '3', [[150, 782]]),
    c37.pl('w1', 'w', '1', [[730, 355], [[640, 352], [520, 345], [403, 360]], [[350, 420], [328, 520]]]),
    c37.pl('w2', 'w', '2', [[758, 325]]), c37.pl('w3', 'w', '3', [[788, 322]]),
  ],
  balls: c37.balls([['b1', 'b1', 'b1'], ['w1', 'w1', 'w1']]),
}

// p38 1v1 at speed: on GO! the attacker runs with the ball to the gate diagonally opposite; if caught, he shields the ball
const d38 = persp([[283, 330], [803, 330], [122, 838], [963, 838]], SQ, false)
const bc38: BookScene = {
  ...S, steps: 4,
  notes: { 1: ["Himoyachi yetib keldi: hujumchi tanasi bilan to'pni to'sadi (qo'l bilan himoyachini his qiladi)", 'Защитник догнал: атакующий закрывает мяч корпусом (рукой чувствует защитника)'] },
  field: [d38.area(''), d38.cone([330, 395], 'y'), d38.cone([405, 360], 'y'), d38.cone([687, 362], 'r'), d38.cone([758, 390], 'r'),
    d38.cone([237, 728], 'r'), d38.cone([315, 773], 'r'), d38.cone([772, 773], 'y'), d38.cone([848, 728], 'y')],
  players: [
    d38.pl('co', 'c', 'T', [[165, 515]]),
    d38.pl('a1', 'b', 'A', [[355, 380], [448, 490], [[480, 560], [560, 640]], [[700, 720], [810, 765]]]),
    d38.pl('d1', 'w', 'D', [[388, 368], [[470, 420], [500, 490]], [585, 625], [760, 735]]),
    d38.pl('a2', 'b', 'A', [[710, 352], [655, 425], [[560, 520], [470, 600]], [[380, 680], [280, 760]]]),
    d38.pl('d2', 'w', 'D', [[738, 348], [620, 428], [500, 590], [320, 715]]),
    d38.pl('a3', 'b', 'A', [[770, 335]], true), d38.pl('d3', 'w', 'D', [[797, 330]], true),
    d38.pl('a4', 'b', 'A', [[885, 765]], true), d38.pl('d4', 'w', 'D', [[920, 775]], true),
  ],
  balls: d38.balls([['a1', 'a1', 'a1', 'a1'], ['a2', 'a2', 'a2', 'a2']]),
}

// p40 4v4 (+2 jokers): at least 3-5 touches before every pass, so the players carry the ball (moves 1-10 as in the book)
const j40 = persp([[283, 325], [803, 325], [122, 833], [962, 833]], SQ, false)
const bc40: BookScene = {
  ...S, steps: 11, speed: 1.1,
  field: [j40.area('cr')],
  players: [
    j40.pl('co', 'c', 'T', [[183, 490]]),
    j40.pl('b1', 'b', undefined, [[815, 560]]),
    j40.pl('b2', 'b', undefined, [[770, 760], [806, 795], [[760, 805], [702, 798]]]),
    j40.pl('b4', 'b', undefined, [[300, 640], [300, 640], [300, 640], [290, 630], [275, 615], [262, 600], [[270, 550], [290, 500]]]),
    j40.pl('b3', 'b', undefined, [[450, 390], [450, 390], [450, 390], [450, 390], [440, 380], [430, 375], [420, 370], [398, 357], [[440, 345], [505, 345]]]),
    j40.pl('j1', 'y', undefined, [[705, 400], [705, 400], [705, 400], [705, 400], [705, 400], [705, 400], [705, 400], [705, 400], [705, 400], [705, 408], [[690, 450], [655, 495]]]),
    j40.pl('j2', 'y', undefined, [[468, 730], [468, 730], [468, 730], [466, 742], [[380, 742], [372, 690], [435, 650]]]),
    j40.pl('w1', 'w', undefined, [[395, 485], [395, 485], [395, 485], [400, 540], [410, 580], [360, 560], [330, 530], [360, 470], [420, 420], [480, 420], [560, 440]]),
    j40.pl('w2', 'w', undefined, [[470, 600], [500, 640], [520, 680], [500, 690], [460, 680], [420, 640], [400, 600], [420, 560], [460, 500], [520, 480], [580, 500]]),
    j40.pl('w3', 'w', undefined, [[740, 525], [760, 580], [760, 620], [720, 640], [660, 640], [620, 620], [600, 580], [600, 520], [620, 470], [650, 450], [660, 460]]),
    j40.pl('w4', 'w', undefined, [[665, 685], [700, 720], [700, 740], [640, 720], [580, 700], [540, 680], [520, 660], [520, 620], [560, 580], [600, 560], [620, 560]]),
  ],
  balls: j40.balls([['b1', 'b2', 'b2', 'j2', 'j2', 'b4', 'b4', 'b3', 'b3', 'j1', 'j1']]),
}

export const BC_A: Record<string, BookScene> = { 'bc-15': bc15, 'bc-16': bc16, 'bc-21': bc21, 'bc-22': bc22, 'bc-25': bc25, 'bc-26': bc26, 'bc-31': bc31, 'bc-33': bc33, 'bc-35': bc35, 'bc-37': bc37, 'bc-38': bc38, 'bc-40': bc40 }

export const MORE_BC_A: Record<string, More> = {
  // the next pair races (number 2s), then the 1v1 at speed by the next attacker/defender pairs
  'bc-37': replay(bc37, { b1: 'b2', w1: 'w2', b2: 'b3', w2: 'w3' }),
  'bc-38': replay(bc38, { a1: 'a3', d1: 'd3', a2: 'a4', d2: 'd4' }),
  // new round: in every pair the other player has the ball when the coach shouts GO!
  'bc-25': replay(bc25, { b1: 'w1', w1: 'b1', b2: 'w2', w2: 'b2', w3: 'b3', b3: 'w3', b4: 'w4', w4: 'b4', w5: 'b5', b5: 'w5', b6: 'w6', w6: 'b6' }),
  // the blues keep throwing (calling a name each time); the whites intercept and it is their ball
  'bc-15': h15.more(4, {
    b5: [[795, 718], [760, 700], [720, 690], [700, 700]], b1: [[600, 420], [610, 430], [560, 470], [520, 470]], b4: [[820, 550], [800, 520], [800, 520], [760, 540]],
    w5: [[770, 660], [760, 690], [720, 620], [700, 560]], w1: [[560, 470], [580, 440], [560, 450], [600, 420]], w3: [[520, 650], [560, 620], [600, 560], [640, 520]],
    w4: [[660, 620], [690, 600], [690, 600], [720, 600]], w2: [[400, 600], [420, 560], [400, 520], [380, 500]],
  }, [['b5', 'b1', 'w1', 'w3']]),
  // the rally goes on: control (one bounce allowed) and lob it back over the line
  'bc-16': t16.more(4, {}, pairs16.map(([n, l, r, ltr]) => (ltr
    ? ['r' + n, ['l', [l[0] + 14, l[1] + 6]], 'l' + n, ['l', [r[0] - 14, r[1] + 6]]]
    : ['l' + n, ['l', [r[0] - 14, r[1] + 6]], 'r' + n, ['l', [l[0] + 14, l[1] + 6]]]))),
}
