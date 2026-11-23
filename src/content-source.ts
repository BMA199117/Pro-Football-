/*
 * The drill library as the app gets it.
 * This full version (used when the app runs without a server, and in development) carries everything.
 * Production builds with a server swap it for content-source.paywall.ts (see vite.config.ts):
 * there the app ships only the catalog, and the details come from the server for coaches who may open them.
 */
import type { Drill } from './types'
import { LIBRARY } from './library'
import { BOOK_SCENES } from './book'
import { BODY } from './body'
import { BENEFITS } from './benefits'
import type { Details } from './premium/split'

export const PAYWALL_BUILD = false
export const CATALOG: Drill[] = LIBRARY
export const localDetails = (id: string): Details | undefined => {
  const scene = BOOK_SCENES[id], body = BODY[id], benefit = BENEFITS[id]
  return scene || body || benefit ? { scene, body, benefit } : undefined
}
