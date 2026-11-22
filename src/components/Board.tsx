import { useEffect, useId, useRef, useState } from 'react'
import { ballAt, marks, posAt, type BallStep, type BookScene, type ConeColor, type Item, type Pt, type Step, type Team } from '../book/scene'
import { Frame, MarkPaths, TEAM, ballDot, item, playerDot } from './BookPitch'
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
type Hit = { kind: 'p'; id: string } | { kind: 'b'; i: number } | { kind: 'i'; i: number }

const PLAYER_TOOLS: [Team, Key][] = [['r', 'bRed'], ['b', 'bBlue'], ['y', 'bYellow'], ['w', 'bWhite'], ['o', 'bOrange'], ['g', 'bGrey'], ['k', 'bKeeper'], ['c', 'bCoach']]
type Kit = { key: string; label: Key; col?: Key; make: (x: number, y: number) => Item; box?: number }
const COLS: [ConeColor, Key][] = [['y', 'cYellow'], ['r', 'cRed'], ['b', 'cBlue']]
/** equipment on the board; each one is drawn with the same shapes as the book diagrams */
const KIT: Kit[] = [
  ...COLS.map(([c, col]): Kit => ({ key: 'cone' + c, label: 'bCone', col, make: (x, y) => ['cone', x, y, c], box: 9 })),
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

export const blankScene = (): BookScene => ({ steps: 1, field: [['pitch', 'full']], players: [], balls: [] })

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
    if (only !== 'b') sc.players.forEach((p) => consider({ kind: 'p', id: p.id }, dist(posAt(sc, p, s), at), 6.5))
    if (only !== 'p') ballsP.forEach((tr, i) => { const b = ballAt(sc, tr, s); if (b) consider({ kind: 'b', i }, dist(b, at), 4.5) })
    if (!only) sc.field.forEach((it, i) => { if (MOVABLE.has(it[0])) consider({ kind: 'i', i }, itemDist(it, at), it[0] === 'mark' ? 3.5 : 6) })
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
      else commit({ ...sc, field: sc.field.filter((_, i) => i !== h.i) })
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
      if (text.trim()) commit({ ...sc, field: [...sc.field, ['text', pt[0], pt[1], text.trim()]] })
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
    if (kit) commit({ ...sc, field: [...sc.field, kit.make(pt[0], pt[1])] })
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
      if (dist(a, b) > 4) commit({ ...sc, field: [...sc.field, ['mark', a[0], a[1], b[0], b[1], line.type + line.end + line.col + line.w]] })
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
  const setField = (f: 'full' | 'right' | 'free') => {
    const rest = sc.field.filter((it) => it[0] !== 'pitch')
    commit({ ...sc, field: f === 'free' ? rest : [['pitch', f], ...rest] })
  }
  const fieldNow = (sc.field.find((it) => it[0] === 'pitch')?.[1] as 'full' | 'right' | undefined) ?? 'free'
  const save = () => { if (!name.trim()) { document.getElementById('tb-name')?.focus(); return } onSave(sc, name.trim()) }

  const hintKey: Key = tool === 'move' ? (s === 0 ? 'bHintStart' : 'bHintMove')
    : tool === 'del' ? 'bHintDel'
    : tool === 'pass' || tool === 'shot' || tool === 'lob' ? (s === 0 ? 'bHintPass0' : 'bHintPass')
    : tool === 'line' ? 'bHintLine'
    : tool === 'add:text' ? 'bHintText'
    : 'bHintAdd'
  const selBall = sel !== null && ballsP[sel] ? ballAt(sc, ballsP[sel], s) : null
  const toolBtn = (v: Tool, label: string, icon: React.ReactNode) => (
    <button type="button" key={v} className="tb-tool" aria-pressed={tool === v} onClick={() => { setTool(v); setPreview(false) }} title={label}>
      <span className="tb-ic" aria-hidden="true">{icon}</span><span>{label}</span>
    </button>
  )
  const kitBtn = (v: Tool, label: string, icon: React.ReactNode) => (
    <button type="button" key={v} className="tb-kitbtn" aria-pressed={tool === v} onClick={() => { setTool(v); setPreview(false) }} title={label} aria-label={label}>{icon}</button>
  )
  const dot = (team: Team) => <svg viewBox="-6 -6 12 12" width="18" height="18"><circle r={4.6} fill={TEAM[team].fill} stroke={team === 'w' || team === 'y' ? '#1C2A22' : '#fff'} strokeWidth={1.2} /></svg>
  /** a small picture of a kit item, drawn with the board's own shapes */
  const kitIc = (k: Kit) => { const r = (k.box ?? 16) / 2; return <svg viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} width="26" height="26"><g>{item(k.make(0, 0), 0, fid + 'net')}</g></svg> }
  const ballIc = <svg viewBox="-6 -6 12 12" width="18" height="18"><circle r={3.6} fill="#fff" stroke="#16231C" strokeWidth={1} /></svg>
  const lineIc = (st: string) => <svg viewBox="0 0 30 12" width="34" height="14"><rect width="30" height="12" rx="2.5" fill="#2E8B57" />{item(['mark', 3, 8, 26, 5, st], 0, fid + 'net')}</svg>
  const arrowIc = (dash?: string, curve?: boolean) => <svg viewBox="0 0 20 12" width="20" height="12"><path d={curve ? 'M2 10Q10 -2 17 8' : 'M2 6H16'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray={dash} /><path d={curve ? 'M14 9l4 0l-1-4z' : 'M15 3l4 3l-4 3z'} fill="currentColor" /></svg>

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

      <div className="tb-main">
        <div className="tb-pitch">
          {preview ? (
            <BookPlayer key={JSON.stringify(sc).length + ':' + sc.steps} scene={sc} autoPlay maxHeight={undefined} />
          ) : (
            <Frame id={fid} svg={{ ref: svgRef, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, className: 'pitch tb-svg', style: { touchAction: 'none' }, 'aria-hidden': false, 'aria-label': t('board') }}>
              {sc.field.map((it, i) => item(it, i, fid + 'net'))}
              {all && sc.steps > 1 && <MarkPaths scene={sc} ms={marks(sc, 0, sc.steps - 1)} id={fid} opacity={0.35} />}
              {s > 0 && <>
                {sc.players.map((p) => { const a = posAt(sc, p, s - 1), b = posAt(sc, p, s); return dist(a, b) > 1.5 ? <circle key={'g' + p.id} cx={a[0]} cy={a[1]} r={4.4} fill={TEAM[p.t].fill} opacity={0.3} /> : null })}
                <MarkPaths scene={sc} ms={marks(sc, s - 1, s)} id={fid} />
              </>}
              {selBall && (tool === 'pass' || tool === 'shot' || tool === 'lob') && <circle cx={selBall[0]} cy={selBall[1]} r={4.6} fill="none" stroke="#FFE45C" strokeWidth={1} />}
              {draft && dist(draft[0], draft[1]) > 1 && item(['mark', ...draft[0], ...draft[1], line.type + line.end + line.col + line.w], 999, fid + 'net')}
              {sc.players.map((p) => playerDot(p.t, posAt(sc, p, s), p.l, 'p' + p.id))}
              {ballsP.map((tr, i) => { const b = ballAt(sc, tr, s); return b ? ballDot(b, 'b' + i) : null })}
            </Frame>
          )}
          <p className="tb-hint">{preview ? t('bHintPreview') : t(hintKey)}</p>
        </div>

        <div className="tb-side">
          <div className="tb-steps" role="group" aria-label={t('stepsTitle')}>
            {Array.from({ length: sc.steps }, (_, k) => (
              <button type="button" key={k} aria-pressed={!preview && s === k} onClick={() => { setS(k); setPreview(false) }}>{k === 0 ? t('bStart') : `${k}`}</button>
            ))}
            <button type="button" className="tb-add" onClick={() => { addStep(); setPreview(false) }}>+ {t('bStep')}</button>
            {sc.steps > 1 && s > 0 && !preview && <button type="button" className="tb-delstep" onClick={delStep} aria-label={t('bDelStep')}>✕</button>}
          </div>
          <div className="tb-row">
            <button type="button" className="btn small" aria-pressed={preview} onClick={() => setPreview(!preview)} disabled={sc.steps < 2}>{preview ? '✏️ ' + t('bEdit') : '▶ ' + t('bPlay')}</button>
            <label className="tb-check"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> {t('bAll')}</label>
          </div>

          <h3 className="tb-h">{t('bAct')}</h3>
          <div className="tb-tools">
            {toolBtn('move', t('bMove'), '✋')}
            {toolBtn('pass', t('bPass'), arrowIc('3 2'))}
            {toolBtn('shot', t('bShot'), arrowIc('0.5 2'))}
            {toolBtn('lob', t('bLob'), arrowIc(undefined, true))}
            {toolBtn('del', t('del'), '🗑')}
          </div>
          <h3 className="tb-h">{t('bPlayers')}</h3>
          <div className="tb-tools">{PLAYER_TOOLS.map(([team, k]) => toolBtn(`add:${team}`, t(k), dot(team)))}</div>
          <h3 className="tb-h">{t('bKit')}</h3>
          <div className="tb-tools tb-kit">
            {kitBtn('add:ball', t('bBall'), ballIc)}
            {KIT.map((k) => kitBtn('add:' + k.key, t(k.label) + (k.col ? ' · ' + t(k.col) : ''), kitIc(k)))}
            {kitBtn('add:text', t('bText'), <b className="tb-T">T</b>)}
          </div>
          {tool === 'add:text' && <input id="tb-text" className="tb-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('bTextPh')} aria-label={t('bText')} />}
          <h3 className="tb-h">{t('bLines')}</h3>
          <div className="tb-tools">{toolBtn('line', t('bDraw'), lineIc(line.type + line.end + line.col + line.w))}</div>
          {tool === 'line' && (
            <div className="tb-lines">
              <div className="tb-tools">{L_TYPES.map(([v, k]) => <button type="button" key={v} className="tb-tool" aria-pressed={line.type === v} title={t(k)} aria-label={t(k)} onClick={() => setLine({ ...line, type: v })}>{lineIc(v + 'n' + line.col + line.w)}</button>)}</div>
              <div className="tb-tools">{L_ENDS.map(([v, k]) => <button type="button" key={v} className="tb-tool" aria-pressed={line.end === v} title={t(k)} aria-label={t(k)} onClick={() => setLine({ ...line, end: v })}>{lineIc('s' + v + line.col + line.w)}</button>)}</div>
              <div className="tb-tools">{L_COLS.map(([v, k, c]) => <button type="button" key={v} className="tb-sw" aria-pressed={line.col === v} title={t(k)} aria-label={t(k)} onClick={() => setLine({ ...line, col: v })}><i style={{ background: c }} /></button>)}</div>
              <div className="tb-tools">{[1, 2, 3, 4].map((w) => <button type="button" key={w} className="tb-sw" aria-pressed={line.w === w} aria-label={t('lWidth') + ' ' + w} onClick={() => setLine({ ...line, w })}><i className="tb-w" style={{ width: 3 + w * 3, height: 3 + w * 3 }} /></button>)}</div>
            </div>
          )}
          <h3 className="tb-h">{t('bField')}</h3>
          <div className="tb-tools">
            {(['full', 'right', 'free'] as const).map((f) => (
              <button type="button" key={f} className="tb-tool" aria-pressed={fieldNow === f} onClick={() => setField(f)}><span>{t(f === 'full' ? 'bFull' : f === 'right' ? 'bHalf' : 'bFree')}</span></button>
            ))}
          </div>
          <p className="tb-count muted">{sc.players.length} {t('bPl')} · {balls.length} {t('bBl')} · {sc.steps - 1} {t('bSt')}</p>
        </div>
      </div>
    </div>
  )
}

/** Steps after the first need something to move; true when the drawing has at least one move or pass. */
export const hasMoves = (sc: BookScene) => sc.steps > 1 && marks(sc, 0, sc.steps - 1).length > 0
