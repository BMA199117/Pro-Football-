import { useId, type ReactNode } from 'react'
import { arcCtl, bookSteps, frameAt, marks, posAt, smooth, tracks, ballAt, type BookScene, type ConeColor, type Dir, type Item, type Mark, type Pt, type Team } from '../book/scene'

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

/** A football: white ball with a black centre panel and five edge panels, a seam ring and a soft shadow. */
export function soccerBall(x: number, y: number, r: number, k: string, shadow = true): ReactNode {
  const P = (a: number, d: number): string => { const t = (a * Math.PI) / 180; return (x + Math.cos(t) * d).toFixed(2) + ' ' + (y + Math.sin(t) * d).toFixed(2) }
  const centre = Array.from({ length: 5 }, (_, i) => P(-90 + i * 72, r * 0.33))
  const patches = Array.from({ length: 5 }, (_, i) => {
    const a = -54 + i * 72 // opposite each edge of the centre panel
    return `M${P(a - 11, r * 0.74)}L${P(a - 19, r)}A${r} ${r} 0 0 1 ${P(a + 19, r)}L${P(a + 11, r * 0.74)}Z`
  })
  const seams = Array.from({ length: 5 }, (_, i) => `M${P(-90 + i * 72, r * 0.33)}L${P(-90 + i * 72, r * 0.7)}`)
  return (
    <g key={k}>
      {shadow && <ellipse cx={x + r * 0.25} cy={y + r * 0.95} rx={r * 0.95} ry={r * 0.32} fill="rgba(0,0,0,.28)" />}
      <circle cx={x} cy={y} r={r} fill="#FCFCFC" />
      <path d={seams.join('')} stroke="#9AA3A0" strokeWidth={r * 0.07} />
      <path d={'M' + centre.join('L') + 'Z'} fill="#1B1F1D" />
      <path d={patches.join('')} fill="#1B1F1D" />
      <path d={`M${P(200, r * 0.97)}A${r * 0.97} ${r * 0.97} 0 0 0 ${P(20, r * 0.97)}`} fill="none" stroke="rgba(0,0,0,.10)" strokeWidth={r * 0.26} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#3A423E" strokeWidth={r * 0.07} />
      <ellipse cx={x - r * 0.38} cy={y - r * 0.42} rx={r * 0.26} ry={r * 0.16} fill="rgba(255,255,255,.85)" transform={`rotate(-35 ${x - r * 0.38} ${y - r * 0.42})`} />
    </g>
  )
}

const cone = (x: number, y: number, c: ConeColor = 'o', k: string) => (
  <g key={k}>
    <ellipse cx={x + 0.4} cy={y + 2.3} rx={3.3} ry={1} fill="rgba(0,0,0,.25)" />
    <path d={`M${x - 3.1} ${y + 2.4}H${x + 3.1}L${x + 2.6} ${y + 1.5}H${x - 2.6}Z`} fill={CONE[c]} stroke="rgba(0,0,0,.35)" strokeWidth={0.3} />
    <path d={`M${x - 2.3} ${y + 1.6}L${x - 0.45} ${y - 3.4}H${x + 0.45}L${x + 2.3} ${y + 1.6}Z`} fill={CONE[c]} stroke="rgba(0,0,0,.35)" strokeWidth={0.3} />
    <path d={`M${x - 1.45} ${y - 0.7}L${x - 0.95} ${y - 2}H${x + 0.95}L${x + 1.45} ${y - 0.7}Z`} fill={c === 'w' ? '#E3463B' : '#fff'} opacity={0.92} />
    <path d={`M${x + 0.2} ${y - 3.3}L${x + 2.1} ${y + 1.5}H${x + 1}Z`} fill="rgba(0,0,0,.14)" />
  </g>
)

