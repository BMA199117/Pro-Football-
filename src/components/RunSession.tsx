import { useEffect, useRef, useState } from 'react'
import { DrillViews } from './AnimatedPitch'
import { useT, useDrills, PHASE_COLOR } from '../hooks'
import { PHASES, type Phase, type Session } from '../types'

/** Full-screen pitch-side mode: one drill at a time with a countdown. */
export function RunSession({ session, onClose }: { session: Session; onClose: () => void }) {
  const { t, L } = useT()
  const drills = useDrills()
  const byId = new Map(drills.map((d) => [d.id, d]))
  const steps = PHASES.flatMap((p) => session.phases[p].map((id) => ({ phase: p as Phase, drill: byId.get(id) }))).filter((s) => s.drill)
  const [i, setI] = useState(0)
  const [left, setLeft] = useState((steps[0]?.drill?.min ?? 0) * 60)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const lock = useRef<{ release: () => Promise<void> } | null>(null)

  useEffect(() => {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }
    nav.wakeLock?.request('screen').then((l) => { lock.current = l }).catch(() => {})
    return () => { lock.current?.release().catch(() => {}) }
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setLeft((x) => {
      if (x <= 1) { setRunning(false); try { navigator.vibrate?.([300, 150, 300]) } catch { /* no vibration */ } return 0 }
      return x - 1
    }), 1000)
    return () => clearInterval(id)
  }, [running])

  const go = (n: number) => {
    if (n >= steps.length) { setFinished(true); setRunning(false); return }
    if (n < 0) return
    setI(n); setLeft((steps[n].drill?.min ?? 0) * 60); setRunning(false)
  }

  const step = steps[i]
  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0')

  return (
    <div className="run">
      <div className="run-top">
        <button className="btn ghost small light" onClick={onClose}>✕ {t('close')}</button>
        <span>{session.goal}</span>
      </div>
      {finished || !step ? (
        <div className="run-done"><h1>{t('done')}</h1><button className="btn" onClick={onClose}>{t('close')}</button></div>
      ) : (
        <div className="run-body">
          <div className="run-meta">
            <span className="chip" style={{ background: PHASE_COLOR[step.phase], color: '#fff' }}>{t(step.phase)}</span>
            <span>{i + 1} / {steps.length} {t('drillOf')}</span>
          </div>
          <h1>{L(step.drill!.name)}</h1>
          <div className="run-grid">
            <div className="run-pitch run-views"><DrillViews id={step.drill!.id} type={step.drill!.dia} /></div>
            <div className="run-side">
              <div className={'clock' + (left === 0 ? ' zero' : '')} aria-live="polite">{mm}:{ss}</div>
              <button className="btn big" onClick={() => setRunning(!running)}>{running ? t('pause') : left === (step.drill!.min * 60) ? '▶ ' + t('startTimer') : t('resume')}</button>
              {step.drill!.points && <ul className="points">{step.drill!.points.map((p, k) => <li key={k}>{L(p)}</li>)}</ul>}
            </div>
          </div>
          <div className="run-nav">
            <button className="btn ghost light" onClick={() => go(i - 1)} disabled={i === 0}>‹ {t('prev')}</button>
            <button className="btn ghost light" onClick={() => go(i + 1)}>{i === steps.length - 1 ? t('finish') : t('next') + ' ›'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
