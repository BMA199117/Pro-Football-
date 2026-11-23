/**
 * The phone/browser Back button: it closes the open window (drill card, board, session run)
 * before it leaves a tab, and moves between the tabs the coach opened, instead of leaving the site.
 * Each open layer adds one history entry; Back closes the top layer only.
 */
import { useEffect, useRef } from 'react'

type Layer = { id: number; close: () => void }
const stack: Layer[] = []
let seq = 0
let listening = false
/** history.back() calls we made ourselves (a layer closed from a button) */
let selfBack = 0

function listen() {
  if (listening || typeof window === 'undefined') return
  listening = true
  window.addEventListener('popstate', () => {
    if (selfBack > 0) { selfBack--; return }
    const top = stack.pop()
    top?.close()
  })
}

/** Close this window with the Back button; call it in any full-screen or modal component. */
export function useBackClose(onClose: () => void) {
  const ref = useRef(onClose)
  ref.current = onClose
  useEffect(() => {
    listen()
    const layer: Layer = { id: ++seq, close: () => ref.current() }
    stack.push(layer)
    history.pushState({ ...(history.state ?? {}), pfLayer: layer.id }, '')
    return () => {
      const i = stack.indexOf(layer)
      if (i >= 0) {
        // closed by a button, not by Back: drop our history entry too
        stack.splice(i, 1)
        setTimeout(() => { if (history.state?.pfLayer === layer.id) { selfBack++; history.back() } }, 0)
      }
    }
  }, [])
}

/** Tabs: each tab change is a history entry, so Back returns to the previous tab. */
export function useTabHistory<T extends string>(tab: T, setTab: (t: T) => void) {
  const set = useRef(setTab)
  set.current = setTab
  useEffect(() => {
    listen()
    const on = (e: PopStateEvent) => { const t = e.state?.pfTab as T | undefined; if (t && !stack.length) set.current(t) }
    window.addEventListener('popstate', on)
    if (!history.state?.pfTab) history.replaceState({ ...(history.state ?? {}), pfTab: tab }, '')
    return () => window.removeEventListener('popstate', on)
  }, [])
  useEffect(() => {
    if (history.state?.pfTab !== tab && !history.state?.pfLayer) history.pushState({ pfTab: tab }, '')
  }, [tab])
}
