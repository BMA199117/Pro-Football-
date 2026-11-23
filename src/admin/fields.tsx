import { useState, type ReactNode } from 'react'
import { Video } from '../components/Video'
import { MAX_VIDEO_MB, uploadVideo } from './api'
import type { Text } from '../types'

export type Pair = [string, string]
export const toPair = (x?: Text): Pair => [x?.uz ?? '', x?.ru ?? '']
export const toText = (p: Pair): Text => ({ uz: p[0].trim(), ru: p[1].trim() })
export const cleanPairs = (l: Pair[]): Pair[] => l.map(([a, b]) => [a.trim(), b.trim()] as Pair).filter(([a, b]) => a || b)

/** One text in both languages, side by side. */
export function UzRu({ label, value, onChange, rows, required, hint }: {
  label: string; value: Pair; onChange: (v: Pair) => void; rows?: number; required?: boolean; hint?: string
}) {
  const field = (i: 0 | 1) => {
    const props = {
      value: value[i], required: required && i === 0, 'aria-label': `${label} (${i ? 'RU' : 'UZ'})`,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(i ? [value[0], e.target.value] : [e.target.value, value[1]]),
    }
    return rows ? <textarea rows={rows} {...props} /> : <input {...props} />
  }
  return (
    <fieldset className="uzru full">
      <legend>{label}{hint && <span className="muted small"> · {hint}</span>}</legend>
      <label><span className="lng">UZ</span>{field(0)}</label>
      <label><span className="lng">RU</span>{field(1)}</label>
    </fieldset>
  )
}

/** A list of texts in both languages (tips, points…), with add / move / remove. */
export function PairList({ label, value, onChange, rows = 2, hint }: { label: string; value: Pair[]; onChange: (v: Pair[]) => void; rows?: number; hint?: string }) {
  const set = (i: number, p: Pair) => onChange(value.map((x, j) => (j === i ? p : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const c = [...value];[c[i], c[j]] = [c[j], c[i]]
    onChange(c)
  }
  return (
    <fieldset className="plist full">
      <legend>{label} <span className="muted small">({value.length}){hint && ' · ' + hint}</span></legend>
      {value.map((p, i) => (
        <div className="plist-row" key={i}>
          <span className="plist-n">{i + 1}</span>
          <textarea rows={rows} value={p[0]} aria-label={`${label} ${i + 1} UZ`} placeholder="O'zbekcha" onChange={(e) => set(i, [e.target.value, p[1]])} />
          <textarea rows={rows} value={p[1]} aria-label={`${label} ${i + 1} RU`} placeholder="Русский" onChange={(e) => set(i, [p[0], e.target.value])} />
          <div className="plist-ctl">
            <button type="button" className="icon-btn" title="Yuqoriga" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" className="icon-btn" title="Pastga" onClick={() => move(i, 1)} disabled={i === value.length - 1}>↓</button>
            <button type="button" className="icon-btn danger" title="O'chirish" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn ghost small add-row" onClick={() => onChange([...value, ['', '']])}>+ Qo'shish</button>
    </fieldset>
  )
}

/** Pick several keys (chips). */
export function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: [T, string][]; value: T[]; onChange: (v: T[]) => void }) {
  return (
    <fieldset className="full chips-pick">
      <legend>{label}</legend>
      <div className="filters">
        {options.map(([k, l]) => (
          <button type="button" key={k} aria-pressed={value.includes(k)} onClick={() => onChange(value.includes(k) ? value.filter((x) => x !== k) : [...value, k])}>{l}</button>
        ))}
      </div>
    </fieldset>
  )
}

export function Field({ label, children, full, hint }: { label: string; children: ReactNode; full?: boolean; hint?: string }) {
  return <label className={full ? 'full' : undefined}><span>{label}{hint && <span className="muted small">{hint}</span>}</span>{children}</label>
}

/** Bottom bar of every editor: draft switch, cancel, save. */
export function EditorFoot({ hidden, setHidden, busy, onCancel, err }: { hidden: boolean; setHidden: (v: boolean) => void; busy: boolean; onCancel: () => void; err: string | null }) {
  return (
    <div className="ed-foot full">
      {err && <p className="note err">{err}</p>}
      <label className="tog-line"><input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> Qoralama: murabbiylar hozircha ko'rmaydi</label>
      <div className="row">
        <button type="button" className="btn ghost" onClick={onCancel}>Bekor qilish</button>
        <button className="btn" disabled={busy}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
      </div>
    </div>
  )
}

export const SAVE_ERR: Record<string, string> = {
  notAdmin: "Saqlanmadi: bu hisobda admin huquqi yo'q.",
  noNet: "Saqlanmadi: internet yo'q. Ulanib, qayta urinib ko'ring.",
  error: "Saqlanmadi: serverda xatolik. Birozdan keyin qayta urinib ko'ring.",
}

/** Video: upload a file or paste a YouTube link. */
export function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const pick = async (f?: File) => {
    if (!f) return
    setBusy(true); setErr(null)
    const r = await uploadVideo(f)
    setBusy(false)
    if (r.url) onChange(r.url); else setErr(r.error ?? 'Xatolik')
  }
  return (
    <fieldset className="full plist">
      <legend>Video <span className="muted small">· ixtiyoriy</span></legend>
      <div className="vfield">
        {value ? <Video url={value} /> : <p className="muted small" style={{ margin: 0 }}>Video yo'q. Telefon yoki kompyuterdan video fayl yuklang (eng ko'pi {MAX_VIDEO_MB} MB) yoki YouTube havolasini qo'ying.</p>}
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <label className="btn small" style={{ cursor: busy ? 'default' : 'pointer' }}>
            {busy ? 'Yuklanmoqda…' : value ? '📤 Boshqa video yuklash' : '📤 Video fayl yuklash'}
            <input type="file" accept="video/mp4,video/webm,video/quicktime" hidden disabled={busy} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
          </label>
          {value && <button type="button" className="btn ghost small danger" onClick={() => onChange('')}>Videoni olib tashlash</button>}
        </div>
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <input className="search wide" placeholder="yoki YouTube havolasi: https://youtu.be/..." value={link} onChange={(e) => setLink(e.target.value)} aria-label="YouTube havolasi" />
          <button type="button" className="btn ghost small" onClick={() => {
            const v = link.trim()
            if (!/^https:\/\//.test(v)) { setErr('Havola https:// bilan boshlanishi kerak.'); return }
            setErr(null); onChange(v); setLink('')
          }}>Qo'yish</button>
        </div>
        {err && <p className="note err">{err}</p>}
      </div>
    </fieldset>
  )
}
