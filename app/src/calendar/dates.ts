import type { CalendarDate } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import type { IsoDate } from '../contracts/investment'

export function civilDate(value: IsoDate): CalendarDate {
  return parseDate(value)
}

export function isoDate(value: CalendarDate): IsoDate {
  return value.toString() as IsoDate
}

export function compareDates(left: IsoDate, right: IsoDate): number {
  return civilDate(left).compare(civilDate(right))
}

export function calendarDaysBetween(start: IsoDate, end: IsoDate): number {
  let days = 0
  for (let cursor = civilDate(start); cursor.compare(civilDate(end)) < 0; cursor = cursor.add({ days: 1 })) days++
  return days
}

export function datesAfterStartThroughEnd(start: IsoDate, end: IsoDate): IsoDate[] {
  const values: IsoDate[] = []
  for (let cursor = civilDate(start).add({ days: 1 }); cursor.compare(civilDate(end)) <= 0; cursor = cursor.add({ days: 1 })) {
    values.push(isoDate(cursor))
  }
  return values
}

export function addYears(date: IsoDate, years: number): IsoDate {
  return isoDate(civilDate(date).add({ years }))
}

export function brazilToday(): IsoDate {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()) as IsoDate
}
