import { useState } from 'react'
import { useT, useDrills, sessionMinutes } from '../hooks'
import { useData, setPrefs } from '../store'
import { addDays, iso, monday } from '../dates'
import { SessionForm } from './SessionForm'

export function Calendar() {
  const { t, days, months } = useT()
  const data = useData()
  const drills = useDrills()
  const [offset, setOffset] = useState(0)
  const [newOn, setNewOn] = useState<string | null>(null)
  const start = addDays(monday(new Date()), offset * 7)
  const today = iso(new Date())
  return (
    <>
      <div className="head">
        <div><h1>{t('cal')}</h1><p className="sub">{t('calSub')}</p></div>
        <div className="row">
          <button className="btn ghost small" onClick={() => setOffset(offset - 1)}>‹ {t('prevWeek')}</button>
          <button className="btn ghost small" onClick={() => setOffset(0)}>{t('today')}</button>
          <button className="btn ghost small" onClick={() => setOffset(offset + 1)}>{t('nextWeek')} ›</button>
        </div>
      </div>
      <div className="week">
        {days.map((name, i) => {
          const d = addDays(start, i), k = iso(d)
          const ev = data.sessions.filter((s) => s.date === k).sort((a, b) => a.time.localeCompare(b.time))
          return (
            <div key={k} className={'day' + (k === today ? ' today' : '')}>
              <h4><span>{name}</span><span className="muted">{d.getDate()} {months[d.getMonth()]}</span></h4>
              {ev.map((s) => (
                <button key={s.id} className="ev" onClick={() => setPrefs({ selected: s.id, tab: 'plan' })}>
                  <b>{s.time} · {s.group}</b>{s.goal} · {sessionMinutes(s, drills)} {t('min')}
                </button>
              ))}
              <button className="add-day" onClick={() => setNewOn(k)} aria-label={t('newS')}>+</button>
            </div>
          )
        })}
      </div>
      {newOn && <SessionForm defaultDate={newOn} onClose={() => setNewOn(null)} />}
    </>
  )
}
