import { useId, type ReactNode } from 'react'
import { arcCtl, frameAt, marks, posAt, smooth, tracks, ballAt, type BookScene, type ConeColor, type Dir, type Item, type Mark, type Pt, type Team } from '../book/scene'

export const TEAM: Record<Team, { fill: string; stroke: string; text: string }> = {
  r: { fill: '#D9342B', stroke: '#fff', text: '#fff' },
  w: { fill: '#FFFFFF', stroke: '#1C2A22', text: '#1C2A22' },
  b: { fill: '#2F63C4', stroke: '#fff', text: '#fff' },
  y: { fill: '#F4C51C', stroke: '#1C2A22', text: '#1C2A22' },
  k: { fill: '#7E4FB3', stroke: '#fff', text: '#fff' },
  c: { fill: '#1C2A22', stroke: '#fff', text: '#fff' },
  g: { fill: '#9AA4A0', stroke: '#fff', text: '#fff' },
  o: { fill: '#F08A24', stroke: '#fff', text: '#fff' },
}
const CONE: Record<ConeColor, string> = { o: '#F28A30', y: '#F6D83A', r: '#E3463B', b: '#3D7FE6', w: '#FFFFFF' }
/** The books' line keys. EPYSA: run = red solid, dribble = black wavy, pass = white dashed, shot = dotted. */
export const LINE = { run: '#FF4A3D', drib: '#0E1C15', pass: '#FFFFFF', shot: '#0E1C15', lob: '#FFFFFF' } as const
type Kind = keyof typeof LINE
interface Style { stroke: string; dash?: string; width: number; marker: 'r' | 'k' | 'w' }
const EPYSA_STYLE: Record<Kind, Style> = {
  run: { stroke: LINE.run, width: 1, marker: 'r' },
  drib: { stroke: LINE.drib, width: 1, marker: 'k' },
  pass: { stroke: LINE.pass, dash: '2.6 1.8', width: 0.95, marker: 'w' },
  shot: { stroke: LINE.shot, dash: '0.1 2', width: 1.15, marker: 'k' },
  lob: { stroke: LINE.lob, width: 1, marker: 'w' },
}
/** FIFA manuals: run without the ball = dashed, with the ball = wavy, ball = solid line. */
const FIFA_STYLE: Record<Kind, Style> = {
  run: { stroke: '#0E1C15', dash: '2.4 1.6', width: 0.9, marker: 'k' },
  drib: { stroke: '#0E1C15', width: 1, marker: 'k' },
  pass: { stroke: '#0E1C15', width: 1, marker: 'k' },
  shot: { stroke: '#0E1C15', width: 1.3, marker: 'k' },
  lob: { stroke: '#0E1C15', width: 1, marker: 'k' },
}
export const styleOf = (scene: BookScene) => (scene.key === 'fifa' ? FIFA_STYLE : EPYSA_STYLE)

const cone = (x: number, y: number, c: ConeColor = 'o', k: string) => <path key={k} d={`M${x - 2.6} ${y + 2}L${x} ${y - 3}L${x + 2.6} ${y + 2}Z`} fill={CONE[c]} stroke="rgba(0,0,0,.35)" strokeWidth={0.4} />

