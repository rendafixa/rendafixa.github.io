import type { IsoDate } from '../contracts/investment'
import type { MonthlyYield, TimelinePoint } from '../contracts/simulation'
import { decimal } from '../finance/decimal'

export function buildMonthlyYields(startDate: IsoDate, maturityDate: IsoDate, principal: string, timeline: TimelinePoint[]): MonthlyYield[] {
  const months = new Map<string, TimelinePoint[]>()
  for (const point of timeline) {
    const month = point.date.slice(0, 7)
    months.set(month, [...(months.get(month) ?? []), point])
  }
  let previous = decimal(principal)
  return [...months.entries()].map(([month, points]) => {
    const final = decimal(points.at(-1)!.netValue)
    const netYield = final.minus(previous)
    previous = final
    return {
      month: month as `${number}-${number}`,
      netYield: netYield.toString(),
      partial: month === startDate.slice(0, 7) || month === maturityDate.slice(0, 7),
    }
  })
}
