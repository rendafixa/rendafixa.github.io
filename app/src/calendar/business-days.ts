import { civilDate, datesAfterStartThroughEnd } from './dates'
import type { IsoDate } from '../contracts/investment'

export function isBusinessDay(date: IsoDate, holidays: ReadonlySet<IsoDate>): boolean {
  const day = civilDate(date).toDate('UTC').getUTCDay()
  return day !== 0 && day !== 6 && !holidays.has(date)
}

export function businessDates(start: IsoDate, end: IsoDate, holidays: ReadonlySet<IsoDate>): IsoDate[] {
  return datesAfterStartThroughEnd(start, end).filter(date => isBusinessDay(date, holidays))
}

export function countBusinessDays(start: IsoDate, end: IsoDate, holidays: ReadonlySet<IsoDate>): number {
  return businessDates(start, end, holidays).length
}
