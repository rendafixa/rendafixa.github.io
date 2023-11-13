import * as finance from './finance';

export function getLcxResult(
  amount: number,
  di: number,
  yearlyIndex: number,
  periods: number
): { interestAmount: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexLcx(yearlyIndex, di),
    periods
  );
  return { interestAmount };
}

function getIndexLcx(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}

