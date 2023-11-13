import * as cdb from '@/src/cdb'

const each = require('jest-each').default

describe('getCDBResult', () => {
  each([
    [
      1000,
      12,
      100,
      1,
      {
        interestAmount: 0.31053775565533215,
        iofAmount: 0.29811624542911885,
        taxAmount: 0.0027948398008979915,
        taxPercentage: 22.5
      }
    ],
    [
      1000,
      12,
      100,
      15,
      {
        interestAmount: 4.668205511358451,
        iofAmount: 2.3341027556792255,
        taxAmount: 0.5251731200278258,
        taxPercentage: 22.5
      }
    ],
    [
      1000,
      12,
      100,
      29,
      {
        interestAmount: 9.044856640276748,
        iofAmount: 0.2713456992083024,
        taxAmount: 1.9740399617404005,
        taxPercentage: 22.5
      }
    ],
    [
      1000,
      12,
      100,
      30,
      {
        interestAmount: 9.358203165413329,
        iofAmount: 0,
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
        iofAmount: 0,
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
        iofAmount: 0,
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
        iofAmount: 0,
        taxAmount: 43.839470375896425,
        taxPercentage: 17.5
      }
    ]
  ]).it(
    'when the invested value is %s, DI index is %s% and the yearly index %s%, ' +
      'invested for %s days, the return will be %s',
    (amount, di, yearlyInterest, days, expectedResult) => {
      const actualResult = cdb.getCDBResult(amount, di, yearlyInterest, days)
      expect(actualResult).toEqual(expectedResult)
    }
  )
})
