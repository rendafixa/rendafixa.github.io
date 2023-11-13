import * as finance from './finance'

export function getCDBResult(
  amount: number,
  di: number,
  yearlyIndex: number,
  days: number
): { interestAmount: number; taxAmount: number; taxPercentage: number, iofAmount: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexCDB(yearlyIndex, di),
    days
  );
  const taxPercentage = finance.getIndexIR(days)
  const iofAmount = finance.getIOFAmount(days, interestAmount)
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

function getIndexCDB(yearlyInterest: number, di: number): number {
  const index = yearlyInterest / 100;
  return Math.pow((index * di) / 100 + 1, 1 / 365);
}
