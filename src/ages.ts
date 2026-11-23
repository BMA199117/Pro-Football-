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
