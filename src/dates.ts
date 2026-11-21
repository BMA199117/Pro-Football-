export const iso = (d: Date) => {
  const x = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return x.toISOString().slice(0, 10)
}
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const monday = (d: Date) => { const x = new Date(d); x.setHours(12, 0, 0, 0); return addDays(x, -((x.getDay() + 6) % 7)) }
export const parse = (s: string) => new Date(s + 'T12:00:00')
export const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
