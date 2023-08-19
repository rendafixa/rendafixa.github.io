import * as lcx from '@/src/lcx'
const each = require('jest-each').default

describe('getCDBResult', () => {
  each([
    [1000, 12, 100, 30, { interestAmount: 9.358203165413329 }],
    [1000, 12, 100, 200, { interestAmount: 64.06652212284939 }],
    [1000, 12, 100, 721, { interestAmount: 250.89959025071857 }],
    [1000, 12, 100, 720, { interestAmount: 250.51125929083673 }]
  ]).it(
    'when the value is %s and the index %s, invested for %s days, the return will be %s',
    (amount, di, index, periods, result) => {
      expect(lcx.getLcxResult(amount, di, index, periods)).toEqual(result)
    }
  )
})
