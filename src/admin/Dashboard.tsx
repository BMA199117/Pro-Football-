import { useEffect, useState } from 'react'
import { KINDS, useContent } from '../content'
import { getActivity, getOverview, type DayStat, type Overview } from './api'
import { KIND_LABEL } from './labels'
import type { Section } from './Admin'

function Tile({ n, label, sub }: { n: number | string; label: string; sub?: string }) {
  return <div className="tile"><span className="tile-n">{n}</span><span className="tile-l">{label}</span>{sub && <span className="tile-s">{sub}</span>}</div>
}

/** Daily bars for the last 30 days. */
function Chart({ days, field, label, color }: { days: DayStat[]; field: 'active' | 'signups' | 'sessions'; label: string; color: string }) {
  const max = Math.max(1, ...days.map((d) => d[field]))
  const w = 100 / days.length
  const total = days.reduce((a, d) => a + d[field], 0)
  return (
    <figure className="chart">
      <figcaption><b>{label}</b><span className="muted small"> · 30 kunda jami {total}</span></figcaption>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label={label}>
        {days.map((d, i) => {
          const h = (d[field] / max) * 36
          return <rect key={d.day} x={i * w + w * 0.15} y={40 - h} width={w * 0.7} height={Math.max(h, d[field] ? 1 : 0.4)} fill={d[field] ? color : 'var(--line)'} rx={0.6}><title>{d.day}: {d[field]}</title></rect>
        })}
      </svg>
      <div className="chart-x muted small"><span>{days[0]?.day.slice(5).split('-').reverse().join('.')}</span><span>bugun</span></div>
    </figure>
  )
}

export function Dashboard({ go }: { go: (s: Section) => void }) {
  const { all } = useContent()
  const [o, setO] = useState<Overview | null>(null)
  const [days, setDays] = useState<DayStat[]>([])
  const [err, setErr] = useState(false)
  useEffect(() => {
    getOverview().then(setO, () => setErr(true))
    getActivity(30).then(setDays, () => setErr(true))
  }, [])

  const backup = () => {
    const rows = KINDS.flatMap((k) => all[k].filter((e) => e.row).map((e) => e.row))
    const blob = new Blob([JSON.stringify({ app: 'Pro Football', at: new Date().toISOString(), rows }, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `pro-football-kontent-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }

  return (
    <>
      <div className="head"><div><h1>Umumiy ko'rinish</h1><p className="sub">Sayt va ilova holati</p></div></div>
      {err && <p className="note err">Ma'lumotni yuklab bo'lmadi. Internetni tekshiring yoki sahifani yangilang.</p>}
      <section className="panel">
        <h2>Murabbiylar</h2>
        <div className="tiles">
          <Tile n={o?.coaches ?? '…'} label="Jami murabbiylar" sub={o ? `+${o.new7} shu haftada` : undefined} />
          <Tile n={o?.activeToday ?? '…'} label="Bugun kirganlar" />
          <Tile n={o?.active7 ?? '…'} label="7 kunda faol" />
          <Tile n={o?.active30 ?? '…'} label="30 kunda faol" />
        </div>
        <div className="tiles">
          <Tile n={o?.sessions ?? '…'} label="Mashg'ulotlar" sub={o ? `+${o.sessions7} shu haftada` : undefined} />
          <Tile n={o?.players ?? '…'} label="O'yinchilar" />
          <Tile n={o?.ownDrills ?? '…'} label="Murabbiylarning o'z mashqlari" />
        </div>
        {days.length > 0 && (
          <div className="charts">
            <Chart days={days} field="active" label="Har kuni kirgan murabbiylar" color="var(--pitch)" />
            <Chart days={days} field="signups" label="Yangi ro'yxatdan o'tganlar" color="var(--blue)" />
            <Chart days={days} field="sessions" label="Yaratilgan / o'zgartirilgan mashg'ulotlar" color="var(--cone)" />
          </div>
        )}
        <div className="row" style={{ justifyContent: 'flex-start' }}><button className="btn ghost small" onClick={() => go('coaches')}>Murabbiylar ro'yxati →</button></div>
      </section>
      <section className="panel">
        <h2>Kontent</h2>
        <div className="tiles">
          {KINDS.map((k) => {
            const l = all[k]
            const changed = l.filter((e) => e.row).length
            return (
              <button key={k} className="tile link-tile" onClick={() => go(k)}>
                <span className="tile-n">{l.filter((e) => !e.hidden).length}</span>
                <span className="tile-l">{KIND_LABEL[k].many}</span>
                <span className="tile-s">{changed ? `${changed} ta o'zgarish` : "o'zgarishsiz"}</span>
              </button>
            )
          })}
        </div>
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <button className="btn ghost small" onClick={() => go('history')}>O'zgarishlar tarixi →</button>
          <button className="btn ghost small" onClick={backup}>⬇ Zaxira nusxa (JSON)</button>
        </div>
      </section>
    </>
  )
}
