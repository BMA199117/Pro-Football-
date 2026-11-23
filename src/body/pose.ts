/**
 * Body-exercise figures (strength, stability, stretching) drawn like the pictures in FIFA part 8.2.
 *
 * A pose is a hip point, a torso angle and four limbs. A limb is either two absolute angles
 * (upper bone, lower bone) or a target point for the hand / ankle (2-bone IK), so a hand or a
 * foot that stays on the floor stays planted while the body moves. Angles are degrees in screen
 * coordinates: 0 = right, 90 = down, 180 = left, -90 = up.
 *
 * The animation interpolates the pose parameters (not the joint points), so bones never change
 * length. Figures are authored facing right; `fc: -1` turns the front of the body the other way
 * (e.g. lying on the back with the head to the right).
 */
export type Pt = [number, number]
export type Limb = [number, number] | { to: Pt; bend?: 1 | -1 }
export type ObjKind = 'ball' | 'bar' | 'rod' | 'dumb' | 'med' | 'disc'
/** a joint of the figure or a fixed point */
export type Ref = 'head' | 'neck' | 'hip' | 'hand' | 'hand2' | 'hands' | 'foot' | 'foot2' | 'knee' | 'knee2' | Pt
export type Obj = [ObjKind, Ref, number?, number?] // kind, where, dx, dy

export interface Pose {
  h: Pt
  t: number
  /** head direction (default: along the torso) */
  hd?: number
  /** near arm, far arm (default: same as near) */
  a: Limb
  b?: Limb
  /** near leg, far leg (default: same as near) */
  l: Limb
  m?: Limb
  /** foot angles (near, far); default: flat to the front */
  f?: number
  g?: number
  /** which side the front of the body faces (1 = as authored, -1 = turned) */
  fc?: 1 | -1
  /** front view (both shoulders and hips apart) */
  fr?: boolean
  /** thigh / shin / arm length factors (foreshortened limbs: seen from the front or from above) */
  lk?: number
  sk?: number
  mk?: number
  /** objects: ball, barbell, dumbbells, medicine ball */
  o?: Obj[]
}

export const LEN = { torso: 17, neck: 5.2, headR: 4.1, ua: 9.5, fa: 9, th: 13.5, sh: 13, ft: 4.2, sw: 5.2, hw: 3.4 }
export const GROUND = 58

const rad = (d: number) => (d * Math.PI) / 180
const dirOf = (d: number): Pt => [Math.cos(rad(d)), Math.sin(rad(d))]
const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k]
const angle = (a: Pt, b: Pt) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]

/** Joint of a 2-bone limb from root r to target t (bend picks the side). */
function ik(r: Pt, t: Pt, l1: number, l2: number, bend: number): [Pt, Pt] {
  const dx = t[0] - r[0], dy = t[1] - r[1]
  let d = Math.hypot(dx, dy)
  if (d < 1e-6) return [add(r, [0, 1], l1), r]
  const u: Pt = [dx / d, dy / d]
  if (d >= l1 + l2) { const j = add(r, u, l1); return [j, add(j, u, l2)] }
  d = Math.max(d, Math.abs(l1 - l2) + 0.01)
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a))
  const n: Pt = [-u[1], u[0]]
  const j: Pt = [r[0] + u[0] * a + n[0] * h * bend, r[1] + u[1] * a + n[1] * h * bend]
  return [j, add(r, u, d)]
}

export interface Bone { a: Pt; b: Pt; part: 'torso' | 'ua' | 'fa' | 'th' | 'sh' | 'ft' | 'neck'; far?: boolean }
export interface Figure {
  bones: Bone[]
  head: Pt
  /** unit vector to the back of the head (for the hair) */
  back: Pt
  joints: Record<'head' | 'neck' | 'hip' | 'hand' | 'hand2' | 'foot' | 'foot2' | 'knee' | 'knee2', Pt>
  hipL?: Pt; hipR?: Pt; shL?: Pt; shR?: Pt
  front: boolean
}

