import { useEffect, useId, useRef, useState } from 'react'
import type { Diagram } from '../types'
import { Field, Pitch } from './Pitch'
import { SCENES, frame } from '../scenes'
import { sceneOf } from '../scene-of'
import { bookSteps, type BookScene } from '../book/scene'
import { narrate } from '../book/narrate'
import { BookFrame, BookStatic } from './BookPitch'
import { useT } from '../hooks'
import { getContent, useContent } from '../content'
import { LockedPitch } from '../premium/Locked'
import { BodyPlayer, BodyStatic, BodySteps } from './BodyFigure'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Static diagram for a drill: the book drawing when we have it, else the generic one. */
export function DrillPitch({ id, type, maxHeight }: { id?: string; type: Diagram; maxHeight?: number }) {
  const c = useContent()
  if (id && c.locked(id)) return <LockedPitch maxHeight={maxHeight} />
  const body = id ? c.body(id) : undefined
  if (body) return <BodyStatic prog={body} maxHeight={maxHeight} />
  const book = sceneOf(id)
  return book ? <BookStatic scene={book} maxHeight={maxHeight} /> : <Pitch type={type} maxHeight={maxHeight} />
}

// ---------- timeline of a book animation (seconds) ----------
// Each step: its arrows appear first (PRE), then the players and the ball move (move), then a short hold (HOLD).
const START = 1.2, PRE = 1.0, HOLD = 0.7, END = 3.0

export function timing(sc: BookScene, slow: boolean) {
  const move = Math.max(2.0, (sc.speed ?? 1.15) * 1.8) * (slow ? 1.8 : 1)
  const pre = PRE * (slow ? 1.4 : 1)
  const len = pre + move + HOLD
  const moves = sc.steps - 1
  return { move, pre, len, moves, total: START + moves * len + END }
}

/** Where the animation is at second s: frame time t, the current step and how visible its arrows are. */
export function at(sc: BookScene, s: number, slow: boolean) {
  const { move, pre, len, moves } = timing(sc, slow)
  if (s < START) return { t: 0, step: 0, op: 0, k: -1 }
  const u = s - START
  const k = Math.floor(u / len)
  if (k >= moves) return { t: moves, step: moves, op: 0, k: moves }
  const r = u - k * len
  if (r < pre) return { t: k, step: k, op: r / pre, k }
  if (r < pre + move) return { t: k + (r - pre) / move, step: k, op: 1, k }
  return { t: k + 1, step: k, op: 1, k }
}

/** The book animation: step by step, with the arrows of each step shown before it plays. */
export function BookPlayer({ scene, autoPlay, maxHeight, fit }: { scene: BookScene; autoPlay: boolean; maxHeight?: number; fit?: boolean }) {
  const { t: tr, lang } = useT()
  const story = narrate(scene, lang)
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion())
  const [slow, setSlow] = useState(false)
  const [s, setS] = useState(0)
  const sRef = useRef(0)
  const { len, pre, move, moves, total } = timing(scene, slow)

  useEffect(() => { sRef.current = 0; setS(0) }, [scene])

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
  const pos = at(scene, s, slow)
  // jump to the end of a step (paused): the move is done and its arrows stay visible
  const toStep = (k: number) => { setPlaying(false); go(k < 0 ? 0 : START + k * len + pre + move + 0.01) }
  const shown = pos.k < 0 ? 0 : Math.min(pos.k + 1, moves)
  // steps already completed
  const done = pos.k < 0 ? 0 : pos.k >= moves ? moves : pos.t >= pos.k + 1 ? pos.k + 1 : pos.k

  return (
    <div className="apitch">
      {fit
        ? <div className="apitch-fit"><BookFrame scene={scene} t={pos.t} step={pos.step} stepOpacity={pos.op} /></div>
        : <BookFrame scene={scene} t={pos.t} step={pos.step} stepOpacity={pos.op} maxHeight={maxHeight} />}
      <div className="apitch-step" aria-live="polite">
        {pos.k < 0 ? tr('ready') : pos.k >= moves ? tr('finalPos') : `${tr('stepN')} ${shown} / ${moves}${pos.k >= bookSteps(scene) - 1 ? ' · ' + tr('cont') : ''}`}
      </div>
      <div className="apitch-cap" aria-live="polite">
        {pos.k < 0 || pos.k >= moves
          ? <span className="muted">{pos.k < 0 ? tr('ready') : tr('finalPos')}</span>
          : <><b>{pos.k + 1}.</b> {(story[pos.k] ?? []).join(' ') || '—'}</>}
      </div>
      <div className="apitch-bar"><i style={{ width: `${Math.min(100, (s / total) * 100)}%` }} /></div>
      <div className="apitch-ctl">
        <button type="button" onClick={() => toStep(done - 2)} aria-label={tr('prevStep')} disabled={pos.k < 0}>⏮</button>
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? tr('pause') : tr('play')}>{playing ? '❚❚' : '▶'}</button>
        <button type="button" onClick={() => toStep(Math.min(done, moves - 1))} aria-label={tr('nextStep')} disabled={done >= moves}>⏭</button>
        <button type="button" onClick={() => { go(0); setPlaying(true) }} aria-label={tr('replay')}>↺</button>
        <button type="button" aria-pressed={slow} onClick={() => { const f = s / total; setSlow(!slow); go(f * timing(scene, !slow).total) }} aria-label={tr('slow')}>½×</button>
      </div>
    </div>
  )
}

/**
 * Drill diagram that plays the drill: players run and the ball moves.
 * Stopped at the start it shows the static diagram with arrows.
 */
