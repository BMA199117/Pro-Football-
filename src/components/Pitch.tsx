import { cloneElement, isValidElement, useId } from 'react'
import type { Diagram } from '../types'

export const RED = '#E46E26', BLUE = '#3B6FB6', PURPLE = '#8A5BB8'
export const P = (x: number, y: number, c: string, k: string) => <circle key={k} cx={x} cy={y} r={5} fill={c} stroke="#fff" strokeWidth={1.5} />
export const C = (x: number, y: number, k: string) => <path key={k} d={`M${x - 4} ${y + 4}L${x} ${y - 5}L${x + 4} ${y + 4}Z`} fill="#F08A3C" />
const A = (x1: number, y1: number, x2: number, y2: number, k: string, dashed = false) =>
  <path key={k} d={`M${x1} ${y1}L${x2} ${y2}`} stroke="#fff" strokeWidth={1.6} strokeDasharray={dashed ? '4 3' : undefined} markerEnd="url(#AH)" fill="none" />
export const B = (x: number, y: number, k: string) => <circle key={k} cx={x} cy={y} r={3} fill="#fff" stroke="#16231C" strokeWidth={1} />
export const goal = (x: number, y: number, h: number, k: string) => <rect key={k} x={x} y={y} width={6} height={h} fill="#fff" />

function shapes(type: Diagram) {
  const g: React.ReactNode[] = []
  switch (type) {
    case 'dribble':
      for (let i = 0; i < 6; i++) g.push(C(40 + i * 28, 55 + (i % 2 ? -10 : 10), 'c' + i))
      g.push(<path key="p" d="M30 58 Q54 30 68 55 T124 55 T180 55" stroke="#fff" strokeDasharray="4 3" fill="none" strokeWidth={1.5} />, P(20, 55, RED, 'a'), B(30, 58, 'b'))
      break
    case 'pass':
      ;[[50, 35], [150, 35], [50, 75], [150, 75]].forEach(([x, y], i) => g.push(P(x, y, i < 2 ? RED : BLUE, 'p' + i)))
      g.push(A(58, 35, 140, 35, 'a1'), A(142, 75, 60, 75, 'a2'), B(54, 36, 'b'))
      break
    case 'rondo':
      g.push(<rect key="r" x={60} y={15} width={80} height={80} fill="none" stroke="#fff" strokeOpacity={0.7} />)
      ;[[60, 15], [140, 15], [60, 95], [140, 95]].forEach(([x, y], i) => g.push(C(x, y, 'c' + i)))
      ;[[100, 18], [137, 55], [100, 92], [63, 55]].forEach(([x, y], i) => g.push(P(x, y, RED, 'p' + i)))
      g.push(P(100, 55, BLUE, 'd'), A(104, 22, 132, 50, 'a'), B(102, 22, 'b'))
      break
    case 'smallgame':
      g.push(goal(8, 42, 26, 'g1'), goal(186, 42, 26, 'g2'), <line key="l" x1={100} y1={8} x2={100} y2={102} stroke="#fff" strokeOpacity={0.6} />)
      ;[[45, 30], [45, 80], [75, 55], [30, 55]].forEach(([x, y], i) => g.push(P(x, y, RED, 'r' + i)))
      ;[[155, 30], [155, 80], [125, 55], [170, 55]].forEach(([x, y], i) => g.push(P(x, y, BLUE, 'u' + i)))
      g.push(B(80, 58, 'b'), A(80, 55, 118, 40, 'a', true))
      break
    case 'sprint':
      ;[30, 170].forEach((x, i) => g.push(C(x, 30, 'c' + i), C(x, 80, 'd' + i)))
      g.push(P(22, 30, RED, 'p1'), P(22, 80, BLUE, 'p2'), A(34, 30, 160, 30, 'a1'), A(34, 80, 160, 80, 'a2'))
      break
    case 'warmup':
      for (let i = 0; i < 4; i++) g.push(C(40 + i * 40, 25, 'c' + i), C(40 + i * 40, 85, 'd' + i))
      ;[[50, 55], [90, 55], [130, 55]].forEach(([x, y], i) => g.push(P(x, y, RED, 'p' + i)))
      g.push(A(140, 55, 180, 55, 'a', true))
      break
    case 'shoot':
      g.push(goal(186, 35, 40, 'g'), <rect key="box" x={140} y={20} width={52} height={70} fill="none" stroke="#fff" strokeOpacity={0.7} />)
      g.push(P(40, 55, RED, 'p1'), P(110, 40, BLUE, 'p2'), P(182, 55, PURPLE, 'k'), A(48, 53, 102, 42, 'a1'), A(115, 44, 180, 52, 'a2', true), B(44, 57, 'b'))
      break
    case 'duel':
      g.push(goal(186, 35, 40, 'g'), <line key="l" x1={120} y1={10} x2={120} y2={100} stroke="#fff" strokeOpacity={0.6} strokeDasharray="5 4" />)
      g.push(P(40, 55, PURPLE, 'k0'), A(48, 55, 78, 55, 'a0'), P(85, 55, RED, 'p'), B(92, 58, 'b'), P(125, 55, BLUE, 'd'), P(182, 55, PURPLE, 'k'))
      g.push(<path key="c" d="M92 58 Q110 85 140 70" stroke="#fff" strokeDasharray="4 3" fill="none" strokeWidth={1.5} />, A(140, 70, 178, 58, 'a1'))
      break
    case 'overload':
      g.push(goal(186, 35, 40, 'g'), P(182, 55, PURPLE, 'k'))
      ;[[60, 30], [70, 55], [60, 80]].forEach(([x, y], i) => g.push(P(x, y, RED, 'r' + i)))
      ;[[130, 42], [130, 68]].forEach(([x, y], i) => g.push(P(x, y, BLUE, 'u' + i)))
      g.push(B(76, 58, 'b'), A(76, 55, 112, 30, 'a1'), A(66, 80, 150, 88, 'a2', true), A(66, 30, 150, 20, 'a3', true))
      break
    case 'gk':
      g.push(goal(186, 30, 50, 'g'), P(176, 55, PURPLE, 'k'), P(110, 55, RED, 'p'), A(118, 52, 176, 36, 'a1', true), A(118, 58, 176, 74, 'a2', true), B(114, 56, 'b'))
      break
  }
  return g
}

/** Grass, lines and the arrow marker shared by the static and animated pitch. */
export function Field({ markerId, children, maxHeight }: { markerId: string; children: React.ReactNode; maxHeight?: number }) {
  return (
    <svg className="pitch" viewBox="0 0 200 110" style={{ maxHeight }} role="img" aria-hidden="true">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#fff" />
        </marker>
      </defs>
      <rect width="200" height="110" fill="#2E7D52" />
      <g stroke="#fff" strokeOpacity={0.25}>
        <line x1="0" y1="27" x2="200" y2="27" /><line x1="0" y1="55" x2="200" y2="55" /><line x1="0" y1="82" x2="200" y2="82" />
      </g>
      {children}
    </svg>
  )
}

export function Pitch({ type, maxHeight }: { type: Diagram; maxHeight?: number }) {
  // each SVG needs its own marker id, otherwise hidden copies break the arrows
  const id = 'ah' + useId().replace(/:/g, '')
  return <Field markerId={id} maxHeight={maxHeight}>{withMarker(shapes(type), id)}</Field>
}

function withMarker(nodes: React.ReactNode[], id: string) {
  return nodes.map((n) => {
    if (!isValidElement<{ markerEnd?: string }>(n) || !n.props.markerEnd) return n
    return cloneElement(n, { markerEnd: `url(#${id})` })
  })
}
