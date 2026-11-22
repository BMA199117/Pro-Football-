import { isLob, isShot, posAt, tracks, type BookScene, type Player, type Team } from './scene'

/**
 * Step-by-step description of a drill, read from its scene data:
 * who passes to whom, who shoots, who dribbles, who runs.
 * Because it is generated from the same data as the drawing and the animation, it always matches them.
 */
type Lang = 'uz' | 'ru'

const TEAM_NAME: Record<Team, [string, string]> = {
  r: ['qizil', 'красный'], b: ["ko'k", 'синий'], w: ['oq', 'белый'], y: ['sariq', 'жёлтый'],
  k: ['binafsha', 'фиолетовый'], c: ['qora', 'чёрный'], g: ['kulrang', 'серый'], o: ["to'q sariq", 'оранжевый'],
}
const TEAM_MANY: Record<Team, [string, string]> = {
  r: ['qizillar', 'красные'], b: ["ko'klar", 'синие'], w: ['oqlar', 'белые'], y: ['sariqlar', 'жёлтые'],
  k: ['binafshalar', 'фиолетовые'], c: ['qoralar', 'чёрные'], g: ['kulranglar', 'серые'], o: ["to'q sariqlar", 'оранжевые'],
}
const W = {
  gk: ['darvozabon', 'вратарь'], coach: ['murabbiy', 'тренер'], player: ["o'yinchi", 'игрок'],
  pass: ['Pas', 'Пас'], lob: ['Oshirma', 'Передача верхом'], shot: ['Zarba', 'Удар'], drib: ["To'p bilan yurish", 'Ведение'],
  run: ['Yugurish', 'Рывок'], move: ['Harakatlanish', 'Перемещение'], space: ["bo'sh joyga", 'в свободную зону'],
  get: ["To'pni oladi", 'Получает мяч'], players: ["o'yinchi", 'игрока'], start: ['Boshlanish', 'Начало'],
} as const

const isGk = (p: Player) => (p.t === 'k' && (!p.l || p.l === '1')) || ['gl', 'gr', 'gk'].includes(p.id) || (/^g\d$/.test(p.id) && (p.t === 'y' || p.t === 'k'))
const isCoach = (p: Player) => p.id === 'co' || p.id === 'coach' || p.l === 'T' || p.l === 'Т'

/** Short name of a player: "qizil 10", "ko'k A", "darvozabon", "murabbiy", "qizil o'yinchi". */
export function who(p: Player, lang: Lang): string {
  const i = lang === 'uz' ? 0 : 1
  if (isCoach(p)) return W.coach[i]
  if (isGk(p)) return W.gk[i]
  const team = TEAM_NAME[p.t][i]
  return p.l ? `${team} ${p.l}` : `${team} ${W.player[i]}`
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

type Ev = { kind: 'pass' | 'lob' | 'shot' | 'drib' | 'get' | 'space'; a: Player; b?: Player }

/** What happens in step k → k+1, as short lines ("Pas: qizil 4 → qizil 6"). */
export function stepLines(sc: BookScene, k: number, lang: Lang): string[] {
  const i = lang === 'uz' ? 0 : 1
  const byId = (id: string) => sc.players.find((p) => p.id === id)
  const dist = (p: Player) => { const x = posAt(sc, p, k), y = posAt(sc, p, k + 1); return Math.hypot(y[0] - x[0], y[1] - x[1]) }
  const evs: Ev[] = []
  const withBall = new Set<string>()
  for (const tr of tracks(sc)) {
    const a = tr[k], b = tr[Math.min(k + 1, sc.steps - 1)]
    const pa = typeof a === 'string' ? byId(a) : undefined
    const pb = typeof b === 'string' ? byId(b) : undefined
    if (pa) withBall.add(pa.id)
    if (pa && pb && pa.id === pb.id) { if (dist(pa) > 3) evs.push({ kind: 'drib', a: pa }); continue }
    if (pa && pb) { evs.push({ kind: 'pass', a: pa, b: pb }); continue }
    if (pa && b !== 0 && typeof b !== 'string') { evs.push({ kind: isShot(b) ? 'shot' : isLob(b) ? 'lob' : 'space', a: pa }); continue }
    if (!pa && pb) evs.push({ kind: 'get', a: pb })
  }
  const recv = new Set(evs.filter((e) => e.b || e.kind === 'get').map((e) => (e.b ?? e.a).id))
  const runs = (p: Player) => dist(p) > 6
  const onRun = [' (yugurib oladi)', ' (на ходу)'][i]
  const out: string[] = []
  // passes: named one by one, many unnamed passes of the same colours grouped
  const passes = evs.filter((e) => e.kind === 'pass')
  const pg = new Map<string, Ev[]>()
  for (const e of passes) { const key = e.a.t + e.b!.t; pg.set(key, [...(pg.get(key) ?? []), e]) }
  for (const [, es] of pg) {
    if (es.length === 1 || es.every((e) => e.a.l && e.b!.l)) for (const e of es) out.push(`${W.pass[i]}: ${who(e.a, lang)} → ${who(e.b!, lang)}${runs(e.b!) ? onRun : ''}`)
    else out.push(`${W.pass[i]}: ${TEAM_MANY[es[0].a.t][i]} → ${TEAM_MANY[es[0].b!.t][i]} (${es.length})`)
  }
  // other ball actions, grouped by colour when several players do the same
  for (const kind of ['lob', 'space', 'drib', 'shot', 'get'] as const) {
    const es = evs.filter((e) => e.kind === kind)
    const label = kind === 'lob' ? W.lob[i] : kind === 'space' ? W.pass[i] : kind === 'drib' ? W.drib[i] : kind === 'shot' ? W.shot[i] : W.get[i]
    const tail = kind === 'lob' || kind === 'space' ? ` → ${W.space[i]}` : ''
    const bt = new Map<Team, Player[]>()
    for (const e of es) bt.set(e.a.t, [...(bt.get(e.a.t) ?? []), e.a])
    const parts: string[] = []
    for (const [t, ps] of bt) {
      if (ps.length === 1 || (ps.length === 2 && ps.every((p) => p.l))) parts.push(...ps.map((p) => who(p, lang)))
      else parts.push(`${TEAM_MANY[t][i]} (${ps.length})`)
    }
    if (parts.length) out.push(`${label}: ${parts.join(', ')}${tail}`)
  }
  // runs without the ball (receivers are already described)
  const movers = sc.players.filter((p) => !p.quiet && !withBall.has(p.id) && !recv.has(p.id) && !isCoach(p) && runs(p))
  const named = movers.filter((p) => p.l && !isGk(p))
  for (const p of named) out.push(`${W.run[i]}: ${who(p, lang)}`)
  const byTeam = new Map<Team, Player[]>()
  for (const p of movers) if (!named.includes(p)) byTeam.set(p.t, [...(byTeam.get(p.t) ?? []), p])
  const mv: string[] = []
  for (const [t, ps] of byTeam) mv.push(ps.length === 1 ? who(ps[0], lang) : `${TEAM_MANY[t][i]} (${ps.length})`)
  if (mv.length) out.push(`${W.move[i]}: ${mv.join(', ')}`)
  return out.map(cap)
}

/** All steps of a drill (step 1 = first movement). */
export function narrate(sc: BookScene, lang: Lang): string[][] {
  return Array.from({ length: sc.steps - 1 }, (_, k) => stepLines(sc, k, lang))
}
