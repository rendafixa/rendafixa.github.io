import type { Decimal } from '../finance/decimal'
import { annualToDailyFactor, decimal } from '../finance/decimal'

export function cdiLinkedFactor(cdiAnnualPct: Decimal, percentOfCdi: Decimal): Decimal {
  const cdiDailyYield = annualToDailyFactor(cdiAnnualPct).minus(1)
  return decimal(1).plus(cdiDailyYield.mul(percentOfCdi).div(100))
}
