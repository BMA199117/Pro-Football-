import { useMemo, useState } from 'react'
import { BOOK_SCENES } from '../book'
import type { BookScene } from '../book/scene'
import { BookStatic } from '../components/BookPitch'
import { BookPlayer } from '../components/AnimatedPitch'
import { Board } from '../components/Board'
import { Pitch } from '../components/Pitch'
import { Modal } from '../components/Modal'
import { getContent, isBuiltin, newId, saveItem, useContent, type Entry, type ItemOf, type Kind, type SaveResult } from '../content'
import { SKILLS, type SkillKey } from '../skills'
import { DEV_AREA_LABELS, DEV_SOURCES, type DevArea } from '../development'
import { TOPICS } from '../knowledge'
import { CATEGORIES, PHASES, type Diagram, type Phase } from '../types'
import { CAT_UZ, TOPIC_UZ } from './labels'
import { Chips, EditorFoot, Field, PairList, SAVE_ERR, UzRu, VideoField, cleanPairs, toPair, toText, type Pair } from './fields'

type Props<K extends Kind> = { entry?: Entry<K>; onDone: () => void }

/** Shared save logic for every editor. */
function useSave(kind: Kind, hidden0: boolean, onDone: () => void) {
  const [hidden, setHidden] = useState(hidden0)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const run = async (item: ItemOf[Kind]) => {
    setBusy(true); setErr(null)
    const r: SaveResult = await saveItem(kind, item, hidden)
    setBusy(false)
    if (r) setErr(SAVE_ERR[r]); else onDone()
  }
  return { hidden, setHidden, busy, err, setErr, run }
}

const SourcePick = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { all } = useContent()
  return (
    <Field label="Manba (kitob)">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— manbasiz —</option>
        {all.source.map((e) => <option key={e.item.id} value={e.item.id}>{e.item.title}{e.item.author ? ` — ${e.item.author}` : ''}</option>)}
      </select>
    </Field>
  )
}

const AGE_HINTS = ['U6', 'U6–U8', 'U7–U8', 'U8–U9', 'U9–U10', 'U9–U12', 'U10–U11', 'U11–U12', 'U12–U14', 'U13–U14', 'U13–U17', 'U14–U15', 'U15–U17', 'U15+', 'Pro']
const DIAGRAMS: Diagram[] = ['pass', 'dribble', 'rondo', 'smallgame', 'shoot', 'duel', 'overload', 'sprint', 'warmup', 'gk']

