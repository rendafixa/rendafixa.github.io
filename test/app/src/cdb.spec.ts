import { describe, it, expect } from 'vitest'
import { getCDBResult } from '../../../app/src/cdb'
import { getIndexIR, getIOFAmount, getIOFPercentage } from '../../../app/src/finance'

// Helper to compute expected values independently (mirrors financial math)
function expectedCDB(amount: number, di: number, yearlyIndex: number, days: number) {
  const yearlyRate = yearlyIndex / 100 // convert to decimal
  const dailyFactor = Math.pow((yearlyRate * di) / 100 + 1, 1 / 365)
  const rawInterest = amount * Math.pow(dailyFactor, days) - amount
  const interestAmount = parseFloat(rawInterest.toFixed(2))
  const taxPercentage = getIndexIR(days)
  const iofAmount = getIOFAmount(days, interestAmount)
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

describe('getCDBResult - tax percentage tiers', () => {
  const tierCases = [
    { days: 30, expected: 22.5 },
    { days: 181, expected: 20 },
    { days: 400, expected: 17.5 },
    { days: 900, expected: 15 }
  ]

  for (const { days, expected } of tierCases) {
    it(`returns taxPercentage ${expected} for ${days} days`, () => {
      const result = getCDBResult(1000, 100, 13.15, days)
      expect(result.taxPercentage).toBe(expected)
    })
  }
})

describe('getCDBResult - IOF impact (early redemption)', () => {
  it('applies IOF correctly for redemption within 10 days', () => {
    const amount = 1000
    const di = 110 // 110% of CDI
    const yearlyIndex = 13.15
    const days = 10

    const result = getCDBResult(amount, di, yearlyIndex, days)
    const expected = expectedCDB(amount, di, yearlyIndex, days)

    expect(getIOFPercentage(days)).toBeGreaterThan(0) // sanity check IOF applies
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxPercentage).toBe(expected.taxPercentage)
    expect(result.iofAmount).toBeCloseTo(expected.iofAmount, 6)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

describe('getCDBResult - no IOF after 35 days', () => {
  it('does not apply IOF and calculates taxes correctly', () => {
    const amount = 1000
    const di = 100
    const yearlyIndex = 13.15
    const days = 200

    const result = getCDBResult(amount, di, yearlyIndex, days)
    const expected = expectedCDB(amount, di, yearlyIndex, days)

    expect(getIOFPercentage(days)).toBe(0)
    expect(result.iofAmount).toBe(0)
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxPercentage).toBe(expected.taxPercentage)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

describe('getCDBResult - long term lowest tax bracket', () => {
  it('applies 15% tax after more than 720 days', () => {
    const amount = 1000
    const di = 95
    const yearlyIndex = 13.15
    const days = 800

    const result = getCDBResult(amount, di, yearlyIndex, days)
    const expected = expectedCDB(amount, di, yearlyIndex, days)

    expect(result.taxPercentage).toBe(15)
    expect(result.iofAmount).toBe(0)
    expect(result.interestAmount).toBe(expected.interestAmount)
    expect(result.taxAmount).toBeCloseTo(expected.taxAmount, 6)
  })
})

