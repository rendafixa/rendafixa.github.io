import { describe, expect, it } from 'vitest'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from '../../../app/src/prefixado'

describe('getPrefixadoCdbResult', () => {
  it('returns the golden result for one year at 14% a year', () => {
    const result = getPrefixadoCdbResult(1000, 14, 365)

    expect(result).toEqual({
      interestAmount: 140,
      taxAmount: 24.5,
      taxPercentage: 17.5,
      iofAmount: 0,
    })
  })

  it('returns the golden early-redemption result with IOF', () => {
    const result = getPrefixadoCdbResult(1000, 14, 10)

    expect(result.interestAmount).toBe(3.6)
    expect(result.taxPercentage).toBe(22.5)
    expect(result.iofAmount).toBeCloseTo(2.376, 6)
    expect(result.taxAmount).toBeCloseTo(0.2754, 6)
  })

  it.each([
    { days: 180, taxPercentage: 22.5 },
    { days: 181, taxPercentage: 20 },
    { days: 360, taxPercentage: 20 },
    { days: 361, taxPercentage: 17.5 },
    { days: 720, taxPercentage: 17.5 },
    { days: 721, taxPercentage: 15 },
  ])('returns $taxPercentage% IR at $days days', ({ days, taxPercentage }) => {
    const result = getPrefixadoCdbResult(1000, 14, days)

    expect(result.taxPercentage).toBe(taxPercentage)
  })
})

describe('getPrefixadoLcxResult', () => {
  it('returns the golden tax-exempt result for one year', () => {
    const result = getPrefixadoLcxResult(5000, 13.5, 365)

    expect(result).toEqual({ interestAmount: 675 })
  })

  it('returns only gross interest', () => {
    const result = getPrefixadoLcxResult(1000, 14, 365)

    expect(result).not.toHaveProperty('taxAmount')
    expect(result).not.toHaveProperty('iofAmount')
    expect(result).not.toHaveProperty('taxPercentage')
  })
})
