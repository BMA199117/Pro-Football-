import { useState } from 'react'
import { useT } from '../hooks'
import { update, useData, usePrefs, setPrefs } from '../store'
import { Modal } from '../components/Modal'
import { EmptyState } from '../components/Icon'
import { parse, uid } from '../dates'
import { allGroups } from '../groups'
import type { Player } from '../types'

export function Team() {
  const { t, months } = useT()
  const data = useData()
  const { selected } = usePrefs()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Player | null>(null)
  const sorted = [...data.sessions].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const s = sorted.find((x) => x.id === selected) ?? sorted[0]
  const [groupPick, setGroupPick] = useState(data.groups[0] ?? 'U12')
  const group = s?.group ?? groupPick
  const players = data.players.filter((p) => p.group === group).sort((a, b) => a.num - b.num)
  const marked = data.sessions.filter((x) => x.group === group && Object.keys(x.att).length > 0)
  const rate = (pid: string) => marked.length ? Math.round((marked.filter((x) => x.att[pid]).length / marked.length) * 100) : 0
  const came = s ? players.filter((p) => s.att[p.id]).length : 0
  const toggle = (pid: string) => s && update((d) => ({ ...d, sessions: d.sessions.map((x) => (x.id === s.id ? { ...x, att: { ...x.att, [pid]: !x.att[pid] } } : x)) }))

  return (
    <>
      <div className="head">
        <div><h1>{t('team')} · {group}</h1><p className="sub">{t('teamSub')}</p></div>
        <button className="btn" onClick={() => setAdding(true)}>+ {t('addPlayer')}</button>
      </div>
      <div className="panel">
        <div className="head">
          {s ? (
            <label className="inline">{t('session')}:
              <select className="sel" id="att-session" value={s.id} onChange={(e) => setPrefs({ selected: e.target.value })}>
                {sorted.map((x) => { const d = parse(x.date); return <option key={x.id} value={x.id}>{d.getDate()} {months[d.getMonth()]} · {x.group} · {x.goal}</option> })}
              </select>
            </label>
          ) : (
            <label className="inline">{t('group')}:
              <select className="sel" id="team-group" value={groupPick} onChange={(e) => setGroupPick(e.target.value)}>
                {allGroups(data.groups).map((g) => <option key={g}>{g}</option>)}
              </select>
            </label>
          )}
          {s && <span className="chip">{came}/{players.length} {t('present')}</span>}
        </div>
        {players.length === 0 ? (
          <EmptyState icon="user" title={t('esPlayersT')} text={t('esPlayers')}>
            <button className="btn" onClick={() => setAdding(true)}>+ {t('addPlayer')}</button>
          </EmptyState>
        ) : (
          <div className="tw">
            <table>
              <thead><tr><th>{t('num')}</th><th>{t('pname')}</th><th>{t('pos')}</th>{s && <th>{t('session')}</th>}<th>{t('rate')}</th></tr></thead>
              <tbody>
                {players.map((p) => {
                  const on = !!s?.att[p.id]
                  const r = rate(p.id)
                  return (
                    <tr key={p.id}>
                      <td className="num">{p.num}</td>
                      <td><button className="link" onClick={() => setEditing(p)}>{p.name}</button></td>
                      <td>{p.pos}</td>
                      {s && <td><button className="tog" aria-pressed={on} onClick={() => toggle(p.id)}>{on ? t('came') : t('absent')}</button></td>}
                      <td><div className="pct"><div className="bar"><i style={{ width: `${r}%`, background: 'var(--ok)' }} /></div><span className="num">{r}%</span></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {(adding || editing) && <PlayerForm player={editing ?? undefined} group={group} onClose={() => { setAdding(false); setEditing(null) }} />}
    </>
  )
}

function PlayerForm({ player, group, onClose }: { player?: Player; group: string; onClose: () => void }) {
  const { t } = useT()
  const data = useData()
  const [name, setName] = useState(player?.name ?? '')
  const [num, setNum] = useState(player?.num ?? 10)
  const [pos, setPos] = useState<Player['pos']>(player?.pos ?? 'MF')
  const [grp, setGrp] = useState(player?.group ?? group)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Player = { id: player?.id ?? uid(), name: name.trim(), num, pos, group: grp }
    update((d) => ({ ...d, groups: d.groups.includes(grp) ? d.groups : [...d.groups, grp], players: player ? d.players.map((p) => (p.id === next.id ? next : p)) : [...d.players, next] }))
    onClose()
  }
  const remove = () => { if (player) update((d) => ({ ...d, players: d.players.filter((p) => p.id !== player.id) })); onClose() }
  return (
    <Modal title={player ? t('edit') : t('addPlayer')} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="full">{t('fullName')}<input id="fp-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus /></label>
        <label>{t('num')}<input id="fp-num" type="number" min={1} max={99} value={num} onChange={(e) => setNum(Number(e.target.value))} /></label>
        <label>{t('pos')}<select id="fp-pos" value={pos} onChange={(e) => setPos(e.target.value as Player['pos'])}>{['GK', 'DF', 'MF', 'FW'].map((p) => <option key={p}>{p}</option>)}</select></label>
        <label className="full">{t('group')}<select id="fp-group" value={grp} onChange={(e) => setGrp(e.target.value)}>{allGroups(data.groups).map((g) => <option key={g}>{g}</option>)}</select></label>
        <div className="row full">
          {player && <button type="button" className="btn ghost danger" onClick={remove}>{t('del')}</button>}
          <button type="button" className="btn ghost" onClick={onClose}>{t('cancel')}</button>
          <button className="btn">{t('save')}</button>
        </div>
      </form>
    </Modal>
  )
}
