import { useState } from 'react'
import { Ic } from './Icon'
import { useT } from '../hooks'
import { update } from '../store'
import { Modal } from './Modal'
import { Pitch } from './Pitch'
import { BookStatic } from './BookPitch'
import { Board } from './Board'
import { uid } from '../dates'
import { CATEGORIES, type Category, type Diagram, type Drill } from '../types'
import type { BookScene } from '../book/scene'

const DIAGRAMS: Diagram[] = ['pass', 'dribble', 'rondo', 'smallgame', 'shoot', 'duel', 'overload', 'sprint', 'warmup', 'gk']

/** Add or edit the coach's own drill; its drawing is made on the tactics board. */
export function DrillForm({ drill, onClose, onSaved }: { drill?: Drill; onClose: () => void; onSaved?: (d: Drill) => void }) {
  const { t, L } = useT()
  const [f, setF] = useState({
    name: drill ? L(drill.name) : '', desc: drill ? L(drill.desc) : '', cat: drill?.cat ?? ('tech' as Category), dia: drill?.dia ?? ('pass' as Diagram),
    min: drill?.min ?? 10, age: drill?.age ?? 'U10–U14', equip: drill && L(drill.equip) !== '—' ? L(drill.equip) : '', points: (drill?.points ?? []).map(L).join('\n'),
  })
  const [scene, setScene] = useState<BookScene | undefined>(drill?.scene)
  const [drawing, setDrawing] = useState(false)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: k === 'min' ? Number(e.target.value) : e.target.value })
  const both = (s: string) => ({ uz: s, ru: s })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const d: Drill = {
      id: drill?.id ?? uid(), cat: f.cat, dia: f.dia, age: f.age, min: f.min || 10, name: both(f.name.trim()), desc: both(f.desc.trim()), equip: both(f.equip.trim() || '—'),
      points: f.points.split('\n').map((x) => x.trim()).filter(Boolean).map(both), custom: true, ...(scene ? { scene } : {}),
    }
    update((x) => ({ ...x, customDrills: drill ? x.customDrills.map((y) => (y.id === d.id ? d : y)) : [d, ...x.customDrills] }))
    onSaved?.(d)
    onClose()
  }
  return (
    <Modal title={drill ? t('edit') : t('own')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="full">{t('name')}<input id="fd-name" value={f.name} onChange={set('name')} required autoFocus /></label>
        <div className="full fd-draw">
          {scene ? <BookStatic scene={scene} maxHeight={150} /> : <p className="muted">{t('ownDrawing')}: —</p>}
          <button type="button" className="btn small" onClick={() => setDrawing(true)}><Ic n="edit" />{scene ? t('redraw') : t('drawBoard')}</button>
        </div>
        <label className="full">{t('desc')}<textarea id="fd-desc" rows={3} value={f.desc} onChange={set('desc')} /></label>
        <label>{t('cat')}<select id="fd-cat" value={f.cat} onChange={set('cat')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select></label>
        <label>{t('min')}<input id="fd-min" type="number" min={1} value={f.min} onChange={set('min')} /></label>
        <label>{t('age')}<input id="fd-age" value={f.age} onChange={set('age')} /></label>
        <label>{t('equip')}<input id="fd-eq" value={f.equip} onChange={set('equip')} /></label>
        <label className="full">{t('points')}<textarea id="fd-points" rows={3} value={f.points} onChange={set('points')} placeholder="1 qator = 1 maslahat" /></label>
        {!scene && (
          <div className="full">
            <div className="dia-pick">
              {DIAGRAMS.map((d) => (
                <button type="button" key={d} aria-pressed={f.dia === d} onClick={() => setF({ ...f, dia: d })}><Pitch type={d} maxHeight={50} /></button>
              ))}
            </div>
          </div>
        )}
        <div className="row full">
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn">{t('save')}</button>
        </div>
      </form>
      {drawing && <Board initial={scene} name={f.name} onClose={() => setDrawing(false)} onSave={(sc, name) => { setScene(sc); setF((x) => ({ ...x, name })); setDrawing(false) }} />}
    </Modal>
  )
}
