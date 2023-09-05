import * as cdb from '@/src/cdb'
const each = require('jest-each').default

describe('getCDBResult', () => {
  each([
    [
      1000,
      12,
      100,
      30,
      {
        interestAmount: 9.358203165413329,
        taxAmount: 2.105595712217999,
        taxPercentage: 22.5
      }
    ],
    [
      1000,
      12,
      100,
      200,
      {
        interestAmount: 64.06652212284939,
        taxAmount: 12.813304424569878,
        taxPercentage: 20
      }
    ],
    [
      1000,
      12,
      100,
      721,
      {
        interestAmount: 250.89959025071857,
        taxAmount: 37.63493853760779,
        taxPercentage: 15
      }
    ],
    [
      1000,
      12,
      100,
      720,
      {
        interestAmount: 250.51125929083673,
        taxAmount: 43.839470375896425,
        taxPercentage: 17.5
      }
    ]
  ]).it(
    'when the value is %s and the index %s, invested for %s days, the return will be %s',
    (amount, di, index, periods, result) => {
      expect(cdb.getCDBResult(amount, di, index, periods)).toEqual(result)
    }
  )
})
