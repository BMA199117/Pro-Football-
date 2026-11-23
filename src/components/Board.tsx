import { useEffect, useId, useRef, useState } from 'react'
import { ballAt, marks, posAt, type BallStep, type BookScene, type ConeColor, type Item, type PitchKind, type Pt, type Step, type Team } from '../book/scene'
import { Frame, MarkPaths, SCALABLE, TEAM, ballDot, fieldItem, item, playerDot, soccerBall } from './BookPitch'
import { BookPlayer } from './AnimatedPitch'
import { useT } from '../hooks'
import type { Key } from '../i18n'

/**
 * Tactics board: the coach places players, balls and equipment, then adds steps.
 * In each step players are dragged to where they run and the ball is passed, so the
 * board builds the same kind of scene the book drills use (drawing + step animation).
 */

/** move, pass, shot, lob, del, line, add:<team> or add:<kit key> */
type Tool = string
/** the bottom bar's panels */
type Pop = null | 'players' | 'kit' | 'text' | 'field' | 'color'
type Hit = { kind: 'p'; id: string } | { kind: 'b'; i: number } | { kind: 'i'; i: number }

const FIELDS: [PitchKind | 'free', Key][] = [['full', 'bFull'], ['right', 'bHalf'], ['left', 'bHalfL'], ['box', 'bBox'], ['mid', 'bMid'], ['grid', 'bGrid'], ['free', 'bFree']]
const QUICK_KIT = ['coneo', 'discy', 'mini', 'goal', 'dummy', 'pole']
const PLAYER_TOOLS: [Team, Key][] = [['r', 'bRed'], ['b', 'bBlue'], ['y', 'bYellow'], ['w', 'bWhite'], ['o', 'bOrange'], ['g', 'bGrey'], ['k', 'bKeeper'], ['c', 'bCoach']]
type Kit = { key: string; label: Key; col?: Key; make: (x: number, y: number) => Item; box?: number }
const COLS: [ConeColor, Key][] = [['y', 'cYellow'], ['r', 'cRed'], ['b', 'cBlue']]
const CONE_COLS: [ConeColor, Key][] = [['o', 'cOrange'], ...COLS]
/** equipment on the board; each one is drawn with the same shapes as the book diagrams */
const KIT: Kit[] = [
  ...CONE_COLS.map(([c, col]): Kit => ({ key: 'cone' + c, label: 'bCone', col, make: (x, y) => ['cone', x, y, c], box: 9 })),
  ...COLS.map(([c, col]): Kit => ({ key: 'disc' + c, label: 'bDisc', col, make: (x, y) => ['disc', x, y, c], box: 8 })),
  { key: 'dummy', label: 'bDummy', make: (x, y) => ['dummy', x, y], box: 16 },
  { key: 'pole', label: 'bPole', make: (x, y) => ['pole', x, y], box: 13 },
  { key: 'hurdle', label: 'bHurdle', make: (x, y) => ['hurdle', x, y], box: 11 },
  { key: 'arc', label: 'bArc', make: (x, y) => ['arc', x, y], box: 10 },
  { key: 'ladder', label: 'bLadder', make: (x, y) => ['ladder', x - 8, y, x + 8, y], box: 22 },
  ...COLS.filter(([c]) => c !== 'r').map(([c, col]): Kit => ({ key: 'hoop' + c, label: 'bHoop', col, make: (x, y) => ['hoop', x, y, c], box: 10 })),
  ...COLS.map(([c, col]): Kit => ({ key: 'bib' + c, label: 'bBib', col, make: (x, y) => ['bib', x, y, c], box: 9 })),
  { key: 'mini', label: 'bMini', make: (x, y) => ['mini', x, y, goalDir(x)], box: 13 },
  { key: 'goal', label: 'bGoal', make: (x, y) => ['goal', x, y, goalDir(x)], box: 26 },
  { key: 'flag', label: 'bFlag', make: (x, y) => ['flag', x, y], box: 13 },
]
const MOVABLE = new Set(['cone', 'disc', 'dummy', 'bib', 'arc', 'ladder', 'mark', 'mini', 'goal', 'pole', 'hurdle', 'flag', 'ball', 'hoop', 'text'])
const TWO_POINT = new Set(['ladder', 'mark'])
/** line styles of the line tool (see the 'mark' item) */
const L_TYPES: [string, Key][] = [['s', 'lSolid'], ['d', 'lDashed'], ['w', 'lWavy'], ['c', 'lCurved'], ['e', 'lCurvedDashed']]
const L_ENDS: [string, Key][] = [['a', 'lArrow'], ['x', 'lCross'], ['b', 'lBar'], ['n', 'lNone']]
const L_COLS: [string, Key, string][] = [['w', 'cWhite', '#fff'], ['k', 'cBlack', '#0E1C15'], ['r', 'cRed', '#FF4A3D'], ['b', 'cBlue', '#3D7FE6'], ['y', 'cYellow', '#F6D83A']]

