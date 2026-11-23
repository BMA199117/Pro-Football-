import type { BookScene, Item, More } from './scene'
import { frame, type Px } from './pos-util'

/**
 * "Roberto De Zerbi: The Master of Timing" (Phase of Play): sample drills for the Professional section,
 * drawn after the book's diagrams: blue in possession, black defending, green neutrals (our yellow),
 * book pages in the ids. Book key: ball movement = solid line, player movement = dashed line.
 */
const K = { key: 'fifa' as const, speed: 1.2 }
type F = ReturnType<typeof frame>
const dummy = (f: F, q: Px): Item => { const a = f.pt(q); return ['dummy', a[0], a[1]] }

// p8 8v8+5: from one end to the other; the middle zone may only be crossed with a third-man combination via green 10
const f8 = frame([370, 100, 680, 460], [46, 8, 154, 101])
const dz8: BookScene = {
  ...K, steps: 7,
  field: [f8.area([378, 123], [670, 445]), f8.line([378, 263], [670, 263], false), f8.line([378, 307], [670, 307], false)],
  players: [
    f8.pl('n4t', 'y', '4', [[448, 112]]), f8.pl('n5t', 'y', '5', [[580, 116]]), f8.pl('n10', 'y', '10', [[521, 289]]),
    f8.pl('n5', 'y', '5', [[491, 449]]), f8.pl('n4', 'y', '4', [[598, 449]]),
    f8.pl('b6', 'b', '6', [[455, 366]]), f8.pl('b8', 'b', '8', [[543, 380]]), f8.pl('b3', 'b', '3', [[410, 410]]),
    f8.pl('b2', 'b', '2', [[638, 368], [638, 368], [638, 368], [624, 330], [609, 286]]),
    f8.pl('b11', 'b', '11', [[407, 204]]), f8.pl('b9', 'b', '9', [[484, 224]]), f8.pl('b10', 'b', '10', [[550, 193]]), f8.pl('b7', 'b', '7', [[633, 208]]),
    f8.pl('c2', 'c', '2', [[471, 185]]), f8.pl('c6', 'c', '6', [[543, 168]]), f8.pl('c3', 'c', '3', [[631, 178]]), f8.pl('c8', 'c', '8', [[589, 225]]),
    f8.pl('c9', 'c', '9', [[462, 344]]), f8.pl('c10', 'c', '10', [[518, 349]]), f8.pl('c7', 'c', '7', [[407, 373]]), f8.pl('c11', 'c', '11', [[592, 368]]),
  ],
  balls: f8.balls([['n5', 'b6', 'b8', 'n10', 'b2', 'b7', 'n5t']]),
}

// p18 6v3 "box" rondo: centre-backs at each end, pivots and forwards locked in their rectangles, 2 touches
const f18 = frame([421, 505, 684, 1020], [12, 10, 186, 101])
const dz18: BookScene = {
  ...K, steps: 5,
  field: [f18.area([421, 598], [684, 943]), f18.line([553, 598], [553, 943], false), f18.line([421, 770], [684, 770], false),
    f18.mini([478, 525], 'd'), f18.mini([622, 525], 'd'), f18.mini([478, 1010], 'u'), f18.mini([622, 1010], 'u')],
  players: [
    f18.pl('b5', 'b', '5', [[552, 978]]), f18.pl('b8', 'b', '8', [[502, 866]]), f18.pl('b6', 'b', '6', [[645, 879]]),
    f18.pl('b10', 'b', '10', [[489, 690]]), f18.pl('b9', 'b', '9', [[638, 714]]), f18.pl('b4', 'b', '4', [[555, 578]]),
    f18.pl('c8', 'c', '8', [[578, 742], [578, 742], [578, 742], [590, 724], [598, 708]]),
    f18.pl('c9', 'c', '9', [[509, 820]]), f18.pl('c10', 'c', '10', [[607, 813]]),
  ],
  balls: f18.balls([['b5', 'b8', 'b6', 'b9', 'b4']]),
}

