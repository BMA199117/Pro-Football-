import type { BookScene, More } from './scene'
import { frame } from './pos-util'

/**
 * "4-3-3 In Possession" (Phase of Play): sample drills for the Professional section after the
 * book's diagrams: orange in possession, black defending, green neutrals (our yellow); numbers = 4-3-3 positions.
 * Book key: ball = solid line, player = dashed line.
 */
const K = { key: 'fifa' as const, speed: 1.2 }

// p11 4v2 positional rondo: goalkeeper, two centre-backs and the holding midfielder against two pressers (2 touches)
const a11 = frame([889, 118, 1092, 262], [55, 15, 145, 95])
const ip11a: BookScene = {
  ...K, steps: 2,
  field: [a11.area([889, 118], [1092, 262])],
  players: [
    a11.pl('gk', 'o', '1', [[1003, 254]]), a11.pl('o5', 'o', '5', [[898, 177]]), a11.pl('o6', 'o', '6', [[959, 127]]), a11.pl('o4', 'o', '4', [[1085, 207]]),
    a11.pl('c9', 'c', '9', [[985, 166], [957, 172]]), a11.pl('c11', 'c', '11', [[1008, 204], [982, 195]]),
  ],
  balls: a11.balls([['gk', 'o5']]),
}

// p11 5+GK v 5: play out from the back against a high press and score in one of 3 small goals; black has 6 seconds after winning the ball
const b11 = frame([414, 37, 779, 424], [15, 5, 185, 105])
const ip11b: BookScene = {
  ...K, steps: 3,
  field: [b11.area([414, 37], [779, 424]), b11.goal([573, 424], 'u'), ...[428, 573, 723].map((x) => b11.mini([x, 40], 'd')),
    b11.line([481, 37], [481, 424]), b11.line([666, 37], [666, 424]), b11.line([414, 261], [779, 261], false),
    b11.line([481, 371], [666, 371], false), b11.line([481, 371], [481, 424], false), b11.line([666, 371], [666, 424], false)],
  players: [
    b11.pl('gk', 'o', '1', [[575, 402]]), b11.pl('o5', 'o', '5', [[443, 318]]), b11.pl('o6', 'o', '6', [[571, 236]]),
    b11.pl('o4', 'o', '4', [[717, 318]]), b11.pl('o8', 'o', '8', [[436, 168]]), b11.pl('o10', 'o', '10', [[749, 177]]),
    b11.pl('c8', 'c', '8', [[568, 146], [568, 146], [571, 186]]), b11.pl('c7', 'c', '7', [[444, 200]]), b11.pl('c10', 'c', '10', [[709, 174]]),
    b11.pl('c11', 'c', '11', [[615, 297], [597, 268]]), b11.pl('c9', 'c', '9', [[518, 330]]),
  ],
  balls: b11.balls([['gk', 'o5', 'o6']]),
}

// p13 5v3 positional rondo with transitions: from centre-back 5 to winger 11 up top, 10 passes = a point; black counters into 4 small goals
const f13 = frame([30, 10, 186, 217], [55, 15, 145, 95])
const ip13: BookScene = {
  ...K, steps: 3,
  field: [f13.area([30, 10], [186, 217]), f13.mini([206, 105], 'l'), f13.mini([206, 183], 'l'), f13.mini([10, 105], 'r'), f13.mini([10, 183], 'r')],
  players: [
    f13.pl('o5', 'o', '5', [[112, 211]]), f13.pl('o8', 'o', '8', [[100, 108]]), f13.pl('o3', 'o', '3', [[34, 99]]),
    f13.pl('o11', 'o', '11', [[63, 12]]), f13.pl('o6', 'o', '6', [[176, 136]]),
    f13.pl('c2', 'c', '2', [[92, 51], [92, 51], [68, 68]]), f13.pl('c7', 'c', '7', [[122, 90]]), f13.pl('c10', 'c', '10', [[85, 145], [65, 125]]),
  ],
  balls: f13.balls([['o5', 'o8', 'o3']]),
}

// p19 2v2+1: a goal counts only after a third-man combination with the neutral 10 (one touch)
const a19 = frame([334, 57, 498, 257], [40, 25, 160, 85])
const ip19a: BookScene = {
  ...K, steps: 4,
  field: [a19.area([334, 57], [498, 257]), a19.mini([376, 57], 'd'), a19.mini([457, 57], 'd'), a19.mini([376, 257], 'u'), a19.mini([457, 257], 'u'),
    a19.line([334, 152], [498, 152], false), ['circle', 100, 55, 17]],
  players: [
    a19.pl('o6', 'o', '6', [[425, 209]]), a19.pl('n10', 'y', '10', [[438, 134]]),
    a19.pl('o8', 'o', '8', [[348, 165], [355, 130], [362, 97]]),
    a19.pl('c6', 'c', '6', [[432, 107]]), a19.pl('c8', 'c', '8', [[389, 145]]),
  ],
  balls: a19.balls([['o6', 'n10', 'o8', ['s', [376, 62]]]]),
}

