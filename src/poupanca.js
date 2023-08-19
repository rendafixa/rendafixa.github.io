import * as finance from './finance.js'

export function getPoupancaResult(amount, index, periods) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPoupanca(index),
    calculateFullMonthsDays(periods)
  )

  return { interestAmount }
}

export function calculateFullMonthsDays(days) {
  const daysInMonth = 30
  return days < daysInMonth ? 0 : Math.floor(days / daysInMonth) * daysInMonth
}

function getIndexPoupanca(index) {
  return Math.pow(index / 100 + 1, 1 / 30)
}
