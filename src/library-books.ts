import type { Category, Diagram, Drill } from './types'
import { EPYSA_ROWS } from './library-epysa'
import { RFS_69 } from './library-rfs69'
import { ADIDAS_1014 } from './library-adidas1014'
import { ADIDAS_1517 } from './library-adidas1517'
import { SSG_100 } from './library-ssg100'

/**
 * Drills retold briefly from the coach's books (see sources.ts).
 * Descriptions are our own short wording, not the book text.
 * Only drills drawn exactly as in their book are listed (src/book).
 */
export type Row = [id: string, cat: Category, dia: Diagram, age: string, min: number, players: string, source: string,
  name: [string, string], desc: [string, string], equip: [string, string], points: [string, string][]]

const toDrill = ([id, cat, dia, age, min, players, source, name, desc, equip, points]: Row): Drill => ({
  id, cat, dia, age, min, players, source,
  name: { uz: name[0], ru: name[1] }, desc: { uz: desc[0], ru: desc[1] }, equip: { uz: equip[0], ru: equip[1] },
  points: points.map(([uz, ru]) => ({ uz, ru })),
})

export const BOOK_DRILLS: Drill[] = [...RFS_69, ...ADIDAS_1014, ...ADIDAS_1517, ...SSG_100, ...EPYSA_ROWS].map(toDrill)
