import { useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { saveItem, getContent, isBuiltin, resetItem, setHidden, KINDS, type Entry, type ItemOf, type Kind, type SaveResult } from '../content'
import { getEmails, getHistory, when, type HistoryRow } from './api'
import { KIND_LABEL, describe } from './labels'
import { SAVE_ERR } from './fields'

function action(r: HistoryRow): string {
  if (r.deleted) return isBuiltin(r.kind, r.id) ? 'Asl holiga qaytarildi' : "Butunlay o'chirildi"
  if (r.hidden) return r.data ? "O'chirildi (yoki qoralama)" : "O'chirildi"
  return 'Saqlandi'
}

function titleOf(r: HistoryRow): string {
  if (r.data && typeof r.data === 'object') { try { return describe(r.kind, r.data as ItemOf[Kind])[0] } catch { /* old shape */ } }
  const cur = (getContent().all[r.kind] as Entry<Kind>[]).find((e) => e.item.id === r.id)
  return cur ? describe(r.kind, cur.item)[0] : r.id
}

/** Put an earlier version back. */
function restore(r: HistoryRow): Promise<SaveResult> {
  if (r.deleted) return resetItem(r.kind, r.id)
  if (r.data) return saveItem(r.kind, r.data as ItemOf[Kind], r.hidden)
  return setHidden(r.kind, r.id, r.hidden)
}

function Rows({ rows, emails, showKind, onRestored }: { rows: HistoryRow[]; emails: Map<string, string>; showKind: boolean; onRestored: (msg: string, err?: boolean) => void }) {
  const [busy, setBusy] = useState<number | null>(null)
  return (
    <div className="adm-list">
      {rows.map((r, i) => (
        <article key={r.n} className="adm-row hist">
          <div className="adm-main">
            <b>{titleOf(r)}</b>
            <span className="muted small">{showKind && <>{KIND_LABEL[r.kind]?.one} · </>}{action(r)} · {when(r.changed_at)} · {r.changed_by ? emails.get(r.changed_by) ?? '—' : '—'}</span>
          </div>
          <div className="adm-act">
            {(!showKind ? i > 0 : true) && (
              <button className="btn ghost small" disabled={busy === r.n} onClick={async () => {
                setBusy(r.n)
                const e = await restore(r)
                setBusy(null)
                onRestored(e ? SAVE_ERR[e] : `«${titleOf(r)}»: ${when(r.changed_at)} dagi holat tiklandi.`, !!e)
              }}>Shu holatni tiklash</button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

/** All recent content changes. */
export function History() {
  const [rows, setRows] = useState<HistoryRow[] | null>(null)
  const [emails, setEmails] = useState(new Map<string, string>())
  const [kind, setKind] = useState<Kind | ''>('')
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  const [err, setErr] = useState(false)
  const load = () => getHistory(200, kind || undefined).then(setRows, () => setErr(true))
  useEffect(() => { load(); getEmails().then(setEmails) }, [kind]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="head"><div><h1>O'zgarishlar tarixi</h1><p className="sub">Har bir saqlash, o'chirish va qaytarish shu yerda yoziladi. Xohlagan eski holatni tiklash mumkin.</p></div></div>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      <div className="filters">
        <button aria-pressed={kind === ''} onClick={() => setKind('')}>Hammasi</button>
        {KINDS.map((k) => <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>{KIND_LABEL[k].many}</button>)}
      </div>
      {err && <p className="note err">Tarixni yuklab bo'lmadi.</p>}
      {rows && rows.length === 0 && <p className="muted">Hali o'zgarish yo'q.</p>}
      {rows && <Rows rows={rows} emails={emails} showKind onRestored={(text, e) => { setMsg({ text, err: e }); load() }} />}
    </>
  )
}

/** Versions of one item. */
export function ItemHistory({ kind, entry, onClose }: { kind: Kind; entry: Entry<Kind>; onClose: () => void }) {
  const [rows, setRows] = useState<HistoryRow[] | null>(null)
  const [emails, setEmails] = useState(new Map<string, string>())
  const [msg, setMsg] = useState<{ text: string; err?: boolean } | null>(null)
  const load = () => getHistory(50, kind, entry.item.id).then(setRows, () => setRows([]))
  useEffect(() => { load(); getEmails().then(setEmails) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Modal title={`Tarix: ${describe(kind, entry.item)[0]}`} onClose={onClose}>
      <p className="muted small">Eng yangisi tepada. «Shu holatni tiklash» o'sha paytdagi variantni qaytaradi.</p>
      {msg && <p className={'note' + (msg.err ? ' err' : ' ok')}>{msg.text}</p>}
      {rows ? <Rows rows={rows} emails={emails} showKind={false} onRestored={(text, e) => { setMsg({ text, err: e }); load() }} /> : <p className="muted">Yuklanmoqda…</p>}
      <div className="row"><button className="btn ghost" onClick={onClose}>Yopish</button></div>
    </Modal>
  )
}
