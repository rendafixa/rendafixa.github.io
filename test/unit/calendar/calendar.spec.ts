import { describe, expect, it } from 'vitest'
import { businessDates, countBusinessDays, isBusinessDay } from '../../../app/src/calendar/business-days'
import { calendarDaysBetween } from '../../../app/src/calendar/dates'
import { savingsAnniversaries } from '../../../app/src/calendar/monthly-anniversary'

describe('civil date and business-day rules', () => {
  it('uses an exclusive start and inclusive maturity', () => {
    expect(calendarDaysBetween('2026-08-09', '2026-08-10')).toBe(1)
    expect(businessDates('2026-08-09', '2026-08-10', new Set())).toEqual(['2026-08-10'])
  })

  it('excludes weekends and holidays', () => {
    const holidays = new Set<'2026-09-07'>(['2026-09-07'])
    expect(isBusinessDay('2026-09-05', holidays)).toBe(false)
    expect(isBusinessDay('2026-09-07', holidays)).toBe(false)
    expect(countBusinessDays('2026-09-04', '2026-09-08', holidays)).toBe(1)
  })

  it('crosses leap day without converting through local time', () => {
    expect(calendarDaysBetween('2028-02-28', '2028-03-01')).toBe(2)
  })
})

describe('savings anniversaries', () => {
  it.each([
    ['2026-01-28', '2026-02-28'],
    ['2026-01-29', '2026-03-01'],
    ['2026-01-30', '2026-03-01'],
    ['2026-01-31', '2026-03-01'],
  ] as const)('moves the anniversary for a deposit on %s to %s', (start, expected) => {
    expect(savingsAnniversaries(start, '2026-03-02')[0]).toBe(expected)
  })
})
