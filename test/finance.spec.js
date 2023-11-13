import * as finance from '@/src/finance.js'

const each = require('jest-each').default

describe('getIndexIR', () => {
  each([
    [30, 22.5],
    [60, 22.5],
    [180, 22.5],
    [181, 20],
    [250, 20],
    [360, 20],
    [361, 17.5],
    [720, 17.5],
    [730, 15]
  ]).it('when period is %s then IR index is %s', (periods, result) => {
    expect(finance.getIndexIR(periods)).toBe(result)
  })
})

describe('getCompoundInterest', () => {
  test('calculate correctly', () => {
    const amount = 1_000
    const periods = 12
    const index = 1.01
    expect(finance.compoundInterest(amount, index, 1)).toBe(10)
    expect(finance.compoundInterest(amount, index, periods)).toBe(
      126.8250301319697
    )
  })
})

describe('getIOFPercentage', () => {
  it('should return the correct IOF percentage for days within the first 30 days', () => {
    expect(finance.getIOFPercentage(1)).toBe(96)
    expect(finance.getIOFPercentage(10)).toBe(66)
    expect(finance.getIOFPercentage(15)).toBe(50)
    expect(finance.getIOFPercentage(22)).toBe(26)
    expect(finance.getIOFPercentage(30)).toBe(0)
  })

  it('should return 0 for days beyond 30 days', () => {
    expect(finance.getIOFPercentage(31)).toBe(0)
    expect(finance.getIOFPercentage(50)).toBe(0)
    expect(finance.getIOFPercentage(100)).toBe(0)
  })
})

describe('getIOFAmount', () => {
  it('should calculate the correct IOF amount based on the interest amount and IOF percentage', () => {
    const interestAmount = 1000

    const iofAmount = finance.getIOFAmount(1, interestAmount)
    const expectedIOFAmount = (interestAmount * 96) / 100

    expect(iofAmount).toBe(expectedIOFAmount)
  })

  it('should return 0 for 30 days', () => {
    const daysToRedeem = 30
    const interestAmount = 1000

    const iofAmount = finance.getIOFAmount(daysToRedeem, interestAmount)

    expect(iofAmount).toBe(0)
  })

  it('should return 0 for 31 and more days', () => {
    const daysToRedeem = 31
    const interestAmount = 1000

    const iofAmount = finance.getIOFAmount(daysToRedeem, interestAmount)

    expect(iofAmount).toBe(0)
  })
})