// p19 4v4 with a false 9: 1 point for a goal, 3 points for a goal after "up, back, through"
const b19 = frame([75, 192, 305, 628], [20, 20, 180, 90])
const ip19b: BookScene = {
  ...K, steps: 4,
  field: [b19.area([75, 192], [305, 628]), b19.mini([133, 192], 'd'), b19.mini([245, 192], 'd'), b19.mini([133, 628], 'u'), b19.mini([245, 628], 'u'),
    b19.line([75, 410], [305, 410], false), ['circle', 100, 55, 22]],
  players: [
    b19.pl('o6', 'o', '6', [[157, 490]]), b19.pl('o9', 'o', '9', [[188, 293]]), b19.pl('o10', 'o', '10', [[284, 372]]), b19.pl('o8', 'o', '8', [[112, 380]]),
    b19.pl('c6', 'c', '6', [[210, 250]]), b19.pl('c8', 'c', '8', [[137, 278]]), b19.pl('c10', 'c', '10', [[228, 350]]), b19.pl('c9', 'c', '9', [[191, 461]]),
  ],
  balls: b19.balls([['o6', 'o9', 'o10', ['s', [245, 198]]]]),
}

// p21 2v2+2 wide rondo: winger and full-back (1 touch, always moving) with two neutral centre-backs (2 touches) who look for the vertical pass
const f21 = frame([633, 20, 783, 222], [40, 25, 160, 85])
const ip21: BookScene = {
  ...K, steps: 4,
  field: [f21.area([633, 20], [783, 222]), f21.line([666, 20], [666, 222]), f21.line([750, 20], [750, 222])],
  players: [
    f21.pl('o11', 'o', '11', [[645, 148]]), f21.pl('n4', 'y', '4', [[707, 218]]), f21.pl('n5', 'y', '5', [[707, 20]]),
    f21.pl('o3', 'o', '3', [[771, 125], [771, 115], [771, 105], [771, 98]]),
    f21.pl('c7', 'c', '7', [[677, 133], [677, 133], [705, 118]]), f21.pl('c2', 'c', '2', [[732, 157], [732, 157], [742, 127]]),
  ],
  balls: f21.balls([['o11', 'n4', 'n5', 'o3']]),
}

// p33 4+2 v 4+2 finishing centrally: a goal only counts after a pass from one of the two players behind the goal (one touch)
const f33 = frame([102, 55, 316, 431], [12, 5, 188, 105])
const ip33: BookScene = {
  ...K, steps: 5,
  field: [f33.area([102, 55], [316, 431]), f33.goal([210, 55], 'd'), f33.goal([210, 431], 'u'), f33.line([102, 243], [316, 243], false),
    f33.line([102, 117], [316, 117], false), f33.line([102, 369], [316, 369], false)],
  players: [
    f33.pl('gk', 'o', '1', [[217, 410]]), f33.pl('o7', 'o', '7', [[298, 231]]), f33.pl('o11', 'o', '11', [[129, 227]]),
    f33.pl('o9', 'o', '9', [[228, 157]]), f33.pl('o10', 'o', '10', [[190, 320]]),
    f33.pl('o8', 'o', '8', [[137, 44]]), f33.pl('o6', 'o', '6', [[286, 44]]),
    f33.pl('gr', 'c', '1', [[216, 92]]), f33.pl('c7', 'c', '7', [[167, 172]]), f33.pl('c11', 'c', '11', [[266, 153]]),
    f33.pl('c9', 'c', '9', [[223, 270]]), f33.pl('c10', 'c', '10', [[258, 340]]),
    f33.pl('c8', 'c', '8', [[137, 442]]), f33.pl('c6', 'c', '6', [[286, 442]]),
  ],
  balls: f33.balls([['gk', 'o7', 'o6', 'o9', ['s', [238, 60]]]]),
}

