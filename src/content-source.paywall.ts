/* Production version of content-source.ts: only the catalog ships; details come from the server. */
import type { Drill } from './types'
import type { Details } from './premium/split'
import catalog from './generated/catalog.json'

export const PAYWALL_BUILD = true
export const CATALOG: Drill[] = catalog as Drill[]
export const localDetails = (_id: string): Details | undefined => undefined
