import type { Decimal } from '../finance/decimal'
import { annualToDailyFactor, decimal } from '../finance/decimal'

export function ipcaLinkedFactor(ipcaAnnualPct: Decimal, realAnnualPct: Decimal): Decimal {
  const combinedPct = decimal(1).plus(ipcaAnnualPct.div(100))
    .mul(decimal(1).plus(realAnnualPct.div(100)))
    .minus(1)
    .mul(100)
  return annualToDailyFactor(combinedPct)
}