// p38 5v5+2GK break-out game: 5 passes in the square, then break out to either goal (5 seconds); on a turnover the other team breaks out at once
const f38 = frame([462, 45, 830, 543], [10, 5, 190, 105])
const ip38: BookScene = {
  ...K, steps: 4,
  field: [f38.area([462, 45], [830, 543]), f38.goal([646, 45], 'd'), f38.goal([646, 543], 'u'), f38.area([559, 206], [735, 382]),
    f38.line([563, 45], [462, 147]), f38.line([730, 45], [830, 147]), f38.line([563, 543], [462, 441]), f38.line([730, 543], [830, 441])],
  players: [
    f38.pl('gk', 'y', '12', [[646, 75]]), f38.pl('gr', 'y', '1', [[646, 515]]),
    f38.pl('o10', 'o', '10', [[671, 368]]), f38.pl('o8', 'o', '8', [[583, 341]]), f38.pl('o7', 'o', '7', [[706, 271]]),
    f38.pl('o11', 'o', '11', [[580, 252], [580, 252], [580, 252], [586, 212]]), f38.pl('o9', 'o', '9', [[648, 252], [648, 252], [648, 252], [645, 212]]),
    f38.pl('c9', 'c', '9', [[625, 325]]), f38.pl('c8', 'c', '8', [[680, 270]]), f38.pl('c7', 'c', '7', [[590, 305]]), f38.pl('c11', 'c', '11', [[700, 311]]),
    f38.pl('c10', 'c', '10', [[612, 246], [612, 246], [612, 246], [628, 187]]),
  ],
  balls: f38.balls([['o10', 'c9', 'c8', [643, 158]]]),
}

export const IP_SCENES: Record<string, BookScene> = {
  'ip-11a': ip11a, 'ip-11b': ip11b, 'ip-13': ip13, 'ip-19a': ip19a, 'ip-19b': ip19b, 'ip-21': ip21, 'ip-33': ip33, 'ip-38': ip38,
}

/** What happens after the book moment (animation only). */
export const MORE_IP: Record<string, More> = {
  // the ball keeps moving round the diamond: 5 → 6 → 4 → goalkeeper, the two pressers chase
  'ip-11a': a11.more(3, {
    o6: [[965, 135]], c9: [[950, 150], [1000, 170], [1030, 210]], c11: [[960, 180], [1020, 200], [1015, 230]],
  }, [['o6', 'o4', 'gk']]),
  // 6 turns and finds 10 between the lines, who scores in a small goal
  'ip-11b': b11.more(3, {
    o10: [[740, 150], [728, 110], [725, 90]], c10: [[720, 160], [722, 120]], c8: [[600, 200], [640, 160]],
  }, [['o10', 'o10', ['s', [723, 46]]]]),
  // full-back 3 finds the winger 11: the target is reached, 11 bounces it to 6
  'ip-13': f13.more(2, {
    o6: [[160, 70]], c2: [[70, 40], [100, 40]], c10: [[60, 110], [80, 90]],
  }, [['o11', 'o6']]),
  // the blacks start from the other end, also through the neutral
  'ip-19a': a19.more(4, {
    c8: [[400, 170], [420, 210], [440, 230]], c6: [[440, 150], [455, 200]], n10: [[430, 140]], o8: [[380, 120], [410, 150], [430, 190]], o6: [[425, 209], [440, 220]],
  }, [['c8', 'n10', 'c6', ['s', [457, 252]]]]),
  // the blacks attack the other way: up to their 9, back, through and a shot
  'ip-19b': b19.more(4, {
    c6: [[210, 300]], c10: [[230, 400], [240, 460]], c9: [[191, 500], [200, 560], [230, 600]], o9: [[200, 320], [220, 380]],
  }, [['c6', 'c10', 'c9', ['s', [245, 622]]]]),
  // full-back 3 plays it back to the neutral, the winger moves up the line and receives
  'ip-21': f21.more(2, {
    o11: [[650, 100], [650, 70]], c7: [[700, 100], [680, 80]], c2: [[750, 110], [760, 100]],
  }, [['n5', 'o11']]),
  // now the blacks: from their goalkeeper, through a player behind the other goal
  'ip-33': f33.more(4, {
    c9: [[223, 300], [215, 380]], c10: [[250, 360]], o10: [[200, 340], [210, 360]], o9: [[228, 200], [230, 250]],
  }, [['gr', 'c10', 'c8', 'c9', ['s', [205, 425]]]]),
  // black 10 is through and scores within the 5 seconds
  'ip-38': f38.more(2, {
    c10: [[643, 150], [640, 130]], o9: [[645, 175], [645, 150]], o11: [[600, 180]], gk: [[646, 80]],
  }, [['c10', ['s', [646, 50]]]]),
}
