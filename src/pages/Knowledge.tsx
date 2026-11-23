import { useState } from 'react'
import { useT } from '../hooks'
import { TOPICS } from '../knowledge'
import { useContent } from '../content'
import { Video } from '../components/Video'
import type { Topic } from '../types'
import { DEV_AREA_LABELS, DEV_SOURCES, type DevArea, type DevText } from '../development'

const TOPIC_COLOR: Record<Topic, string> = { method: 'var(--pitch)', game: 'var(--blue)', kids: 'var(--cone)', physical: 'var(--purple)' }

export function Knowledge() {
  const { t, L } = useT()
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)
  const [view, setView] = useState<'tips' | 'stages' | 'principles'>('tips')
  const { cards: KNOWLEDGE, sources: SOURCES } = useContent()
  const shown = KNOWLEDGE.filter((k) => topic === 'all' || k.topic === topic)
  return (
    <>
      <div className="head">
        <div><h1>{t('know')}</h1><p className="sub">{t('knowSub')}</p></div>
      </div>
      <div className="libtabs" role="group">
        {(['tips', 'stages', 'principles'] as const).map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{t(v)}</button>
        ))}
      </div>
      {view === 'stages' && <Stages />}
      {view === 'principles' && <Principles />}
      {view === 'tips' && <>
      <div className="filters">
        {(['all', ...TOPICS] as const).map((c) => (
          <button key={c} aria-pressed={topic === c} onClick={() => setTopic(c)}>{t(c)}</button>
        ))}
      </div>
      <div className="know-list">
        {shown.map((k) => {
          const isOpen = open === k.id
          const src = SOURCES[k.source]
          return (
            <article key={k.id} className="know" style={{ borderLeftColor: TOPIC_COLOR[k.topic] }}>
              <button className="know-h" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : k.id)}>
                <span className="know-topic" style={{ color: TOPIC_COLOR[k.topic] }}>{t(k.topic)}</span>
                <span className="know-title">{L(k.title)}</span>
                <span className="know-arrow">{isOpen ? '−' : '+'}</span>
              </button>
              <p className="know-idea">{L(k.idea)}</p>
              {isOpen && (
                <div className="know-more">
                  {k.video && <Video url={k.video} />}
                  <h3 className="label">{t('howTo')}</h3>
                  <ul className="points">{k.tips.map((tip, i) => <li key={i}>{L(tip)}</li>)}</ul>
                </div>
              )}
              {src && <p className="source">📖 {src.author}, «{src.title}»</p>}
            </article>
          )
        })}
      </div>
      </>}
    </>
  )
}

const D = (lang: 'uz' | 'ru', x: DevText) => (lang === 'uz' ? x[0] : x[1])
const AREAS: DevArea[] = ['technical', 'tactical', 'physical', 'mental']

function SourceLinks({ ids }: { ids: string[] }) {
  const { t } = useT()
  const list = DEV_SOURCES.filter((s) => ids.includes(s.id))
  if (!list.length) return null
  return (
    <p className="source">🔗 {t('source')}: {list.map((s, i) => (
      <span key={s.id}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noreferrer">{s.org}: {s.title}</a></span>
    ))}</p>
  )
}

function Stages() {
  const { t, lang } = useT()
  const { stages: DEV_STAGES } = useContent()
  const [id, setId] = useState(DEV_STAGES[0]?.id)
  const st = DEV_STAGES.find((s) => s.id === id) ?? DEV_STAGES[0]
  if (!st) return null
  const L = (x: DevText) => D(lang, x)
  return (
    <>
      <p className="sub">{t('stagesSub')}</p>
      <div className="ages" role="group">
        {DEV_STAGES.map((s) => (
          <button key={s.id} aria-pressed={s.id === id} onClick={() => setId(s.id)}>{s.ages} {t('years')}<span className="yrs">{L(s.title)}</span></button>
        ))}
      </div>
      <article className="stage">
        <h2 className="band-h">{L(st.title)} <span>· {st.ages} {t('years')}</span></h2>
        <p className="lead">🎯 {L(st.goal)}</p>
        <h3 className="label">{t('profile')}</h3>
        <ul className="points">{st.profile.map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
        <div className="stage-grid">
          {AREAS.map((a) => (
            <div key={a} className="stage-area">
              <h3 className="label">{L(DEV_AREA_LABELS[a])}</h3>
              <ul className="points">{st.focus[a].map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
            </div>
          ))}
        </div>
        <h3 className="label">{t('formats')}</h3>
        <ul className="points">{st.formats.map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
        <h3 className="label">{t('sessionModel')}</h3>
        <p>{L(st.session)}</p>
        <div className="stage-grid two">
          <div className="stage-area do"><h3 className="label">✓ {t('coachDo')}</h3><ul className="points">{st.coachDo.map((x, i) => <li key={i}>{L(x)}</li>)}</ul></div>
          <div className="stage-area avoid"><h3 className="label">✕ {t('coachAvoid')}</h3><ul className="points">{st.coachAvoid.map((x, i) => <li key={i}>{L(x)}</li>)}</ul></div>
        </div>
        <h3 className="label">{t('heading')}</h3>
        <p>{L(st.heading)}</p>
        <SourceLinks ids={st.sources} />
      </article>
    </>
  )
}

function Principles() {
  const { t, lang } = useT()
  const [open, setOpen] = useState<string | null>(null)
  const { principles: DEV_PRINCIPLES } = useContent()
  const L = (x: DevText) => D(lang, x)
  return (
    <div className="know-list">
      {DEV_PRINCIPLES.map((p) => {
        const isOpen = open === p.id
        return (
          <article key={p.id} className="know">
            <button className="know-h" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)}>
              <span className="know-topic" style={{ color: 'var(--pitch)' }}>{t('principles')}</span>
              <span className="know-title">{L(p.title)}</span>
              <span className="know-arrow">{isOpen ? '−' : '+'}</span>
            </button>
            <p className="know-idea">{L(p.idea)}</p>
            {isOpen && <div className="know-more"><h3 className="label">{t('howTo')}</h3><ul className="points">{p.tips.map((x, i) => <li key={i}>{L(x)}</li>)}</ul></div>}
            <SourceLinks ids={p.sources} />
          </article>
        )
      })}
    </div>
  )
}
