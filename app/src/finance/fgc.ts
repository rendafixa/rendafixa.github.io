import type { IsoDate } from '../contracts/investment'
import type { FgcResult, TimelinePoint } from '../contracts/simulation'
import { decimal } from './decimal'
import { FGC_LIMIT } from './regulatory-constants'

export function evaluateFgc(isTreasury: boolean, startDate: IsoDate, principal: string, timeline: TimelinePoint[]): FgcResult {
  if (isTreasury) return { covered: false, label: 'Tesouro Nacional' }
  const initial = decimal(principal)
  const exceeded = initial.gt(FGC_LIMIT)
    ? { date: startDate, value: initial }
    : timeline.find(point => decimal(point.grossValue).gt(FGC_LIMIT))
  if (!exceeded) return { covered: true, limit: FGC_LIMIT, exceeded: false }
  const exceededOn = 'date' in exceeded ? exceeded.date : startDate
  const balance = 'grossValue' in exceeded ? decimal(exceeded.grossValue) : exceeded.value
  const finalValue = timeline.length ? decimal(timeline.at(-1)!.grossValue) : initial
  return {
    covered: true,
    limit: FGC_LIMIT,
    exceeded: true,
    exceededOn,
    balanceOnDate: balance.toString(),
    uncoveredAtMaturity: DecimalMax(finalValue.minus(FGC_LIMIT), 0).toString(),
  }
}

function DecimalMax(value: ReturnType<typeof decimal>, minimum: number) {
  return value.gt(minimum) ? value : decimal(minimum)
}
