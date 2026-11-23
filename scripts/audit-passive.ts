import { BOOK_SCENES } from '../src/book/index'
import { tracks, posAt, bookSteps } from '../src/book/scene'
const d = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])
const out: string[] = []
for (const [id, sc] of Object.entries(BOOK_SCENES)) {
  const trs = tracks(sc); const bad: string[] = []
  for (let k = 0; k < sc.steps - 1; k++) {
    for (const t of trs) {
      if (typeof t[k] !== 'string' || t[k] !== t[k + 1]) continue
      const c = sc.players.find((p) => p.id === t[k])!
      if (!c || d(posAt(sc, c, k), posAt(sc, c, k + 1)) < 6) continue
      const opp = sc.players.filter((p) => p.t !== c.t && p.t !== 'c' && p.l !== 'T' && !/^g|^k$|gk/.test(p.id) && p.t !== 'y' && p.t !== 'k')
      for (const o of opp) {
        const near = Math.min(d(posAt(sc, o, k), posAt(sc, c, k + 1)), d(posAt(sc, o, k), posAt(sc, c, k)))
        if (near < 22 && d(posAt(sc, o, k), posAt(sc, o, k + 1)) < 1.5) bad.push(`${k >= bookSteps(sc) - 1 ? 'D' : 'S'}${k + 1}:${c.id}>${o.id}`)
      }
    }
  }
  if (bad.length) out.push(`${id}: ${bad.join(' ')}`)
}
console.log(out.join('\n')); console.error(out.length)
