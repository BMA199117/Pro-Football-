import type { AppData, Player } from './types'
import { addDays, iso, monday, uid } from './dates'

export function sampleData(): AppData {
  const m = monday(new Date())
  const names: [string, Player['pos'], number][] = [
    ['Aziz Karimov', 'DF', 2], ['Jasur Toshmatov', 'MF', 8], ['Sardor Aliyev', 'FW', 9], ['Bekzod Rahimov', 'GK', 1],
    ['Doston Yusupov', 'MF', 6], ['Otabek Nazarov', 'DF', 4], ['Islom Qodirov', 'FW', 11], ["Ulug'bek Saidov", 'MF', 10],
    ['Temur Ergashev', 'DF', 5], ['Shoxrux Mirzayev', 'MF', 7], ['Nodir Xolmatov', 'FW', 17], ['Akmal Sobirov', 'DF', 3],
  ]
  const players: Player[] = names.map(([name, pos, num]) => ({ id: uid(), name, pos, num, group: 'U12' }))
  const att = (skip: number[]) => Object.fromEntries(players.map((p, i) => [p.id, !skip.includes(i)]))
  return {
    version: 1,
    updatedAt: Date.now(),
    groups: ['U10', 'U12'],
    players,
    customDrills: [],
    sessions: [
      { id: uid(), date: iso(addDays(m, 0)), time: '16:00', group: 'U12', goal: "Pas va to'pni ushlab turish",
        phases: { warm: ['b6'], main: ['b2', 'b3', 'b4'], cool: ['b9'] }, att: att([3, 9]) },
      { id: uid(), date: iso(addDays(m, 2)), time: '16:00', group: 'U12', goal: 'Hujumda yakunlash',
        phases: { warm: ['b6', 'b1'], main: ['b7', 'b11'], cool: ['b9'] }, att: att([5]) },
      { id: uid(), date: iso(addDays(m, 4)), time: '17:00', group: 'U12', goal: "Tezlik va kichik o'yinlar",
        phases: { warm: ['b6'], main: ['b5', 'b4'], cool: [] }, att: {} },
      { id: uid(), date: iso(addDays(m, 5)), time: '10:00', group: 'U10', goal: 'Dribling asoslari',
        phases: { warm: ['b6'], main: ['b1', 'b10'], cool: ['b9'] }, att: {} },
    ],
  }
}

export const emptyData = (): AppData => ({ version: 1, updatedAt: 0, groups: ['U12'], players: [], customDrills: [], sessions: [] })
