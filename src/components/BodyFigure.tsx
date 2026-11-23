import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { build, mix, refPt, GROUND, LEN, type Obj, type Pose, type Pt } from '../body/pose'
import type { BodyProgram, Exercise, Scenery, Seg } from '../body/program'
import { soccerBall } from './BookPitch'
import { useT } from '../hooks'

const H = 64
const C = {
  bg: '#F3F6F1', floor: '#C3CEC2', mat: '#2E9D6A', matEdge: '#23805A',
  shirt: '#2F63C4', shirtFar: '#244F9E', shorts: '#1C2A22', shortsFar: '#33433B',
  skin: '#E8B48C', skinFar: '#C9946D', sock: '#F4F6F8', sockFar: '#D5DAD8', boot: '#151A17', hair: '#3B2A1E',
  wood: '#B98A55', woodDark: '#8C6436', metal: '#6F7B76', metalDark: '#4A5551', red: '#D9342B',
}
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const seg = (a: Pt, b: Pt, color: string, w: number, k: string, cap: 'round' | 'butt' = 'round') =>
  <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap={cap} />
const mid = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]

/** The figure: outline first, then far limbs, torso, near limbs. */
export function Figure({ pose, faint, k = '' }: { pose: Pose; faint?: boolean; k?: string }) {
  const f = build(pose)
  const W = { torso: 7.4, ua: 4.3, fa: 3.6, th: 5.8, sh: 4.4, ft: 3.1, neck: 2.6 }
  const out: ReactNode[] = []
  // dark outline (as in the book drawings) so crossing limbs stay readable
  f.bones.forEach((b, i) => out.push(seg(b.a, b.b, '#1D2B24', W[b.part] + 1.1, 'o' + i)))
  out.push(<circle key="ho" cx={f.head[0]} cy={f.head[1]} r={LEN.headR + 0.55} fill="#1D2B24" />)
  f.bones.forEach((b, i) => {
    const far = !!b.far && !f.front
    if (b.part === 'torso') {
      if (f.front && f.shL && f.shR && f.hipL && f.hipR) {
        out.push(<path key={'t' + i} d={`M${f.shL[0]} ${f.shL[1]}L${f.shR[0]} ${f.shR[1]}L${f.hipR[0]} ${f.hipR[1]}L${f.hipL[0]} ${f.hipL[1]}Z`} fill={C.shirt} stroke={C.shirt} strokeWidth={3} strokeLinejoin="round" />)
        out.push(<path key={'s' + i} d={`M${f.hipL[0]} ${f.hipL[1]}L${f.hipR[0]} ${f.hipR[1]}`} stroke={C.shorts} strokeWidth={4} strokeLinecap="round" />)
      } else {
        out.push(seg(b.a, b.b, C.shirt, W.torso, 't' + i))
        out.push(seg(b.a, mid(b.a, b.b, 0.2), C.shorts, W.torso + 0.2, 'tp' + i))
      }
    } else if (b.part === 'neck') { if (!f.front) out.push(seg(b.a, b.b, C.skin, W.neck, 'n' + i)) }
    else if (b.part === 'ua') { out.push(seg(b.a, b.b, far ? C.skinFar : C.skin, W.ua, 'u' + i)); out.push(seg(b.a, mid(b.a, b.b, 0.45), far ? C.shirtFar : C.shirt, W.ua + 0.4, 'us' + i)) }
    else if (b.part === 'fa') out.push(seg(b.a, b.b, far ? C.skinFar : C.skin, W.fa, 'f' + i))
    else if (b.part === 'th') { out.push(seg(b.a, b.b, far ? C.skinFar : C.skin, W.th, 'h' + i)); out.push(seg(b.a, mid(b.a, b.b, 0.55), far ? C.shortsFar : C.shorts, W.th + 0.3, 'hs' + i)) }
    else if (b.part === 'sh') { out.push(seg(b.a, b.b, far ? C.skinFar : C.skin, W.sh, 's' + i)); out.push(seg(mid(b.a, b.b, 0.35), b.b, far ? C.sockFar : C.sock, W.sh, 'ss' + i)) }
    else if (b.part === 'ft') out.push(seg(b.a, b.b, C.boot, W.ft, 'b' + i))
  })
  // head with hair on the back
  const [hx, hy] = f.head, r = LEN.headR
  out.push(<circle key="h" cx={hx} cy={hy} r={r} fill={C.skin} />)
  if (f.front) {
    const ang = (Math.atan2(hy - f.joints.neck[1], hx - f.joints.neck[0]) * 180) / Math.PI + 90
    out.push(<path key="hair" d={`M${hx - r} ${hy - 0.5}A${r} ${r} 0 0 1 ${hx + r} ${hy - 0.5}Q${hx} ${hy - r * 0.35} ${hx - r} ${hy - 0.5}Z`} fill={C.hair} transform={`rotate(${ang} ${hx} ${hy})`} />)
  }
  else {
    const a = Math.atan2(f.back[1], f.back[0])
    const p = (d: number): Pt => [hx + Math.cos(a + d) * r, hy + Math.sin(a + d) * r]
    const [s, e] = [p(-1.5), p(1.5)]
    out.push(<path key="hair" d={`M${s[0]} ${s[1]}A${r} ${r} 0 0 1 ${e[0]} ${e[1]}Z`} fill={C.hair} />)
  }
  return <g opacity={faint ? 0.28 : 1} key={k}>{out}{objects(pose.o, f)}</g>
}

