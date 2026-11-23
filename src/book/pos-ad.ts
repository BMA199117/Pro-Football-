import type { BookScene, Item, More } from './scene'
import { frame, type Px } from './pos-util'

/**
 * "The Art of Defending" (Phase of Play): sample drills for the Professional section, drawn after the
 * book's diagrams (the book colours: light blue and black teams, green neutrals = our yellow), book pages in the ids.
 * Book key: ball movement = solid line, player movement = dashed line.
 */
const K = { key: 'fifa' as const, speed: 1.2 }
type F = ReturnType<typeof frame>
const dummy = (f: F, q: Px): Item => { const a = f.pt(q); return ['dummy', a[0], a[1]] }
const circle = (f: F, q: Px, r: number): Item => { const a = f.pt(q); return ['circle', a[0], a[1], r] }

// p7 6v4 double rondo: after black win the ball, the four outside blacks may only play through the two inside
const f7 = frame([394, 182, 662, 425], [54, 4, 146, 106])
const ad7: BookScene = {
  ...K, steps: 3,
  field: [f7.area([394, 182], [662, 425]), f7.area([446, 231], [610, 375])],
  players: [
    f7.pl('c10', 'c', '10', [[550, 205]]), f7.pl('c11', 'c', '11', [[628, 280]]), f7.pl('c7', 'c', '7', [[407, 325]]), f7.pl('c9', 'c', '9', [[499, 397]]),
    f7.pl('c8', 'c', '8', [[499, 312]]), f7.pl('c6', 'c', '6', [[566, 354]]),
    f7.pl('b11', 'b', '11', [[526, 258]]), f7.pl('b9', 'b', '9', [[462, 300]]), f7.pl('b7', 'b', '7', [[570, 300]]), f7.pl('b10', 'b', '10', [[518, 350]]),
  ],
  balls: f7.balls([['c9', 'c6', 'c11']]),
}

// p8 6v6 possession with transitions: only 4 defenders may enter the other half; on a regain the ball goes to the own half
const f8 = frame([424, 168, 630, 432], [47, 14, 153, 96])
const ad8: BookScene = {
  ...K, steps: 3,
  field: [f8.area([424, 168], [630, 432]), f8.line([424, 299], [630, 299], false)],
  players: [
    f8.pl('b6', 'b', '6', [[500, 315]]), f8.pl('b9', 'b', '9', [[585, 319]]), f8.pl('b3', 'b', '3', [[449, 339]]),
    f8.pl('b2', 'b', '2', [[622, 354]]), f8.pl('b5', 'b', '5', [[471, 406]]), f8.pl('b4', 'b', '4', [[592, 406]]),
    f8.pl('c11', 'c', '11', [[483, 213]]), f8.pl('c6', 'c', '6', [[582, 195]]), f8.pl('c10', 'c', '10', [[492, 344]]), f8.pl('c8', 'c', '8', [[541, 337]]),
    f8.pl('c7', 'c', '7', [[568, 363], [568, 363], [574, 374], [580, 385]]),
    f8.pl('c9', 'c', '9', [[509, 379], [509, 379], [525, 386], [541, 393]]),
  ],
  balls: f8.balls([['b3', 'b5', 'b4']]),
}

// p9 6v6+3 counter-pressing: four zones, at most two players of each team per zone (4v2 for the ball side)
const f9 = frame([401, 186, 650, 434], [50, 5, 150, 105])
const ad9: BookScene = {
  ...K, steps: 5,
  field: [f9.area([401, 186], [650, 434]), f9.line([525, 186], [525, 434]), f9.line([401, 309], [650, 309])],
  players: [
    f9.pl('n8', 'y', '8', [[534, 198]]), f9.pl('n6', 'y', '6', [[526, 312]]), f9.pl('n10', 'y', '10', [[517, 423]]),
    f9.pl('b11', 'b', '11', [[472, 231]]), f9.pl('b6', 'b', '6', [[570, 227]]), f9.pl('b8', 'b', '8', [[616, 278]]),
    f9.pl('b3', 'b', '3', [[435, 293]]), f9.pl('b9', 'b', '9', [[457, 394]]), f9.pl('b7', 'b', '7', [[591, 393]]),
    f9.pl('c11', 'c', '11', [[543, 247], [543, 247], [543, 247], [523, 255], [503, 262]]),
    f9.pl('c7', 'c', '7', [[501, 292], [501, 292], [501, 292], [483, 290], [465, 288]]),
    f9.pl('c9', 'c', '9', [[581, 290]]), f9.pl('c2', 'c', '2', [[467, 350]]), f9.pl('c5', 'c', '5', [[617, 334]]), f9.pl('c4', 'c', '4', [[561, 368]]),
  ],
  balls: f9.balls([['b8', 'b6', 'n8', 'b11', 'b3']]),
}

