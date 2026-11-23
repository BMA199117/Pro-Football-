import type { Kind, ItemOf } from '../content'
import type { Category, Topic } from '../types'

export const KIND_LABEL: Record<Kind, { many: string; one: string; add: string }> = {
  drill: { many: 'Mashqlar', one: 'Mashq', add: "Yangi mashq" },
  card: { many: 'Bilim kartalari', one: 'Bilim kartasi', add: 'Yangi karta' },
  plan: { many: 'Tayyor rejalar', one: 'Tayyor reja', add: 'Yangi reja' },
  stage: { many: 'Yosh bosqichlari', one: 'Yosh bosqichi', add: 'Yangi bosqich' },
  principle: { many: 'Tamoyillar', one: 'Tamoyil', add: 'Yangi tamoyil' },
  source: { many: 'Kitoblar (manbalar)', one: 'Kitob', add: "Yangi kitob" },
}

export const CAT_UZ: Record<Category, string> = { tech: 'Texnika', tact: 'Taktika', phys: 'Jismoniy', gk: 'Darvozabon' }
export const TOPIC_UZ: Record<Topic, string> = { method: 'Uslubiyat', game: "O'yin g'oyalari", kids: 'Bolalar bilan ishlash', physical: 'Jismoniy tayyorgarlik', pro: 'Professional: taktika' }

/** Title + one line under it, for lists. */
export function describe<K extends Kind>(kind: K, x: ItemOf[K]): [string, string] {
  switch (kind) {
    case 'drill': { const d = x as ItemOf['drill']; return [d.name.uz || d.name.ru, `${d.age} · ${CAT_UZ[d.cat] ?? d.cat} · ${d.min} daq`] }
    case 'card': { const c = x as ItemOf['card']; return [c.title.uz || c.title.ru, TOPIC_UZ[c.topic] ?? c.topic] }
    case 'plan': { const p = x as ItemOf['plan']; return [p.title.uz || p.title.ru, `${p.ages} yosh · ${p.group}`] }
    case 'stage': { const s = x as ItemOf['stage']; return [s.title[0] || s.title[1], `${s.ages} yosh`] }
    case 'principle': { const p = x as ItemOf['principle']; return [p.title[0] || p.title[1], p.idea[0].slice(0, 90)] }
    case 'source': { const s = x as ItemOf['source']; return [s.title, s.author] }
  }
  return ['', '']
}

/** Text used by the search box. */
export function haystack<K extends Kind>(kind: K, x: ItemOf[K]): string {
  return (x.id + ' ' + JSON.stringify(kind === 'drill' ? { n: (x as ItemOf['drill']).name, d: (x as ItemOf['drill']).desc } : x)).toLowerCase()
}