function objects(o: Obj[] | undefined, f: ReturnType<typeof build>): ReactNode[] {
  if (!o) return []
  return o.map((x, i) => {
    const p = refPt(f, x[1]); const q: Pt = x[0] === 'rod' ? [p[0], p[1] + (x[3] ?? 0)] : [p[0] + (x[2] ?? 0), p[1] + (x[3] ?? 0)]
    if (x[0] === 'ball') return soccerBall(q[0], q[1], 2.6, 'ball' + i, false)
    if (x[0] === 'med') return <g key={'m' + i}><circle cx={q[0]} cy={q[1]} r={3.6} fill="#8C3B2E" stroke="#5E241B" strokeWidth={0.6} /><path d={`M${q[0] - 3.4} ${q[1]}H${q[0] + 3.4}`} stroke="#5E241B" strokeWidth={0.5} /></g>
    if (x[0] === 'dumb') return <g key={'d' + i}><rect x={q[0] - 2.6} y={q[1] - 0.6} width={5.2} height={1.2} fill={C.metalDark} /><rect x={q[0] - 3.2} y={q[1] - 1.8} width={1.4} height={3.6} rx={0.4} fill={C.metal} /><rect x={q[0] + 1.8} y={q[1] - 1.8} width={1.4} height={3.6} rx={0.4} fill={C.metal} /></g>
    if (x[0] === 'rod') {
      // barbell seen from the front: a long bar with plates at both ends
      const L2 = x[2] ?? 22
      return <g key={'r' + i}><path d={`M${q[0] - L2} ${q[1]}H${q[0] + L2}`} stroke={C.metalDark} strokeWidth={1.1} /><rect x={q[0] - L2 - 1} y={q[1] - 4.5} width={2.6} height={9} rx={0.6} fill="#C62D24" /><rect x={q[0] + L2 - 1.6} y={q[1] - 4.5} width={2.6} height={9} rx={0.6} fill="#C62D24" /></g>
    }
    if (x[0] === 'disc') return <rect key={'k' + i} x={q[0] - 3} y={q[1] - 3} width={6} height={6} rx={1.4} fill="#C62D24" />
    // barbell seen from the side: plate with the bar end
    return <g key={'bar' + i}><circle cx={q[0]} cy={q[1]} r={4} fill="#C62D24" stroke="#8E1E18" strokeWidth={0.6} /><circle cx={q[0]} cy={q[1]} r={1.1} fill={C.metal} /></g>
  })
}