/* =============================================================== drill */
export function DrillEditor({ entry, onDone }: Props<'drill'>) {
  const d = entry?.item
  const builtin = !!d && isBuiltin('drill', d.id)
  const bookScene = d ? BOOK_SCENES[d.id] : undefined
  const [name, setName] = useState(toPair(d?.name))
  const [desc, setDesc] = useState(toPair(d?.desc))
  const [equip, setEquip] = useState(toPair(d?.equip))
  const [cat, setCat] = useState(d?.cat ?? 'tech')
  const [age, setAge] = useState(d?.age ?? 'U9–U12')
  const [min, setMin] = useState(d?.min ?? 10)
  const [players, setPlayers] = useState(d?.players ?? '')
  const [source, setSource] = useState(d?.source ?? '')
  const [points, setPoints] = useState<Pair[]>((d?.points ?? []).map(toPair))
  const [skills, setSkills] = useState<SkillKey[]>(d?.benefit?.[0] ?? [])
  const [why, setWhy] = useState<Pair>([d?.benefit?.[1] ?? '', d?.benefit?.[2] ?? ''])
  const [dia, setDia] = useState<Diagram>(d?.dia ?? 'pass')
  const [video, setVideo] = useState(d?.video ?? '')
  /** the admin's own drawing; undefined = keep the book drawing (built-in drills) */
  const [scene, setScene] = useState<BookScene | undefined>(d?.scene)
  const [drawing, setDrawing] = useState(false)
  const [preview, setPreview] = useState(false)
  const s = useSave('drill', entry?.hidden ?? false, onDone)
  const shown = scene ?? bookScene

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name[0].trim() && !name[1].trim()) { s.setErr('Mashq nomini yozing.'); return }
    const item: ItemOf['drill'] = {
      id: d?.id ?? newId('drill'), cat, dia, age: age.trim() || 'U9–U12', min: Math.max(1, Number(min) || 10),
      name: toText(name), desc: toText(desc), equip: toText(equip[0] || equip[1] ? equip : ['—', '—']),
      ...(players.trim() ? { players: players.trim() } : {}),
      points: cleanPairs(points).map(toText),
      ...(source ? { source } : {}),
      ...(scene ? { scene } : {}),
      ...(video ? { video } : {}),
      ...(skills.length || why[0].trim() || why[1].trim() ? { benefit: [skills, why[0].trim(), why[1].trim()] } : {}),
    }
    s.run(item)
  }

  return (
    <form className="form ed" onSubmit={submit}>
      <UzRu label="Mashq nomi" value={name} onChange={setName} required />
      <div className="full ed-scene">
        <div className="ed-scene-pic">
          {shown ? (preview ? <BookPlayer scene={shown} autoPlay maxHeight={260} /> : <BookStatic scene={shown} maxHeight={220} />) : <Pitch type={dia} maxHeight={160} />}
        </div>
        <div className="ed-scene-side">
          <b>Chizma va animatsiya</b>
          <p className="muted small">
            {scene ? (bookScene ? "Kitobdagi chizma o'rniga siz chizgan chizma ishlatiladi." : 'Siz chizgan chizma.')
              : bookScene ? 'Kitobdagi chizma (asl holi).' : "Hali chizma yo'q: pastdagi oddiy rasm ko'rsatiladi."}
          </p>
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <button type="button" className="btn small" onClick={() => setDrawing(true)}>✏️ {shown ? "Chizmani o'zgartirish" : 'Doskada chizish'}</button>
            {shown && <button type="button" className="btn ghost small" onClick={() => setPreview(!preview)}>{preview ? "Chizmani ko'rish" : '▶ Animatsiya'}</button>}
            {scene && bookScene && <button type="button" className="btn ghost small" onClick={() => setScene(undefined)}>Kitobdagi chizmaga qaytarish</button>}
            {scene && !bookScene && <button type="button" className="btn ghost small danger" onClick={() => setScene(undefined)}>Chizmani olib tashlash</button>}
          </div>
          {!shown && (
            <div className="dia-pick">
              {DIAGRAMS.map((x) => <button type="button" key={x} aria-pressed={dia === x} onClick={() => setDia(x)}><Pitch type={x} maxHeight={44} /></button>)}
            </div>
          )}
        </div>
      </div>
      <VideoField value={video} onChange={setVideo} />
      <UzRu label="Tavsif (qanday o'tkaziladi)" value={desc} onChange={setDesc} rows={5} />
      <Field label="Turi">
        <select value={cat} onChange={(e) => setCat(e.target.value as typeof cat)}>{CATEGORIES.map((c) => <option key={c} value={c}>{CAT_UZ[c]}</option>)}</select>
      </Field>
      <Field label="Yosh toifasi" hint=" · masalan U9–U12">
        <input value={age} onChange={(e) => setAge(e.target.value)} list="age-hints" required />
      </Field>
      <datalist id="age-hints">{AGE_HINTS.map((a) => <option key={a} value={a} />)}</datalist>
      <Field label="Davomiyligi (daqiqa)"><input type="number" min={1} max={120} value={min} onChange={(e) => setMin(Number(e.target.value))} /></Field>
      <Field label="O'yinchilar soni" hint=" · masalan 8–12"><input value={players} onChange={(e) => setPlayers(e.target.value)} /></Field>
      <UzRu label="Jihozlar va maydon" value={equip} onChange={setEquip} />
      <SourcePick value={source} onChange={setSource} />
      <PairList label="Murabbiy maslahatlari" value={points} onChange={setPoints} rows={1} />
      <UzRu label="Nima uchun foydali" value={why} onChange={setWhy} rows={3} />
      <Chips label="Rivojlantiradi" value={skills} onChange={setSkills} options={(Object.keys(SKILLS) as SkillKey[]).map((k) => [k, SKILLS[k][0]])} />
      {builtin && <p className="note full">Bu mashq kitobdan olingan. O'zgartirsangiz, murabbiylar sizning variantingizni ko'radi. Istalgan payt «Asl holiga qaytarish» mumkin.</p>}
      <EditorFoot {...s} onCancel={onDone} />
      {drawing && (
        <Board initial={shown} name={name[0] || name[1]} onClose={() => setDrawing(false)}
          onSave={(sc, nm) => { setScene(sc); if (!name[0].trim()) setName([nm, name[1]]); setDrawing(false); setPreview(false) }} />
      )}
    </form>
  )
}

