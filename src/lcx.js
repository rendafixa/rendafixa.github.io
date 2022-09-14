import * as finance from './finance.js'

export function getLcxResult(amount, di, yearlyIndex, periods) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexLcx(yearlyIndex, di),
    periods
  )
  return { interestAmount }
}

function getIndexLcx(yearlyInterest, di) {
  const index = yearlyInterest / 100
  return Math.pow((index * di) / 100 + 1, 1 / 12)
}
