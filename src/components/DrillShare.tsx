import { useEffect, useRef, useState, type RefObject } from 'react'
import { pdfName, sheetToPdf } from '../pdf'
import { createPortal } from 'react-dom'
import { DrillPitch } from './AnimatedPitch'
import { BookFrame, LineKey } from './BookPitch'
import { sceneOf } from '../scene-of'
import { narrate } from '../book/narrate'
import { bookSteps } from '../book/scene'
import { useT } from '../hooks'
import { SOURCES } from '../sources'
import { getContent } from '../content'
import { SKILLS } from '../skills'
import { ageText } from '../ages'
import { drillLink } from '../share'
import type { Drill } from '../types'

/** "PDF / print" and "send a link" for a drill. */
export function DrillShare({ drill }: { drill: Drill }) {
  const { t } = useT()
  const [busy, setBusy] = useState(false)
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!busy) return
    let live = true
    const go = async () => {
      try { if (ref.current) await sheetToPdf(ref.current, pdfName(drill.name.uz)) }
      catch { try { window.print() } catch { /* printing blocked */ } }
      finally { if (live) setBusy(false) }
    }
    void go()
    return () => { live = false }
  }, [busy, drill])

  const send = async () => {
    const url = await drillLink(drill)
    setLink(url); setCopied(false)
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> }
    if (nav.share) { try { await nav.share({ title: drill.name.uz, url }); return } catch { /* cancelled or blocked: show the link */ } }
    try { await navigator.clipboard.writeText(url); setCopied(true) } catch { /* the link stays visible to copy by hand */ }
  }

  return (
    <div className="share">
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <button className="btn ghost small" disabled={busy} onClick={() => setBusy(true)}>{busy ? '⏳ ' + t('pdfMaking') : '📄 ' + t('printPdf')}</button>
        <button className="btn ghost small" onClick={send}>🔗 {t('shareLink')}</button>
      </div>
      {link && (
        <div className="share-link">
          <p className="sub" style={{ margin: 0 }}>{copied ? '✓ ' + t('linkCopied') + '. ' : ''}{t('shareHint')}</p>
          <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
            <input id="share-url" readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
            <button className="btn small" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopied(true) } catch { (document.getElementById('share-url') as HTMLInputElement | null)?.select() } }}>{t('copy')}</button>
          </div>
        </div>
      )}
      {busy && createPortal(<PrintSheet drill={drill} sheetRef={ref} />, document.body)}
    </div>
  )
}

/** One printable page (A4): drawing, steps as small pictures with words, description, why, points, source. */
function PrintSheet({ drill, sheetRef }: { drill: Drill; sheetRef: RefObject<HTMLDivElement | null> }) {
  const { t, L, lang } = useT()
  const scene = sceneOf(drill.id)
  const ben = getContent().benefit(drill.id)
  const story = scene ? narrate(scene, lang) : []
  const n = scene ? bookSteps(scene) - 1 : 0
  return (
    <div className="print-sheet pdf-render" ref={sheetRef}>
      <header className="ps-head">
        <h1>{L(drill.name)}</h1>
        <div className="ps-meta">{t(drill.cat)} · {ageText(drill.age, t('proAges'))} · {drill.min} {t('min')}{drill.players ? ` · ${t('playersCount')}: ${drill.players}` : ''}</div>
      </header>
      <div className="ps-main"><DrillPitch id={drill.id} type={drill.dia} /></div>
      {scene && <LineKey scene={scene} label={(k) => t(({ run: 'kRun', drib: 'kDrib', pass: 'kPass', shot: 'kShot', lob: 'kLob' } as const)[k])} />}
      {L(drill.desc) && <p className="ps-desc">{L(drill.desc)}</p>}
      {scene && n > 0 && (
        <section>
          <h2>{t('stepsTitle')}</h2>
          <div className="ps-steps">
            {Array.from({ length: n }, (_, k) => (
              <figure key={k}>
                <BookFrame scene={scene} t={k} step={k} />
                <figcaption><b>{k + 1}.</b> {story[k]?.join(' ')}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      {ben && (
        <section>
          <h2>💡 {t('why')}</h2>
          <p>{lang === 'ru' ? ben[2] : ben[1]}</p>
          <p className="ps-small"><b>{t('develops')}:</b> {ben[0].map((k) => SKILLS[k][lang === 'ru' ? 1 : 0]).join(', ')}</p>
        </section>
      )}
      {drill.points && drill.points.length > 0 && (
        <section><h2>{t('points')}</h2><ul>{drill.points.map((p, i) => <li key={i}>{L(p)}</li>)}</ul></section>
      )}
      {L(drill.equip) && <p className="ps-small"><b>{t('equip')}:</b> {L(drill.equip)}</p>}
      {drill.source && SOURCES[drill.source] && <p className="ps-small">📖 {t('source')}: {SOURCES[drill.source].author}, «{SOURCES[drill.source].title}»</p>}
      <footer className="ps-foot">{t('printedFrom')}</footer>
    </div>
  )
}