function scenery(items: Scenery[] | undefined, withArrows: boolean, mk: string): ReactNode[] {
  if (!items) return []
  const G = GROUND
  return items.map((s, i) => {
    const k = 's' + i
    switch (s[0]) {
      case 'mat': return <rect key={k} x={s[1]} y={G - 0.4} width={s[2] - s[1]} height={2.2} rx={0.6} fill={C.mat} stroke={C.matEdge} strokeWidth={0.4} />
      case 'box': return <g key={k}><rect x={s[1]} y={G - s[3]} width={s[2]} height={s[3]} rx={0.8} fill={C.wood} stroke={C.woodDark} strokeWidth={0.6} /><path d={`M${s[1] + 1.5} ${G - s[3] + 2.2}H${s[1] + s[2] - 1.5}`} stroke={C.woodDark} strokeWidth={0.4} /></g>
      case 'bench': return <g key={k}><rect x={s[1]} y={G - s[3]} width={s[2]} height={2.6} rx={0.8} fill={C.wood} stroke={C.woodDark} strokeWidth={0.5} /><path d={`M${s[1] + 2.5} ${G - s[3] + 2.6}V${G}M${s[1] + s[2] - 2.5} ${G - s[3] + 2.6}V${G}`} stroke={C.metalDark} strokeWidth={1.2} /></g>
      case 'wall': return <rect key={k} x={-5} y={0} width={s[1] + 5} height={G} fill="#DCE3DA" stroke="#B9C4B6" strokeWidth={0.5} />
      case 'bars': return <g key={k}><path d={`M${s[1]} 2V${G}M${s[1] + 5} 2V${G}`} stroke={C.woodDark} strokeWidth={1.2} />{Array.from({ length: 10 }, (_, j) => <path key={j} d={`M${s[1]} ${6 + j * 5.2}H${s[1] + 5}`} stroke={C.wood} strokeWidth={1} />)}</g>
      case 'hurdle': { const h = s[2] ?? 6; return <g key={k}><path d={`M${s[1]} ${G}V${G - h}`} stroke={C.metalDark} strokeWidth={0.9} /><rect x={s[1] - 1.6} y={G - h - 0.6} width={3.2} height={1.6} rx={0.4} fill="#F2C318" stroke="#B98F0A" strokeWidth={0.3} /><path d={`M${s[1] - 2.2} ${G}H${s[1] + 2.2}`} stroke={C.metalDark} strokeWidth={0.9} /></g> }
      case 'cone': return <path key={k} d={`M${s[1] - 2.4} ${G}L${s[1]} ${G - 5}L${s[1] + 2.4} ${G}Z`} fill={C.red} stroke="#A0231C" strokeWidth={0.4} />
      case 'ring': return <ellipse key={k} cx={s[1]} cy={G - 0.2} rx={5} ry={1.4} fill="none" stroke={C.red} strokeWidth={0.9} />
      case 'pull': return <g key={k} stroke={C.metalDark} strokeWidth={1.3} fill="none"><path d={`M${s[1] - 15} ${G}V4H${s[1] + 15}V${G}`} /><path d={`M${s[1]} 4V12`} strokeWidth={0.6} /><rect x={s[1] - 5} y={G - 20} width={10} height={2.4} rx={0.6} fill={C.metal} stroke="none" /><path d={`M${s[1] - 4} ${G - 17.6}V${G}M${s[1] + 4} ${G - 17.6}V${G}`} strokeWidth={1} /></g>
      case 'curl': return <g key={k}><rect x={s[1]} y={G - 14} width={44} height={2.8} rx={0.8} fill={C.wood} stroke={C.woodDark} strokeWidth={0.5} /><path d={`M${s[1] + 6} ${G - 11.2}V${G}M${s[1] + 38} ${G - 11.2}V${G}M${s[1] - 2} ${G - 11}V${G}`} stroke={C.metalDark} strokeWidth={1.3} /><rect x={s[1] - 5} y={G - 9} width={6} height={9} rx={0.6} fill={C.metal} /></g>
      case 'calf': return <g key={k} stroke={C.metalDark} strokeWidth={1.3} fill="none"><path d={`M${s[1] + 6} ${G}V8M${s[1] + 6} 20H${s[1] - 2}`} /><rect x={s[1] - 6} y={G - 3} width={14} height={3} fill={C.metal} stroke="none" /><rect x={s[1] + 8} y={G - 26} width={6} height={18} fill={C.metal} stroke="none" /></g>
      case 'seat': return <g key={k}><rect x={s[1] - 8} y={G - 16} width={16} height={3} rx={0.8} fill={C.wood} stroke={C.woodDark} strokeWidth={0.5} /><rect x={s[1] - 6} y={G - 34} width={12} height={18} rx={1} fill={C.metal} opacity={0.5} /><path d={`M${s[1]} ${G - 13}V${G}`} stroke={C.metalDark} strokeWidth={1.6} /></g>
      case 'ext': return <g key={k}><path d={`M${s[1]} ${G - 18}L${s[1] + 26} ${G - 26}`} stroke={C.wood} strokeWidth={3} strokeLinecap="round" /><path d={`M${s[1] + 4} ${G - 19}V${G}M${s[1] + 22} ${G - 25}V${G}M${s[1] - 2} ${G - 6}H${s[1] + 4}`} stroke={C.metalDark} strokeWidth={1.3} /></g>
      case 'partner': return <g key={k}><circle cx={s[1]} cy={s[2]} r={1.8} fill={C.skin} stroke={C.skinFar} strokeWidth={0.5} /><path d={`M${s[1]} ${s[2]}L${s[1] + (s[3] ?? 6)} ${s[2] - 8}`} stroke={C.shirtFar} strokeWidth={2.6} strokeLinecap="round" opacity={0.7} /></g>
      case 'text': return <text key={k} x={s[1]} y={s[2]} fontSize={4.2} fontWeight={700} fill="#33433B" textAnchor="middle">{s[3]}</text>
      case 'arrow': {
        if (!withArrows) return null
        const [a, b, v] = [s[1], s[2], s[3]]
        const d = v ? `M${a[0]} ${a[1]}Q${v[0]} ${v[1]} ${b[0]} ${b[1]}` : `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`
        return <path key={k} d={d} fill="none" stroke={C.red} strokeWidth={1} markerEnd={`url(#${mk})`} />
      }
    }
    return null
  })
}

