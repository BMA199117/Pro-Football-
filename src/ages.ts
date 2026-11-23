/**
 * Age labels of drills and plans: "U9–U12", "U15+" (15 and older), "Pro" (adult professional players).
 * ageRange gives the years they suit.
 */
export function ageRange(r: string): [number, number] {
  if (/^pro/i.test(r.trim())) return [18, 99]
  const n = r.match(/\d+/g)?.map(Number) ?? []
  if (!n.length) return [0, 99]
  if (r.includes('+')) return [n[0], 99]
  return [n[0], n[1] ?? n[0]]
}

/** "Pro" in the user's language; other labels stay as written. */
export const ageText = (r: string, pro: string) => (/^pro$/i.test(r.trim()) ? pro : r)

/** Age bands of the drill library (the tabs on the Drills page). */
export type Band = { id: string; label: string; from: number; to: number }
export const BANDS: Band[] = [
  { id: 'u8', label: 'U6–U8', from: 6, to: 8 },
  { id: 'u10', label: 'U9–U10', from: 9, to: 10 },
  { id: 'u12', label: 'U11–U12', from: 11, to: 12 },
  { id: 'u14', label: 'U13–U14', from: 13, to: 14 },
  { id: 'u17', label: 'U15–U17', from: 15, to: 17 },
  { id: 'pro', label: '', from: 18, to: 99 },
]
export const fitsBand = (r: string, b: Band) => { const [a, z] = ageRange(r); return a <= b.to && z >= b.from }
/** The youngest band a drill suits: where it is listed under "all ages". */
export const homeBand = (r: string) => BANDS.find((b) => fitsBand(r, b))
