import * as finance from './finance';

export function getPoupancaResult(
  amount: number,
  index: number,
  periods: number
): { interestAmount: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPoupanca(index),
    calculateFullMonthsDays(periods)
  );

  return { interestAmount };
}

export function calculateFullMonthsDays(days: number): number {
  const daysInMonth = 30;
  return days < daysInMonth ? 0 : Math.floor(days / daysInMonth) * daysInMonth;
}

function getIndexPoupanca(index: number): number {
  return Math.pow(index / 100 + 1, 1 / 30);
}
