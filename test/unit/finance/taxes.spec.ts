import { describe, expect, it } from 'vitest'
import { decimal } from '../../../app/src/finance/decimal'
import { calculateTaxes, incomeTaxRatePct, iofRatePct, taxBracketAlert } from '../../../app/src/finance/taxes'
import { IOF_PERCENT_BY_DAY } from '../../../app/src/finance/regulatory-constants'

describe('IOF', () => {
  it.each(IOF_PERCENT_BY_DAY.map((rate, index) => [index + 1, rate]))('uses %s days as %s%%', (day, rate) => {
    expect(iofRatePct(day).toNumber()).toBe(rate)
  })

  it('is zero from day 30', () => expect(iofRatePct(30).toNumber()).toBe(0))
})

describe('income tax', () => {
  it.each([[180, 22.5], [181, 20], [360, 20], [361, 17.5], [720, 17.5], [721, 15]])('uses the bracket at day %s', (day, rate) => {
    expect(incomeTaxRatePct(day).toNumber()).toBe(rate)
  })

  it('calculates IR after IOF', () => {
    const taxes = calculateTaxes(decimal(100), 1, false)
    expect(taxes.iof.toNumber()).toBe(96)
    expect(taxes.incomeTax.toNumber()).toBe(0.9)
  })

  it('does not tax exempt, zero, or negative yields', () => {
    expect(calculateTaxes(decimal(100), 360, true).incomeTax.toNumber()).toBe(0)
    expect(calculateTaxes(decimal(0), 360, false).incomeTax.toNumber()).toBe(0)
    expect(calculateTaxes(decimal(-10), 360, false).incomeTax.toNumber()).toBe(0)
  })

  it.each([[152, 29], [180, 1], [181, undefined]])('builds alerts around a lower bracket at day %s', (day, remaining) => {
    expect(taxBracketAlert(day)?.daysRemaining).toBe(remaining)
  })
})
