import { BOOK_SCENES } from './book'
import { getData } from './store'
import type { BookScene } from './book/scene'

/** Drawings of drills opened from a link and not saved yet. */
const opened = new Map<string, BookScene>()
export const openedScene = (id: string, scene?: BookScene) => { if (scene) opened.set(id, scene) }

/** The scene of a drill: drawn from a book, or drawn by the coach on the tactics board. */
export const sceneOf = (id?: string): BookScene | undefined =>
  !id ? undefined : BOOK_SCENES[id] ?? getData().customDrills.find((d) => d.id === id)?.scene
    ?? opened.get(id)
