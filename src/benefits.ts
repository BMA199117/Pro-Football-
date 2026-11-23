import type { Benefit } from './skills'
import { BENEFITS_A } from './benefits-a'
import { BENEFITS_B } from './benefits-b'
import { BENEFITS_C } from './benefits-c'
import { BENEFITS_D } from './benefits-d'
import { BENEFITS_E } from './benefits-e'
import { BENEFITS_F } from './benefits-f'
import { BENEFITS_G } from './benefits-g'
import { BENEFITS_H } from './benefits-h'

/** "Why useful" + developed qualities for every book drill, keyed by drill id. */
export const BENEFITS: Record<string, Benefit> = {
  ...BENEFITS_A, ...BENEFITS_B, ...BENEFITS_C, ...BENEFITS_D, ...BENEFITS_E, ...BENEFITS_F, ...BENEFITS_G, ...BENEFITS_H,
}
