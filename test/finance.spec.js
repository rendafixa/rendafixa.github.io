import * as finance from '@/src/finance.js'
const each = require('jest-each').default

describe('getIndexIR', () => {
  each([
    [1, 22.5],
    [5, 22.5],
    [6, 22.5],
    [7, 20],
    [12, 20],
    [13, 17.5],
    [23, 17.5],
    [24, 17.5],
    [25, 15]
  ]).it('when period is %s then IR index is %s', (periods, result) => {
    expect(finance.getIndexIR(periods)).toBe(result)
  })
})
