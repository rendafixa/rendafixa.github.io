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
