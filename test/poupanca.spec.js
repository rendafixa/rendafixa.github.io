import * as poupanca from '@/src/poupanca'
const each = require('jest-each').default

describe('calculateFullMonthsDays', () => {
  each([
    [0, 0],
    [29, 0],
    [30, 30],
    [200, 180],
    [365, 360]
  ]).it('when the number of days is %s then return %s', (periods, result) => {
    expect(poupanca.calculateFullMonthsDays(periods)).toBe(result)
  })
})

describe('getPoupancaResult', () => {
  each([
    [1000, 0.65, 30, 6.500000000002615],
    [1000, 0.65, 35, 6.500000000002615],
    [1000, 0.65, 180, 39.6392693456462],
    [1000, 0.65, 365, 80.84981036554882]
  ]).it(
    'when the value is %s and the index %s, invested for %s days, the return will be %s',
    (amount, index, periods, result) => {
      expect(poupanca.getPoupancaResult(amount, index, periods)).toEqual({
        interestAmount: result
      })
    }
  )
})
