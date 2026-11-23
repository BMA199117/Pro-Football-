/*
 * npm run content — splits the drill library for the paid version:
 *   src/generated/catalog.json          the drill cards that ship with the app (no details)
 *   private/drill-details.json          the details, uploaded to the server from the admin panel
 *   src/generated/free-defaults.json        the default free drills / plans / season programmes
 * Runs before every build.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { LIBRARY } from '../src/library'
import { BOOK_SCENES } from '../src/book'
import { BODY } from '../src/body'
import { BENEFITS } from '../src/benefits'
import { TEMPLATES } from '../src/templates'
import { SEASON_PROGRAMS } from '../src/season'
import { toCatalog, toDetails } from '../src/premium/split'
import { defaultFreeDrills, defaultFreePlans, firstPerAge } from '../src/premium/defaults'

mkdirSync('src/generated', { recursive: true })
mkdirSync('private', { recursive: true })

const catalog = LIBRARY.map(toCatalog)
const details = Object.fromEntries(LIBRARY.map((d) => [d.id, toDetails(d, { scene: BOOK_SCENES[d.id], body: BODY[d.id], benefit: BENEFITS[d.id] })]))
const free = {
  drill: defaultFreeDrills(LIBRARY, (id) => !!(BOOK_SCENES[id] || BODY[id])),
  plan: defaultFreePlans(TEMPLATES),
  season: firstPerAge(SEASON_PROGRAMS),
}

writeFileSync('src/generated/catalog.json', JSON.stringify(catalog))
writeFileSync('private/drill-details.json', JSON.stringify({ v: 1, made: new Date().toISOString(), details }))
writeFileSync('src/generated/free-defaults.json', JSON.stringify(free, null, 1))
console.log(`content: ${catalog.length} drills, details ${(JSON.stringify(details).length / 1024).toFixed(0)} KB, free ${free.drill.length} drills / ${free.plan.length} plans / ${free.season.length} season programmes`)
