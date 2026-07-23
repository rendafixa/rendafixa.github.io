import { describe, it, expect } from 'vitest'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from '../../../app/src/prefixado'
import { getIndexIR, getIOFAmount, getIOFPercentage } from '../../../app/src/finance'

// Helper to compute expected values independently (mirrors financial math)
function expectedPrefixado(amount: number, yearlyRate: number, days: number) {
  const dailyFactor = Math.pow(yearlyRate / 100 + 1, 1 / 365)
  const rawInterest = amount * Math.pow(dailyFactor, days) - amount
  const interestAmount = Number.parseFloat(rawInterest.toFixed(2))
  const taxPercentage = getIndexIR(days)
  const iofAmount = getIOFAmount(days, interestAmount)
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

describe('getPrefixadoCdbResult - tax percentage tiers', () => {
  const tierCases = [
    { days: 30, expected: 22.5 },
    { days: 181, expected: 20 },
    { days: 400, expected: 17.5 },
    { days: 900, expected: 15 },
  ]

  for (const { days, expected } of tierCases) {
    it(`returns taxPercentage ${expected} for ${days} days`, () => {
      const result = getPrefixadoCdbResult(1000, 14, days)
      expect(result.taxPercentage).toBe(expected)
    })
  }
})

describe('getPrefixadoCdbResult - IOF impact (early redemption)', () => {
  it('applies IOF correctly for redemption within 10 days', () => {
    const amount = 1000
    const yearlyRate = 14
    const days = 10

    const result = getPrefixadoCdbResult(amount, yearlyRate, days)
    const expected = expectedPrefixado(amount, yearlyRate, days)

    expect(getIOFPercentage(days)).toBeGreaterThan(0) // sanity check IOF applies
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxPercentage).toBe(expected.taxPercentage)
    expect(result.iofAmount).toBeCloseTo(expected.iofAmount, 6)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

describe('getPrefixadoCdbResult - no IOF after 30 days', () => {
  it('does not apply IOF and calculates taxes correctly', () => {
    const amount = 1000
    const yearlyRate = 14
    const days = 200

    const result = getPrefixadoCdbResult(amount, yearlyRate, days)
    const expected = expectedPrefixado(amount, yearlyRate, days)

    expect(getIOFPercentage(days)).toBe(0)
    expect(result.iofAmount).toBe(0)
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxPercentage).toBe(expected.taxPercentage)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

describe('getPrefixadoCdbResult - long term lowest tax bracket', () => {
  it('applies 15% tax after more than 720 days', () => {
    const amount = 1000
    const yearlyRate = 12.5
    const days = 800

    const result = getPrefixadoCdbResult(amount, yearlyRate, days)
    const expected = expectedPrefixado(amount, yearlyRate, days)

    expect(result.taxPercentage).toBe(15)
    expect(result.iofAmount).toBe(0)
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

describe('getPrefixadoLcxResult - tax-exempt', () => {
  it('returns only interestAmount (no tax/IOF for LCI/LCA)', () => {
    const result = getPrefixadoLcxResult(1000, 14, 365)

    expect(result).toHaveProperty('interestAmount')
    expect(result).not.toHaveProperty('taxAmount')
    expect(result).not.toHaveProperty('iofAmount')
    expect(result).not.toHaveProperty('taxPercentage')
  })

  it('matches the independently computed gross interest', () => {
    const amount = 5000
    const yearlyRate = 13.5
    const days = 365

    const result = getPrefixadoLcxResult(amount, yearlyRate, days)
    const expected = expectedPrefixado(amount, yearlyRate, days)

    expect(result.interestAmount).toBe(expected.interestAmount)
  })

  it('returns zero interest for zero rate', () => {
    const result = getPrefixadoLcxResult(1000, 0, 365)

    expect(result.interestAmount).toBe(0)
  })

  it('returns zero interest for zero amount', () => {
    const result = getPrefixadoLcxResult(0, 14, 365)

    expect(result.interestAmount).toBe(0)
  })

  it('calculates higher interest for longer periods', () => {
    const shortTerm = getPrefixadoLcxResult(1000, 14, 180)
    const longTerm = getPrefixadoLcxResult(1000, 14, 720)

    expect(longTerm.interestAmount).toBeGreaterThan(shortTerm.interestAmount)
  })
})

describe('getPrefixadoCdbResult vs getPrefixadoLcxResult', () => {
  it('produce the same gross interest for identical inputs', () => {
    const cdb = getPrefixadoCdbResult(10000, 14, 365)
    const lcx = getPrefixadoLcxResult(10000, 14, 365)

    expect(cdb.interestAmount).toBe(lcx.interestAmount)
  })

  it('CDB net profit is lower than tax-exempt LCI/LCA for the same rate', () => {
    const cdb = getPrefixadoCdbResult(10000, 14, 365)
    const lcx = getPrefixadoLcxResult(10000, 14, 365)

    const cdbNet = cdb.interestAmount - cdb.taxAmount - cdb.iofAmount
    expect(cdbNet).toBeLessThan(lcx.interestAmount)
  })
})
