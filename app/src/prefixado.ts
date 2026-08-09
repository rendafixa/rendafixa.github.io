import { getCDBResult } from './cdb'
import { getLcxResult } from './lcx'

export function getPrefixadoCdbResult(
  amount: number,
  yearlyRate: number,
  days: number,
): { interestAmount: number, taxAmount: number, taxPercentage: number, iofAmount: number } {
  return getCDBResult(amount, 100, yearlyRate, days)
}

export function getPrefixadoLcxResult(
  amount: number,
  yearlyRate: number,
  days: number,
): { interestAmount: number } {
  return getLcxResult(amount, 100, yearlyRate, days)
}