export const blankScene = (): BookScene => ({ steps: 1, field: [['pitch', 'full'], ['goal', 4, 55, 'r', 12], ['goal', 196, 55, 'l', 12]], players: [], balls: [] })

const padTo = <T,>(a: T[], n: number): T[] => (a.length >= n ? a : [...a, ...Array(n - a.length).fill(a[a.length - 1])])
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1])
const clampPt = (p: Pt): Pt => [Math.round(Math.max(3, Math.min(197, p[0])) * 2) / 2, Math.round(Math.max(3, Math.min(107, p[1])) * 2) / 2]

/** Set entry s of a track; the entries after it that repeated the old value follow (the thing stood still). */
function setAt<T>(arr: T[], s: number, v: T, fill: T): T[] {
  const a = arr.length ? padTo(arr, s + 1) : [...Array(s).fill(fill), v]
  const old = a[s]
  const out = [...a]
  out[s] = v
  for (let j = s + 1; j < out.length && same(out[j], old); j++) out[j] = v
  return out
}

const movePlayer = (sc: BookScene, id: string, s: number, at: Pt): BookScene => ({
  ...sc, players: sc.players.map((p) => (p.id === id ? { ...p, p: setAt<Step>(p.p, s, at, at) } : p)),
})
const setBall = (sc: BookScene, i: number, s: number, v: BallStep): BookScene => ({
  ...sc, balls: (sc.balls ?? []).map((t, j) => (j === i ? setAt<BallStep>(t, s, v, 0) : t)),
})
const goalDir = (x: number) => (x < 100 ? 'r' : 'l') as 'r' | 'l'
/** Shift an item by (dx, dy); goals turn to face the middle of the pitch. */
function shiftItem(it: Item, dx: number, dy: number): Item {
  const c = [...it] as unknown as (string | number)[]
  c[1] = (c[1] as number) + dx; c[2] = (c[2] as number) + dy
  if (TWO_POINT.has(it[0])) { c[3] = (c[3] as number) + dx; c[4] = (c[4] as number) + dy }
  if (it[0] === 'goal' || it[0] === 'mini') c[3] = goalDir(c[1] as number)
  return c as unknown as Item
}
/** Distance from a tap to an item (to the whole line for lines and ladders). */
function itemDist(it: Item, at: Pt): number {
  const a: Pt = [it[1] as number, it[2] as number]
  if (!TWO_POINT.has(it[0])) return dist(a, at)
  const b: Pt = [it[3] as number, it[4] as number]
  const vx = b[0] - a[0], vy = b[1] - a[1], l2 = vx * vx + vy * vy || 1
  const f = Math.max(0, Math.min(1, ((at[0] - a[0]) * vx + (at[1] - a[1]) * vy) / l2))
  return dist([a[0] + vx * f, a[1] + vy * f], at)
}
/** Sizes of the field items, one per item (missing = 1); stored only when some item is resized. */
const sizesOf = (sc: BookScene) => sc.field.map((_, i) => sc.fs?.[i] ?? 1)
const packSizes = (fs: number[]) => (fs.some((v) => v !== 1) ? fs : undefined)
/** The scene with its field (and the sizes that go with it) replaced. */
function withField(sc: BookScene, pairs: [Item, number][]): BookScene {
  const { fs: _old, ...rest } = sc
  const fs = packSizes(pairs.map((p) => p[1]))
  return { ...rest, field: pairs.map((p) => p[0]), ...(fs ? { fs } : {}) }
}
const fieldPairs = (sc: BookScene): [Item, number][] => sc.field.map((it, i) => [it, sc.fs?.[i] ?? 1])
const clampSize = (v: number) => Math.max(0.5, Math.min(2, Math.round(v * 10) / 10))

function removePlayer(sc: BookScene, id: string): BookScene {
  const p = sc.players.find((q) => q.id === id)!
  // a ball this player had stays where the player was
  const balls = (sc.balls ?? []).map((t) => t.map((b, k) => (b === id ? posAt(sc, p, k) : b)))
  return { ...sc, players: sc.players.filter((q) => q.id !== id), balls }
}
function nextId(sc: BookScene, t: Team) {
  let n = 1
  while (sc.players.some((p) => p.id === t + n)) n++
  return t + n
}