/* =============================================================== card */
export function CardEditor({ entry, onDone }: Props<'card'>) {
  const c = entry?.item
  const [topic, setTopic] = useState(c?.topic ?? 'method')
  const [title, setTitle] = useState(toPair(c?.title))
  const [idea, setIdea] = useState(toPair(c?.idea))
  const [tips, setTips] = useState<Pair[]>((c?.tips ?? []).map(toPair))
  const [source, setSource] = useState(c?.source ?? '')
  const [video, setVideo] = useState(c?.video ?? '')
  const s = useSave('card', entry?.hidden ?? false, onDone)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title[0].trim() && !title[1].trim()) { s.setErr('Sarlavhani yozing.'); return }
    s.run({ id: c?.id ?? newId('card'), topic, title: toText(title), idea: toText(idea), tips: cleanPairs(tips).map(toText), source, ...(video ? { video } : {}) })
  }
  return (
    <form className="form ed" onSubmit={submit}>
      <UzRu label="Sarlavha" value={title} onChange={setTitle} required />
      <Field label="Mavzu"><select value={topic} onChange={(e) => setTopic(e.target.value as typeof topic)}>{TOPICS.map((x) => <option key={x} value={x}>{TOPIC_UZ[x]}</option>)}</select></Field>
      <SourcePick value={source} onChange={setSource} />
      <UzRu label="Asosiy g'oya" value={idea} onChange={setIdea} rows={6} />
      <VideoField value={video} onChange={setVideo} />
      <PairList label="Qanday qo'llash (maslahatlar)" value={tips} onChange={setTips} />
      <EditorFoot {...s} onCancel={onDone} />
    </form>
  )
}

/* =============================================================== plan */
const PHASE_UZ: Record<Phase, string> = { warm: 'Badan qizdirish', main: 'Asosiy qism', cool: 'Yakuniy qism' }

function DrillPicker({ onPick, onClose }: { onPick: (id: string) => void; onClose: () => void }) {
  const { all } = useContent()
  const [q, setQ] = useState('')
  const list = all.drill.filter((e) => !e.hidden && (q === '' || (e.item.name.uz + ' ' + e.item.name.ru + ' ' + e.item.id).toLowerCase().includes(q.toLowerCase()))).slice(0, 80)
  return (
    <Modal title="Mashq tanlash" onClose={onClose}>
      <input className="search wide" autoFocus placeholder="Qidirish…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="list">
        {list.map((e) => (
          <button type="button" key={e.item.id} className="pick" onClick={() => onPick(e.item.id)}>
            <div style={{ flex: 1, minWidth: 0 }}><b>{e.item.name.uz}</b><div className="muted small">{e.item.age} · {CAT_UZ[e.item.cat]} · {e.item.min} daq</div></div>
          </button>
        ))}
      </div>
      <div className="row"><button type="button" className="btn ghost" onClick={onClose}>Yopish</button></div>
    </Modal>
  )
}

