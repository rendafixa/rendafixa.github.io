import { getCDBResult } from './cdb'
import { getLcxResult } from './lcx'
import { getPoupancaResult } from './poupanca'

export interface Contribution {
  principal: number
  depositDay: number
  days: number
}

export interface BreakdownEntry {
  day: number
  contributed: number
  balance: number
  interest: number
}

// Builds the list of deposits made over the investment horizon: the initial
// amount at day 0 plus one recurring contribution every `frequencyDays` until
// (but not including) the redemption day. Each deposit keeps its own holding
// period so taxes can be computed per deposit. When `inflationRate` (yearly %)
// is greater than zero, recurring contributions are corrected by inflation to
// keep their purchasing power constant over time.
export function buildContributionSchedule(
  initialAmount: number,
  recurringAmount: number,
  frequencyDays: number,
  totalDays: number,
  inflationRate: number,
): Contribution[] {
  const schedule: Contribution[] = []

  if (initialAmount > 0) {
    schedule.push({ principal: initialAmount, depositDay: 0, days: totalDays })
  }

  if (recurringAmount > 0 && frequencyDays > 0) {
    for (let day = frequencyDays; day < totalDays; day += frequencyDays) {
      const inflationFactor = Math.pow(1 + inflationRate / 100, day / 365)
      schedule.push({
        principal: recurringAmount * inflationFactor,
        depositDay: day,
        days: totalDays - day,
      })
    }
  }

  return schedule
}

export function getRecurringCdbResult(
  schedule: Contribution[],
  di: number,
  yearlyIndex: number,
): { interestAmount: number, taxAmount: number, taxPercentage: number, iofAmount: number } {
  let interestAmount = 0
  let taxAmount = 0
  let iofAmount = 0

  for (const contribution of schedule) {
    const result = getCDBResult(contribution.principal, di, yearlyIndex, contribution.days)
    interestAmount += result.interestAmount
    taxAmount += result.taxAmount
    iofAmount += result.iofAmount
  }

  const taxableBase = interestAmount - iofAmount
  const taxPercentage = taxableBase > 0 ? (taxAmount / taxableBase) * 100 : 0

  return { interestAmount, taxAmount, taxPercentage, iofAmount }
}

export function getRecurringLcxResult(
  schedule: Contribution[],
  di: number,
  yearlyIndex: number,
): { interestAmount: number } {
  let interestAmount = 0
  for (const contribution of schedule) {
    interestAmount += getLcxResult(contribution.principal, di, yearlyIndex, contribution.days).interestAmount
  }
  return { interestAmount }
}

export function getRecurringPoupancaResult(
  schedule: Contribution[],
  index: number,
): { interestAmount: number } {
  let interestAmount = 0
  for (const contribution of schedule) {
    interestAmount += getPoupancaResult(contribution.principal, index, contribution.days).interestAmount
  }
  return { interestAmount }
}

// Builds a period-by-period timeline of the gross accumulation (before taxes,
// which are only realized at redemption). Each entry is a cumulative snapshot
// of how much was contributed and how much the balance is worth at that day.
// When the number of intervals exceeds `maxRows`, snapshots are aggregated into
// wider buckets so the breakdown stays readable. `grow` returns the value of a
// principal (including itself) after being invested for a given number of days,
// letting each product apply its own compounding rule.
export function buildBreakdown(
  schedule: Contribution[],
  frequencyDays: number,
  totalDays: number,
  grow: (principal: number, days: number) => number,
  maxRows = 24,
): BreakdownEntry[] {
  if (frequencyDays <= 0 || totalDays <= 0) {
    return []
  }

  const marks = Math.floor(totalDays / frequencyDays)
  const bucketFactor = marks > maxRows ? Math.ceil(marks / maxRows) : 1
  const stepDays = frequencyDays * bucketFactor

  const snapshotDays = new Set<number>()
  for (let day = stepDays; day < totalDays; day += stepDays) {
    snapshotDays.add(day)
  }
  snapshotDays.add(totalDays)

  const entries: BreakdownEntry[] = []
  for (const day of snapshotDays) {
    let contributed = 0
    let balance = 0
    for (const contribution of schedule) {
      if (contribution.depositDay <= day) {
        contributed += contribution.principal
        balance += grow(contribution.principal, day - contribution.depositDay)
      }
    }
    entries.push({ day, contributed, balance, interest: balance - contributed })
  }

  return entries
}
