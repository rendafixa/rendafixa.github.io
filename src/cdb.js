import * as finance from './finance.js'

export function getCDBResult(amount, di, yearlyIndex, days) {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexCDB(yearlyIndex, di),
    days
  )
  const taxPercentage = finance.getIndexIR(days)
  const iofAmount = finance.getIOFAmount(days, interestAmount)
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

function getIndexCDB(yearlyInterest, di) {
  const index = yearlyInterest / 100
  return Math.pow((index * di) / 100 + 1, 1 / 365)
}
