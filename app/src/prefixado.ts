import * as finance from './finance'

export function getPrefixadoCdbResult(
  amount: number,
  yearlyRate: number,
  days: number,
): { interestAmount: number, taxAmount: number, taxPercentage: number, iofAmount: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPrefixado(yearlyRate),
    days,
  )
  const taxPercentage = finance.getIndexIR(days)
  const iofAmount = finance.getIOFAmount(days, interestAmount)
  const taxAmount = (interestAmount - iofAmount) * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

export function getPrefixadoLcxResult(
  amount: number,
  yearlyRate: number,
  days: number,
): { interestAmount: number } {
  const interestAmount = finance.compoundInterest(
    amount,
    getIndexPrefixado(yearlyRate),
    days,
  )
  return { interestAmount }
}

function getIndexPrefixado(yearlyRate: number): number {
  return Math.pow(yearlyRate / 100 + 1, 1 / 365)
}