// p13 6v5+GK pressing from a low block (Mourinho): ball goes wide, nearest defender presses from the front,
// nearest midfielder from inside, the third man closes the simplest lane; everyone shifts across
const f13 = frame([370, 190, 690, 460], [55, 2, 144, 108])
const ad13: BookScene = {
  ...K, steps: 3,
  field: [f13.area([371, 216], [681, 453]), f13.area([428, 379], [618, 453]), f13.area([479, 428], [566, 453]), f13.goal([525, 453], 'u'),
    circle(f13, [522, 217], 14), f13.line([427, 216], [427, 379]), f13.line([479, 216], [479, 428]), f13.line([566, 216], [566, 428]), f13.line([618, 216], [618, 379]),
    f13.mini([418, 210], 'd'), f13.mini([522, 210], 'd'), f13.mini([622, 210], 'd')],
  players: [
    f13.pl('b6', 'b', '6', [[586, 243]]), f13.pl('b7', 'b', '7', [[642, 313]]), f13.pl('b8', 'b', '8', [[570, 297]]),
    f13.pl('b10', 'b', '10', [[497, 290]]), f13.pl('b11', 'b', '11', [[440, 316]]), f13.pl('b9', 'b', '9', [[536, 343]]),
    f13.pl('gr', 'c', '1', [[525, 441]]),
    f13.pl('c3', 'c', '3', [[622, 352], [622, 352], [629, 342], [636, 333]]),
    f13.pl('c6', 'c', '6', [[557, 321], [557, 321], [568, 318], [580, 315]]),
    f13.pl('c5', 'c', '5', [[572, 362], [572, 362], [585, 356], [598, 349]]),
    f13.pl('c4', 'c', '4', [[505, 360], [505, 360], [516, 358], [527, 355]]),
    f13.pl('c2', 'c', '2', [[450, 345], [450, 345], [459, 345], [468, 346]]),
  ],
  balls: f13.balls([['b6', 'b7', 'b7']]),
}

// p15 4+2v4+2 compactness (Simeone): the four are locked one per zone; pass through the line to a striker,
// one-touch to the other striker, one-touch finish
const f15 = frame([392, 190, 648, 395], [58, 3, 142, 108])
const ad15: BookScene = {
  ...K, steps: 5,
  field: [f15.area([392, 211], [648, 377]), f15.line([449, 211], [449, 377]), f15.line([512, 211], [512, 377]), f15.line([581, 211], [581, 377]),
    f15.line([392, 294], [648, 294]), f15.mini([442, 198], 'd'), f15.mini([580, 198], 'd'), f15.mini([442, 388], 'u'), f15.mini([580, 388], 'u')],
  players: [
    f15.pl('b11', 'b', '11', [[472, 246]]), f15.pl('b9', 'b', '9', [[567, 232]]),
    f15.pl('b7', 'b', '7', [[407, 320]]), f15.pl('b6', 'b', '6', [[480, 322]]), f15.pl('b8', 'b', '8', [[551, 322]]), f15.pl('b10', 'b', '10', [[618, 322]]),
    f15.pl('c3', 'c', '3', [[412, 275]]), f15.pl('c5', 'c', '5', [[480, 270]]), f15.pl('c4', 'c', '4', [[552, 270]]), f15.pl('c2', 'c', '2', [[618, 265]]),
    f15.pl('c9', 'c', '9', [[443, 348]]), f15.pl('c11', 'c', '11', [[579, 348]]),
  ],
  balls: f15.balls([['b8', 'b10', 'b9', 'b11', ['s', [441, 204]]]]),
}

