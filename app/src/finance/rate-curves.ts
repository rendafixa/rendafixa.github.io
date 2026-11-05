import type { IsoDate } from '../contracts/investment'
import type { MarketSnapshot } from '../contracts/market'
import { decimal, type Decimal } from './decimal'

export function selicRateForDate(date: IsoDate, market: MarketSnapshot, projected: boolean): Decimal {
  if (!projected || market.projections.selic.length === 0) return decimal(market.rates.selicEffective.annualPct)
  const point = market.projections.selic
    .filter(item => item.effectiveDate <= date)
    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))[0]
  return point ? decimal(point.annualPct) : decimal(market.rates.selicEffective.annualPct)
}

export function cdiRateForDate(date: IsoDate, market: MarketSnapshot, projected: boolean): Decimal {
  if (!projected) return decimal(market.rates.cdi.annualPct)
  const firstProjection = [...market.projections.selic].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate))[0]
  return firstProjection && date >= firstProjection.effectiveDate
    ? selicRateForDate(date, market, true)
    : decimal(market.rates.cdi.annualPct)
}

export function ipcaRateForDate(date: IsoDate, market: MarketSnapshot, projected: boolean): Decimal {
  if (!projected || market.projections.ipca.length === 0) return decimal(market.rates.ipca12m.annualPct)
  const year = Number(date.slice(0, 4))
  const sorted = [...market.projections.ipca].sort((a, b) => a.year - b.year)
  if (year < sorted[0]!.year) return decimal(market.rates.ipca12m.annualPct)
  return decimal(sorted.find(item => item.year === year)?.annualPct ?? sorted.at(-1)!.annualPct)
}
