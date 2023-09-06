import { describe, it, expect } from 'vitest';
import { compoundInterest, getIndexIR } from '../../src/finance';

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