import type { Pose, Pt } from './pose'

/** Things around the figure. x is the left edge unless said otherwise; the floor is GROUND. */
export type Scenery =
  | ['mat', number, number] // from x1 to x2
  | ['box', number, number, number] // x, width, height
  | ['bench', number, number, number] // x, width, height (with legs)
  | ['wall', number] // wall at x
  | ['bars', number] // wall bars at x
  | ['hurdle', number, number?] // centre x, height
  | ['cone', number]
  | ['ring', number] // ring on the floor, centre x
  | ['pull', number] // lat pull-down machine (front view), centre x
  | ['curl', number] // leg curl bench, left x
  | ['calf', number] // calf raise machine, centre x
  | ['seat', number] // machine seat (adductor / abductor), centre x
  | ['ext', number] // back extension bench, left x
  | ['partner', number, number, number?] // a partner's hands holding at (x, y) (simple marker)
  | ['arrow', Pt, Pt, Pt?] // red arrow (drawing only): from, to, via
  | ['text', number, number, string]

/** One movement: key poses played forward and back (pp) or forward only (fwd, e.g. a run of jumps). */
export interface Seg {
  k: Pose[]
  reps?: number
  /** seconds per move between two key poses */
  mv?: number
  /** seconds held at each key pose */
  hold?: number
  loop?: 'pp' | 'fwd'
  /** the drawing shows all key poses of this movement in one picture (faint, last one solid) */
  ghost?: boolean
  /** key poses the drawing shows (default: all with ghost, else the last one) */
  show?: number[]
  sc?: Scenery[]
  /** short label of this part (shown in the drawing) */
  label?: [string, string]
}

export interface Exercise {
  name: [string, string]
  /** dosage from the book (sets, repetitions, time) */
  dose: [string, string]
  /** how to do it */
  cue: [string, string]
  seg: Seg[]
  /** scenery for every part */
  sc?: Scenery[]
  /** picture width (height is 64), default 100 */
  w?: number
  /** turn the whole picture (author facing right, show facing left) */
  flip?: boolean
  /** seen from above (lying on a mat): no floor line */
  top?: boolean
}

export interface BodyProgram {
  ex: Exercise[]
  /** the book shows several exercises one after another as a sequence (one picture row) */
  chain?: boolean
}