type Box = [number, number, number, number] // x, y, w, h

/** The part of the picture the exercise uses (all its poses and things), so the figure is drawn large. */
export function fitBox(ex: Exercise): Box {
  const w = ex.w ?? 100
  if (ex.top) return [0, 0, w, H]
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity
  const put = (x: number, y: number) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y) }
  for (const s of ex.seg) for (const p of s.k) {
    const f = build(p)
    f.bones.forEach((b) => { put(b.a[0], b.a[1]); put(b.b[0], b.b[1]) })
    put(f.head[0] - LEN.headR - 1, f.head[1] - LEN.headR - 1); put(f.head[0] + LEN.headR + 1, f.head[1])
    for (const o of p.o ?? []) { const q = refPt(f, o[1]); const r = o[0] === 'rod' ? (o[2] ?? 22) + 2 : 5; put(q[0] - r, q[1] - 5); put(q[0] + r, q[1]) }
  }
  for (const it of [...(ex.sc ?? []), ...ex.seg.flatMap((s) => s.sc ?? [])]) {
    switch (it[0]) {
      case 'box': case 'bench': put(it[1], GROUND - it[3]); put(it[1] + it[2], GROUND); break
      case 'bars': put(it[1] - 2, 2); put(it[1] + 7, GROUND); break
      case 'pull': put(it[1] - 17, 2); put(it[1] + 17, GROUND); break
      case 'calf': put(it[1] - 8, 6); put(it[1] + 16, GROUND); break
      case 'curl': put(it[1] - 6, GROUND - 16); put(it[1] + 46, GROUND); break
      case 'seat': put(it[1] - 9, GROUND - 35); put(it[1] + 9, GROUND); break
      case 'hurdle': put(it[1] - 3, GROUND - (it[2] ?? 6) - 2); put(it[1] + 3, GROUND); break
      case 'cone': case 'ring': put(it[1] - 5, GROUND - 6); put(it[1] + 5, GROUND); break
      case 'arrow': put(it[1][0], it[1][1]); put(it[2][0], it[2][1]); break
      default: break
    }
  }
  const pad = 5
  x0 = Math.max(0, x0 - pad); x1 = Math.min(w, x1 + pad); y0 = Math.max(-24, y0 - pad)
  let bw = x1 - x0, bh = H - y0
  // keep a calm shape: not narrower than 1.15 : 1, not wider than 2.4 : 1
  if (bw < bh * 1.15) { const d = bh * 1.15 - bw; x0 -= d / 2; bw = bh * 1.15 }
  if (bw > bh * 2.4) { const d = bw / 2.4 - bh; y0 = Math.max(-20, y0 - d); bh = H - y0 }
  return [x0, y0, bw, bh]
}