// p19 7v7+1 "box" vs the high press: GK → centre-back → forward; 9 in the finishing zone, 11 joins for a 2v2+GK
const f19 = frame([370, 500, 712, 975], [30, 2, 167, 108])
const dz19: BookScene = {
  ...K, steps: 8,
  field: [f19.area([370, 516], [712, 958]), f19.line([370, 653], [712, 653], false), f19.line([370, 820], [712, 820], false),
    f19.line([370, 737], [712, 737], false), f19.line([541, 653], [541, 820], false), f19.goal([541, 516], 'd'), f19.goal([541, 958], 'u')],
  players: [
    f19.pl('gk', 'b', '1', [[541, 935]]), f19.pl('b5', 'b', '5', [[445, 873]]), f19.pl('b4', 'b', '4', [[637, 862]]),
    f19.pl('b6', 'b', '6', [[572, 792]]), f19.pl('b8', 'b', '8', [[469, 775]]), f19.pl('n10', 'y', '10', [[633, 694]]),
    f19.pl('b9', 'b', '9', [[557, 623]]),
    f19.pl('b11', 'b', '11', [[469, 693], [469, 693], [469, 693], [469, 693], [469, 693], [482, 660], [495, 625]]),
    f19.pl('gr', 'c', '1', [[532, 541]]), f19.pl('c4', 'c', '4', [[486, 595]]), f19.pl('c5', 'c', '5', [[566, 599]]),
    f19.pl('c10', 'c', '10', [[524, 701]]), f19.pl('c6', 'c', '6', [[503, 760]]), f19.pl('c8', 'c', '8', [[578, 762]]), f19.pl('c9', 'c', '9', [[538, 862]]),
  ],
  balls: f19.balls([['gk', 'b5', 'b6', 'b4', 'n10', 'b9', 'b11', ['s', [520, 522]]]]),
}

// p20 S-combination activation: 5 → 4 → dropping 6 → one-touch diagonal to 8 → one-touch finish into a small goal
const f20 = frame([425, 110, 665, 575], [20, 14, 180, 96])
const dz20: BookScene = {
  ...K, steps: 5,
  field: [f20.area([437, 149], [655, 561]), f20.mini([486, 128], 'd'), f20.mini([605, 128], 'd'), dummy(f20, [500, 385]), dummy(f20, [588, 385])],
  players: [
    f20.pl('b5', 'b', '5', [[472, 541]]), f20.pl('b4', 'b', '4', [[600, 535]]),
    f20.pl('b6', 'b', '6', [[467, 300], [480, 340], [499, 397]]),
    f20.pl('b8', 'b', '8', [[601, 397], [601, 397], [604, 340], [607, 283]]),
  ],
  balls: f20.balls([['b5', 'b4', 'b6', 'b8', ['s', [495, 140]]]]),
}

// p22 8+GK v 6 in the hourglass: 5 passes in the build-up zone, through the double pivot into 9 and 10
const f22 = frame([385, 560, 699, 960], [32, 3, 168, 107])
const hg: [Px, Px][] = [[[391, 613], [699, 613]], [[391, 613], [441, 750]], [[699, 613], [649, 750]], [[441, 750], [391, 887]], [[649, 750], [699, 887]], [[391, 887], [699, 887]]]
const dz22: BookScene = {
  ...K, steps: 8,
  field: [...hg.map(([a, b]) => f22.line(a, b, false)), f22.line([441, 750], [649, 750]),
    f22.mini([388, 573], 'd'), f22.mini([478, 565], 'd'), f22.mini([590, 565], 'd'), f22.mini([694, 573], 'd'), f22.goal([541, 955], 'u')],
  players: [
    f22.pl('gk', 'b', '1', [[543, 930]]), f22.pl('b5', 'b', '5', [[480, 880]]), f22.pl('b4', 'b', '4', [[595, 878]]),
    f22.pl('b3', 'b', '3', [[427, 830]]), f22.pl('b2', 'b', '2', [[661, 835]]), f22.pl('b6', 'b', '6', [[604, 783]]), f22.pl('b8', 'b', '8', [[493, 783]]),
    f22.pl('b9', 'b', '9', [[459, 703]]), f22.pl('b10', 'b', '10', [[550, 687]]),
    f22.pl('c5', 'c', '5', [[471, 662]]), f22.pl('c3', 'c', '3', [[565, 651]]), f22.pl('c8', 'c', '8', [[506, 760]]),
    f22.pl('c6', 'c', '6', [[570, 778]]), f22.pl('c9', 'c', '9', [[503, 827]]), f22.pl('c10', 'c', '10', [[584, 840]]),
  ],
  balls: f22.balls([['b4', 'b2', 'b6', 'b5', 'b3', 'b8', 'b9', 'b10']]),
}