export function Board({ initial, name: name0 = '', onSave, onClose }: { initial?: BookScene; name?: string; onSave: (scene: BookScene, name: string) => void; onClose: () => void }) {
  const { t } = useT()
  const fid = 'tb' + useId().replace(/:/g, '')
  const [sc, setSc] = useState<BookScene>(() => initial ?? blankScene())
  const [hist, setHist] = useState<BookScene[]>([])
  const [s, setS] = useState(0)
  const [tool, setTool] = useState<Tool>('move')
  const [sel, setSel] = useState<number | null>(null)
  const [name, setName] = useState(name0)
  const [preview, setPreview] = useState(false)
  const [all, setAll] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ hit: Hit; moved: boolean; last: Pt } | null>(null)
  const [line, setLine] = useState({ type: 'd', end: 'a', col: 'w', w: 2 })
  const [draft, setDraft] = useState<[Pt, Pt] | null>(null)
  const [text, setText] = useState('')
  /** the field item last tapped or moved, whose size the size buttons change */
  const [selItem, setSelItem] = useState<number | null>(null)
  const [pop, setPop] = useState<Pop>(null)
  /** size given to new equipment */
  const [kitSize, setKitSize] = useState(1)
  const addItem = (it: Item) => { commit(withField(sc, [...fieldPairs(sc), [it, kitSize]])); setSelItem(sc.field.length) }

  useEffect(() => {
    // capture first, so Escape closes only the board and not the form under it
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }
    window.addEventListener('keydown', k, true)
    return () => window.removeEventListener('keydown', k, true)
  }, [onClose])

  const balls = sc.balls ?? []
  // tracks padded to every step (the scene keeps them short; ballAt needs an entry per step)
  const ballsP = balls.map((tr) => (tr.length ? padTo(tr, sc.steps) : tr))
  const commit = (next: BookScene) => { setHist((h) => [...h.slice(-40), sc]); setSc(next) }
  const undo = () => { const h = hist[hist.length - 1]; if (!h) return; setHist(hist.slice(0, -1)); setSc(h); setS((x) => Math.min(x, h.steps - 1)) }

  const toPt = (e: React.PointerEvent): Pt => {
    const svg = svgRef.current!
    const m = svg.getScreenCTM()
    if (!m) return [0, 0]
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    return [p.x, p.y]
  }
  const hitAt = (at: Pt, only?: 'p' | 'b'): Hit | null => {
    let best: Hit | null = null, bd = Infinity
    // on a phone the pitch is small: keep every target at least ~22px wide for a finger
    const px = (svgRef.current?.getBoundingClientRect().width ?? 600) / 200
    const consider = (h: Hit, d: number, r0: number) => { const r = Math.max(r0, 11 / px); if (d < r && d - r * 0.3 < bd) { bd = d - r * 0.3; best = h } }
    if (only !== 'b') sc.players.forEach((p) => consider({ kind: 'p', id: p.id }, dist(posAt(sc, p, s), at), 6.5 * (sc.ps ?? 1)))
    if (only !== 'p') ballsP.forEach((tr, i) => { const b = ballAt(sc, tr, s); if (b) consider({ kind: 'b', i }, dist(b, at), 4.5) })
    if (!only) sc.field.forEach((it, i) => { if (MOVABLE.has(it[0])) consider({ kind: 'i', i }, itemDist(it, at), it[0] === 'mark' ? 3.5 : 6 * (sc.fs?.[i] ?? 1)) })
    return best
  }
  /** ball the pass tools act on: the selected one, the only one, or the one at a tapped player's feet */
  const ballOf = (h: Hit | null): number | null => {
    if (h?.kind === 'b') return h.i
    if (h?.kind === 'p') { const i = balls.findIndex((tr) => padTo(tr, s + 1)[s] === h.id); if (i >= 0) return i }
    return null
  }

  const down = (e: React.PointerEvent) => {
    if (preview) return
    const at = toPt(e)
    const h = hitAt(at)
    if (tool === 'move') {
      setSelItem(h?.kind === 'i' && SCALABLE.has(sc.field[h.i][0]) ? h.i : null)
      if (!h) return
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setHist((x) => [...x.slice(-40), sc])
      drag.current = { hit: h, moved: false, last: at }
      return
    }
    if (tool === 'line') {
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      const p = clampPt(at)
      setDraft([p, p])
      return
    }
    if (tool === 'del') {
      if (!h) return
      if (h.kind === 'p') commit(removePlayer(sc, h.id))
      else if (h.kind === 'b') { commit({ ...sc, balls: balls.filter((_, i) => i !== h.i) }); setSel(null) }
      else { commit(withField(sc, fieldPairs(sc).filter((_, i) => i !== h.i))); setSelItem(null) }
      return
    }
    if (tool === 'pass' || tool === 'shot' || tool === 'lob') {
      const own = ballOf(h)
      const cur = sel ?? (balls.length === 1 ? 0 : null)
      // the first tap picks the ball (or the player who has it); tapping another ball switches to it
      if (cur === null || (own !== null && own !== cur)) { if (own !== null) setSel(own); return }
      if (own === cur) return
      const p = h?.kind === 'p' ? h.id : null
      const pt = clampPt(at)
      const v: BallStep = tool === 'shot' ? [pt[0], pt[1], 1] : tool === 'lob' ? [pt[0], pt[1], 2] : p ?? pt
      commit(setBall(sc, cur, s, v))
      setSel(cur)
      return
    }
    // add tools
    const kind = tool.slice(4)
    const pt = clampPt(at)
    if (kind === 'ball') {
      const p = hitAt(at, 'p')
      const tr: BallStep[] = [...Array(s).fill(0), p?.kind === 'p' ? p.id : pt]
      commit({ ...sc, balls: [...balls, tr] })
      setSel(balls.length)
      return
    }
    if (kind === 'text') {
      if (text.trim()) addItem(['text', pt[0], pt[1], text.trim()])
      else document.getElementById('tb-text')?.focus()
      return
    }
    if (kind.length === 1) {
      const team = kind as Team
      const id = nextId(sc, team)
      // field players get a number (as in the books), the coach a T; keepers stay plain
      const l = team === 'c' ? 'T' : team === 'k' ? undefined : String(sc.players.filter((p) => p.t === team).length + 1)
      commit({ ...sc, players: [...sc.players, { id, t: team, p: [pt], ...(l ? { l } : {}) }] })
      return
    }
    const kit = KIT.find((k) => k.key === kind)
    if (kit) addItem(kit.make(pt[0], pt[1]))
  }
  const move = (e: React.PointerEvent) => {
    if (draft) { const p = clampPt(toPt(e)); setDraft([draft[0], p]); return }
    const d = drag.current
    if (!d) return
    const raw = toPt(e), at = clampPt(raw)
    const dx = raw[0] - d.last[0], dy = raw[1] - d.last[1]
    d.last = raw
    d.moved = true
    const h = d.hit
    setSc((cur) => h.kind === 'p' ? movePlayer(cur, h.id, s, at)
      : h.kind === 'b' ? setBall(cur, h.i, s, at)
      : { ...cur, field: cur.field.map((it, i) => (i === h.i ? shiftItem(it, dx, dy) : it)) })
  }
  const up = (e: React.PointerEvent) => {
    if (draft) {
      const [a, b] = draft
      setDraft(null)
      if (dist(a, b) > 4) commit(withField(sc, [...fieldPairs(sc), [['mark', a[0], a[1], b[0], b[1], line.type + line.end + line.col + line.w], 1]]))
      return
    }
    const d = drag.current
    drag.current = null
    if (!d) return
    if (!d.moved) { setHist((x) => x.slice(0, -1)); if (d.hit.kind === 'b') setSel(d.hit.i); return }
    if (d.hit.kind === 'b') {
      // dropped on a player: the player receives the ball
      const i = d.hit.i
      const p = hitAt(toPt(e), 'p')
      if (p?.kind === 'p') setSc((cur) => setBall(cur, i, s, p.id))
      setSel(i)
    }
  }

  const addStep = () => { commit({ ...sc, steps: sc.steps + 1 }); setS(sc.steps) }
  const delStep = () => {
    if (sc.steps < 2) return
    const cut = <T,>(a: T[]) => (a.length > s ? [...a.slice(0, s), ...a.slice(s + 1)] : a)
    commit({ ...sc, steps: sc.steps - 1, players: sc.players.map((p) => ({ ...p, p: p.p.length > 1 ? cut(p.p) : p.p })), balls: balls.map((tr) => (tr.length > 1 ? cut(tr) : tr)) })
    setS(Math.max(0, s - 1))
  }
  const setField = (f: PitchKind | 'free') => {
    const rest = fieldPairs(sc).filter(([it]) => it[0] !== 'pitch')
    commit(withField(sc, f === 'free' ? rest : [[['pitch', f], 1], ...rest]))
    setSelItem(null)
  }
  const fieldNow = (sc.field.find((it) => it[0] === 'pitch')?.[1] as PitchKind | undefined) ?? 'free'
  const save = () => { if (!name.trim()) { document.getElementById('tb-name')?.focus(); return } onSave(sc, name.trim()) }

  const hintKey: Key = tool === 'move' ? (s === 0 ? 'bHintStart' : 'bHintMove')
    : tool === 'del' ? 'bHintDel'
    : tool === 'pass' || tool === 'shot' || tool === 'lob' ? (s === 0 ? 'bHintPass0' : 'bHintPass')
    : tool === 'line' ? 'bHintLine'
    : tool === 'add:text' ? 'bHintText'
    : 'bHintAdd'
  const selBall = sel !== null && ballsP[sel] ? ballAt(sc, ballsP[sel], s) : null
  const kitBtn = (v: Tool, label: string, icon: React.ReactNode) => (
    <button type="button" key={v} className="tb-kitbtn" aria-pressed={tool === v} onClick={() => { setTool(v); setPreview(false) }} title={label} aria-label={label}>{icon}</button>
  )
  const dot = (team: Team) => <svg viewBox="-6 -6 12 12" width="18" height="18"><circle r={4.6} fill={TEAM[team].fill} stroke={team === 'w' || team === 'y' ? '#1C2A22' : '#fff'} strokeWidth={1.2} /></svg>
  /** a small picture of a kit item, drawn with the board's own shapes */
  const kitIc = (k: Kit) => { const r = (k.box ?? 16) / 2; const it = k.make(0, 0); const shown = (it[0] === 'goal' || it[0] === 'mini') ? ([it[0], 0, -r * 0.25, 'u', it[0] === 'goal' ? 22 : 11] as Item) : it; return <svg viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} width="26" height="26"><g>{item(shown, 0, fid + 'net')}</g></svg> }
  const ballIc = <svg viewBox="-5 -5 10 10" width="24" height="24">{soccerBall(0, 0, 4, "b", false)}</svg>
  const lineIc = (st: string) => <svg viewBox="0 0 30 12" width="34" height="14"><rect width="30" height="12" rx="2.5" fill="#2E8B57" />{item(['mark', 3, 8, 26, 5, st], 0, fid + 'net')}</svg>
  const arrowIc = (dash?: string, curve?: boolean) => <svg viewBox="0 0 20 12" width="20" height="12"><path d={curve ? 'M2 10Q10 -2 17 8' : 'M2 6H16'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray={dash} /><path d={curve ? 'M14 9l4 0l-1-4z' : 'M15 3l4 3l-4 3z'} fill="currentColor" /></svg>

  const pick = (v: Tool) => { setTool(v); setPreview(false); setPop(null) }
  const popBtn = (k: Pop, label: string, icon: React.ReactNode, active: boolean) => (
    <button type="button" className="tbb-big" aria-pressed={pop === k || active} aria-expanded={pop === k} onClick={() => { setPreview(false); setPop(pop === k ? null : k) }}>
      <span className="tbb-bigic" aria-hidden="true">{icon}</span><span>{label}</span>
    </button>
  )
  const actBtn = (v: Tool, label: string, icon: React.ReactNode) => (
    <button type="button" className="tbb-act" aria-pressed={!preview && tool === v} onClick={() => pick(v)} title={label}>
      <span className="tbb-actic" aria-hidden="true">{icon}</span><span>{label}</span>
    </button>
  )
  /** side rails: each team's players stand beside the pitch; tap one to put it on, or drag it to a spot */
  const railRef = useRef<null | { team: Team; l?: string; side: 'L' | 'R'; sx: number; sy: number; moved: boolean }>(null)
  const [ghost, setGhost] = useState<null | { team: Team; l?: string; x: number; y: number }>(null)
  const putPlayer = (team: Team, l: string | undefined, pt: Pt) =>
    commit({ ...sc, players: [...sc.players, { id: nextId(sc, team), t: team, p: [clampPt(pt)], ...(l ? { l } : {}) }] })
  const railSpot = (team: Team, l: string | undefined, side: 'L' | 'R'): Pt => {
    if (team === 'k') return [side === 'L' ? 10 : 190, 55]
    const n = Number(l ?? 1) - 1
    // a 4-4-2-like spread on the team's own half, so tapped players don't land on each other
    const rows: Pt[] = [[24, 22], [24, 44], [24, 66], [24, 88], [52, 18], [52, 41], [52, 69], [52, 92], [78, 40], [78, 70], [66, 55]]
    const [x, y] = rows[n % rows.length]
    return [side === 'L' ? x : 200 - x, y]
  }
  const railDown = (e: React.PointerEvent, team: Team, l: string | undefined, side: 'L' | 'R') => {
    e.preventDefault()
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    railRef.current = { team, l, side, sx: e.clientX, sy: e.clientY, moved: false }
  }
  const railMove = (e: React.PointerEvent) => {
    const r = railRef.current
    if (!r) return
    if (!r.moved && Math.hypot(e.clientX - r.sx, e.clientY - r.sy) > 6) r.moved = true
    if (r.moved) setGhost({ team: r.team, l: r.l, x: e.clientX, y: e.clientY })
  }
  const railUp = (e: React.PointerEvent) => {
    const r = railRef.current
    railRef.current = null
    setGhost(null)
    if (!r || e.type === 'pointercancel') return
    if (!r.moved) { putPlayer(r.team, r.l, railSpot(r.team, r.l, r.side)); return }
    const svg = svgRef.current, m = svg?.getScreenCTM()
    if (!svg || !m) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    if (p.x < 0 || p.x > 200 || p.y < 0 || p.y > 110) return
    putPlayer(r.team, r.l, [p.x, p.y])
  }
  const token = (team: Team, l: string | undefined, size = 26) => (
    <svg viewBox="-6 -6 12 12" width={size} height={size} aria-hidden="true">
      <circle r={5.2} fill={TEAM[team].fill} stroke={team === 'w' || team === 'y' ? '#1C2A22' : '#fff'} strokeWidth={0.9} />
      {l && <text y={2} textAnchor="middle" fontSize={5.4} fontWeight={700} fill={team === 'w' || team === 'y' ? '#1C2A22' : '#fff'}>{l}</text>}
    </svg>
  )
  const rail = (side: 'L' | 'R') => {
    const team: Team = side === 'L' ? 'b' : 'r'
    const used = new Set(sc.players.filter((p) => p.t === team).map((p) => p.l))
    const btn = (tm: Team, l: string | undefined, label: string, dim = false) => (
      <button type="button" key={tm + (l ?? '')} className={'tb-tok' + (dim ? ' used' : '')} title={label} aria-label={label}
        onPointerDown={(e) => railDown(e, tm, l, side)} onPointerMove={railMove} onPointerUp={railUp} onPointerCancel={railUp}>{token(tm, l)}</button>
    )
    return (
      <div className={'tb-rail tb-rail-' + side} role="group" aria-label={t(side === 'L' ? 'bBlue' : 'bRed')}>
        {btn('k', undefined, t('bKeeper'))}
        <div className="tb-toks">{Array.from({ length: 11 }, (_, i) => String(i + 1)).map((l) => btn(team, l, t(side === 'L' ? 'bBlue' : 'bRed') + ' ' + l, used.has(l)))}</div>
        <div className="tb-rail-x">
          {side === 'L' ? <>
            {actBtn('move', t('bMove'), '✋')}
            {actBtn('pass', t('bPass'), arrowIc('3 2'))}
            {actBtn('shot', t('bShot'), arrowIc('0.5 2'))}
            {actBtn('lob', t('bLob'), arrowIc(undefined, true))}
            {actBtn('del', t('del'), '🧽')}
          </> : <div className="tb-kit tb-qkit">
            {kitBtn('add:ball', t('bBall'), ballIc)}
            {QUICK_KIT.map((key) => { const k = KIT.find((x) => x.key === key); return k ? <span key={key}>{kitBtn('add:' + k.key, t(k.label) + (k.col ? ' · ' + t(k.col) : ''), kitIc(k))}</span> : null })}
          </div>}
        </div>
      </div>
    )
  }
  const lineSet = (patch: Partial<typeof line>) => { setLine({ ...line, ...patch }); pick('line') }
  const isLine = !preview && tool === 'line'
  const playersIc = <svg viewBox="0 0 30 22" width="34" height="26"><circle cx="10" cy="11" r="7" fill={TEAM.r.fill} stroke="#fff" strokeWidth="1.6" /><circle cx="21" cy="11" r="7" fill={TEAM.b.fill} stroke="#fff" strokeWidth="1.6" /></svg>
  const kitBig = <svg viewBox="-9 -7 18 14" width="34" height="26">{item(['cone', 3.5, 0.5, 'o'], 0, fid + 'net')}{soccerBall(-3.5, 2, 3.2, 'kb', false)}</svg>
  const fieldIc = <svg viewBox="0 0 30 20" width="34" height="24"><rect x="1" y="1" width="28" height="18" rx="2" fill="#5F9B3C" stroke="#fff" strokeWidth="1.2" /><path d="M15 1V19" stroke="#fff" strokeWidth="1.2" /><circle cx="15" cy="10" r="3.4" fill="none" stroke="#fff" strokeWidth="1.2" /></svg>
  const sizeRow = (label: string, cur: number, min: number, max: number, set: (v: number) => void) => (
    <div className="tb-size">
      <span>{label}</span>
      <button type="button" className="tb-tool" aria-label={t('bSmaller')} disabled={cur <= min} onClick={() => set(Math.max(min, Math.round((cur - 0.1) * 10) / 10))}>−</button>
      <input type="range" min={min} max={max} step={0.1} value={cur} aria-label={label} onChange={(e) => set(Number(e.target.value))} />
      <button type="button" className="tb-tool" aria-label={t('bBigger')} disabled={cur >= max} onClick={() => set(Math.min(max, Math.round((cur + 0.1) * 10) / 10))}>+</button>
      <b>{Math.round(cur * 100)}%</b>
    </div>
  )
  const kitSizeRow = () => {
    const one = selItem !== null && sc.field[selItem] ? selItem : null
    const cur = one !== null ? sc.fs?.[one] ?? 1 : kitSize
    const set = (v: number) => {
      v = clampSize(v)
      if (one !== null) { commit(withField(sc, fieldPairs(sc).map(([it, z], i) => [it, i === one ? v : z]))); return }
      // nothing picked: every piece of equipment and the balls, and new equipment too
      setKitSize(v)
      const sizes = sizesOf(sc).map((z, i) => (SCALABLE.has(sc.field[i][0]) ? v : z))
      commit({ ...withField(sc, sc.field.map((it, i) => [it, sizes[i]])), bs: v === 1 ? undefined : v })
    }
    return <>{sizeRow(t(one !== null ? 'bSizeOne' : 'bSizeAll'), cur, 0.5, 2, set)}<p className="tb-note">{t(one !== null ? 'bSizeHintOne' : 'bSizeHintAll')}</p></>
  }

  return (
    <div className="board" role="dialog" aria-modal="true" aria-label={t('board')}>
      <div className="tb-top">
        <input id="tb-name" className="tb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('bName')} aria-label={t('name')} />
        <div className="tb-top-btns">
          <button type="button" className="btn ghost small" onClick={undo} disabled={!hist.length}>↶ {t('bUndo')}</button>
          <button type="button" className="btn ghost small" onClick={onClose}>{t('cancel')}</button>
          <button type="button" className="btn small" onClick={save}>{t('save')}</button>
        </div>
      </div>

      <div className="tb-stage" onPointerDown={() => pop && setPop(null)}>
        {preview ? (
          <div className="tb-play"><BookPlayer key={JSON.stringify(sc).length + ':' + sc.steps} scene={sc} autoPlay fit /></div>
        ) : (
          <div className="tb-field">
          {rail('L')}
          <div className="tb-fitbox">
          <Frame id={fid} svg={{ ref: svgRef, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, className: 'pitch tb-svg', style: { touchAction: 'none' }, 'aria-hidden': false, 'aria-label': t('board') }}>
            {sc.field.map((it, i) => fieldItem(it, i, fid + 'net', sc.fs?.[i]))}
            {selItem !== null && sc.field[selItem] && (() => { const it = sc.field[selItem]; const [x, y] = it[0] === 'ladder' ? [((it[1] as number) + (it[3] as number)) / 2, ((it[2] as number) + (it[4] as number)) / 2] : [it[1] as number, it[2] as number]; return <circle cx={x} cy={y} r={(it[0] === 'goal' ? 13 : it[0] === 'ladder' ? 10 : 6.5) * (sc.fs?.[selItem] ?? 1)} fill="none" stroke="#FFE45C" strokeWidth={0.6} strokeDasharray="1.6 1.2" pointerEvents="none" /> })()}
            {all && sc.steps > 1 && <MarkPaths scene={sc} ms={marks(sc, 0, sc.steps - 1)} id={fid} opacity={0.35} />}
            {s > 0 && <>
              {sc.players.map((p) => { const a = posAt(sc, p, s - 1), b = posAt(sc, p, s); return dist(a, b) > 1.5 ? <circle key={'g' + p.id} cx={a[0]} cy={a[1]} r={4.4 * (sc.ps ?? 1)} fill={TEAM[p.t].fill} opacity={0.3} /> : null })}
              <MarkPaths scene={sc} ms={marks(sc, s - 1, s)} id={fid} />
            </>}
            {selBall && (tool === 'pass' || tool === 'shot' || tool === 'lob') && <circle cx={selBall[0]} cy={selBall[1]} r={4.6} fill="none" stroke="#FFE45C" strokeWidth={1} />}
            {draft && dist(draft[0], draft[1]) > 1 && item(['mark', ...draft[0], ...draft[1], line.type + line.end + line.col + line.w], 999, fid + 'net')}
            {sc.players.map((p) => playerDot(p.t, posAt(sc, p, s), p.l, 'p' + p.id, sc.ps))}
            {ballsP.map((tr, i) => { const b = ballAt(sc, tr, s); return b ? ballDot(b, 'b' + i, sc.bs) : null })}
          </Frame>
          </div>
          {rail('R')}
          </div>
        )}
        {ghost && <div className="tb-ghost" style={{ left: ghost.x, top: ghost.y }}>{token(ghost.team, ghost.l, 34)}</div>}
        <p className="tb-hint">{preview ? t('bHintPreview') : t(hintKey)}</p>
      </div>

      {!preview && (
        <div className="tb-steps" role="group" aria-label={t('stepsTitle')}>
          {Array.from({ length: sc.steps }, (_, k) => (
            <button type="button" key={k} aria-pressed={s === k} onClick={() => setS(k)}>{k === 0 ? t('bStart') : `${k}`}</button>
          ))}
          <button type="button" className="tb-add" onClick={addStep}>+ {t('bStep')}</button>
          {sc.steps > 1 && s > 0 && <button type="button" className="tb-delstep" onClick={delStep} aria-label={t('bDelStep')}>✕</button>}
          <label className="tb-check"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> {t('bAll')}</label>
          <span className="tb-count">{sc.players.length} {t('bPl')} · {balls.length} {t('bBl')} · {sc.steps - 1} {t('bSt')}</span>
        </div>
      )}

      <div className="tb-dock">
        {pop && (
          <div className="tb-pop" role="dialog" aria-label={pop}>
            {pop === 'players' && <>
              <div className="tb-pophead"><b>{t('bPlayers')}</b><button type="button" className="tb-x" onClick={() => setPop(null)} aria-label={t('cancel')}>✕</button></div>
              <div className="tb-tools">{PLAYER_TOOLS.map(([team, k]) => (
                <button type="button" key={team} className="tb-tool" aria-pressed={tool === `add:${team}`} onClick={() => pick(`add:${team}`)}><span className="tb-ic">{dot(team)}</span><span>{t(k)}</span></button>
              ))}</div>
              {sizeRow(t('bSize'), sc.ps ?? 1, 0.6, 1.6, (v) => commit({ ...sc, ps: v }))}
            </>}
            {pop === 'kit' && <>
              <div className="tb-pophead"><b>{t('bKit')}</b><button type="button" className="tb-x" onClick={() => setPop(null)} aria-label={t('cancel')}>✕</button></div>
              <div className="tb-kit">
                {kitBtn('add:ball', t('bBall'), ballIc)}
                {KIT.map((k) => kitBtn('add:' + k.key, t(k.label) + (k.col ? ' · ' + t(k.col) : ''), kitIc(k)))}
              </div>
              {kitSizeRow()}
            </>}
            {pop === 'text' && <>
              <div className="tb-pophead"><b>{t('bText')}</b><button type="button" className="tb-x" onClick={() => setPop(null)} aria-label={t('cancel')}>✕</button></div>
              <input id="tb-text" className="tb-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('bTextPh')} aria-label={t('bText')} onKeyDown={(e) => { if (e.key === 'Enter') pick('add:text') }} />
              <button type="button" className="btn small" onClick={() => pick('add:text')} disabled={!text.trim()}>{t('bTextPlace')}</button>
            </>}
            {pop === 'field' && <>
              <div className="tb-pophead"><b>{t('bField')}</b><button type="button" className="tb-x" onClick={() => setPop(null)} aria-label={t('cancel')}>✕</button></div>
              <div className="tb-fields">
                {FIELDS.map(([f, k]) => (
                  <button type="button" key={f} className="tb-fieldbtn" aria-pressed={fieldNow === f} onClick={() => { setField(f); setPop(null) }}>
                    <svg viewBox="0 0 200 110" aria-hidden="true"><rect width="200" height="110" rx="6" fill="#5F9B3C" />{f !== 'free' && item(['pitch', f], 0, fid + 'net')}</svg>
                    <span>{t(k)}</span>
                  </button>
                ))}
              </div>
            </>}
            {pop === 'color' && <>
              <div className="tb-pophead"><b>{t('bColor')}</b><button type="button" className="tb-x" onClick={() => setPop(null)} aria-label={t('cancel')}>✕</button></div>
              <div className="tb-tools">{L_COLS.map(([v, k, c]) => <button type="button" key={v} className="tb-sw" aria-pressed={line.col === v} title={t(k)} aria-label={t(k)} onClick={() => lineSet({ col: v })}><i style={{ background: c }} /></button>)}</div>
            </>}
          </div>
        )}

        <div className="tb-bar" role="toolbar" aria-label={t('board')}>
          <div className="tbb-group tbb-mode">
            <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>✏️<span>{t('bModeEdit')}</span></button>
            <button type="button" aria-pressed={preview} disabled={sc.steps < 2} onClick={() => { setPop(null); setPreview(true) }} title={sc.steps < 2 ? t('bHintStart') : undefined}>▶<span>{t('bModeAnim')}</span></button>
          </div>
          <div className="tbb-group tb-dup">
            {actBtn('move', t('bMove'), '✋')}
            {actBtn('pass', t('bPass'), arrowIc('3 2'))}
            {actBtn('shot', t('bShot'), arrowIc('0.5 2'))}
            {actBtn('lob', t('bLob'), arrowIc(undefined, true))}
          </div>
          <div className={'tbb-group tbb-lines' + (isLine ? ' on' : '')} role="group" aria-label={t('bLines')}>
            <div className="tbb-grid tbb-g3">{L_TYPES.map(([v, k]) => <button type="button" key={v} aria-pressed={isLine && line.type === v} title={t(k)} aria-label={t(k)} onClick={() => lineSet({ type: v })}>{lineIc(v + 'n' + line.col + line.w)}</button>)}</div>
            <div className="tbb-grid tbb-g2">{L_ENDS.map(([v, k]) => <button type="button" key={v} aria-pressed={isLine && line.end === v} title={t(k)} aria-label={t(k)} onClick={() => lineSet({ end: v })}>{lineIc('s' + v + line.col + line.w)}</button>)}</div>
            <div className="tbb-grid tbb-w">{[1, 2, 3, 4].map((w) => <button type="button" key={w} aria-pressed={isLine && line.w === w} aria-label={t('lWidth') + ' ' + w} onClick={() => lineSet({ w })}><i style={{ width: 2 + w * 2.5, height: 2 + w * 2.5 }} /></button>)}</div>
            <button type="button" className="tbb-color" aria-label={t('bColor')} aria-expanded={pop === 'color'} onClick={() => setPop(pop === 'color' ? null : 'color')}><i style={{ background: L_COLS.find((c) => c[0] === line.col)?.[2] }} /></button>
          </div>
          <div className="tbb-group tb-dup">
            {actBtn('del', t('del'), '🧽')}
          </div>
          <div className="tbb-group">
            {popBtn('players', t('bPlayers'), playersIc, tool.length === 5 && tool.startsWith('add:'))}
            {popBtn('kit', t('bKit'), kitBig, tool.startsWith('add:') && tool.length > 5 && tool !== 'add:text')}
            {popBtn('text', t('bText'), <b className="tbb-T">T</b>, tool === 'add:text')}
            {popBtn('field', t('bField'), fieldIc, false)}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Steps after the first need something to move; true when the drawing has at least one move or pass. */
export const hasMoves = (sc: BookScene) => sc.steps > 1 && marks(sc, 0, sc.steps - 1).length > 0
