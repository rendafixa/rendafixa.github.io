import type { Decimal } from '../finance/decimal'
import { annualToDailyFactor } from '../finance/decimal'

export function fixedRateFactor(annualPct: Decimal): Decimal {
  return annualToDailyFactor(annualPct)
}