function limb(root: Pt, lb: Limb, l1: number, l2: number, bend: number): [Pt, Pt] {
  if (Array.isArray(lb)) { const j = add(root, dirOf(lb[0]), l1); return [j, add(j, dirOf(lb[1]), l2)] }
  return ik(root, lb.to, l1, l2, lb.bend ?? bend)
}

/** Joint points of a pose. */
export function build(p: Pose): Figure {
  const fc = p.fc ?? 1
  const tdir = dirOf(p.t)
  const neck = add(p.h, tdir, LEN.torso)
  const hd = p.hd ?? p.t
  const head = add(neck, dirOf(hd), LEN.neck)
  // the front of the head is the head axis turned +90° (for fc = 1)
  const hv = dirOf(hd)
  const front: Pt = [-hv[1] * fc, hv[0] * fc]
  const back: Pt = [-front[0], -front[1]]
  const lk = p.lk ?? 1, sk = p.sk ?? 1, mk = p.mk ?? 1
  let shN = neck, shF = neck, hpN = p.h, hpF = p.h
  if (p.fr) {
    const n: Pt = [-tdir[1], tdir[0]] // normal to the torso
    shN = add(neck, n, LEN.sw); shF = add(neck, n, -LEN.sw)
    hpN = add(p.h, n, LEN.hw); hpF = add(p.h, n, -LEN.hw)
  }
  // front view: knees and elbows bend outwards (near side is +normal)
  const legBend = p.fr ? -1 : -fc, armBend = p.fr ? -1 : fc
  const [kn, an] = limb(hpN, p.l, LEN.th * lk, LEN.sh * sk, legBend)
  const [kf, af] = limb(hpF, p.m ?? p.l, LEN.th * lk, LEN.sh * sk, p.fr ? 1 : legBend)
  const [en, hn] = limb(shN, p.a, LEN.ua * mk, LEN.fa * mk, armBend)
  const [ef, hf] = limb(shF, p.b ?? p.a, LEN.ua * mk, LEN.fa * mk, p.fr ? 1 : armBend)
  const footDir = (knee: Pt, ankle: Pt, f?: number) => {
    if (f !== undefined) return f
    if (p.fr) return 90
    const s = angle(knee, ankle)
    return s - 90 * fc
  }
  const toeN = add(an, dirOf(footDir(kn, an, p.f)), LEN.ft * (p.fr ? 0.6 : 1))
  const toeF = add(af, dirOf(footDir(kf, af, p.g ?? p.f)), LEN.ft * (p.fr ? 0.6 : 1))
  const bones: Bone[] = [
    { a: shF, b: ef, part: 'ua', far: true }, { a: ef, b: hf, part: 'fa', far: true },
    { a: hpF, b: kf, part: 'th', far: true }, { a: kf, b: af, part: 'sh', far: true }, { a: af, b: toeF, part: 'ft', far: true },
    { a: p.h, b: neck, part: 'torso' }, { a: neck, b: head, part: 'neck' },
    { a: hpN, b: kn, part: 'th' }, { a: kn, b: an, part: 'sh' }, { a: an, b: toeN, part: 'ft' },
    { a: shN, b: en, part: 'ua' }, { a: en, b: hn, part: 'fa' },
  ]
  return {
    bones, head, back, front: !!p.fr,
    joints: { head, neck, hip: p.h, hand: hn, hand2: hf, foot: an, foot2: af, knee: kn, knee2: kf },
    hipL: hpN, hipR: hpF, shL: shN, shR: shF,
  }
}

/** Where an object is drawn in a figure. */
export function refPt(fig: Figure, r: Ref): Pt {
  if (Array.isArray(r)) return r
  if (r === 'hands') return lerpPt(fig.joints.hand, fig.joints.hand2, 0.5)
  return fig.joints[r]
}

// ---------- interpolation ----------

function limbAt(a: Limb, b: Limb, k: number, rootA: Pt, rootB: Pt, l1: number, l2: number, bend: number): Limb {
  if (Array.isArray(a) && Array.isArray(b)) return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]
  const ta = Array.isArray(a) ? limb(rootA, a, l1, l2, bend)[1] : a.to
  const tb = Array.isArray(b) ? limb(rootB, b, l1, l2, bend)[1] : b.to
  const bd = (!Array.isArray(b) ? b.bend : undefined) ?? (!Array.isArray(a) ? a.bend : undefined)
  return { to: lerpPt(ta, tb, k), bend: bd }
}

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2)