function goalShape(x: number, y: number, dir: Dir, w: number, k: string, net: string, mini = false) {
  const d = mini ? 3 : 4.5
  const horiz = dir === 'u' || dir === 'd'
  const gw = horiz ? w : d, gh = horiz ? d : w
  const gx = horiz ? x - w / 2 : dir === 'r' ? x - d : x
  const gy = horiz ? (dir === 'd' ? y - d : y) : y - w / 2
  return (
    <g key={k}>
      <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${net})`} stroke="#fff" strokeWidth={mini ? 0.9 : 1.3} />
    </g>
  )
}

function item(it: Item, i: number, net: string): ReactNode {
  const k = 'i' + i
  switch (it[0]) {
    case 'area': {
      const [, x, y, w, h, cc] = it
      const out: ReactNode[] = [<rect key={k} x={x} y={y} width={w} height={h} fill="none" stroke="#fff" strokeOpacity={0.85} strokeWidth={0.8} />]
      if (cc) {
        const col = (cc.length > 1 ? cc[1] : 'o') as ConeColor
        const pts: Pt[] = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]
        if (cc[0] === 'm') pts.push([x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2])
        pts.forEach(([a, b], j) => out.push(cone(a, b, col, k + 'c' + j)))
      }
      return <g key={k}>{out}</g>
    }
    case 'cone': return cone(it[1], it[2], it[3], k)
    case 'cones': { const [, c, xs] = it; const out: ReactNode[] = []; for (let j = 0; j + 1 < xs.length; j += 2) out.push(cone(xs[j], xs[j + 1], c, k + j)); return <g key={k}>{out}</g> }
    case 'goal': return goalShape(it[1], it[2], it[3], it[4] ?? 22, k, net)
    case 'mini': return goalShape(it[1], it[2], it[3], it[4] ?? 9, k, net, true)
    case 'line': return <line key={k} x1={it[1]} y1={it[2]} x2={it[3]} y2={it[4]} stroke="#fff" strokeOpacity={0.8} strokeWidth={0.8} strokeDasharray={it[5] ? '3 2' : undefined} />
    case 'zone': return <rect key={k} x={it[1]} y={it[2]} width={it[3]} height={it[4]} fill={it[5] ?? 'rgba(255,255,255,.13)'} stroke="#fff" strokeOpacity={0.6} strokeWidth={0.6} strokeDasharray="3 2" />
    case 'text': return <text key={k} x={it[1]} y={it[2]} fill="#fff" fontSize={6} fontWeight={700} textAnchor="middle" style={{ paintOrder: 'stroke' }} stroke="rgba(0,0,0,.35)" strokeWidth={1.2}>{it[3]}</text>
    case 'circle': return <circle key={k} cx={it[1]} cy={it[2]} r={it[3]} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={0.8} />
    case 'pole': return <g key={k}><line x1={it[1]} y1={it[2] + 2} x2={it[1]} y2={it[2] - 6} stroke="#F6D83A" strokeWidth={1.4} /><circle cx={it[1]} cy={it[2] + 2} r={1.4} fill="#F6D83A" /></g>
    case 'hurdle': return it[3]
      ? <path key={k} d={`M${it[1]} ${it[2] - 4}V${it[2] + 4}`} stroke="#F6D83A" strokeWidth={1.8} strokeLinecap="round" />
      : <path key={k} d={`M${it[1] - 4} ${it[2]}H${it[1] + 4}`} stroke="#F6D83A" strokeWidth={1.8} strokeLinecap="round" />
    case 'ladder': {
      const [, x1, y1, x2, y2] = it
      const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 4))
      const horiz = Math.abs(x2 - x1) > Math.abs(y2 - y1)
      const out: ReactNode[] = []
      for (let j = 0; j <= n; j++) {
        const x = x1 + ((x2 - x1) * j) / n, y = y1 + ((y2 - y1) * j) / n
        out.push(horiz ? <line key={j} x1={x} y1={y - 3} x2={x} y2={y + 3} /> : <line key={j} x1={x - 3} y1={y} x2={x + 3} y2={y} />)
      }
      return <g key={k} stroke="#F6D83A" strokeWidth={0.8}>{out}<line x1={horiz ? x1 : x1 - 3} y1={horiz ? y1 - 3 : y1} x2={horiz ? x2 : x2 - 3} y2={horiz ? y2 - 3 : y2} /><line x1={horiz ? x1 : x1 + 3} y1={horiz ? y1 + 3 : y1} x2={horiz ? x2 : x2 + 3} y2={horiz ? y2 + 3 : y2} /></g>
    }
    case 'ball': return <circle key={k} cx={it[1]} cy={it[2]} r={2.1} fill="#fff" stroke="#16231C" strokeWidth={0.8} />
    case 'traffic': return (
      <g key={k} transform={`translate(${it[1]} ${it[2]})`}>
        <rect x={-3.2} y={-9} width={6.4} height={18} rx={1.6} fill="#1C2A22" stroke="#fff" strokeWidth={0.5} />
        <circle cy={-5} r={1.9} fill="#E3463B" /><circle cy={0} r={1.9} fill="#F6D83A" /><circle cy={5} r={1.9} fill="#3CCB6B" />
      </g>
    )
    case 'flag': return <g key={k}><line x1={it[1]} y1={it[2] + 3} x2={it[1]} y2={it[2] - 6} stroke="#fff" strokeWidth={0.8} /><path d={`M${it[1]} ${it[2] - 6}l5 1.6l-5 1.6z`} fill="#F6D83A" /></g>
    case 'hoop': return <circle key={k} cx={it[1]} cy={it[2]} r={3.2} fill="none" stroke="#1C2A22" strokeWidth={0.8} />
    case 'pitch': {
      const s = { stroke: '#fff', strokeOpacity: 0.8, strokeWidth: 0.8, fill: 'none' }
      if (it[1] === 'full') return (
        <g key={k} {...s}>
          <rect x={4} y={4} width={192} height={102} /><line x1={100} y1={4} x2={100} y2={106} /><circle cx={100} cy={55} r={13} />
          <rect x={4} y={30} width={24} height={50} /><rect x={172} y={30} width={24} height={50} />
          <rect x={4} y={43} width={8} height={24} /><rect x={188} y={43} width={8} height={24} />
        </g>
      )
      const r = it[1] === 'right'
      return (
        <g key={k} {...s}>
          <rect x={4} y={4} width={192} height={102} />
          {r ? <><path d="M4 42 A13 13 0 0 1 4 68" /><rect x={150} y={22} width={46} height={66} /><rect x={180} y={39} width={16} height={32} /><path d="M150 44 A15 15 0 0 0 150 66" /></>
            : <><path d="M196 42 A13 13 0 0 0 196 68" /><rect x={4} y={22} width={46} height={66} /><rect x={4} y={39} width={16} height={32} /><path d="M50 44 A15 15 0 0 1 50 66" /></>}
        </g>
      )
    }
  }
}

const toD = (pts: Pt[]) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')

/** A wavy line along a path (the book's "dribbling" arrow). */
function wavy(pts: Pt[]): Pt[] {
  const d = smooth(pts, 14)
  const out: Pt[] = []
  let s = 0
  const total = d.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - d[i][0], p[1] - d[i][1]), 0)
  for (let i = 0; i < d.length; i++) {
    if (i) s += Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1])
    const a = d[Math.max(0, i - 1)], b = d[Math.min(d.length - 1, i + 1)]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len
    const tail = total - s < 4 ? (total - s) / 4 : 1 // straight end so the arrowhead points right
    const w = Math.sin(s * 0.95) * 1.35 * tail
    out.push([d[i][0] + nx * w, d[i][1] + ny * w])
  }
  return out
}

/** Shorten a polyline at the end so the arrowhead does not cover the player. */
function trim(pts: Pt[], by: number): Pt[] {
  const out = [...pts]
  let left = by
  while (out.length > 2) {
    const a = out[out.length - 2], b = out[out.length - 1]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (d > left) { out[out.length - 1] = [b[0] - ((b[0] - a[0]) * left) / d, b[1] - ((b[1] - a[1]) * left) / d]; return out }
    out.pop(); left -= d
  }
  const [a, b] = out
  const d = Math.hypot(b[0] - a[0], b[1] - a[1])
  if (d > left + 1) out[1] = [b[0] - ((b[0] - a[0]) * left) / d, b[1] - ((b[1] - a[1]) * left) / d]
  return out
}

function playerDot(t: Team, at: Pt, l: string | undefined, k: string) {
  const c = TEAM[t]
  return (
    <g key={k} transform={`translate(${at[0].toFixed(2)} ${at[1].toFixed(2)})`}>
      <circle r={4.4} fill={c.fill} stroke={c.stroke} strokeWidth={1.1} />
      {l && <text y={1.9} fontSize={5} fontWeight={800} fill={c.text} textAnchor="middle">{l}</text>}
    </g>
  )
}
const ballDot = (at: Pt, k: string) => <circle key={k} cx={at[0]} cy={at[1]} r={2.1} fill="#fff" stroke="#16231C" strokeWidth={0.8} />

/** Pitch frame with grass and the defs shared by both views. */
function Frame({ id, children, maxHeight }: { id: string; children: ReactNode; maxHeight?: number }) {
  return (
    <svg className="pitch" viewBox="0 0 200 110" style={{ maxHeight }} role="img" aria-hidden="true">
      <defs>
        <marker id={id + 'w'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#fff" /></marker>
        <marker id={id + 'r'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill={LINE.run} /></marker>
        <marker id={id + 'k'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill={LINE.drib} /></marker>
        <pattern id={id + "net"} width="1.6" height="1.6" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="rgba(255,255,255,.25)" /><path d="M0 0L1.6 1.6M1.6 0L0 1.6" stroke="rgba(255,255,255,.55)" strokeWidth={0.25} /></pattern>
      </defs>
      <rect width="200" height="110" fill="#2E8B57" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 20} width={10} height={110} fill="#2A8050" />)}
      {children}
    </svg>
  )
}


/** Arrows of a drawing (runs, dribbles, passes, shots, lofted balls) in the book's line style. */
function MarkPaths({ scene, ms, id, opacity = 1 }: { scene: BookScene; ms: Mark[]; id: string; opacity?: number }) {
  const st = styleOf(scene)
  return (
    <g opacity={opacity}>
      {ms.map((m, i) => {
        if (m.kind === 'lob') {
          const [a, b] = m.pts, c = arcCtl(a, b)
          const e = trim([c, b], 2.5)[1]
          return <path key={'m' + i} d={`M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${e[0]} ${e[1]}`} fill="none" stroke={st.lob.stroke} strokeWidth={st.lob.width} markerEnd={`url(#${id}${st.lob.marker})`} strokeLinecap="round" />
        }
        const pts = m.kind === 'drib' ? wavy(trim(m.pts, 3.5)) : m.kind === 'run' ? smooth(trim(m.pts, 4.5)) : trim(m.pts, m.kind === 'shot' ? 1 : 2.5)
        const y = st[m.kind]
        return <path key={'m' + i} d={toD(pts)} fill="none" stroke={y.stroke} strokeWidth={y.width} strokeDasharray={y.dash} markerEnd={`url(#${id}${y.marker})`} strokeLinecap="round" strokeLinejoin="round" />
      })}
    </g>
  )
}

