import { useState } from 'react'
import { resetItem, setHidden, useContent, type Entry, type Kind, type SaveResult } from '../content'
import { DrillPitch } from '../components/AnimatedPitch'
import { EDITORS } from './editors'
import { KIND_LABEL, describe, haystack } from './labels'
import { SAVE_ERR } from './fields'
import { ItemHistory } from './History'

type Filter = 'all' | 'book' | 'new' | 'changed' | 'hidden'
const FILTERS: [Filter, string][] = [['all', 'Hammasi'], ['book', 'Asl (kitobdan)'], ['changed', "O'zgartirilgan"], ['new', "Siz qo'shgan"], ['hidden', "O'chirilgan / qoralama"]]
const PAGE = 40

export function ContentList({ kind }: { kind: Kind }) {
  const { all } = useContent()
  const list = all[kind] as Entry<Kind>[]
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editing, setEditing] = useState<Entry<Kind> | 'new' | null>(null)
  const [historyOf, setHistoryOf] = useState<Entry<Kind> | null>(null)
  const [limit, setLimit] = useState(PAGE)
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const L = KIND_LABEL[kind]

  const match = (f: Filter, e: Entry<Kind>) =>
    f === 'all' ? true : f === 'book' ? e.builtin && !e.changed && !e.hidden : f === 'changed' ? e.builtin && e.changed : f === 'new' ? !e.builtin : e.hidden
  const fits = (e: Entry<Kind>) => match(filter, e)
  const count = (f: Filter) => list.filter((e) => match(f, e)).length
  const shown = list.filter((e) => fits(e) && (q === '' || haystack(kind, e.item).includes(q.toLowerCase())))

  const act = async (id: string, fn: () => Promise<SaveResult>, ok: string) => {
    setBusy(id)
    const r = await fn()
    setBusy(null)
    setMsg(r ? { text: SAVE_ERR[r], err: true } : { text: ok })
  }

  if (editing) {
    const Editor = EDITORS[kind] as (p: { entry?: Entry<Kind>; onDone: () => void }) => React.ReactNode
    const title = editing === 'new' ? L.add : describe(kind, editing.item)[0]
    return (
      <>
        <div className="head">
          <div>
            <button className="linkish" onClick={() => setEditing(null)}>← {L.many}</button>
            <h1>{title}</h1>
            {editing !== 'new' && <p className="sub muted small">ID: {editing.item.id}</p>}
          </div>
        </div>
        <div className="panel"><Editor entry={editing === 'new' ? undefined : editing} onDone={() => { setEditing(null); setMsg({ text: 'Saqlandi. Murabbiylar ilovasida darhol ko\'rinadi.' }) }} /></div>
      </>
    )
  }

  return (
    <>
      <div className="head">
        <div><h1>{L.many}</h1><p className="sub">{list.filter((e) => !e.hidden).length} ta ko'rinadi · jami {list.length}</p></div>
        <button className="btn" onClick={() => { setEditing('new'); setMsg(null) }}>+ {L.add}</button>
      </div>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')} role="status">{msg.text}</p>}
      <div className="filters">
        <input className="search" placeholder="Qidirish…" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE) }} aria-label="Qidirish" />
        {FILTERS.map(([f, l]) => <button key={f} aria-pressed={filter === f} onClick={() => { setFilter(f); setLimit(PAGE) }}>{l} <span className="cnt">{count(f)}</span></button>)}
      </div>
      {shown.length === 0 && <p className="muted">Hech narsa topilmadi.</p>}
      <div className="adm-list">
        {shown.slice(0, limit).map((e) => {
          const [title, sub] = describe(kind, e.item)
          const id = e.item.id
          return (
            <article key={id} className={'adm-row' + (e.hidden ? ' is-hidden' : '')}>
              {kind === 'drill' && <div className="adm-thumb"><DrillPitch id={id} type={(e.item as Entry<'drill'>['item']).dia} maxHeight={56} /></div>}
              <div className="adm-main">
                <b>{title || <span className="muted">(nomsiz)</span>}</b>
                <span className="muted small">{sub}</span>
                <span className="badges">
                  {e.builtin ? <span className="badge">kitobdan</span> : <span className="badge blue">siz qo'shgan</span>}
                  {e.builtin && e.changed && <span className="badge cone">o'zgartirilgan</span>}
                  {e.hidden && <span className="badge gray">{e.builtin || !e.row ? "o'chirilgan" : "o'chirilgan / qoralama"}</span>}
                </span>
              </div>
              <div className="adm-act">
                <button className="btn small" onClick={() => { setEditing(e); setMsg(null) }}>Tahrirlash</button>
                {e.hidden
                  ? <button className="btn ghost small" disabled={busy === id} onClick={() => act(id, () => setHidden(kind, id, false), `«${title}» yana ko'rinadi.`)}>Qaytarish</button>
                  : <button className="btn ghost small danger" disabled={busy === id} onClick={() => act(id, () => setHidden(kind, id, true), `«${title}» o'chirildi. Murabbiylar endi ko'rmaydi. Kerak bo'lsa «O'chirilgan» ro'yxatidan qaytarasiz.`)}>O'chirish</button>}
                <details className="adm-more">
                  <summary className="btn ghost small" aria-label="Yana">⋯</summary>
                  <div className="adm-menu">
                    {e.row && <button onClick={() => setHistoryOf(e)}>O'zgarishlar tarixi</button>}
                    {e.builtin && (e.changed || e.hidden) && (
                      <button disabled={busy === id} onClick={() => act(id, () => resetItem(kind, id), `«${title}» asl (kitobdagi) holiga qaytdi.`)}>Asl holiga qaytarish</button>
                    )}
                    {!e.builtin && (
                      <ConfirmInline label="Butunlay o'chirish" onYes={() => act(id, () => resetItem(kind, id), `«${title}» butunlay o'chirildi.`)} />
                    )}
                    {!e.row && !e.builtin && <span className="muted small">—</span>}
                    {!e.row && e.builtin && <span className="muted small">Hali o'zgartirilmagan</span>}
                  </div>
                </details>
              </div>
            </article>
          )
        })}
      </div>
      {shown.length > limit && <button className="btn ghost" onClick={() => setLimit(limit + PAGE * 2)}>Yana ko'rsatish ({shown.length - limit})</button>}
      {historyOf && <ItemHistory kind={kind} entry={historyOf} onClose={() => setHistoryOf(null)} />}
    </>
  )
}

function ConfirmInline({ label, onYes }: { label: string; onYes: () => void }) {
  const [ask, setAsk] = useState(false)
  if (!ask) return <button className="danger-t" onClick={() => setAsk(true)}>{label}</button>
  return (
    <span className="confirm-inline">
      <span className="small">Qaytarib bo'lmaydi. Rostdanmi?</span>
      <button className="danger-t" onClick={onYes}>Ha, o'chirish</button>
      <button onClick={() => setAsk(false)}>Yo'q</button>
    </span>
  )
}