// p17 5v5+1 defending the switch of play: a direct switch from zone B to zone B is worth 3 goals;
// the whole defending block must slide across together
const f17 = frame([378, 165, 658, 440], [48, 2, 152, 108])
const ad17: BookScene = {
  ...K, steps: 3,
  field: [f17.area([378, 181], [657, 421]), f17.line([474, 181], [474, 421]), f17.line([571, 181], [571, 421]), f17.line([378, 301], [657, 301]),
    f17.mini([428, 172], 'd'), f17.mini([520, 172], 'd'), f17.mini([616, 172], 'd'), f17.mini([428, 430], 'u'), f17.mini([520, 430], 'u'), f17.mini([616, 430], 'u')],
  players: [
    f17.pl('b9', 'b', '9', [[520, 245]]), f17.pl('b11', 'b', '11', [[409, 278]]), f17.pl('b10', 'b', '10', [[612, 290]]),
    f17.pl('b8', 'b', '8', [[429, 334]]), f17.pl('b7', 'b', '7', [[620, 375]]), f17.pl('n6', 'y', '6', [[536, 315]]),
    f17.pl('c3', 'c', '3', [[477, 238], [462, 240], [448, 242]]), f17.pl('c4', 'c', '4', [[544, 235], [527, 235], [510, 235]]),
    f17.pl('c5', 'c', '5', [[603, 262], [588, 262], [573, 262]]), f17.pl('c2', 'c', '2', [[561, 274], [546, 274], [532, 274]]),
    f17.pl('c6', 'c', '6', [[492, 293], [477, 290], [462, 287]]),
  ],
  balls: f17.balls([['b7', ['l', [409, 278]], ['s', [428, 180]]]]),
}

// p23 3+GK v 4 defending a counter-attack: the defending trio loses the ball to a winger and must drop and delay
const f23 = frame([370, 170, 690, 440], [55, 2, 144, 108])
const ad23: BookScene = {
  ...K, steps: 5,
  field: [f23.area([371, 175], [681, 436]), f23.line([371, 193], [681, 193], false), circle(f23, [522, 193], 14),
    f23.area([431, 356], [617, 436]), f23.area([482, 405], [566, 436]), f23.goal([523, 436], 'u')],
  players: [
    f23.pl('b6', 'b', '6', [[523, 205]]), f23.pl('b5', 'b', '5', [[495, 250], [495, 250], [495, 250], [495, 250], [497, 280]]),
    f23.pl('b4', 'b', '4', [[547, 250], [547, 250], [547, 250], [547, 250], [552, 280]]), f23.pl('gk', 'b', '1', [[545, 394]]),
    f23.pl('c11', 'c', '11', [[448, 205], [448, 205], [448, 205], [448, 205], [450, 250]]),
    f23.pl('c10', 'c', '10', [[497, 221], [497, 221], [497, 221], [497, 221], [497, 280]]),
    f23.pl('c9', 'c', '9', [[545, 220], [545, 220], [545, 220], [545, 220], [547, 278]]),
    f23.pl('c7', 'c', '7', [[597, 205], [597, 205], [597, 205], [597, 205], [592, 262]]),
  ],
  balls: f23.balls([['b4', 'b5', 'b6', 'c7', 'c7']]),
}

// p26 4+GK v 5 defending the box: two passes in zone 1, ball to the winger in front of the mannequin, cross within 5 s;
// the defenders win it and clear into one of the three small goals
const f26 = frame([380, 150, 690, 410], [55, 2, 145, 108])
const ad26: BookScene = {
  ...K, steps: 4,
  field: [f26.area([380, 176], [685, 400]), f26.line([449, 176], [449, 330]), f26.line([625, 176], [625, 330]), f26.line([449, 257], [625, 257]),
    f26.area([449, 330], [625, 400]), f26.area([497, 374], [578, 400]), f26.goal([536, 400], 'u'),
    f26.mini([537, 168], 'd'), f26.mini([405, 250], 'r'), f26.mini([668, 250], 'l'), dummy(f26, [430, 283]), dummy(f26, [645, 283])],
  players: [
    f26.pl('c10', 'c', '10', [[597, 212]]), f26.pl('c4', 'c', '4', [[488, 209]]),
    f26.pl('c2', 'c', '2', [[407, 288], [407, 288], [407, 288], [411, 326]]),
    f26.pl('c9', 'c', '9', [[534, 283], [534, 283], [534, 283], [530, 300], [527, 318]]),
    f26.pl('c11', 'c', '11', [[664, 273], [664, 273], [664, 273], [652, 292], [640, 310]]),
    f26.pl('gk', 'b', '1', [[530, 385]]), f26.pl('b6', 'b', '6', [[530, 245], [530, 245], [530, 245], [528, 258], [526, 270]]),
    f26.pl('b5', 'b', '5', [[494, 299], [494, 299], [494, 299], [490, 308], [487, 318]]),
    f26.pl('b4', 'b', '4', [[554, 300], [554, 300], [554, 300], [550, 308], [547, 318]]),
    f26.pl('b2', 'b', '2', [[606, 301], [606, 301], [606, 301], [600, 310], [593, 318]]),
  ],
  balls: f26.balls([['c10', 'c4', ['l', [411, 326]], ['l', [540, 340]]]]),
}

