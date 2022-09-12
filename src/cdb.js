import * as finance from './finance.js'

export function getCDBResult(amount, di, yearlyIndex, periods) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexCDB(yearlyIndex, di),
    periods
  )
  const taxPercentage = finance.getIndexIR(periods)
  const taxAmount = interestAmount * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage }
}

function getIndexCDB(yearlyInterest, di) {
  const index = yearlyInterest / 100
  return Math.pow((index * di) / 100 + 1, 1 / 12)
}