export function PlanEditor({ entry, onDone }: Props<'plan'>) {
  const p = entry?.item
  const { all, planAges } = useContent()
  const drills = useMemo(() => new Map(all.drill.map((e) => [e.item.id, e])), [all.drill])
  const [title, setTitle] = useState(toPair(p?.title))
  const [focus, setFocus] = useState(toPair(p?.focus))
  const [ages, setAges] = useState(p?.ages ?? planAges[0])
  const [group, setGroup] = useState(p?.group ?? '')
  const [source, setSource] = useState(p?.source ?? '')
  const [phases, setPhases] = useState<Record<Phase, string[]>>(p?.phases ?? { warm: [], main: [], cool: [] })
  const [picking, setPicking] = useState<Phase | null>(null)
  const s = useSave('plan', entry?.hidden ?? false, onDone)
  const total = PHASES.reduce((a, ph) => a + phases[ph].reduce((b, id) => b + (drills.get(id)?.item.min ?? 0), 0), 0)
  const move = (ph: Phase, i: number, d: -1 | 1) => {
    const l = [...phases[ph]]; const j = i + d
    if (j < 0 || j >= l.length) return
    ;[l[i], l[j]] = [l[j], l[i]]
    setPhases({ ...phases, [ph]: l })
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title[0].trim() && !title[1].trim()) { s.setErr('Reja nomini yozing.'); return }
    if (!PHASES.some((ph) => phases[ph].length)) { s.setErr("Rejaga kamida bitta mashq qo'shing."); return }
    s.run({ id: p?.id ?? newId('plan'), ages: ages.trim(), group: group.trim() || ages.trim(), source, title: toText(title), focus: toText(focus), phases })
  }
  return (
    <form className="form ed" onSubmit={submit}>
      <UzRu label="Reja nomi" value={title} onChange={setTitle} required />
      <UzRu label="Mavzu / maqsad" value={focus} onChange={setFocus} rows={2} />
      <Field label="Yosh (yil)" hint=" · masalan 9–10">
        <input value={ages} onChange={(e) => setAges(e.target.value)} list="plan-ages" required />
      </Field>
      <datalist id="plan-ages">{planAges.map((a) => <option key={a} value={a} />)}</datalist>
      <Field label="Guruh nomi" hint=" · masalan U10"><input value={group} onChange={(e) => setGroup(e.target.value)} /></Field>
      <SourcePick value={source} onChange={setSource} />
      <p className="full muted">Jami: <b>{total} daqiqa</b></p>
      {PHASES.map((ph) => (
        <fieldset key={ph} className="plist full">
          <legend>{PHASE_UZ[ph]} <span className="muted small">({phases[ph].length})</span></legend>
          {phases[ph].map((id, i) => {
            const e = drills.get(id)
            return (
              <div className="plan-row" key={id + i}>
                <span className="plist-n">{i + 1}</span>
                <span className="plan-name">{e ? e.item.name.uz : <span className="muted">«{id}» topilmadi</span>}{e?.hidden && <span className="badge gray"> o'chirilgan</span>}{e && <span className="muted small"> · {e.item.min} daq</span>}</span>
                <div className="plist-ctl">
                  <button type="button" className="icon-btn" onClick={() => move(ph, i, -1)} disabled={i === 0}>↑</button>
                  <button type="button" className="icon-btn" onClick={() => move(ph, i, 1)} disabled={i === phases[ph].length - 1}>↓</button>
                  <button type="button" className="icon-btn danger" onClick={() => setPhases({ ...phases, [ph]: phases[ph].filter((_, j) => j !== i) })}>✕</button>
                </div>
              </div>
            )
          })}
          <button type="button" className="btn ghost small add-row" onClick={() => setPicking(ph)}>+ Mashq qo'shish</button>
        </fieldset>
      ))}
      <EditorFoot {...s} onCancel={onDone} />
      {picking && <DrillPicker onClose={() => setPicking(null)} onPick={(id) => { setPhases({ ...phases, [picking]: [...phases[picking], id] }); setPicking(null) }} />}
    </form>
  )
}

/* =============================================================== stage */
const AREAS: DevArea[] = ['technical', 'tactical', 'physical', 'mental']
const devSourceOptions = (): [string, string][] => DEV_SOURCES.map((x) => [x.id, `${x.org}: ${x.title}`])

