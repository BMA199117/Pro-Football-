import type { BallStep, BookScene, More, Pt, Step } from './scene'
import { end } from './scene'

/**
 * The next player(s) from the queue play the same duel with a new ball.
 * run: the ball carrier's positions (first = where he takes the new ball); nb: index of the new ball track.
 */
export function next(nb: number, att: string, run: Step[], others: Record<string, Step[]>, fin?: BallStep): More {
  const b: BallStep[][] = Array.from({ length: nb + 1 }, () => [])
  b[nb] = [...Array(run.length).fill(att), ...(fin ? [fin] : [])]
  return { n: run.length + (fin ? 1 : 0), p: { [att]: run, ...others }, b }
}

/**
 * The same move again, by the next players (map: book player id → who does it now),
 * optionally mirrored to the other side of the pitch. The first step walks everyone to the start.
 * extra: other players' positions (e.g. the first pair joining the back of the queue).
 */
export function replay(sc: BookScene, map: Record<string, string>, opts: { mirror?: boolean } = {}, extra: Record<string, Step[]> = {}): More {
  const tf = (q: Pt): Pt => (opts.mirror ? [q[0], 110 - q[1]] : [q[0], q[1]])
  const tStep = (s: Step): Step => (Array.isArray(s[0]) ? (s as Pt[]).map(tf) : tf(s as Pt))
  const n = sc.steps
  const p: Record<string, Step[]> = { ...extra }
  for (const pl of sc.players) {
    const to = map[pl.id]
    if (!to) continue
    const st = [...pl.p, ...Array(Math.max(0, n - pl.p.length)).fill(pl.p[pl.p.length - 1])].slice(0, n)
    p[to] = st.map(tStep)
  }
  const tBall = (b: BallStep): BallStep => (typeof b === 'string' ? map[b] ?? b : b === 0 ? 0 : b.length === 3 ? [...tf([b[0], b[1]]), b[2]] as BallStep : tf(b as Pt))
  const old = sc.balls ?? []
  const own = sc.players.filter((pl) => pl.ball && map[pl.id]).map((pl) => [map[pl.id]] as BallStep[])
  const b: BallStep[][] = [...old.map(() => [] as BallStep[]), ...old.map((t) => t.slice(0, n).map(tBall)), ...own]
  return { n, p, b }
}

/**
 * Generic "Davomi" for keep-ball games: the team on the ball keeps passing (to a free team-mate,
 * not straight back), team-mates shift a little to stay open, the other team steps towards the ball,
 * and players with their own ball keep dribbling in small loops.
 */
export function keepBall(sc: BookScene, n = 4, maxPass = 90, reach = 200, groups: Record<string, string> = {}): More {
  const k = sc.steps - 1
  const pos: Record<string, Pt> = {}
  for (const pl of sc.players) pos[pl.id] = end(pl.p[Math.min(k, pl.p.length - 1)])
  const team: Record<string, string> = Object.fromEntries(sc.players.map((pl) => [pl.id, groups[pl.id] ?? pl.t]))
  const clamp = (q: Pt): Pt => [Math.max(6, Math.min(194, q[0])), Math.max(6, Math.min(104, q[1]))]
  const p: Record<string, Step[]> = {}
  const push = (id: string, q: Pt) => { (p[id] ??= []).push(clamp(q)); pos[id] = clamp(q) }
  const b: BallStep[][] = (sc.balls ?? []).map(() => [])
  // current owner and previous passer of each passing ball
  const owners = (sc.balls ?? []).map((t) => {
    const names = t.filter((s): s is string => typeof s === 'string')
    return [names[names.length - 1], names[names.length - 2]] as [string | undefined, string | undefined]
  })
  for (let s = 0; s < n; s++) {
    const moved = new Set<string>()
    const ballAt: Pt[] = []
    owners.forEach(([cur, prev], i) => {
      if (!cur || !pos[cur]) return
      const pick = (noPrev: boolean) => sc.players.filter((pl) => pl.id !== cur && (!noPrev || pl.id !== prev) && team[pl.id] === team[cur] && pl.t !== 'c' && !pl.ball)
        .map((pl) => ({ id: pl.id, d: Math.hypot(pos[pl.id][0] - pos[cur][0], pos[pl.id][1] - pos[cur][1]) }))
        .filter((m) => m.d <= maxPass && m.d > 8 && !moved.has(m.id))
        .sort((a, c) => c.d - a.d)
      let mates = pick(true)
      if (!mates.length) mates = pick(false)
      const to = mates[(s + i) % Math.max(1, Math.min(2, mates.length))]?.id
      if (!to) { b[i].push(cur); return }
      // receiver comes a step towards the ball
      const r = pos[to], o = pos[cur], d = Math.hypot(o[0] - r[0], o[1] - r[1]) || 1
      push(to, [r[0] + (o[0] - r[0]) / d * 3, r[1] + (o[1] - r[1]) / d * 3])
      moved.add(to); moved.add(cur)
      b[i].push(to); ballAt.push(pos[to])
      owners[i] = [to, cur]
    })
    const onBall = new Set(owners.map(([c]) => c && team[c]).filter(Boolean))
    sc.players.forEach((pl, j) => {
      if (moved.has(pl.id) || pl.t === 'c') return
      const q = pos[pl.id]
      if (pl.ball) { const a = (j * 1.7 + s * 1.2); push(pl.id, [q[0] + Math.cos(a) * 9, q[1] + Math.sin(a) * 9]); return }
      if (onBall.has(team[pl.id]) || !ballAt.length) { push(pl.id, [q[0] + (s % 2 ? -2.5 : 2.5), q[1] + ((s + j) % 2 ? 2 : -2)]); return }
      const t = ballAt.reduce((m, x) => (Math.hypot(x[0] - q[0], x[1] - q[1]) < Math.hypot(m[0] - q[0], m[1] - q[1]) ? x : m))
      const dx = t[0] - q[0], dy = t[1] - q[1], d = Math.hypot(dx, dy) || 1
      if (d > reach) { push(pl.id, q); return }
      // the nearest defender presses the ball, the others cover a lane beside it
      const rank = sc.players.filter((o) => team[o.id] === team[pl.id] && !moved.has(o.id) && Math.hypot(t[0] - pos[o.id][0], t[1] - pos[o.id][1]) < d).length
      if (rank >= 2) { push(pl.id, [q[0] + dx / d * 2, q[1] + dy / d * 2]); return }
      const side = rank === 0 ? 0 : (rank % 2 ? 1 : -1) * 10
      const tx = t[0] - dy / d * side - dx / d * (rank ? 8 : 4), ty = t[1] + dx / d * side - dy / d * (rank ? 8 : 4)
      const ex = tx - q[0], ey = ty - q[1], e = Math.hypot(ex, ey) || 1, step = Math.min(10, e * 0.5)
      push(pl.id, [q[0] + ex / e * step, q[1] + ey / e * step])
    })
  }
  return { n, p, b }
}
