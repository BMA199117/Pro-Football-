import type { BookScene } from './scene'
import { U6_SCENES } from './epysa-u6'
import { U8_SCENES } from './epysa-u8'
import { U10_SCENES } from './epysa-u10'
import { U12_SCENES } from './epysa-u12'
import { FIFA82_SCENES } from './fifa82'

/** Drill id → the drill's own diagram and animation, drawn from the book. */
export const BOOK_SCENES: Record<string, BookScene> = { ...U6_SCENES, ...U8_SCENES, ...U10_SCENES, ...U12_SCENES, ...FIFA82_SCENES }