export function StageEditor({ entry, onDone }: Props<'stage'>) {
  const st = entry?.item
  const [ages, setAges] = useState(st?.ages ?? '')
  const [title, setTitle] = useState<Pair>(st?.title ?? ['', ''])
  const [goal, setGoal] = useState<Pair>(st?.goal ?? ['', ''])
  const [profile, setProfile] = useState<Pair[]>(st?.profile ?? [])
  const [focus, setFocus] = useState<Record<DevArea, Pair[]>>(st?.focus ?? { technical: [], tactical: [], physical: [], mental: [] })
  const [formats, setFormats] = useState<Pair[]>(st?.formats ?? [])
  const [session, setSession] = useState<Pair>(st?.session ?? ['', ''])
  const [coachDo, setDo] = useState<Pair[]>(st?.coachDo ?? [])
  const [coachAvoid, setAvoid] = useState<Pair[]>(st?.coachAvoid ?? [])
  const [heading, setHeading] = useState<Pair>(st?.heading ?? ['', ''])
  const [sources, setSources] = useState<string[]>(st?.sources ?? [])
  const s = useSave('stage', entry?.hidden ?? false, onDone)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title[0].trim() || !ages.trim()) { s.setErr('Yosh va sarlavhani yozing.'); return }
    s.run({
      id: st?.id ?? newId('stage'), ages: ages.trim(), title, goal, profile: cleanPairs(profile),
      focus: Object.fromEntries(AREAS.map((a) => [a, cleanPairs(focus[a])])) as Record<DevArea, Pair[]>,
      formats: cleanPairs(formats), session, coachDo: cleanPairs(coachDo), coachAvoid: cleanPairs(coachAvoid), heading, sources,
    })
  }
  return (
    <form className="form ed" onSubmit={submit}>
      <Field label="Yosh (yil)" hint=" · masalan 4–7"><input value={ages} onChange={(e) => setAges(e.target.value)} required /></Field>
      <span />
      <UzRu label="Sarlavha" value={title} onChange={setTitle} required />
      <UzRu label="Murabbiyning asosiy vazifasi" value={goal} onChange={setGoal} rows={2} />
      <PairList label="Bu yoshdagi bola" value={profile} onChange={setProfile} />
      {AREAS.map((a) => <PairList key={a} label={DEV_AREA_LABELS[a][0]} value={focus[a]} onChange={(v) => setFocus({ ...focus, [a]: v })} />)}
      <PairList label="O'yin formatlari" value={formats} onChange={setFormats} />
      <UzRu label="Mashg'ulot tuzilishi" value={session} onChange={setSession} rows={3} />
      <PairList label="Murabbiy nima qilsin" value={coachDo} onChange={setDo} />
      <PairList label="Nimadan qochish kerak" value={coachAvoid} onChange={setAvoid} />
      <UzRu label="Bosh bilan zarba" value={heading} onChange={setHeading} rows={2} />
      <Chips label="Manbalar (havolalar)" value={sources} onChange={setSources} options={devSourceOptions()} />
      <EditorFoot {...s} onCancel={onDone} />
    </form>
  )
}

/* =============================================================== principle */
export function PrincipleEditor({ entry, onDone }: Props<'principle'>) {
  const p = entry?.item
  const [title, setTitle] = useState<Pair>(p?.title ?? ['', ''])
  const [idea, setIdea] = useState<Pair>(p?.idea ?? ['', ''])
  const [tips, setTips] = useState<Pair[]>(p?.tips ?? [])
  const [sources, setSources] = useState<string[]>(p?.sources ?? [])
  const s = useSave('principle', entry?.hidden ?? false, onDone)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title[0].trim()) { s.setErr('Sarlavhani yozing.'); return }
    s.run({ id: p?.id ?? newId('principle'), title, idea, tips: cleanPairs(tips), sources })
  }
  return (
    <form className="form ed" onSubmit={submit}>
      <UzRu label="Sarlavha" value={title} onChange={setTitle} required />
      <UzRu label="G'oya" value={idea} onChange={setIdea} rows={4} />
      <PairList label="Qanday qo'llash" value={tips} onChange={setTips} />
      <Chips label="Manbalar (havolalar)" value={sources} onChange={setSources} options={devSourceOptions()} />
      <EditorFoot {...s} onCancel={onDone} />
    </form>
  )
}

/* =============================================================== source */
export function SourceEditor({ entry, onDone }: Props<'source'>) {
  const x = entry?.item
  const [title, setTitle] = useState(x?.title ?? '')
  const [author, setAuthor] = useState(x?.author ?? '')
  const s = useSave('source', entry?.hidden ?? false, onDone)
  const used = x ? getContent().all.drill.filter((e) => e.item.source === x.id).length + getContent().all.card.filter((e) => e.item.source === x.id).length : 0
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { s.setErr('Kitob nomini yozing.'); return }
    s.run({ id: x?.id ?? newId('source'), title: title.trim(), author: author.trim() })
  }
  return (
    <form className="form ed" onSubmit={submit}>
      <Field label="Kitob nomi" full><input value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
      <Field label="Muallif" full><input value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
      {x && <p className="muted full small">Bu kitobga {used} ta mashq va karta bog'langan.</p>}
      <EditorFoot {...s} onCancel={onDone} />
    </form>
  )
}

export const EDITORS: { [K in Kind]: (p: Props<K>) => React.ReactNode } = {
  drill: DrillEditor, card: CardEditor, plan: PlanEditor, stage: StageEditor, principle: PrincipleEditor, source: SourceEditor,
}
