import { useEffect, useState } from 'react'
import { DrillDetail } from './DrillDetail'
import { Modal } from './Modal'
import { useT, useDrills } from '../hooks'
import { update, useData } from '../store'
import { openedScene } from '../scene-of'
import { clearShared, readShared, type Shared } from '../share'
import { uid } from '../dates'

/** Opens a drill that came in a link (from the head coach), with "save to my drills" for an own drawing. */
export function SharedDrill() {
  const { t } = useT()
  const drills = useDrills()
  const data = useData()
  const [got, setGot] = useState<Shared | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    const read = () => readShared().then((s) => { if (s) { if (s.kind === 'own') openedScene(s.drill.id, s.drill.scene); setGot(s); setSavedId(null); clearShared() } })
    read()
    window.addEventListener('hashchange', read)
    return () => window.removeEventListener('hashchange', read)
  }, [])

  if (!got) return null
  const close = () => setGot(null)
  if (got.kind === 'bad') return (
    <Modal title={t('sharedDrill')} onClose={close}>
      <p>{t('badLink')}</p>
      <div className="row"><button className="btn ghost" onClick={close}>{t('close')}</button></div>
    </Modal>
  )
  const drill = got.kind === 'book' ? drills.find((d) => d.id === got.id) : got.drill
  if (!drill) return (
    <Modal title={t('sharedDrill')} onClose={close}>
      <p>{t('badLink')}</p>
      <div className="row"><button className="btn ghost" onClick={close}>{t('close')}</button></div>
    </Modal>
  )
  const have = got.kind === 'own' && (savedId || data.customDrills.some((d) => d.id === drill.id))
  const save = () => {
    // keep the sender's id when it is free, so a second click or the sender's own device do not duplicate it
    const id = data.customDrills.some((d) => d.id === drill.id) ? uid() : drill.id
    update((d) => ({ ...d, customDrills: [{ ...drill, id, custom: true }, ...d.customDrills] }))
    setSavedId(id)
  }
  return (
    <DrillDetail drill={drill} onClose={close} top={
      <div className="shared-top">
        <span>📨 {t('sharedDrill')}</span>
        {got.kind === 'own' && (have
          ? <span className="chip">✓ {t('savedMine')}</span>
          : <button className="btn small" onClick={save}>+ {t('saveToMine')}</button>)}
      </div>
    } />
  )
}
