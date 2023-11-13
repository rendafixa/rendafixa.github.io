import { describe, expect, it } from 'vitest'
import { compoundInterest, getIndexIR, getIOFAmount, getIOFPercentage } from '../../src/finance'

describe('getIndexIR function', () => {
    const testCases = [
        { days: 1, expected: 22.5 },
        { days: 30, expected: 22.5 },
        { days: 120, expected: 22.5 },
        { days: 180, expected: 22.5 },
        { days: 181, expected: 20 },
        { days: 360, expected: 20 },
        { days: 361, expected: 17.5 },
        { days: 720, expected: 17.5 },
        { days: 721, expected: 15 },
        { days: 9999, expected: 15 },
    ];

    for (const testCase of testCases) {
        it(`returns ${testCase.expected} when days is ${testCase.days}`, () => {
            expect(getIndexIR(testCase.days)).toBe(testCase.expected);
        });
    }
});


describe('compoundInterest function', () => {
    it('calculates compound interest correctly', () => {
        expect(compoundInterest(1000, 1.0003105377556554, 365)).toBe(120);
        expect(compoundInterest(500, 1.0003105377556554, 49)).toBe(7.67);
    });
});

describe.each([
  [1, 96],
  [10, 66],
  [15, 50],
  [22, 26],
  [30, 0],
  [31, 0],
  [365, 0]
])('getIOFPercentage for %s day(s) returns %s% IOF', (daysToRedeem, expected) => {
  it(`for daysToRedeem ${daysToRedeem}`, () => {
    expect(getIOFPercentage(daysToRedeem)).toBe(expected)
  })
})


describe('getIOFAmount', () => {
  it('calculates the correct IOF amount', () => {
    const interestAmount = 1000

    // Assuming getIOFPercentage is correct based on the previous tests
    const iofPercentage = getIOFPercentage(10)

    const result = getIOFAmount(10, interestAmount)

    expect(result).toBe(interestAmount * (iofPercentage / 100))
  })

  it('returns 0 for days greater than 30', () => {
    const interestAmount = 1000

    // Assuming getIOFPercentage is correct based on the previous tests
    const iofPercentage = getIOFPercentage(35)

    const result = getIOFAmount(35, interestAmount)

    expect(result).toBe(0)
  })
})
