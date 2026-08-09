import type { MarketSnapshot } from '../contracts/market'
import type { IsoDate } from '../contracts/investment'
import { annualToMonthlyRate, decimal } from '../finance/decimal'
import { selicRateForDate } from '../finance/rate-curves'

export function savingsMonthlyFactor(market: MarketSnapshot, date?: IsoDate, projected = false) {
  const target = date && projected
    ? selicRateForDate(date, market, true).plus(0.1)
    : decimal(market.rates.selicTarget.annualPct)
  const baseRate = target.gt(8.5) ? decimal(0.005) : annualToMonthlyRate(target.mul(0.7))
  return decimal(1).plus(baseRate).plus(decimal(market.rates.trMonthly.annualPct).div(100))
}
