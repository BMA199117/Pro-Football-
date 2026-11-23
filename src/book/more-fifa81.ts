import type { More } from './scene'
import { replay } from './more-util'
import { FIFA81_SCENES as S } from './fifa81'

/** FIFA 8.1: what happens after the book moment (animation only). */
export const MORE_F81: Record<string, More> = {
  // after 4 minutes of hard running: 3 minutes of easy jogging, then the next interval
  'f81-1': { n: 3, p: {
    r1: [[70, 40], [100, 34], [130, 40]], r2: [[80, 44], [110, 40], [136, 46]],
    r3: [[130, 70], [100, 76], [70, 70]], r4: [[120, 66], [90, 72], [64, 66]],
  } },
  // play goes on: the yellows win the ball and score in the other small goal
  'f81-2': { n: 3, p: {
    y1: [[118, 54], [100, 56], [90, 56]], y2: [[110, 56], [96, 60], [84, 58]], y3: [[94, 50], [86, 52], [80, 54]],
    b1: [[94, 58], [92, 58], [86, 56]], b2: [[104, 62], [98, 62], [92, 62]], b3: [[118, 52], [110, 52], [100, 54]],
  }, b: [[], ['y1', 'y2', 'y3', [70, 55, 1]]] },
  // walk to the middle: the coach reads the highest heart rate from the monitors
  'f81-3': { n: 2, p: { a: [[60, 40], [90, 48]], b: [[60, 55], [94, 56]], c: [[60, 70], [90, 64]], co: [[100, 80], [100, 70]] } },
  // the next lap of the 12 minutes
  'f81-4': { n: 4, p: Object.fromEntries(S['f81-4'].players.filter((p) => p.id !== 'co').map((p) => [p.id, p.p.slice(1)])) },
  // the next series of the pyramid
  'f81-5': replay(S['f81-5'], { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', g: 'g', co: 'co' }),
  // the next player: squats, hurdles, shot
  'f81-6': replay(S['f81-6'], { a: 'q', g: 'g' }, {}, { a: [[104, 58]] }),
  // the next player turns and shoots into the zone the coach calls
  'f81-7': replay(S['f81-7'], { A: 'q', S: 'S' }, {}, { A: [[116, 68]] }),
  'f81-8': replay(S['f81-8'], { A: 'q' }, {}, { A: [[108, 80]] }),
  'f81-9': replay(S['f81-9'], { A: 'q', S: 'S', R: 'R' }, {}, { A: [[12, 40]] }),
  // the next duel: the attacker again with the defender pushing
  'f81-10': replay(S['f81-10'], { A: 'A', D: 'D', S: 'S', g: 'g' }),
  // the intervals go on for the given time
  'f81-11': { n: 2, p: {
    m1: [[140, 24], [86, 24]], m2: [[140, 30], [86, 30]], w1: [[104, 57], [40, 57]], w2: [[104, 63], [40, 63]], f1: [[77, 90], [30, 90]], f2: [[77, 96], [30, 96]],
  } },
}