function Stage({ w, children, maxHeight, label, top, box }: { w: number; children: ReactNode; maxHeight?: number; label?: string; top?: boolean; box?: Box }) {
  const [bx, by, bw, bh] = box ?? [0, 0, w, H]
  return (
    <svg className="body-stage" viewBox={`${bx} ${by} ${bw} ${bh}`} role="img" aria-label={label} style={maxHeight ? { maxHeight } : undefined} preserveAspectRatio="xMidYMid meet">
      <rect x={bx - 1} y={by - 1} width={bw + 2} height={bh + 2} fill={top ? '#E3E9E1' : C.bg} />
      {top
        ? <rect x={w / 2 - 15} y={1} width={30} height={H - 2} rx={1.5} fill={C.mat} stroke={C.matEdge} strokeWidth={0.5} opacity={0.9} />
        : <><rect x={bx - 1} y={GROUND} width={bw + 2} height={H - GROUND} fill="#E3E9E1" /><path d={`M${bx - 1} ${GROUND}H${bx + bw + 1}`} stroke={C.floor} strokeWidth={0.6} /></>}
      {children}
    </svg>
  )
}

const flipBox = (b: Box, w: number, flip?: boolean): Box => (flip ? [w - b[0] - b[2], b[1], b[2], b[3]] : b)

const Marker = ({ id }: { id: string }) => (
  <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={C.red} /></marker></defs>
)

/** One picture of an exercise part: the key poses (A and B side by side, or a faint sequence). */
function Panel({ ex, si, ki, maxHeight, both }: { ex: Exercise; si: number; ki?: number; maxHeight?: number; both?: boolean }) {
  const mk = 'ba' + useId().replace(/:/g, '')
  const s = ex.seg[si]
  const w = ex.w ?? 100
  const flip = ex.flip ? `translate(${w} 0) scale(-1 1)` : undefined
  const keys = s.ghost ? (s.show ?? s.k.map((_, i) => i)) : [ki ?? s.show?.[0] ?? s.k.length - 1]
  const sc = [...(ex.sc ?? []), ...(s.sc ?? [])]
  return (
    <Stage w={w} maxHeight={maxHeight} top={ex.top} box={flipBox(fitBox(ex), w, ex.flip)}>
      <Marker id={mk} />
      <g transform={flip}>
        {scenery(sc, both !== false, mk)}
        {keys.map((i) => <Figure key={i} k={'f' + i} pose={s.k[i]} faint={s.ghost && i !== keys[keys.length - 1]} />)}
      </g>
    </Stage>
  )
}

/** The pictures of one exercise (as in the book: start and end position, or each part). */
function pics(ex: Exercise): [number, number | undefined][] {
  if (ex.seg.length === 1) {
    const s = ex.seg[0]
    return s.ghost || s.k.length < 2 ? [[0, undefined]] : [[0, 0], [0, s.k.length - 1]]
  }
  return ex.seg.map((_, i) => [i, undefined])
}