export function AnimatedPitch({ id, type, autoPlay = true, maxHeight }: { id?: string; type: Diagram; autoPlay?: boolean; maxHeight?: number }) {
  const c = useContent()
  if (id && c.locked(id)) return <LockedPitch maxHeight={maxHeight} />
  const body = id ? c.body(id) : undefined
  if (body) return <BodyPlayer key={id} prog={body} autoPlay={autoPlay} maxHeight={maxHeight} />
  const book = sceneOf(id)
  if (book) return <BookPlayer key={id} scene={book} autoPlay={autoPlay} maxHeight={maxHeight} />
  return <GenericPlayer type={type} autoPlay={autoPlay} maxHeight={maxHeight} />
}

type View = 'anim' | 'dia' | 'both'
const VIEW_KEY = 'pf-drill-view'
const readView = (): View => { try { const v = localStorage.getItem(VIEW_KEY); return v === 'anim' || v === 'dia' || v === 'both' ? v : 'both' } catch { return 'both' } }

/** Animation and the book drawing side by side (or one of them): the coach chooses. */
export function DrillViews({ id, type, maxHeight }: { id?: string; type: Diagram; maxHeight?: number }) {
  const { t } = useT()
  const [view, setView] = useState<View>(readView)
  const pick = (v: View) => { setView(v); try { localStorage.setItem(VIEW_KEY, v) } catch { /* private mode */ } }
  return (
    <div className={'views views-' + view}>
      <div className="seg" role="tablist">
        {(['anim', 'dia', 'both'] as const).map((v) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => pick(v)}>{t(v === 'anim' ? 'vAnim' : v === 'dia' ? 'vDia' : 'vBoth')}</button>
        ))}
      </div>
      <div className="views-grid">
        {view !== 'dia' && <figure className="view-anim"><AnimatedPitch id={id} type={type} maxHeight={maxHeight} />{view === 'both' && <figcaption>{t('vAnim')}</figcaption>}</figure>}
        {view !== 'anim' && <figure className="view-dia"><DrillPitch id={id} type={type} maxHeight={maxHeight} />{view === 'both' && <figcaption>{t('vDia')}</figcaption>}</figure>}
      </div>
      {id && getContent().body(id) && <BodySteps prog={getContent().body(id)!} />}
      {sceneOf(id) && <StepList scene={sceneOf(id)!} />}
    </div>
  )
}

/** The drill step by step in words (generated from the same data as the drawing). */
function StepList({ scene }: { scene: BookScene }) {
  const { t, lang } = useT()
  const story = narrate(scene, lang)
  if (!story.some((l) => l.length)) return null
  const b = bookSteps(scene) - 1
  const li = (l: string[], k: number) => l.length ? <li key={k} value={k + 1}>{l.join(' ')}</li> : null
  return (
    <details className="steps" open>
      <summary>{t('stepsTitle')}</summary>
      <ol>{story.slice(0, b).map((l, k) => li(l, k))}</ol>
      {story.length > b && <>
        <p className="steps-cont">{t('cont')}: <span>{t('contNote')}</span></p>
        <ol>{story.slice(b).map((l, k) => li(l, k + b))}</ol>
      </>}
    </details>
  )
}

/** Animation of the generic (non-book) diagrams. */
function GenericPlayer({ type, autoPlay, maxHeight }: { type: Diagram; autoPlay: boolean; maxHeight?: number }) {
  const { t: tr } = useT()
  const scene = SCENES[type]
  const steps = scene?.steps ?? 1
  const speed = (scene?.speed ?? 1.1) * 1.6
  const markerId = 'am' + useId().replace(/:/g, '')
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion())
  const [time, setTime] = useState(0)
  const [slow, setSlow] = useState(false)
  const timeRef = useRef(0)

  useEffect(() => { timeRef.current = 0; setTime(0) }, [type])

  useEffect(() => {
    if (!playing || !scene) return
    let raf = 0, last = performance.now()
    const per = speed * (slow ? 2 : 1)
    const end = steps - 1 + 1.6
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      let next = timeRef.current + dt / per
      if (next > end) next = 0
      timeRef.current = next
      setTime(next)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, scene, slow, speed, steps])

  if (!scene) return <Pitch type={type} maxHeight={maxHeight} />
  const atStart = !playing && time === 0
  const f = frame(scene, time)
  return (
    <div className="apitch">
      {atStart ? <Pitch type={type} maxHeight={maxHeight} /> : (
        <Field markerId={markerId} maxHeight={maxHeight}>
          {scene.field()}
          {f.trail && <line x1={f.trail.from[0]} y1={f.trail.from[1]} x2={f.trail.to[0]} y2={f.trail.to[1]} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray="3 3" />}
          {f.actors.map((a) => <circle key={a.id} cx={a.at[0]} cy={a.at[1]} r={5} fill={a.color} stroke="#fff" strokeWidth={1.5} />)}
          {f.ball && <circle cx={f.ball[0]} cy={f.ball[1]} r={3} fill="#fff" stroke="#16231C" strokeWidth={1} />}
        </Field>
      )}
      <div className="apitch-ctl">
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? tr('pause') : tr('play')}>{playing ? '❚❚' : '▶'}</button>
        <button type="button" onClick={() => { timeRef.current = 0; setTime(0); setPlaying(true) }} aria-label={tr('replay')}>↺</button>
        <button type="button" aria-pressed={slow} onClick={() => setSlow(!slow)} aria-label={tr('slow')}>½×</button>
      </div>
    </div>
  )
}
