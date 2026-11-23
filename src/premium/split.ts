/*
 * A library drill is split in two:
 *  - the catalog card (name, age, category, minutes, players, equipment, a short teaser) ships with the app,
 *    so every coach sees what the library holds;
 *  - the details (full description, coaching points, the book drawing and its animation, body-figure
 *    exercises, "why useful") live on the server and reach only the coaches allowed to open the drill.
 */
import type { Drill, Text } from '../types'
import type { BookScene } from '../book/scene'
import type { BodyProgram } from '../body/program'
import type { Benefit } from '../skills'

export interface Details {
  desc?: Text
  points?: Text[]
  scene?: BookScene
  body?: BodyProgram
  benefit?: Benefit
  video?: string
}

const TEASER = 110
const cut = (s: string) => {
  if (s.length <= TEASER) return s
  const short = s.slice(0, TEASER)
  return short.slice(0, Math.max(short.lastIndexOf(' '), 60)).replace(/[\s,.;:–-]+$/, '') + '…'
}
export const teaser = (t: Text): Text => ({ uz: cut(t.uz ?? ''), ru: cut(t.ru ?? '') })

/** What a coach without access may see of a drill. */
export function toCatalog(d: Drill): Drill {
  const { id, cat, dia, age, min, name, equip, players, source, custom } = d
  const out: Drill = { id, cat, dia, age, min, name, equip, desc: teaser(d.desc) }
  if (players) out.players = players
  if (source) out.source = source
  if (custom) out.custom = custom
  return out
}

/** The server part of a drill. */
export function toDetails(d: Drill, extra: Omit<Details, 'desc' | 'points' | 'video'>): Details {
  const out: Details = { desc: d.desc }
  if (d.points?.length) out.points = d.points
  if (d.video) out.video = d.video
  if (extra.scene) out.scene = extra.scene
  if (extra.body) out.body = extra.body
  if (extra.benefit) out.benefit = extra.benefit
  return out
}