function goalShape(x: number, y: number, dir: Dir, w: number, k: string, net: string, mini = false) {
  const d = mini ? 3 : 4.5
  const horiz = dir === 'u' || dir === 'd'
  const gw = horiz ? w : d, gh = horiz ? d : w
  const gx = horiz ? x - w / 2 : dir === 'r' ? x - d : x
  const gy = horiz ? (dir === 'd' ? y - d : y) : y - w / 2
  return (
    <g key={k}>
      <rect x={gx + 0.6} y={gy + 0.6} width={gw} height={gh} fill="rgba(0,0,0,.22)" />
      <rect x={gx} y={gy} width={gw} height={gh} fill={`url(#${net})`} stroke="#fff" strokeOpacity={0.85} strokeWidth={mini ? 0.45 : 0.55} />
      {/* crossbar and posts along the goal mouth */}
      <path d={dir === 'r' ? `M${x} ${gy}V${gy + gh}` : dir === 'l' ? `M${x} ${gy}V${gy + gh}` : `M${gx} ${y}H${gx + gw}`} stroke={mini ? '#E3463B' : '#fff'} strokeWidth={mini ? 1.1 : 1.4} strokeLinecap="round" />
    </g>
  )
}

const MARK_COL: Record<string, string> = { k: '#0E1C15', w: '#FFFFFF', r: '#FF4A3D', b: '#3D7FE6', y: '#F6D83A' }
/** A line the coach drew on the board: solid, dashed, wavy or curved, ending in an arrow, a cross or a stop bar. */
function markLine(it: Extract<Item, ['mark', ...unknown[]]>, k: string): ReactNode {
  const [, x1, y1, x2, y2, st] = it
  const type = st[0] ?? 's', endKind = st[1] ?? 'a', col = MARK_COL[st[2] ?? 'w'] ?? '#fff', w = [0.6, 0.9, 1.3, 1.8][Number(st[3] ?? 2) - 1] ?? 0.9
  const a: Pt = [x1, y1], b: Pt = [x2, y2]
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len
  let pts: Pt[]
  if (type === 'w') pts = wavy([a, b])
  else if (type === 'c' || type === 'e') { const c = arcCtl(a, b); pts = Array.from({ length: 25 }, (_, i) => { const t = i / 24, u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]] as Pt }) }
  else pts = [a, b]
  // direction at the end (curves end at an angle)
  const p0 = pts[Math.max(0, pts.length - 3)], ex = b[0] - p0[0], ey = b[1] - p0[1], el = Math.hypot(ex, ey) || 1
  const dx = type === 's' || type === 'd' || type === 'w' ? ux : ex / el, dy = type === 's' || type === 'd' || type === 'w' ? uy : ey / el
  const h = 2.2 + w * 1.2
  const dash = type === 'd' || type === 'e' ? `${2.4 + w} ${1.6 + w * 0.6}` : undefined
  const tip = endKind === 'a' ? <path d={`M${b[0]} ${b[1]}L${b[0] - dx * h - dy * h * 0.55} ${b[1] - dy * h + dx * h * 0.55}L${b[0] - dx * h + dy * h * 0.55} ${b[1] - dy * h - dx * h * 0.55}Z`} fill={col} />
    : endKind === 'x' ? <path d={`M${b[0] - h * 0.6} ${b[1] - h * 0.6}L${b[0] + h * 0.6} ${b[1] + h * 0.6}M${b[0] - h * 0.6} ${b[1] + h * 0.6}L${b[0] + h * 0.6} ${b[1] - h * 0.6}`} stroke={col} strokeWidth={w * 1.1} strokeLinecap="round" />
    : endKind === 'b' ? <path d={`M${b[0] - dy * h * 0.8} ${b[1] + dx * h * 0.8}L${b[0] + dy * h * 0.8} ${b[1] - dx * h * 0.8}`} stroke={col} strokeWidth={w * 1.2} strokeLinecap="round" />
    : null
  // the line stops short of an arrowhead so its end stays sharp
  const body = endKind === 'a' ? trim(pts, h * 0.7) : pts
  return <g key={k}><path d={toD(body)} fill="none" stroke={col} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" strokeLinejoin="round" />{tip}</g>
}

