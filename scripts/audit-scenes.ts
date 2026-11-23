import { BOOK_SCENES } from '../src/book/index'
import { tracks, posAt, route, bookSteps, type BookScene } from '../src/book/scene'
const d = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1])
const rows: string[] = []
const stat: Record<string, number> = {}
const add = (k: string) => (stat[k] = (stat[k] ?? 0) + 1)
for (const [id, sc] of Object.entries(BOOK_SCENES) as [string, BookScene][]) {
  const issues: string[] = []
  const trs = tracks(sc)
  const ids = new Set(sc.players.map((p) => p.id))
  for (const t of trs) for (const b of t) if (typeof b === 'string' && !ids.has(b)) issues.push(`unknown owner ${b}`)
  for (let k = 0; k < sc.steps - 1; k++) {
    const tag = k + 1 > bookSteps(sc) - 1 ? `D${k + 1}` : `S${k + 1}`
    let movers = 0, moved = false
    for (const p of sc.players) {
      const r = route(sc, p, k)
      let len = 0; for (let i = 1; i < r.length; i++) len += d(r[i - 1], r[i])
      if (len > 1.5) { movers++; moved = true }
      if (len > 75) issues.push(`${tag} ${p.id} runs ${len.toFixed(0)}`)
    }
    let ballMoves = 0
    for (const t of trs) {
      const a = t[k], b = t[k + 1]
      if (a === b) continue
      ballMoves++
      if (typeof a === 'string' && typeof b === 'string') {
        const pa = sc.players.find((p) => p.id === a)!, pb = sc.players.find((p) => p.id === b)!
        if (!pa || !pb) continue
        const L = d(posAt(sc, pa, k), posAt(sc, pb, k + 1))
        if (L > 130) issues.push(`${tag} long pass ${a}->${b} ${L.toFixed(0)}`)
        if (pa.t !== pb.t && pb.t !== 'y' && pa.t !== 'y') issues.push(`${tag} ball ${a}->${b} other team`)
      }
    }
    if (ballMoves > 1) issues.push(`${tag} ${ballMoves} balls played at once`)
    if (movers > 8) issues.push(`${tag} ${movers} movers`)
    if (!moved && ballMoves === 0) issues.push(`${tag} nothing happens`)
  }
  // same player holding 2 balls
  for (let k = 0; k < sc.steps; k++) {
    const own = trs.map((t) => t[k]).filter((b) => typeof b === 'string') as string[]
    const dup = own.filter((x, i) => own.indexOf(x) !== i)
    if (dup.length) issues.push(`step${k} ${dup[0]} has 2 balls`)
  }
  // overlaps / out of pitch at step ends
  for (let k = 0; k < sc.steps; k++) {
    const P = sc.players.map((p) => [p.id, posAt(sc, p, k)] as const)
    for (let i = 0; i < P.length; i++) {
      const q = P[i][1]
      if (q[0] < -2 || q[0] > 202 || q[1] < -2 || q[1] > 112) issues.push(`step${k} ${P[i][0]} off pitch`)
      for (let j = i + 1; j < P.length; j++) if (d(q, P[j][1]) < 2.5) issues.push(`step${k} ${P[i][0]}~${P[j][0]} overlap`)
    }
  }
  const uniq = [...new Set(issues)]
  uniq.forEach((s) => add(s.replace(/^[SD]?\w*\d+ /, '').replace(/[\w-]+->[\w-]+|\d+|[\w]+~[\w]+/g, '#')))
  if (uniq.length) rows.push(`${id}: ${uniq.join('; ')}`)
}
console.log(rows.join('\n'))
console.error(Object.keys(BOOK_SCENES).length, 'scenes,', rows.length, 'with issues')
console.error(stat)