/** The drawing: every exercise of the programme with its pictures, name and dosage. */
export function BodyStatic({ prog, maxHeight, compact }: { prog: BodyProgram; maxHeight?: number; compact?: boolean }) {
  const { lang } = useT()
  const L = (x: [string, string]) => (lang === 'ru' ? x[1] : x[0])
  if (compact || (maxHeight && maxHeight < 200)) {
    // card: the first exercise only
    const ex = prog.ex[0]
    const p = pics(ex)
    if (maxHeight && maxHeight < 60) return <div className="body-thumb"><Panel ex={ex} si={p[p.length - 1][0]} ki={p[p.length - 1][1]} maxHeight={maxHeight} /></div>
    return <div className="body-thumb row-pics">{p.slice(0, 2).map(([si, ki], j) => <Panel key={j} ex={ex} si={si} ki={ki} maxHeight={maxHeight} />)}</div>
  }
  return (
    <div className="body-grid">
      {prog.ex.map((ex, i) => (
        <section key={i} className="body-tile">
          <h4><b>{i + 1}.</b> {L(ex.name)}</h4>
          <div className={'body-pics n' + pics(ex).length}>
            {pics(ex).map(([si, ki], j) => (
              <figure key={j}>
                <Panel ex={ex} si={si} ki={ki} />
                {ex.seg[si].label && ex.seg.length > 1 && <figcaption>{L(ex.seg[si].label!)}</figcaption>}
              </figure>
            ))}
          </div>
          <p className="body-dose">{L(ex.dose)}</p>
        </section>
      ))}
    </div>
  )
}

// ---------- animation ----------

interface Move { ex: number; seg: number; a: Pose; b: Pose; mv: number; hold: number; jump?: boolean }

function timeline(prog: BodyProgram, slow: boolean): { moves: Move[]; starts: number[]; total: number; exStart: number[] } {
  const f = slow ? 1.8 : 1
  const moves: Move[] = []
  const exStart: number[] = []
  prog.ex.forEach((ex, ei) => {
    exStart.push(moves.length)
    ex.seg.forEach((s, si) => {
      const mv = (s.mv ?? 1.3) * f, hold = (s.hold ?? 0.45) * f, reps = s.reps ?? 2
      const ks = s.k
      if (ks.length === 1) { moves.push({ ex: ei, seg: si, a: ks[0], b: ks[0], mv: 0, hold: Math.max(hold, 2.5 * f) }); return }
      for (let r = 0; r < reps; r++) {
        if (s.loop === 'fwd') {
          for (let i = 0; i < ks.length - 1; i++) moves.push({ ex: ei, seg: si, a: ks[i], b: ks[i + 1], mv, hold: i === ks.length - 2 ? hold + 0.3 : hold * 0.4 })
          if (r < reps - 1) moves.push({ ex: ei, seg: si, a: ks[ks.length - 1], b: ks[0], mv: 0.01, hold: 0.25, jump: true })
        } else {
          for (let i = 0; i < ks.length - 1; i++) moves.push({ ex: ei, seg: si, a: ks[i], b: ks[i + 1], mv, hold })
          for (let i = ks.length - 1; i > 0; i--) moves.push({ ex: ei, seg: si, a: ks[i], b: ks[i - 1], mv, hold: i === 1 ? hold * 0.6 : hold })
        }
      }
    })
  })
  const starts: number[] = []
  let t = 1.0
  for (const m of moves) { starts.push(t); t += m.mv + m.hold }
  return { moves, starts, total: t + 1.2, exStart }
}

function poseAt(tl: ReturnType<typeof timeline>, s: number): { i: number; pose: Pose } {
  const { moves, starts } = tl
  if (s < starts[0]) return { i: 0, pose: moves[0].a }
  let i = 0
  while (i < moves.length - 1 && starts[i + 1] <= s) i++
  const m = moves[i]
  const u = s - starts[i]
  if (m.mv <= 0.02 || u >= m.mv) return { i, pose: m.b }
  return { i, pose: mix(m.a, m.b, u / m.mv) }
}

