/*
 * The free part of the library when the administrator has not chosen it yet:
 * 5 drills in every age band (mixed categories, drills with a book drawing first),
 * 1 ready plan and 1 season programme for every age group.
 */
import { BANDS, fitsBand, homeBand } from '../ages'
import type { Drill, Template } from '../types'

export const FREE_PER_BAND = 5

export function defaultFreeDrills(drills: Drill[], drawn: (id: string) => boolean): string[] {
  const picked = new Set<string>()
  for (const b of BANDS) {
    const ordered = [...drills].sort((x, y) => Number(!drawn(x.id)) - Number(!drawn(y.id)))
    // the drills listed under this band (so "all ages" shows 5 free in every section);
    // only a band with too few of its own borrows drills that also suit it
    const own = ordered.filter((d) => homeBand(d.age) === b)
    const pool = own.length >= FREE_PER_BAND ? own : [...own, ...ordered.filter((d) => homeBand(d.age) !== b && fitsBand(d.age, b))]
    let have = 0
    const cats = [...new Set(pool.map((d) => d.cat))]
    for (let round = 0; have < FREE_PER_BAND && round < 50; round++) {
      let added = false
      for (const c of cats) {
        if (have >= FREE_PER_BAND) break
        const d = pool.find((x) => x.cat === c && !picked.has(x.id))
        if (d) { picked.add(d.id); have++; added = true }
      }
      if (!added) break
    }
  }
  return [...picked]
}

/** The first item of every age group. */
export function firstPerAge<T extends { id: string; ages: string }>(items: T[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const x of items) if (!seen.has(x.ages)) { seen.add(x.ages); out.push(x.id) }
  return out
}
export const defaultFreePlans = (plans: Template[]) => firstPerAge(plans)