export const AD_SCENES: Record<string, BookScene> = {
  'ad-7': ad7, 'ad-8': ad8, 'ad-9': ad9, 'ad-13': ad13, 'ad-15': ad15, 'ad-17': ad17, 'ad-23': ad23, 'ad-26': ad26,
}

export const MORE_AD: Record<string, More> = {
  // circulation through the inside pair: 11 → 8 → 7, the four blues shift to cut the lanes
  'ad-7': f7.more(3, {
    b7: [[590, 290], [580, 300]], b11: [[540, 260], [520, 270], [490, 290]], b9: [[470, 305], [450, 315], [440, 320]],
  }, [['c8', 'c7', 'c10']]),
  // 7 wins the ball off 4 and plays into the own half; blue send four forward to win it straight back
  'ad-8': f8.more(3, {
    c7: [[588, 398], [588, 398]], b9: [[585, 300], [585, 270], [585, 230]], b6: [[500, 290], [495, 260], [490, 230]],
    b2: [[620, 320], [610, 290]], b3: [[455, 300], [465, 270]],
  }, [['c7', 'c6', 'c11']]),
  // 7 intercepts the pass to 3 and must connect three passes in the same zone; blue counter-press in that zone at once
  'ad-9': f9.more(3, {
    c7: [[452, 295], [452, 295], [455, 300]], c11: [[495, 255], [500, 250]],
    b3: [[440, 300], [445, 297], [450, 300]], b11: [[475, 240], [490, 248], [497, 252]],
  }, [[[452, 295], 'c11', 'c7']]),
  // forced backwards: 7 plays back to 6, the switch goes to 10 and the movements are mirrored
  'ad-13': f13.more(3, {
    c3: [[630, 345], [622, 352], [615, 355]], c6: [[565, 318], [540, 318], [520, 315]],
    c5: [[590, 355], [572, 362], [560, 362]], c4: [[520, 357], [505, 357], [497, 350]], c2: [[462, 346], [455, 340], [470, 325]],
  }, [['b6', 'b10', 'b10']]),
  // the other direction: through the blue line into black 11, one touch to 9, one-touch finish
  'ad-15': f15.more(4, {
    c11: [[579, 348], [575, 350]], c9: [[443, 348], [445, 355]],
  }, [['c4', 'c11', 'c9', ['s', [442, 384]]]]),
  // the defenders win it back and break into a small goal at the other end
  'ad-17': f17.more(3, {
    c2: [[540, 300], [535, 360], [528, 395]], b9: [[515, 280], [520, 330], [522, 370]],
  }, [['c6', 'c2', ['s', [520, 425]]]]),
  // 7 drives on, plays 9; blue drop and delay, the keeper sweeps
  'ad-23': f23.more(3, {
    c7: [[588, 300], [580, 330]], c9: [[548, 310], [545, 345], [540, 360]], c10: [[497, 315], [500, 345]],
    b4: [[560, 310], [552, 340], [545, 355]], b5: [[505, 315], [510, 340]], b6: [[540, 260], [560, 300], [570, 330]],
    gk: [[540, 385], [538, 375]],
  }, [['c7', 'c9', ['s', [530, 432]]]]),
  // 4 attacks the cross first and clears into a small goal
  'ad-26': f26.more(2, {
    b4: [[540, 340], [540, 340]], c9: [[530, 330], [532, 338]],
  }, [['b4', ['l', [668, 252]]]]),
}