/** Plays the programme: each exercise a few times, slowly, with its name and how to do it. */
export function BodyPlayer({ prog, autoPlay, maxHeight }: { prog: BodyProgram; autoPlay: boolean; maxHeight?: number }) {
  const { t: tr, lang } = useT()
  const L = (x: [string, string]) => (lang === 'ru' ? x[1] : x[0])
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion())
  const [slow, setSlow] = useState(false)
  const [s, setS] = useState(0)
  const sRef = useRef(0)
  const tl = timeline(prog, slow)
  const total = tl.total

  useEffect(() => { sRef.current = 0; setS(0) }, [prog])
  useEffect(() => {
    if (!playing) return
    let raf = 0, last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      let next = sRef.current + dt
      if (next > total) next = 0
      sRef.current = next
      setS(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, total])

  const go = (v: number) => { sRef.current = v; setS(v) }
  const { i, pose } = poseAt(tl, s)
  const m = tl.moves[i]
  const ex = prog.ex[m.ex]
  const w = ex.w ?? 100
  const flip = ex.flip ? `translate(${w} 0) scale(-1 1)` : undefined
  const sc = [...(ex.sc ?? []), ...(ex.seg[m.seg].sc ?? [])]
  const n = prog.ex.length
  const toEx = (e: number) => { const j = tl.exStart[Math.max(0, Math.min(n - 1, e))]; go(tl.starts[j] - 0.3) }
  const part = ex.seg.length > 1 && ex.seg[m.seg].label ? ` · ${L(ex.seg[m.seg].label!)}` : ''

  return (
    <div className="apitch body-player">
      <Stage w={w} maxHeight={maxHeight} label={L(ex.name)} top={ex.top} box={flipBox(fitBox(ex), w, ex.flip)}>
        <g transform={flip}>
          {scenery(sc, false, '')}
          <Figure pose={pose} />
        </g>
      </Stage>
      <div className="apitch-step" aria-live="polite">{`${tr('exN')} ${m.ex + 1} / ${n}`}</div>
      <div className="apitch-cap" aria-live="polite"><b>{L(ex.name)}{part}.</b> {L(ex.cue)} <span className="muted">{L(ex.dose)}</span></div>
      <div className="apitch-bar"><i style={{ width: `${Math.min(100, (s / total) * 100)}%` }} /></div>
      <div className="apitch-ctl">
        <button type="button" onClick={() => { setPlaying(false); toEx(m.ex - 1) }} aria-label={tr('prevStep')} disabled={m.ex === 0}>⏮</button>
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? tr('pause') : tr('play')}>{playing ? '❚❚' : '▶'}</button>
        <button type="button" onClick={() => { toEx(m.ex + 1); setPlaying(true) }} aria-label={tr('nextStep')} disabled={m.ex >= n - 1}>⏭</button>
        <button type="button" onClick={() => { go(0); setPlaying(true) }} aria-label={tr('replay')}>↺</button>
        <button type="button" aria-pressed={slow} onClick={() => { const fr = s / total; setSlow(!slow); go(fr * timeline(prog, !slow).total) }} aria-label={tr('slow')}>½×</button>
      </div>
    </div>
  )
}

/** The exercises in words: name, how to do it, dosage. */
export function BodySteps({ prog }: { prog: BodyProgram }) {
  const { t, lang } = useT()
  const L = (x: [string, string]) => (lang === 'ru' ? x[1] : x[0])
  return (
    <details className="steps" open>
      <summary>{t('exList')}</summary>
      <ol>{prog.ex.map((ex, i) => <li key={i}><b>{L(ex.name)}.</b> {L(ex.cue)} <i>{L(ex.dose)}</i></li>)}</ol>
    </details>
  )
}

export type { Seg }
