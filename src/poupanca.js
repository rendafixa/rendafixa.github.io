import * as finance from './finance.js'

export function getPoupancaResult(amount, index, periods) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPoupanca(index),
    periods
  )
  const taxAmount = 0
  const taxPercentage = 0
  return { interestAmount, taxAmount, taxPercentage }
}

function getIndexPoupanca(index) {
  return index / 100 + 1
}