/** The pose between a and b (k = 0…1, eased). */
export function mix(a: Pose, b: Pose, k0: number): Pose {
  const k = ease(Math.max(0, Math.min(1, k0)))
  if (k <= 0) return a
  if (k >= 1) return b
  const fa = build(a), fb = build(b)
  const fc = a.fc ?? 1
  const legB = a.fr ? -1 : -fc, armB = a.fr ? -1 : fc
  const lk = lerp(a.lk ?? 1, b.lk ?? 1, k), sk = lerp(a.sk ?? 1, b.sk ?? 1, k), mk = lerp(a.mk ?? 1, b.mk ?? 1, k)
  return {
    ...a,
    h: lerpPt(a.h, b.h, k), t: lerp(a.t, b.t, k),
    hd: a.hd !== undefined || b.hd !== undefined ? lerp(a.hd ?? a.t, b.hd ?? b.t, k) : undefined,
    a: limbAt(a.a, b.a, k, fa.shL!, fb.shL!, LEN.ua * mk, LEN.fa * mk, armB),
    b: limbAt(a.b ?? a.a, b.b ?? b.a, k, fa.shR!, fb.shR!, LEN.ua * mk, LEN.fa * mk, a.fr ? 1 : armB),
    l: limbAt(a.l, b.l, k, fa.hipL!, fb.hipL!, LEN.th * lk, LEN.sh * sk, legB),
    m: limbAt(a.m ?? a.l, b.m ?? b.l, k, fa.hipR!, fb.hipR!, LEN.th * lk, LEN.sh * sk, a.fr ? 1 : legB),
    f: a.f !== undefined || b.f !== undefined ? lerp(a.f ?? footOf(fa, 'n', a), b.f ?? footOf(fb, 'n', b), k) : undefined,
    g: a.g !== undefined || b.g !== undefined || a.f !== undefined || b.f !== undefined
      ? lerp(a.g ?? a.f ?? footOf(fa, 'f', a), b.g ?? b.f ?? footOf(fb, 'f', b), k) : undefined,
    lk, sk, mk,
    o: mixObjs(a, b, fa, fb, k),
  }
}

function footOf(fig: Figure, side: 'n' | 'f', p: Pose) {
  const kn = side === 'n' ? fig.joints.knee : fig.joints.knee2
  const an = side === 'n' ? fig.joints.foot : fig.joints.foot2
  return p.fr ? 90 : angle(kn, an) - 90 * (p.fc ?? 1)
}

function mixObjs(a: Pose, b: Pose, fa: Figure, fb: Figure, k: number): Obj[] | undefined {
  const oa = a.o ?? [], ob = b.o ?? []
  if (!oa.length && !ob.length) return undefined
  const out: Obj[] = []
  for (const x of oa) {
    const y = ob.find((q) => q[0] === x[0])
    if (!y) { if (k < 0.5) out.push(x); continue }
    // same joint in both poses: keep it attached; otherwise fly between the points
    if (!Array.isArray(x[1]) && x[1] === y[1]) { out.push([x[0], x[1], lerp(x[2] ?? 0, y[2] ?? 0, k), lerp(x[3] ?? 0, y[3] ?? 0, k)]); continue }
    const pa = add(refPt(fa, x[1]), [x[2] ?? 0, x[3] ?? 0]), pb = add(refPt(fb, y[1]), [y[2] ?? 0, y[3] ?? 0])
    const p = lerpPt(pa, pb, k)
    const lift = x[0] === 'ball' ? Math.sin(Math.PI * k) * Math.min(14, Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) * 0.35) : 0
    out.push([x[0], [p[0], p[1] - lift]])
  }
  for (const y of ob) if (!oa.find((q) => q[0] === y[0]) && k >= 0.5) out.push(y)
  return out
}
