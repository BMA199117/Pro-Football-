import { ballAt, isLob, isShot, posAt, tracks, type BookScene, type Player, type Pt, type Team } from './scene'

/**
 * Step-by-step description of a drill, read from its scene data, written as short football
 * sentences: who passes, who receives, who dribbles or shoots, who opens up, who presses.
 * Because it is generated from the same data as the drawing and the animation, it always matches them.
 */
type Lang = 'uz' | 'ru'

const TEAM_NAME: Record<Team, [string, string]> = {
  r: ['qizil', 'красный'], b: ["ko'k", 'синий'], w: ['oq', 'белый'], y: ['sariq', 'жёлтый'],
  k: ['binafsha', 'фиолетовый'], c: ['qora', 'чёрный'], g: ['kulrang', 'серый'], o: ["to'q sariq", 'оранжевый'],
}
/** "ikki qizil o'yinchi" / "двое красных" */
const TEAM_GEN: Record<Team, string> = { r: 'красных', b: 'синих', w: 'белых', y: 'жёлтых', k: 'фиолетовых', c: 'чёрных', g: 'серых', o: 'оранжевых' }
const NUM_UZ = ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz']
const NUM_RU = ['', 'один', 'двое', 'трое', 'четверо', 'пятеро', 'шестеро', 'семеро', 'восьмеро']

const isGk = (p: Player) => (p.t === 'k' && (!p.l || p.l === '1')) || ['gl', 'gr', 'gk'].includes(p.id) || (/^g\d$/.test(p.id) && (p.t === 'y' || p.t === 'k'))
const isCoach = (p: Player) => p.id === 'co' || p.id === 'coach' || p.l === 'T' || p.l === 'Т'

/** Short name of a player: "qizil 10", "ko'k A", "darvozabon", "murabbiy", "qizil o'yinchi". */
export function who(p: Player, lang: Lang): string {
  const i = lang === 'uz' ? 0 : 1
  if (isCoach(p)) return ['murabbiy', 'тренер'][i]
  if (isGk(p)) return ['darvozabon', 'вратарь'][i]
  const team = TEAM_NAME[p.t][i]
  return p.l ? `${team} ${p.l}` : `${team} ${["o'yinchi", 'игрок'][i]}`
}

/** "ikki qizil o'yinchi" / "двое красных"; one player = his name. */
function group(ps: Player[], lang: Lang): string {
  if (ps.length === 1) return who(ps[0], lang)
  const t = ps[0].t, n = ps.length
  if (lang === 'uz') return `${NUM_UZ[n] ?? n} ${TEAM_NAME[t][0]} o'yinchi`
  return `${NUM_RU[n] ?? n} ${TEAM_GEN[t]}`
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const d2 = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1])

type Ev = { kind: 'pass' | 'lob' | 'shot' | 'drib' | 'get' | 'space'; a: Player; b?: Player }