// p23 7v4 in a 2-4-2-2: five passes, then find the attacking midfielder for the diagonal small goals
const f23 = frame([420, 130, 675, 475], [46, 15, 153, 94])
const dz23: BookScene = {
  ...K, steps: 7,
  field: [f23.area([430, 198], [663, 431]), f23.mini([427, 142], 'd'), f23.mini([664, 142], 'd'),
    f23.mini([444, 463], 'u'), f23.mini([547, 463], 'u'), f23.mini([650, 463], 'u')],
  players: [
    f23.pl('b5', 'b', '5', [[513, 420]]), f23.pl('b4', 'b', '4', [[625, 413]]), f23.pl('b3', 'b', '3', [[441, 342]]), f23.pl('b2', 'b', '2', [[652, 336]]),
    f23.pl('b8', 'b', '8', [[510, 328]]), f23.pl('b6', 'b', '6', [[580, 328]]), f23.pl('b10', 'b', '10', [[532, 246]]),
    f23.pl('c6', 'c', '6', [[494, 297]]), f23.pl('c8', 'c', '8', [[561, 276]]), f23.pl('c9', 'c', '9', [[497, 377]]), f23.pl('c10', 'c', '10', [[571, 380]]),
  ],
  balls: f23.balls([['b4', 'b6', 'b5', 'b3', 'b8', 'b10', ['s', [436, 152]]]]),
}

// p35 8v4+GK central pattern vs a low block: 3 → 8, back to 6, vertical to 9, lay-off to 8, then free choice
const f35 = frame([380, 171, 712, 427], [0, 0, 200, 110])
const dz35: BookScene = {
  ...K, steps: 7,
  field: [['pitch', 'right'], ...([[463, 236], [520, 236], [578, 236], [633, 236], [463, 295], [520, 295], [578, 295], [633, 295], [520, 353], [578, 353]] as Px[]).map((q) => dummy(f35, q))],
  players: [
    f35.pl('b3', 'b', '3', [[470, 348]]), f35.pl('b6', 'b', '6', [[540, 347]]), f35.pl('b2', 'b', '2', [[624, 339]]),
    f35.pl('b8', 'b', '8', [[492, 290]]),
    f35.pl('b9', 'b', '9', [[545, 268], [545, 268], [545, 268], [545, 268], [548, 250], [551, 231]]),
    f35.pl('b11', 'b', '11', [[442, 266], [442, 266], [442, 266], [442, 266], [455, 258], [470, 250], [480, 245]]),
    f35.pl('b10', 'b', '10', [[610, 280], [610, 280], [610, 280], [610, 280], [607, 265], [604, 252], [602, 243]]),
    f35.pl('b7', 'b', '7', [[664, 273], [664, 273], [664, 273], [664, 273], [660, 266], [656, 259], [652, 253]]),
    f35.pl('gr', 'c', '1', [[546, 184]]), f35.pl('c4', 'c', '4', [[503, 264]]), f35.pl('c5', 'c', '5', [[556, 258]]),
    f35.pl('c6', 'c', '6', [[491, 334]]), f35.pl('c8', 'c', '8', [[533, 315]]),
  ],
  balls: f35.balls([['b3', 'b8', 'b6', 'b9', 'b8', 'b9', ['s', [560, 175]]]]),
}

