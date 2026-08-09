import type { TaxBracketAlert } from '../contracts/simulation'
import { decimal, type Decimal } from './decimal'
import { IOF_PERCENT_BY_DAY } from './regulatory-constants'

export function iofRatePct(calendarDays: number): Decimal {
  if (calendarDays < 1 || calendarDays > 29) return decimal(0)
  return decimal(IOF_PERCENT_BY_DAY[calendarDays - 1]!)
}

export function incomeTaxRatePct(calendarDays: number): Decimal {
  if (calendarDays <= 180) return decimal(22.5)
  if (calendarDays <= 360) return decimal(20)
  if (calendarDays <= 720) return decimal(17.5)
  return decimal(15)
}

export function calculateTaxes(grossProfit: Decimal, calendarDays: number, exempt: boolean) {
  if (exempt || grossProfit.lte(0)) return { iof: decimal(0), incomeTax: decimal(0) }
  const iof = grossProfit.mul(iofRatePct(calendarDays)).div(100)
  const incomeTax = grossProfit.minus(iof).mul(incomeTaxRatePct(calendarDays)).div(100)
  return { iof, incomeTax }
}

export function taxBracketAlert(calendarDays: number): TaxBracketAlert | undefined {
  const threshold = ([181, 361, 721] as const).find(day => day - calendarDays >= 1 && day - calendarDays <= 29)
  if (!threshold) return undefined
  return {
    nextDay: threshold,
    daysRemaining: threshold - calendarDays,
    currentRatePct: incomeTaxRatePct(calendarDays).toString(),
    nextRatePct: incomeTaxRatePct(threshold).toString(),
  }
}