/** What happens in step k → k+1, as short sentences. */
export function stepLines(sc: BookScene, k: number, lang: Lang): string[] {
  const uz = lang === 'uz'
  const byId = (id: string) => sc.players.find((p) => p.id === id)
  const at = (p: Player, s: number) => posAt(sc, p, s)
  const dist = (p: Player) => d2(at(p, k), at(p, k + 1))
  const evs: Ev[] = []
  const withBall = new Set<string>()
  const attack = new Set<Team>()
  const balls: Pt[] = []
  for (const tr of tracks(sc)) {
    const a = tr[k], b = tr[Math.min(k + 1, sc.steps - 1)]
    const pa = typeof a === 'string' ? byId(a) : undefined
    const pb = typeof b === 'string' ? byId(b) : undefined
    const bp = ballAt(sc, tr, k + 1) ?? ballAt(sc, tr, k)
    if (bp) balls.push(bp)
    for (const p of [pa, pb]) if (p && !isCoach(p) && !isGk(p)) attack.add(p.t)
    if (pa) withBall.add(pa.id)
    if (pa && pb && pa.id === pb.id) { if (dist(pa) > 3) evs.push({ kind: 'drib', a: pa }); continue }
    if (pa && pb) { evs.push({ kind: 'pass', a: pa, b: pb }); continue }
    if (pa && b !== 0 && typeof b !== 'string') { evs.push({ kind: isShot(b) ? 'shot' : isLob(b) ? 'lob' : 'space', a: pa }); continue }
    if (!pa && pb) evs.push({ kind: 'get', a: pb })
  }
  const recv = new Set(evs.filter((e) => e.b || e.kind === 'get').map((e) => (e.b ?? e.a).id))
  const runs = (p: Player) => dist(p) > 6
  const out: string[] = []

  // ---- passes ----
  const passes = evs.filter((e) => e.kind === 'pass')
  const pg = new Map<string, Ev[]>()
  for (const e of passes) { const key = e.a.t + e.b!.t; pg.set(key, [...(pg.get(key) ?? []), e]) }
  for (const [, es] of pg) {
    if (es.length === 1 || es.every((e) => e.a.l && e.b!.l)) {
      for (const e of es) {
        const a = who(e.a, lang), b = who(e.b!, lang)
        const onRun = runs(e.b!)
        const from = isCoach(e.a) || isGk(e.a)
        const mate = e.a.t === e.b!.t && !e.a.l && !e.b!.l && !from && !isGk(e.b!)
        if (uz) {
          if (from) out.push(`${a} to'pni o'yinga kiritadi, to'pni ${b} ${onRun ? 'harakatda ' : ''}qabul qiladi`)
          else if (mate) out.push(`${a} sherigiga pas beradi${onRun ? ', sherigi to\'pni harakatda qabul qiladi' : ''}`)
          else out.push(`${a} pas beradi, to'pni ${b} ${onRun ? 'harakatda ' : ''}qabul qiladi`)
        } else {
          if (from) out.push(`${a} вводит мяч в игру, мяч ${onRun ? 'на ходу ' : ''}принимает ${b}`)
          else if (mate) out.push(`${a} отдаёт пас партнёру${onRun ? ', партнёр принимает мяч на ходу' : ''}`)
          else out.push(`${a} отдаёт пас, мяч ${onRun ? 'на ходу ' : ''}принимает ${b}`)
        }
      }
    } else {
      const ta = es[0].a.t, tb = es[0].b!.t, n = es.length
      if (ta === tb) out.push(uz ? `${cap(TEAM_NAME[ta][0])}lar bir-biriga pas beradi (${n} ta pas)` : `${cap(TEAM_GEN[ta].replace(/х$/, 'е'))} передают мяч друг другу (передач: ${n})`)
      else out.push(uz ? `${cap(TEAM_NAME[ta][0])}lar ${TEAM_NAME[tb][0]}larga pas beradi (${n} ta pas)` : `${cap(TEAM_GEN[ta].replace(/х$/, 'е'))} отдают пас ${TEAM_GEN[tb].replace(/х$/, 'м')} (передач: ${n})`)
    }
  }

  // ---- other actions with the ball, grouped by colour when several players do the same ----
  const verb: Record<Exclude<Ev['kind'], 'pass'>, [string, string, string, string]> = {
    // [uz one, uz many, ru one, ru many]
    lob: ["to'pni havodan oshirib uzatadi", "to'pni havodan oshirib uzatadi", 'делает передачу верхом', 'делают передачу верхом'],
    space: ["to'pni bo'sh joyga uzatadi", "to'pni bo'sh joyga uzatadi", 'отдаёт мяч в свободную зону', 'отдают мяч в свободную зону'],
    drib: ["to'pni olib boradi", "to'pni olib boradi", 'ведёт мяч', 'ведут мяч'],
    shot: ['darvozaga zarba beradi', 'darvozaga zarba beradi', 'бьёт по воротам', 'бьют по воротам'],
    get: ["to'pni oladi", "to'pni oladi", 'получает мяч', 'получают мяч'],
  }
  for (const kind of ['lob', 'space', 'drib', 'shot', 'get'] as const) {
    const es = evs.filter((e) => e.kind === kind)
    const bt = new Map<Team, Player[]>()
    for (const e of es) bt.set(e.a.t, [...(bt.get(e.a.t) ?? []), e.a])
    for (const [, ps] of bt) {
      const named = ps.length === 1 || (ps.length === 2 && ps.every((p) => p.l))
      const many = !named || ps.length > 1
      const subj = named ? ps.map((p) => who(p, lang)).join(uz ? ' va ' : ' и ') : group(ps, lang)
      const v = verb[kind][(uz ? 0 : 2) + (many ? 1 : 0)]
      if (kind === 'get' && ps.length === 1 && isCoach(ps[0])) out.push(uz ? "To'p murabbiyga qaytadi" : 'Мяч возвращается к тренеру')
      else out.push(`${subj} ${v}`)
    }
  }

  // ---- movement without the ball (receivers are already described) ----
  const movers = sc.players.filter((p) => !p.quiet && !withBall.has(p.id) && !recv.has(p.id) && !isCoach(p) && runs(p))
  const nearBall = (p: Player) => balls.length ? Math.min(...balls.map((b) => d2(at(p, k + 1), b))) < Math.min(...balls.map((b) => d2(at(p, k), b))) - 3 : false
  type Mv = 'open' | 'press' | 'run' | 'back' | 'chase'
  const kindOf = (p: Player): Mv => {
    if (!balls.length) return 'run'
    if (!attack.size) return nearBall(p) ? 'chase' : 'back'
    if (attack.has(p.t)) return 'open'
    if (isGk(p)) return 'back'
    return nearBall(p) ? 'press' : 'back'
  }
  const MV: Record<Mv, [string, string, string, string]> = {
    open: ["bo'sh joyga ochiladi", "bo'sh joyga ochiladi", 'открывается под передачу', 'открываются под передачу'],
    press: ["to'p egasiga yaqinlashib bosim beradi", "to'p egasiga yaqinlashib bosim beradi", 'выходит на игрока с мячом', 'выходят на игрока с мячом'],
    back: ["o'z o'rnini egallaydi", "o'z o'rinlarini egallaydi", 'занимает позицию', 'занимают позиции'],
    run: ['yuguradi', 'yuguradi', 'бежит', 'бегут'],
    chase: ["to'p tomon yuguradi", "to'p tomon yuguradi", 'бежит к мячу', 'бегут к мячу'],
  }
  const buckets = new Map<string, Player[]>()
  for (const p of movers) { const key = kindOf(p) + '|' + (p.l && !isGk(p) ? p.id : p.t + (isGk(p) ? 'gk' : '')); buckets.set(key, [...(buckets.get(key) ?? []), p]) }
  for (const [key, ps] of buckets) {
    const kind = key.split('|')[0] as Mv
    const many = ps.length > 1
    out.push(`${group(ps, lang)} ${MV[kind][(uz ? 0 : 2) + (many ? 1 : 0)]}`)
  }
  return out.map((s) => cap(s) + '.')
}

/** All steps of a drill (step 1 = first movement). */
export function narrate(sc: BookScene, lang: Lang): string[][] {
  return Array.from({ length: sc.steps - 1 }, (_, k) => stepLines(sc, k, lang))
}
