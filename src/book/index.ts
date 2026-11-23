import { extend, type BookScene, type More } from './scene'
import { MORE_U6 } from './more-u6'
import { MORE_U8 } from './more-u8'
import { MORE_U10 } from './more-u10'
import { MORE_U12 } from './more-u12'
import { MORE_F82 } from './more-fifa82'
import { MORE_F81 } from './more-fifa81'
import { MORE_RFS69 } from './more-rfs69'
import { MORE_A14 } from './more-adidas1014'
import { MORE_A17 } from './more-adidas1517'
import { MORE_S100 } from './more-ssg100'
import { U6_SCENES } from './epysa-u6'
import { U8_SCENES } from './epysa-u8'
import { U10_SCENES } from './epysa-u10'
import { U12_SCENES } from './epysa-u12'
import { FIFA82_SCENES } from './fifa82'
import { FIFA81_SCENES } from './fifa81'
import { RFS69_A } from './rfs69a'
import { RFS69_B } from './rfs69b'
import { RFS69_C } from './rfs69c'
import { ADIDAS1014 } from './adidas1014'
import { ADIDAS1517 } from './adidas1517'
import { SSG100 } from './ssg100'
import { PP_SCENES, MORE_PP } from './pos-pp'
import { XA_SCENES, MORE_XA } from './pos-xa'
import { IP_SCENES, MORE_IP } from './pos-ip'
import { DZ_SCENES, MORE_DZ } from './pos-dz'
import { AD_SCENES, MORE_AD } from './pos-ad'
import { VP_SCENES, MORE_VP } from './pos-vp'

export const RAW: Record<string, BookScene> = { ...U6_SCENES, ...U8_SCENES, ...U10_SCENES, ...U12_SCENES, ...FIFA82_SCENES, ...FIFA81_SCENES, ...RFS69_A, ...RFS69_B, ...RFS69_C, ...ADIDAS1014, ...ADIDAS1517, ...SSG100, ...PP_SCENES, ...XA_SCENES, ...IP_SCENES, ...DZ_SCENES, ...AD_SCENES, ...VP_SCENES }

/** Continuations after the book moment (animation only; the drawing stays as in the book). */
export const MORE: Record<string, More> = { ...MORE_U6, ...MORE_U8, ...MORE_U10, ...MORE_U12, ...MORE_F82, ...MORE_F81, ...MORE_RFS69, ...MORE_A14, ...MORE_A17, ...MORE_S100, ...MORE_PP, ...MORE_XA, ...MORE_IP, ...MORE_DZ, ...MORE_AD, ...MORE_VP }

export const BOOK_SCENES: Record<string, BookScene> = Object.fromEntries(
  Object.entries(RAW).map(([id, sc]) => [id, MORE[id] ? extend(sc, MORE[id]) : sc]),
)
