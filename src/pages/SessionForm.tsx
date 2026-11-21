import { useState } from 'react'
import { Modal } from '../components/Modal'
import { useT } from '../hooks'
import { update, useData, setPrefs } from '../store'
import { iso, uid } from '../dates'
import type { Session, Template } from '../types'

export function SessionForm({ session, defaultDate, template, onClose }: { session?: Session; defaultDate?: string; template?: Template; onClose: () => void }) {
  const { t, L } = useT()
  const data = useData()
  const [goal, setGoal] = useState(session?.goal ?? (template ? L(template.title) : ''))
  const [date, setDate] = useState(session?.date ?? defaultDate ?? iso(new Date()))
  const [time, setTime] = useState(session?.time ?? '16:00')
  const [group, setGroup] = useState(session?.group ?? (template && data.groups.includes(template.group) ? template.group : data.groups[0] ?? 'U12'))
  const [newGroup, setNewGroup] = useState('')
  const [notes, setNotes] = useState(session?.notes ?? '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const g = newGroup.trim() || group
    const id = session?.id ?? uid()
    update((d) => {
      const groups = d.groups.includes(g) ? d.groups : [...d.groups, g]
      const phases = template ? { warm: [...template.phases.warm], main: [...template.phases.main], cool: [...template.phases.cool] } : { warm: [], main: [], cool: [] }
      const base: Session = session ?? { id, date, time, group: g, goal, phases, att: {} }
      const next = { ...base, date, time, group: g, goal: goal.trim(), notes: notes.trim() }
      return { ...d, groups, sessions: session ? d.sessions.map((s) => (s.id === id ? next : s)) : [...d.sessions, next] }
    })
    setPrefs({ selected: id, tab: 'plan' })
    onClose()
  }

  return (
    <Modal title={session ? t('edit') : template ? `${t('fromTemplate')}: ${L(template.title)}` : t('newS')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="full">{t('goal')}<input id="fs-goal" value={goal} onChange={(e) => setGoal(e.target.value)} required autoFocus /></label>
        <label>{t('date')}<input id="fs-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label>{t('time')}<input id="fs-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        <label>{t('group')}
          <select id="fs-group" value={group} onChange={(e) => setGroup(e.target.value)}>
            {data.groups.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
        <label>{t('newGroup')}<input id="fs-newgroup" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="U14" /></label>
        <label className="full">{t('notes')}<textarea id="fs-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
        <div className="row full">
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn">{t('save')}</button>
        </div>
      </form>
    </Modal>
  )
}