// p38 6v2+GK "up, back, over": 6 → 9, lay-off to 10, one-touch lob into the box for the winger's run
const f38 = frame([380, 140, 712, 480], [45, 2, 154, 108])
const dz38: BookScene = {
  ...K, steps: 4,
  field: [f38.area([380, 149], [712, 477]), f38.area([471, 149], [625, 191]), f38.line([380, 278], [712, 278], false), f38.goal([545, 149], 'd'),
    ...([[418, 258], [508, 258], [598, 258], [688, 258]] as Px[]).map((q) => dummy(f38, q))],
  players: [
    f38.pl('b6', 'b', '6', [[575, 452]]), f38.pl('b9', 'b', '9', [[543, 318], [543, 318], [543, 318], [538, 262]]),
    f38.pl('b10', 'b', '10', [[482, 378]]), f38.pl('b8', 'b', '8', [[610, 370]]),
    f38.pl('b11', 'b', '11', [[410, 325], [410, 325], [425, 290], [446, 242]]),
    f38.pl('b7', 'b', '7', [[662, 304], [662, 304], [662, 304], [643, 244]]),
    f38.pl('gr', 'c', '1', [[532, 174]]),
    f38.pl('c4', 'c', '4', [[502, 302], [502, 302], [502, 302], [490, 256]]), f38.pl('c5', 'c', '5', [[570, 301], [570, 301], [570, 301], [552, 256]]),
  ],
  balls: f38.balls([['b6', 'b9', 'b10', ['l', [446, 242]]]]),
}

export const DZ_SCENES: Record<string, BookScene> = {
  'dz-8': dz8, 'dz-18': dz18, 'dz-19': dz19, 'dz-20': dz20, 'dz-22': dz22, 'dz-23': dz23, 'dz-35': dz35, 'dz-38': dz38,
}

export const MORE_DZ: Record<string, More> = {
  // point scored; the player who joined the middle zone goes back into his zone and the play goes the other way
  'dz-8': f8.more(4, {
    b2: [[620, 330], [638, 368]], b10: [[540, 205], [535, 215]], b6: [[465, 330], [480, 300]],
    c6: [[560, 185], [565, 200], [550, 230]], c8: [[600, 210], [580, 220], [560, 240]], c9: [[480, 330], [490, 310]],
  }, [['n5t', 'b10', 'n10', 'b6']]),
  // and back again from 4 to 5: 10 to 8 down the left side, the blacks shift across
  'dz-18': f18.more(4, {
    c8: [[560, 700], [520, 690], [505, 720], [505, 750]], c9: [[505, 830], [500, 850], [505, 880], [520, 900]],
    c10: [[590, 800], [570, 780], [560, 800], [550, 840]],
  }, [['b4', 'b10', 'b8', 'b5']]),
  // the keeper catches it and throws out: blue counter-press at once, 11 and 9 close the nearest blacks
  'dz-19': f19.more(3, {
    c4: [[486, 595], [470, 610]], b11: [[495, 625], [485, 615], [478, 612]], b9: [[557, 623], [560, 610], [565, 605]],
  }, [['gr', 'c4', 'c4']]),
  // roles switch: now 8 drops, 6 runs forward, and the same S goes down the other side
  'dz-20': f20.more(5, {
    b6: [[499, 397], [495, 340], [490, 283]], b8: [[607, 283], [602, 340], [590, 397]],
  }, [['b5', 'b4', 'b8', 'b6', ['s', [495, 140]]]]),
  // 3v2 in the finishing zone: 8 joins 9 and 10, five seconds to score in a small goal
  'dz-22': f22.more(3, {
    b8: [[495, 740], [497, 700], [498, 690]], c5: [[480, 675], [490, 688]], c3: [[555, 665], [545, 675]],
  }, [['b10', 'b8', ['s', [478, 572]]]]),
  // restart from 4: this time 2 plays up the right side and 10 drops to show for it
  'dz-23': f23.more(3, {
    b10: [[532, 246], [570, 260], [585, 268]], c8: [[561, 276], [575, 285], [585, 290]], c10: [[590, 370], [610, 350]],
  }, [['b4', 'b2', 'b10']]),
  // the keeper parries and 11, who ran into the box, follows up
  'dz-35': f35.more(2, {
    b11: [[503, 218], [515, 205]], c4: [[510, 240], [515, 225]],
  }, [[[515, 205], ['s', [532, 174]]]]),
  // 11 takes the lob and squares it across goal for 9's run (or shoots himself)
  'dz-38': f38.more(3, {
    b11: [[446, 242], [455, 220]], b9: [[538, 262], [532, 230], [528, 215]], c4: [[490, 256], [480, 240], [470, 228]], c5: [[552, 256], [545, 238]],
  }, [['b11', 'b9', ['s', [540, 158]]]]),
}
