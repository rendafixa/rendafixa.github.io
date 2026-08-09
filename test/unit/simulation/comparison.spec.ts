import { describe, expect, it } from 'vitest'
import marketJson from '../../../app/assets/market-data.json'
import type { ComparisonRequest } from '../../../app/src/contracts/investment'
import type { MarketSnapshot } from '../../../app/src/contracts/market'
import { simulateComparison } from '../../../app/src/simulation/simulate-comparison'

const market = marketJson as MarketSnapshot
const request: ComparisonRequest = {
  schemaVersion: 1, startDate: '2026-08-09', principal: '10000', useProjections: true,
  investments: [
    { id: 'savings', name: 'Poupança', type: 'poupanca', maturityDate: '2028-08-09', rate: { kind: 'savings' } },
    { id: 'cdi', name: 'CDB', type: 'cdb-cdi', maturityDate: '2028-08-09', rate: { kind: 'cdi-percent', percentOfCdi: '100' } },
  ],
}

describe('comparison', () => {
  it('ranks by net profit and calculates benchmark differences', () => {
    const result = simulateComparison(request, market)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.ranking).toEqual(['cdi', 'savings'])
    expect(Number(result.value.runnerUpDifference)).toBeGreaterThan(0)
    expect(Number(result.value.benchmarkDifferences.cdi)).toBeCloseTo(0, 8)
    expect(result.value.benchmarkTimelines.cdi.at(-1)?.netValue).toBe(result.value.investments.find(item => item.investmentId === 'cdi')?.netFinalValue)
  })

  it('keeps valid rows when another row is invalid', () => {
    const invalid = structuredClone(request)
    invalid.investments[0]!.maturityDate = '2026-01-01'
    const result = simulateComparison(invalid, market)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.investments).toHaveLength(1)
      expect(result.value.errors[0]?.investmentId).toBe('savings')
      expect(result.warnings.some(warning => warning.investmentId === 'savings')).toBe(true)
    }
  })

  it('rejects more than 40 investments', () => {
    const oversized = { ...request, investments: Array.from({ length: 41 }, (_, index) => ({ ...request.investments[0]!, id: String(index) })) }
    const result = simulateComparison(oversized, market)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.code).toBe('too-many-investments')
  })

  it('returns a domain error for an invalid start date', () => {
    const result = simulateComparison({ ...request, startDate: '' as ComparisonRequest['startDate'] }, market)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.field).toBe('startDate')
  })

  it('produces the reference scenario within the approved one-cent tolerance', () => {
    const referenceMarket = structuredClone(market)
    referenceMarket.rates.cdi.annualPct = '13.9'
    referenceMarket.rates.selicTarget.annualPct = '14'
    referenceMarket.rates.trMonthly.annualPct = '0.1707990097659211'
    const result = simulateComparison({ ...request, useProjections: false }, referenceMarket)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const savings = result.value.investments.find(item => item.investmentId === 'savings')!
    const cdi = result.value.investments.find(item => item.investmentId === 'cdi')!
    expect(Number(savings.netFinalValue)).toBeCloseTo(11740.44, 2)
    expect(Number(cdi.netFinalValue)).toBeCloseTo(12515.84, 2)
  })
})