export function item(it: Item, i: number, net: string): ReactNode {
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
    case 'pole': return <g key={k}><ellipse cx={it[1] + 0.3} cy={it[2] + 2.3} rx={2.1} ry={0.7} fill="rgba(0,0,0,.25)" /><ellipse cx={it[1]} cy={it[2] + 2} rx={1.8} ry={0.75} fill="#C62F27" /><line x1={it[1]} y1={it[2] + 2} x2={it[1]} y2={it[2] - 6.5} stroke="#E3463B" strokeWidth={1.1} strokeLinecap="round" /><line x1={it[1] - 0.25} y1={it[2] + 1.5} x2={it[1] - 0.25} y2={it[2] - 6} stroke="rgba(255,255,255,.55)" strokeWidth={0.3} /></g>
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
    case 'ball': return soccerBall(it[1], it[2], 2.6, k)
    case 'traffic': return (
      <g key={k} transform={`translate(${it[1]} ${it[2]})`}>
        <rect x={-3.2} y={-9} width={6.4} height={18} rx={1.6} fill="#1C2A22" stroke="#fff" strokeWidth={0.5} />
        <circle cy={-5} r={1.9} fill="#E3463B" /><circle cy={0} r={1.9} fill="#F6D83A" /><circle cy={5} r={1.9} fill="#3CCB6B" />
      </g>
    )
    case 'flag': return <g key={k}><ellipse cx={it[1] + 0.3} cy={it[2] + 3.2} rx={1.8} ry={0.6} fill="rgba(0,0,0,.25)" /><line x1={it[1]} y1={it[2] + 3} x2={it[1]} y2={it[2] - 6.5} stroke="#F2F2F2" strokeWidth={0.7} strokeLinecap="round" /><path d={`M${it[1]} ${it[2] - 6.5}q2.5 -0.8 5 0.6q-2.4 1 -5 2.4z`} fill="#E3463B" stroke="rgba(0,0,0,.25)" strokeWidth={0.2} /></g>
    case 'hoop': return <ellipse key={k} cx={it[1]} cy={it[2]} rx={3.8} ry={2.6} fill="none" stroke={it[3] ? CONE[it[3]] : '#1C2A22'} strokeWidth={0.9} />
    case 'disc': return <g key={k}><ellipse cx={it[1]} cy={it[2] + 0.6} rx={2.6} ry={1.3} fill={CONE[it[3] ?? 'y']} stroke="rgba(0,0,0,.35)" strokeWidth={0.35} /><ellipse cx={it[1]} cy={it[2] + 0.1} rx={1} ry={0.45} fill="rgba(0,0,0,.25)" /></g>
    case 'dummy': return (
      <g key={k} transform={`translate(${it[1]} ${it[2]})`} stroke="rgba(0,0,0,.4)" strokeWidth={0.35}>
        <circle cy={-6.2} r={1.5} fill="#F2C53D" />
        <path d="M-2.4 -4.4H2.4L2 1.2H-2Z" fill="#F2C53D" />
        <path d="M-1.6 1.2V4.6M1.6 1.2V4.6M-2.6 4.8H2.6" stroke="#5A4A12" strokeWidth={0.6} />
      </g>
    )
    case 'bib': return <rect key={k} x={it[1] - 2} y={it[2] - 2.6} width={4} height={5.2} rx={0.8} fill={CONE[it[3] ?? 'y']} stroke="rgba(0,0,0,.35)" strokeWidth={0.35} transform={`rotate(-12 ${it[1]} ${it[2]})`} />
    case 'arc': return <path key={k} d={`M${it[1] - 3.4} ${it[2] + 1.6}A3.4 3.6 0 0 1 ${it[1] + 3.4} ${it[2] + 1.6}`} fill="none" stroke="#F6D83A" strokeWidth={1} strokeLinecap="round" />
    case 'mark': return markLine(it, k)
    case 'pitch': {
      const s = { stroke: '#fff', strokeOpacity: 0.92, strokeWidth: 0.75, fill: 'none' }
      const corners = (xs: number[]) => xs.map((cx) => [4, 106].map((cy) => <path key={cx + '-' + cy} d={`M${cx} ${cy + (cy < 50 ? 2 : -2)}A2 2 0 0 ${(cx < 100) === (cy < 50) ? 0 : 1} ${cx + (cx < 100 ? 2 : -2)} ${cy}`} />))
      const spot = (x: number, y: number, r = 0.75) => <circle cx={x} cy={y} r={r} fill="#fff" stroke="none" />
      if (it[1] === 'full') return (
        <g key={k} {...s}>
          <rect x={4} y={4} width={192} height={102} /><line x1={100} y1={4} x2={100} y2={106} /><circle cx={100} cy={55} r={13} />
          {spot(100, 55, 1)}
          <rect x={4} y={30} width={24} height={50} /><rect x={172} y={30} width={24} height={50} />
          <rect x={4} y={43} width={8} height={24} /><rect x={188} y={43} width={8} height={24} />
          {spot(20, 55)}{spot(180, 55)}
          <path d="M28 44.8A13 13 0 0 1 28 65.2" /><path d="M172 44.8A13 13 0 0 0 172 65.2" />
          {corners([4, 196])}
        </g>
      )
      const r = it[1] === 'right'
      return (
        <g key={k} {...s}>
          <rect x={4} y={4} width={192} height={102} />
          {r ? <><path d="M4 42 A13 13 0 0 1 4 68" /><rect x={150} y={22} width={46} height={66} /><rect x={180} y={39} width={16} height={32} /><path d="M150 44 A15 15 0 0 0 150 66" /></>
            : <><path d="M196 42 A13 13 0 0 0 196 68" /><rect x={4} y={22} width={46} height={66} /><rect x={4} y={39} width={16} height={32} /><path d="M50 44 A15 15 0 0 1 50 66" /></>}
          {r ? spot(166, 55, 0.9) : spot(34, 55, 0.9)}
          {r ? spot(4, 55, 0.9) : spot(196, 55, 0.9)}
          {corners(r ? [196] : [4])}
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

export function playerDot(t: Team, at: Pt, l: string | undefined, k: string) {
  const c = TEAM[t]
  return (
    <g key={k} transform={`translate(${at[0].toFixed(2)} ${at[1].toFixed(2)})`}>
      <circle r={4.4} fill={c.fill} stroke={c.stroke} strokeWidth={1.1} />
      {l && <text y={1.9} fontSize={5} fontWeight={800} fill={c.text} textAnchor="middle">{l}</text>}
    </g>
  )
}
export const ballDot = (at: Pt, k: string) => soccerBall(at[0], at[1], 2.6, k)

/** Pitch frame with grass and the defs shared by both views. */
export function Frame({ id, children, maxHeight, svg }: { id: string; children: ReactNode; maxHeight?: number; svg?: React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> } }) {
  return (
    <svg className="pitch" viewBox="0 0 200 110" style={{ maxHeight }} role="img" aria-hidden="true" {...svg}>
      <defs>
        <marker id={id + 'w'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#fff" /></marker>
        <marker id={id + 'r'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill={LINE.run} /></marker>
        <marker id={id + 'k'} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill={LINE.drib} /></marker>
        <pattern id={id + "net"} width="1.6" height="1.6" patternUnits="userSpaceOnUse"><rect width="1.6" height="1.6" fill="rgba(255,255,255,.25)" /><path d="M0 0L1.6 1.6M1.6 0L0 1.6" stroke="rgba(255,255,255,.55)" strokeWidth={0.25} /></pattern>
        <radialGradient id={id + 'lt'} cx="50%" cy="45%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity="0.10" /><stop offset="0.65" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.16" /></radialGradient>
        <pattern id={id + 'gr'} width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="none" /><path d="M0.5 1h0.4M2.6 3.1h0.4M3.2 0.6h0.3M1.4 2.7h0.3" stroke="rgba(255,255,255,.07)" strokeWidth={0.35} /><path d="M1.8 0.4h0.3M0.3 3.4h0.4M3 2h0.3" stroke="rgba(0,0,0,.07)" strokeWidth={0.35} /></pattern>
      </defs>
      <rect width="200" height="110" fill="#5F9B3C" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={4 + i * 21.33} width={10.67} height={110} fill="#6CA847" />)}
      <rect width="200" height="110" fill={`url(#${id}gr)`} />
      <rect width="200" height="110" fill={`url(#${id}lt)`} />
      {children}
    </svg>
  )
}


/** Arrows of a drawing (runs, dribbles, passes, shots, lofted balls) in the book's line style. */
export function MarkPaths({ scene, ms, id, opacity = 1 }: { scene: BookScene; ms: Mark[]; id: string; opacity?: number }) {
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
      <MarkPaths scene={scene} ms={marks(scene, 0, bookSteps(scene) - 1)} id={id} />
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
      {step !== undefined && step > 0 && <MarkPaths scene={scene} ms={marks(scene, Math.max(0, step - 3), Math.min(step, scene.steps - 1))} id={id} opacity={0.28} />}
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
  const used = new Set(marks(scene, 0, bookSteps(scene) - 1).map((m) => m.kind))
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
