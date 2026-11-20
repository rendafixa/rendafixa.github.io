import { getCDBResult } from './cdb'
import { getLcxResult } from './lcx'
import { getPoupancaResult } from './poupanca'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from './prefixado'

export interface ProgressionInput {
  amount: number
  di: number
  periodDays: number
  cdbIndex: number
  lcxIndex: number
  poupancaIndex: number
  cdbPreIndex?: number | null
  lcxPreIndex?: number | null
}

export interface ProgressionPoint {
  day: number
  poupanca: number
  cdb: number
  cdbPre?: number
  lcx: number
  lcxPre?: number
}

const MAX_SAMPLE_POINTS = 40
const DAYS_PER_MONTH = 30

/**
 * Samples the net value of each simulated investment over time.
 *
 * Each point is the value if the investment were redeemed on that day, so
 * taxed products (CDB) already reflect the IR bracket and IOF of that day.
 */
export function getNetProgression(input: ProgressionInput): ProgressionPoint[] {
  const days = Math.max(0, Math.floor(input.periodDays))

  return buildSampleDays(days).map(day => buildPoint(input, day))
}

function buildSampleDays(days: number): number[] {
  if (days === 0) {
    return [0]
  }

  // Monthly marks for typical durations; step grows in whole months so longer
  // periods stay within the point cap while keeping the axis readable.
  const stepMonths = Math.max(1, Math.ceil(days / (MAX_SAMPLE_POINTS - 1) / DAYS_PER_MONTH))
  const step = stepMonths * DAYS_PER_MONTH
  const samples: number[] = []

  for (let day = 0; day < days; day += step) {
    samples.push(day)
  }

  samples.push(days)

  return samples
}

function buildPoint(input: ProgressionInput, day: number): ProgressionPoint {
  const point: ProgressionPoint = {
    day,
    poupanca: input.amount + getPoupancaResult(input.amount, input.poupancaIndex, day).interestAmount,
    cdb: netValue(input.amount, getCDBResult(input.amount, input.di, input.cdbIndex, day)),
    lcx: input.amount + getLcxResult(input.amount, input.di, input.lcxIndex, day).interestAmount,
  }

  if (isPositiveRate(input.cdbPreIndex)) {
    point.cdbPre = netValue(
      input.amount,
      getPrefixadoCdbResult(input.amount, input.cdbPreIndex, day),
    )
  }

  if (isPositiveRate(input.lcxPreIndex)) {
    point.lcxPre = input.amount
      + getPrefixadoLcxResult(input.amount, input.lcxPreIndex, day).interestAmount
  }

  return point
}

interface TaxedResult {
  interestAmount: number
  taxAmount: number
  iofAmount: number
}

function netValue(amount: number, result: TaxedResult): number {
  return amount + result.interestAmount - result.iofAmount - result.taxAmount
}

function isPositiveRate(rate: number | null | undefined): rate is number {
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0
}
