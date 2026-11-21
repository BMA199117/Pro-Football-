import { useEffect, useId, useRef, useState } from 'react'
import type { Diagram } from '../types'
import { Field, Pitch } from './Pitch'
import { SCENES, frame } from '../scenes'
import { useT } from '../hooks'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Drill diagram that plays the drill: players run and the ball moves.
 * Stopped at the start it shows the classic static diagram with arrows.
 */
export function AnimatedPitch({ type, autoPlay = true, maxHeight }: { type: Diagram; autoPlay?: boolean; maxHeight?: number }) {
  const { t: tr } = useT()
  const scene = SCENES[type]
  const markerId = 'am' + useId().replace(/:/g, '')
  const [playing, setPlaying] = useState(autoPlay && !reduceMotion())
  const [time, setTime] = useState(0)
  const [slow, setSlow] = useState(false)
  const timeRef = useRef(0)

  // new drill → start over
  useEffect(() => { timeRef.current = 0; setTime(0) }, [type])

  useEffect(() => {
    if (!playing || !scene) return
    let raf = 0, last = performance.now()
    const per = (scene.speed ?? 1.1) * (slow ? 2 : 1)
    const end = scene.steps - 1 + 1.2 // hold the final picture a moment
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
  }, [playing, scene, slow])

  if (!scene) return <Pitch type={type} maxHeight={maxHeight} />

  const atStart = !playing && time === 0
  const f = frame(scene, time)
  const restart = () => { timeRef.current = 0; setTime(0); setPlaying(true) }

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
        <button type="button" onClick={restart} aria-label={tr('replay')}>↺</button>
        <button type="button" aria-pressed={slow} onClick={() => setSlow(!slow)} aria-label={tr('slow')}>½×</button>
      </div>
    </div>
  )
}
