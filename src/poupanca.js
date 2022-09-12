import * as finance from './finance.js'

export function getPoupancaResult(amount, periods) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPoupanca(),
    periods
  )
  const taxAmount = 0
  const taxPercentage = 0
  return { interestAmount, taxAmount, taxPercentage }
}
function getCentralBankIndexPoupanca() {
  return 0.7097
}
function getIndexPoupanca() {
  return getCentralBankIndexPoupanca() / 100 + 1
}
