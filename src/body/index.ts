import type { BodyProgram } from './program'
import { SEC8_ABS, SEC8_ARMS, SEC8_BACK, SEC8_CORE, SEC8_LEGS, SEC9_STATIONS } from './fifa82a'
import { SEC10_EX, SEC11_STRETCH } from './fifa82b'

/** Drills shown with the body figure (strength, stability, stretching) instead of a pitch. */
export const BODY: Record<string, BodyProgram> = {
  'f82-29': SEC8_CORE, 'f82-30': SEC8_ARMS, 'f82-31': SEC8_ABS, 'f82-32': SEC8_BACK, 'f82-33': SEC8_LEGS,
  'f82-34': SEC9_STATIONS, ...SEC10_EX, 'f82-40': SEC11_STRETCH,
}
