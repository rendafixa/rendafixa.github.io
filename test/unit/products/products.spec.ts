import { describe, expect, it } from 'vitest'
import marketJson from '../../../app/assets/market-data.json'
import type { InvestmentInput } from '../../../app/src/contracts/investment'
import type { MarketSnapshot } from '../../../app/src/contracts/market'
import { decimal } from '../../../app/src/finance/decimal'
import { cdiLinkedFactor } from '../../../app/src/products/cdi-linked'
import { ipcaLinkedFactor } from '../../../app/src/products/ipca-linked'
import { savingsMonthlyFactor } from '../../../app/src/products/savings'
import { ipcaRateForDate } from '../../../app/src/finance/rate-curves'
import { simulateInvestment } from '../../../app/src/simulation/simulate-investment'

const market = marketJson as MarketSnapshot

describe('product factors', () => {
  it.each([50, 100, 250])('applies %s%% CDI to the daily yield', (percentage) => {
    const factor = cdiLinkedFactor(decimal(13.9), decimal(percentage))
    expect(factor.gt(1)).toBe(true)
  })

  it('combines IPCA and real rate multiplicatively', () => {
    const factor = ipcaLinkedFactor(decimal(5), decimal(6)).pow(252)
    expect(factor.minus(1).mul(100).toNumber()).toBeCloseTo(11.3, 10)
  })

  it('uses the 0.5% savings rule above 8.5% Selic plus TR', () => {
    const expectedMonthlyPct = 0.5 + Number(market.rates.trMonthly.annualPct)
    expect(savingsMonthlyFactor(market).minus(1).mul(100).toNumber()).toBeCloseTo(expectedMonthlyPct, 10)
  })

  it('uses current IPCA before the first projected year', () => {
    expect(ipcaRateForDate('2025-12-31', market, true).toString()).toBe(market.rates.ipca12m.annualPct)
  })

  it('uses projected Selic for future savings anniversaries', () => {
    const lowSelic = structuredClone(market)
    lowSelic.projections.selic = [{ meeting: 'R1', effectiveDate: '2027-01-01', annualPct: '6.9', estimated: false }]
    expect(savingsMonthlyFactor(lowSelic, '2027-02-01', true).minus(1).mul(100).toNumber()).toBeLessThan(0.6)
  })
})

describe('investment simulation', () => {
  it.each([
    ['cdb-pre', { kind: 'fixed', annualPct: '12' }],
    ['cdb-cdi', { kind: 'cdi-percent', percentOfCdi: '100' }],
    ['cdb-ipca', { kind: 'ipca-plus', realAnnualPct: '6' }],
    ['lci-pre', { kind: 'fixed', annualPct: '10' }],
    ['lci-cdi', { kind: 'cdi-percent', percentOfCdi: '90' }],
    ['lci-ipca', { kind: 'ipca-plus', realAnnualPct: '5' }],
    ['tesouro-pre', { kind: 'fixed', annualPct: '12' }],
    ['tesouro-selic', { kind: 'selic' }],
    ['tesouro-ipca', { kind: 'ipca-plus', realAnnualPct: '6' }],
  ] as const)('simulates %s until maturity', (type, rate) => {
    const input = { id: type, name: type, type, maturityDate: '2027-08-09', rate } as InvestmentInput
    const result = simulateInvestment(input, '2026-08-09', '10000', true, market)
    expect(result.ok).toBe(true)
    if (result.ok) expect(Number(result.value.netFinalValue)).toBeGreaterThan(10000)
  })

  it('credits savings only on anniversaries', () => {
    const input: InvestmentInput = { id: 'p', name: 'Poupança', type: 'poupanca', maturityDate: '2026-09-08', rate: { kind: 'savings' } }
    const result = simulateInvestment(input, '2026-08-09', '10000', false, market)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value.grossProfit).toBe('0')
  })
})
