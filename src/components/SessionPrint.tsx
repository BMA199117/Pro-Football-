import { useEffect, useRef, useState, type RefObject } from 'react'
import { Ic } from './Icon'
import { pdfName, sheetToPdf } from '../pdf'
import { createPortal } from 'react-dom'
import { DrillPitch } from './AnimatedPitch'
import { useT } from '../hooks'
import { SOURCES } from '../sources'
import { weekdayIndex } from '../dates'
import { PHASES, type Drill, type Session } from '../types'

/** "Konspekt PDF" button: the whole session on A4 (header, the three parts with every drill's drawing and text, notes). */
export function SessionPrintButton({ session, byId }: { session: Session; byId: Map<string, Drill> }) {
  const { t } = useT()
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!busy) return
    let live = true
    const go = async () => {
      try { if (ref.current) await sheetToPdf(ref.current, pdfName(`konspekt-${session.date}-${session.goal}`), `📄 ${t('konspektTitle')} · ${session.date}${session.goal ? ' · ' + session.goal : ''}`) }
      catch { try { window.print() } catch { /* printing blocked */ } }
      finally { if (live) setBusy(false) }
    }
    void go()
    return () => { live = false }
  }, [busy, session])
  return (
    <>
      <button className="btn ghost small" disabled={busy} onClick={() => setBusy(true)}>{busy ? '⏳ ' + t('pdfMaking') : <><Ic n="file" />{t('konspekt')}</>}</button>
      {busy && createPortal(<SessionSheet sheetRef={ref} session={session} byId={byId} />, document.body)}
    </>
  )
}

function SessionSheet({ session: s, byId, sheetRef }: { session: Session; byId: Map<string, Drill>; sheetRef: RefObject<HTMLDivElement | null> }) {
  const { t, L, days, months } = useT()
  const [y, m, d] = s.date.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const mins = (ids: string[]) => ids.reduce((a, id) => a + (byId.get(id)?.min ?? 0), 0)
  const total = PHASES.reduce((a, p) => a + mins(s.phases[p]), 0)
  const srcs = [...new Set(PHASES.flatMap((p) => s.phases[p]).map((id) => byId.get(id)?.source).filter((x): x is string => !!x && !!SOURCES[x]))]
  let n = 0
  return (
    <div className="print-sheet konspekt pdf-render" ref={sheetRef}>
      <header className="ps-head">
        <div className="ps-small">{t('konspektTitle')}</div>
        <h1>{s.goal}</h1>
        <table className="ks-meta"><tbody>
          <tr><th>{t('date')}</th><td>{days[weekdayIndex(date)]}, {d} {months[m - 1]} {y}</td><th>{t('time')}</th><td>{s.time}</td></tr>
          <tr><th>{t('group')}</th><td>{s.group}</td><th>{t('total')}</th><td>{total} {t('min')}</td></tr>
          <tr><th>{t('warm')}</th><td>{mins(s.phases.warm)} {t('min')}</td><th>{t('main')} / {t('cool')}</th><td>{mins(s.phases.main)} / {mins(s.phases.cool)} {t('min')}</td></tr>
        </tbody></table>
        {s.notes && <p className="ps-desc">{s.notes}</p>}
      </header>
      {PHASES.map((p) => (
        <section key={p} className="ks-phase">
          <h2>{t(p)} · {mins(s.phases[p])} {t('min')}</h2>
          {s.phases[p].length === 0 && <p className="ps-small">—</p>}
          {s.phases[p].map((id, i) => {
            const dr = byId.get(id)
            if (!dr) return null
            n++
            return (
              <article className="ks-drill" key={id + i}>
                <div className="ks-pic"><DrillPitch id={dr.id} type={dr.dia} /></div>
                <div className="ks-text">
                  <h3>{n}. {L(dr.name)} <span className="ks-min">{dr.min}′</span></h3>
                  <div className="ps-small">{t(dr.cat)}{dr.players ? ` · ${t('playersCount')}: ${dr.players}` : ''}{L(dr.equip) ? ` · ${L(dr.equip)}` : ''}</div>
                  {L(dr.desc) && <p>{L(dr.desc)}</p>}
                  {dr.points && dr.points.length > 0 && <ul>{dr.points.map((q, j) => <li key={j}>{L(q)}</li>)}</ul>}
                </div>
              </article>
            )
          })}
        </section>
      ))}
      <section className="ks-notes">
        <h2>{t('notes')}</h2>
        {Array.from({ length: 5 }, (_, i) => <div key={i} className="ks-line" />)}
      </section>
      {srcs.length > 0 && <p className="ps-small"><Ic n="book" /> {t('source')}: {srcs.map((k) => `${SOURCES[k].author}, «${SOURCES[k].title}»`).join('; ')}</p>}
      <footer className="ps-foot">{t('printedFrom')}</footer>
    </div>
  )
}
