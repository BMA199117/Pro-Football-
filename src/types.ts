export type Lang = 'uz' | 'ru'
export type Text = { uz: string; ru: string }
export type Category = 'tech' | 'tact' | 'phys' | 'gk'
export type Phase = 'warm' | 'main' | 'cool'
export type Diagram = 'dribble' | 'pass' | 'rondo' | 'smallgame' | 'sprint' | 'warmup' | 'shoot' | 'gk' | 'duel' | 'overload'

export interface Drill {
  id: string
  cat: Category
  dia: Diagram
  age: string
  min: number
  name: Text
  desc: Text
  equip: Text
  players?: string
  /** Short coaching points shown on the drill card and in run mode. */
  points?: Text[]
  /** Key of SOURCES when the drill comes from a book. */
  source?: string
  custom?: boolean
}

export interface Player {
  id: string
  name: string
  num: number
  pos: 'GK' | 'DF' | 'MF' | 'FW'
  group: string
}

export interface Session {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  group: string
  goal: string
  notes?: string
  phases: Record<Phase, string[]>
  att: Record<string, boolean>
}

/** Everything that is synced between devices. */
export interface AppData {
  version: 1
  updatedAt: number
  groups: string[]
  sessions: Session[]
  players: Player[]
  customDrills: Drill[]
  favorites?: string[]
}

export const PHASES: Phase[] = ['warm', 'main', 'cool']
export const CATEGORIES: Category[] = ['tech', 'tact', 'phys', 'gk']

export type Topic = 'method' | 'game' | 'kids' | 'physical'
export interface KnowledgeCard {
  id: string
  topic: Topic
  title: Text
  idea: Text
  tips: Text[]
  source: string
}
