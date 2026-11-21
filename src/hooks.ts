import { usePrefs, useData } from './store'
import { dict, tr, type Key } from './i18n'
import { LIBRARY } from './library'
import type { Drill, Phase, Session, Text } from './types'
import { PHASES } from './types'

export function useT() {
  const { lang } = usePrefs()
  return {
    lang,
    t: (k: Key) => tr(lang, k),
    L: (x: Text) => x[lang] || x.uz,
    days: dict[lang].days,
    months: dict[lang].months,
  }
}

export function useDrills(): Drill[] {
  const data = useData()
  return [...data.customDrills, ...LIBRARY]
}

export function sessionMinutes(s: Session, drills: Drill[]) {
  const byId = new Map(drills.map((d) => [d.id, d]))
  return PHASES.reduce((a, p) => a + s.phases[p].reduce((b, id) => b + (byId.get(id)?.min ?? 0), 0), 0)
}

export const PHASE_COLOR: Record<Phase, string> = { warm: 'var(--cone)', main: 'var(--pitch)', cool: 'var(--blue)' }
