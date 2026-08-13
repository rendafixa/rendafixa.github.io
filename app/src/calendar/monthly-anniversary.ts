import { civilDate, isoDate } from './dates'
import type { IsoDate } from '../contracts/investment'

export function savingsAnniversaries(start: IsoDate, end: IsoDate): IsoDate[] {
  const original = civilDate(start)
  const finish = civilDate(end)
  const dates: IsoDate[] = []
  for (let offset = 1; offset <= 360; offset++) {
    const monthStart = original.add({ months: offset }).set({ day: 1 })
    const daysInMonth = monthStart.add({ months: 1 }).subtract({ days: 1 }).day
    const anniversary = original.day <= daysInMonth
      ? monthStart.set({ day: original.day })
      : monthStart.add({ months: 1 })
    if (anniversary.compare(finish) > 0) break
    dates.push(isoDate(anniversary))
  }
  return dates
}