/** The drill as in the book: start positions and every movement as arrows. */
export function BookStatic({ scene, maxHeight }: { scene: BookScene; maxHeight?: number }) {
  const id = 'bk' + useId().replace(/:/g, '')
  const trs = tracks(scene)
  // balls at the start; a ball that only comes later shows where it enters
  const start = trs.map((t) => ballAt(scene, t, 0) ?? (() => { const k = t.findIndex((b) => b !== 0); return k >= 0 ? ballAt(scene, t, k) : null })()).filter(Boolean) as Pt[]
  return (
    <Frame id={id} maxHeight={maxHeight}>
      {scene.field.map((it, i) => item(it, i, id + 'net'))}
      <MarkPaths scene={scene} ms={marks(scene)} id={id} />
      {scene.players.map((p) => playerDot(p.t, posAt(scene, p, 0), p.l, 'p' + p.id))}
      {start.map((b, i) => ballDot(b, 'b' + i))}
    </Frame>
  )
}

/**
 * One moment of the drill while it plays.
 * step: the step whose arrows are drawn ahead of / during the movement (shown at stepOpacity);
 * the steps before it stay as faint traces, so the coach sees what has happened so far.
 */
export function BookFrame({ scene, t, maxHeight, step, stepOpacity = 1 }: { scene: BookScene; t: number; maxHeight?: number; step?: number; stepOpacity?: number }) {
  const id = 'bf' + useId().replace(/:/g, '')
  const f = frameAt(scene, t)
  const movers = new Set<string>()
  if (step !== undefined && step < scene.steps - 1) {
    for (const p of scene.players) { const a = posAt(scene, p, step), b = posAt(scene, p, step + 1); if (!p.quiet && Math.hypot(b[0] - a[0], b[1] - a[1]) > 1.5) movers.add(p.id) }
  }
  return (
    <Frame id={id} maxHeight={maxHeight}>
      {scene.field.map((it, i) => item(it, i, id + 'net'))}
      {step !== undefined && step > 0 && <MarkPaths scene={scene} ms={marks(scene, 0, Math.min(step, scene.steps - 1))} id={id} opacity={0.28} />}
      {step !== undefined && step < scene.steps - 1 && stepOpacity > 0 && <MarkPaths scene={scene} ms={marks(scene, step, step + 1)} id={id} opacity={stepOpacity} />}
      {f.trails.map(([a, b, shot], i) => { const y = styleOf(scene)[shot ? 'shot' : 'pass']; return <line key={'t' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={y.stroke} strokeOpacity={0.75} strokeWidth={y.width} strokeDasharray={y.dash} strokeLinecap="round" /> })}
      {f.players.filter(({ p }) => movers.has(p.id)).map(({ p, at }) => <circle key={'h' + p.id} cx={at[0]} cy={at[1]} r={6.6} fill="none" stroke="#FFE45C" strokeWidth={0.9} strokeOpacity={0.9} />)}
      {f.players.map(({ p, at }) => playerDot(p.t, at, p.l, 'p' + p.id))}
      {f.balls.map((b, i) => ballDot(b, 'b' + i))}
    </Frame>
  )
}

/** The line key under a book diagram (only the line types this drill uses). */
export function LineKey({ scene, label }: { scene: BookScene; label: (k: 'run' | 'drib' | 'pass' | 'shot' | 'lob') => string }) {
  const st = styleOf(scene)
  const used = new Set(marks(scene).map((m) => m.kind))
  const kinds = (['run', 'drib', 'pass', 'shot', 'lob'] as const).filter((k) => used.has(k))
  if (!kinds.length) return null
  return (
    <ul className="linekey">
      {kinds.map((k) => {
        const y = st[k]
        const d = k === 'drib' ? 'M2 6 q2.5 -4 5 0 t5 0 t5 0 t5 0' : k === 'lob' ? 'M2 9 Q12 -1 22 9' : 'M2 6 H22'
        return (
          <li key={k}>
            <svg viewBox="0 0 28 12" width="28" height="12" aria-hidden="true">
              <rect width="28" height="12" rx="3" fill="#2E8B57" />
              <path d={d} fill="none" stroke={y.stroke} strokeWidth={y.width * 1.3} strokeDasharray={y.dash ? y.dash.split(' ').map((n) => +n * 1.3).join(' ') : undefined} strokeLinecap="round" />
            </svg>
            {label(k)}
          </li>
        )
      })}
    </ul>
  )
}
