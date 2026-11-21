import { useEffect, useId, useRef, useState } from 'react'
import type { Diagram } from '../types'
import { Field, Pitch } from './Pitch'
import { SCENES, frame } from '../scenes'
import { BOOK_SCENES } from '../book'
import { BookFrame, BookStatic } from './BookPitch'
import { useT } from '../hooks'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Static diagram for a drill: the book drawing when we have it, else the generic one. */
export function DrillPitch({ id, type, maxHeight }: { id?: string; type: Diagram; maxHeight?: number }) {
  const book = id ? BOOK_SCENES[id] : undefined
  return book ? <BookStatic scene={book} maxHeight={maxHeight} /> : <Pitch type={type} maxHeight={maxHeight} />
}

/**
 * Drill diagram that plays the drill: players run and the ball moves.
 * Stopped at the start it shows the static diagram with arrows.
 */
export function AnimatedPitch({ id, type, autoPlay = true, maxHeight }: { id?: string; type: Diagram; autoPlay?: boolean; maxHeight?: number }) {
  const { t: tr } = useT()
  const book = id ? BOOK_SCENES[id] : undefined
  const scene = SCENES[type]
  const steps = book ? book.steps : scene?.steps ?? 1
  const speed = book ? book.speed ?? 1.15 : scene?.speed ?? 1.1
  const markerId = 'am' + useId().replace(/:/g, '')
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion())
  const [time, setTime] = useState(0)
  const [slow, setSlow] = useState(false)
  const timeRef = useRef(0)

  // new drill → start over
  useEffect(() => { timeRef.current = 0; setTime(0) }, [type, id])

  useEffect(() => {
    if (!playing || (!scene && !book)) return
    let raf = 0, last = performance.now()
    const per = speed * (slow ? 2 : 1)
    const end = steps - 1 + 1.4 // hold the final picture a moment
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
  }, [playing, scene, book, slow, speed, steps])

  if (!scene && !book) return <Pitch type={type} maxHeight={maxHeight} />

  const atStart = !playing && time === 0
  const restart = () => { timeRef.current = 0; setTime(0); setPlaying(true) }

  let view
  if (atStart) view = <DrillPitch id={id} type={type} maxHeight={maxHeight} />
  else if (book) view = <BookFrame scene={book} t={Math.min(time, steps - 1)} maxHeight={maxHeight} />
  else {
    const f = frame(scene, time)
    view = (
      <Field markerId={markerId} maxHeight={maxHeight}>
        {scene.field()}
        {f.trail && <line x1={f.trail.from[0]} y1={f.trail.from[1]} x2={f.trail.to[0]} y2={f.trail.to[1]} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.4} strokeDasharray="3 3" />}
        {f.actors.map((a) => <circle key={a.id} cx={a.at[0]} cy={a.at[1]} r={5} fill={a.color} stroke="#fff" strokeWidth={1.5} />)}
        {f.ball && <circle cx={f.ball[0]} cy={f.ball[1]} r={3} fill="#fff" stroke="#16231C" strokeWidth={1} />}
      </Field>
    )
  }

  return (
    <div className="apitch">
      {view}
      <div className="apitch-ctl">
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? tr('pause') : tr('play')}>{playing ? '❚❚' : '▶'}</button>
        <button type="button" onClick={restart} aria-label={tr('replay')}>↺</button>
        <button type="button" aria-pressed={slow} onClick={() => setSlow(!slow)} aria-label={tr('slow')}>½×</button>
      </div>
    </div>
  )
}
