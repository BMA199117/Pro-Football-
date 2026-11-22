import type { BallStep, BookScene, More, Pt, Step } from './scene'

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
