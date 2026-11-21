import { useState } from 'react'
import { useT } from '../hooks'
import { KNOWLEDGE, TOPICS } from '../knowledge'
import { SOURCES } from '../sources'
import type { Topic } from '../types'

const TOPIC_COLOR: Record<Topic, string> = { method: 'var(--pitch)', game: 'var(--blue)', kids: 'var(--cone)', physical: 'var(--purple)' }

export function Knowledge() {
  const { t, L } = useT()
  const [topic, setTopic] = useState<Topic | 'all'>('all')
  const [open, setOpen] = useState<string | null>(null)
  const shown = KNOWLEDGE.filter((k) => topic === 'all' || k.topic === topic)
  return (
    <>
      <div className="head">
        <div><h1>{t('know')}</h1><p className="sub">{t('knowSub')}</p></div>
      </div>
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
                  <h3 className="label">{t('howTo')}</h3>
                  <ul className="points">{k.tips.map((tip, i) => <li key={i}>{L(tip)}</li>)}</ul>
                </div>
              )}
              {src && <p className="source">📖 {src.author}, «{src.title}»</p>}
            </article>
          )
        })}
      </div>
    </>
  )
}
