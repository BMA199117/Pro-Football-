/**
 * Records a board animation as a video file on the coach's device.
 * Each frame is the same drawing as the player on screen (BookFrame), painted on a canvas
 * with the step text under the pitch; the canvas stream is recorded by the browser (MP4 where
 * the browser can, otherwise WebM). It plays in real time, so recording takes as long as the animation.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import type { BookScene } from '../book/scene'
import { narrate } from '../book/narrate'
import type { Lang } from '../types'
import { BookFrame } from './BookPitch'
import { at, timing } from './AnimatedPitch'

const W = 1280, PH = 704, CAP = 96, H = PH + CAP, FPS = 30

export const canRecord = () =>
  typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype

function pickType(): { mime: string; ext: string } {
  const list: [string, string][] = [['video/mp4;codecs=avc1', 'mp4'], ['video/mp4', 'mp4'], ['video/webm;codecs=vp9', 'webm'], ['video/webm;codecs=vp8', 'webm'], ['video/webm', 'webm']]
  for (const [m, e] of list) if (MediaRecorder.isTypeSupported?.(m)) return { mime: m, ext: e }
  return { mime: '', ext: 'webm' }
}

function svgImage(scene: BookScene, t: number, step: number, op: number): Promise<HTMLImageElement> {
  let svg = renderToStaticMarkup(<BookFrame scene={scene} t={t} step={step} stepOpacity={op} />)
  svg = svg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PH}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" `)
  return new Promise((ok, bad) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = bad
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  })
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = []
  let line = ''
  for (const w of text.split(' ')) {
    const next = line ? line + ' ' + w : w
    if (ctx.measureText(next).width > max && line) { out.push(line); line = w } else line = next
  }
  if (line) out.push(line)
  return out.length > 2 ? [out[0], out.slice(1).join(' ').slice(0, 90) + '…'] : out
}

export interface RecordOpts { scene: BookScene; lang: Lang; title: string; labels: { ready: string; end: string }; onProgress: (f: number) => void; signal: AbortSignal }

/** Plays the animation once onto a canvas and returns the recorded file. */
export async function recordScene({ scene, lang, title, labels, onProgress, signal }: RecordOpts): Promise<{ blob: Blob; ext: string }> {
  const story = narrate(scene, lang)
  const { total } = timing(scene, false)
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!
  const { mime, ext } = pickType()
  const stream = canvas.captureStream(FPS)
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined)
  const parts: Blob[] = []
  rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data) }
  const done = new Promise<void>((ok) => { rec.onstop = () => ok() })

  const paint = async (s: number) => {
    const p = at(scene, s, false)
    const img = await svgImage(scene, p.t, p.step, p.op)
    ctx.fillStyle = '#163F2A'; ctx.fillRect(0, 0, W, H)
    ctx.drawImage(img, 0, 0, W, PH)
    ctx.fillStyle = '#FFE45C'; ctx.fillRect(0, PH, W * Math.min(1, s / total), 4)
    ctx.font = '600 26px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.textBaseline = 'middle'
    const moves = scene.steps - 1
    const text = p.k < 0 ? labels.ready : p.k >= moves ? labels.end : `${p.k + 1}. ${(story[p.k] ?? []).join(' ')}`
    const lines = wrap(ctx, text, W - 300)
    ctx.fillStyle = '#fff'
    lines.forEach((l, i) => ctx.fillText(l, 28, PH + 4 + (CAP - 4) / 2 + (i - (lines.length - 1) / 2) * 32))
    ctx.font = '700 22px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,.75)'
    ctx.textAlign = 'right'
    ctx.fillText(title ? `${title} · Pro Football` : 'Pro Football', W - 28, PH + 4 + (CAP - 4) / 2)
    ctx.textAlign = 'left'
  }

  await paint(0)
  rec.start(500)
  const t0 = performance.now()
  await new Promise<void>((ok) => {
    let busy = false
    const tick = () => {
      if (signal.aborted) { ok(); return }
      const s = (performance.now() - t0) / 1000
      onProgress(Math.min(1, s / total))
      if (s > total + 0.3) { ok(); return }
      if (!busy) { busy = true; paint(Math.min(s, total)).finally(() => { busy = false }) }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  rec.stop()
  stream.getTracks().forEach((tr) => tr.stop())
  await done
  if (signal.aborted) throw new DOMException('aborted', 'AbortError')
  return { blob: new Blob(parts, { type: mime.split(';')[0] || 'video/webm' }), ext }
}

/** Saves a file through the browser's download. */
export function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
