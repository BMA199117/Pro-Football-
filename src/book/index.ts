import type { BookScene } from './scene'
import { U6_SCENES } from './epysa-u6'
import { U8_SCENES } from './epysa-u8'
import { U10_SCENES } from './epysa-u10'
import { U12_SCENES } from './epysa-u12'
import { FIFA82_SCENES } from './fifa82'
import { RFS69_A } from './rfs69a'
import { RFS69_B } from './rfs69b'
import { RFS69_C } from './rfs69c'
import { ADIDAS1014 } from './adidas1014'
import { ADIDAS1517 } from './adidas1517'

export const BOOK_SCENES: Record<string, BookScene> = { ...U6_SCENES, ...U8_SCENES, ...U10_SCENES, ...U12_SCENES, ...FIFA82_SCENES, ...RFS69_A, ...RFS69_B, ...RFS69_C, ...ADIDAS1014, ...ADIDAS1517 }
