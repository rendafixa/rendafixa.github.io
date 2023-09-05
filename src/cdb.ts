import * as finance from './finance';

export function getCDBResult(
  amount: number,
  di: number,
  yearlyIndex: number,
  periods: number
): { interestAmount: number; taxAmount: number; taxPercentage: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexCDB(yearlyIndex, di),
    periods
  );
  const taxPercentage = finance.getIndexIR(periods);
  const taxAmount = interestAmount * (taxPercentage / 100);
  return { interestAmount, taxAmount, taxPercentage };
}

function getIndexCDB(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
