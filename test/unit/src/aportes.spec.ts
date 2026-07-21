import { describe, it, expect } from 'vitest'
import {
  buildContributionSchedule,
  buildBreakdown,
  getRecurringCdbResult,
  getRecurringLcxResult,
  getRecurringPoupancaResult,
} from '../../../app/src/aportes'
import { getCDBResult } from '../../../app/src/cdb'
import { getLcxResult } from '../../../app/src/lcx'
import { getPoupancaResult } from '../../../app/src/poupanca'

describe('buildContributionSchedule', () => {
  it('returns only the initial deposit when there is no recurring contribution', () => {
    const schedule = buildContributionSchedule(1000, 0, 30, 360, 0)
    expect(schedule).toEqual([{ principal: 1000, depositDay: 0, days: 360 }])
  })

  it('adds one deposit per period, each with its own holding period', () => {
    const schedule = buildContributionSchedule(1000, 100, 30, 90, 0)
    expect(schedule).toEqual([
      { principal: 1000, depositDay: 0, days: 90 },
      { principal: 100, depositDay: 30, days: 60 },
      { principal: 100, depositDay: 60, days: 30 },
    ])
  })

  it('does not add a contribution landing exactly on the redemption day', () => {
    const schedule = buildContributionSchedule(0, 100, 30, 60, 0)
    // deposits at day 30 only; day 60 == redemption earns nothing and is skipped
    expect(schedule).toEqual([{ principal: 100, depositDay: 30, days: 30 }])
  })

  it('corrects recurring contributions by inflation, leaving the initial deposit untouched', () => {
    const inflationRate = 6
    const schedule = buildContributionSchedule(1000, 100, 365, 730, inflationRate)

    expect(schedule[0]).toEqual({ principal: 1000, depositDay: 0, days: 730 })
    // contribution at day 365 corrected by (1 + 6%)^(365/365)
    expect(schedule[1]!.principal).toBeCloseTo(100 * Math.pow(1.06, 1), 10)
    expect(schedule[1]!.depositDay).toBe(365)
  })

  it('skips recurring deposits when the amount is zero (no regression to single deposit)', () => {
    const schedule = buildContributionSchedule(1000, 0, 30, 360, 6)
    expect(schedule).toHaveLength(1)
  })
})

describe('getRecurringCdbResult', () => {
  it('matches the single-deposit result when there is only the initial deposit', () => {
    const schedule = buildContributionSchedule(1000, 0, 30, 400, 0)
    const recurring = getRecurringCdbResult(schedule, 100, 13.15)
    const single = getCDBResult(1000, 100, 13.15, 400)

    expect(recurring.interestAmount).toBeCloseTo(single.interestAmount, 6)
    expect(recurring.iofAmount).toBeCloseTo(single.iofAmount, 6)
    expect(recurring.taxAmount).toBeCloseTo(single.taxAmount, 6)
    expect(recurring.taxPercentage).toBeCloseTo(single.taxPercentage, 6)
  })

  it('sums per-deposit taxes, applying IOF to contributions held under 30 days', () => {
    const di = 100
    const yearlyIndex = 13.15
    const schedule = buildContributionSchedule(1000, 500, 15, 40, 0)

    let interestAmount = 0
    let taxAmount = 0
    let iofAmount = 0
    let iofHitLastDeposit = false
    for (const contribution of schedule) {
      const result = getCDBResult(contribution.principal, di, yearlyIndex, contribution.days)
      interestAmount += result.interestAmount
      taxAmount += result.taxAmount
      iofAmount += result.iofAmount
      if (contribution.days <= 30) {
        iofHitLastDeposit = iofHitLastDeposit || result.iofAmount > 0
      }
    }

    const result = getRecurringCdbResult(schedule, di, yearlyIndex)
    expect(iofHitLastDeposit).toBe(true) // last deposits held < 30 days pay IOF
    expect(result.interestAmount).toBeCloseTo(interestAmount, 6)
    expect(result.taxAmount).toBeCloseTo(taxAmount, 6)
    expect(result.iofAmount).toBeCloseTo(iofAmount, 6)
  })

  it('reports a blended effective tax percentage', () => {
    const schedule = buildContributionSchedule(1000, 500, 90, 400, 0)
    const result = getRecurringCdbResult(schedule, 100, 13.15)
    const expected = (result.taxAmount / (result.interestAmount - result.iofAmount)) * 100
    expect(result.taxPercentage).toBeCloseTo(expected, 6)
  })
})

describe('getRecurringLcxResult / getRecurringPoupancaResult', () => {
  it('sums LCI/LCA interest per deposit without taxes', () => {
    const schedule = buildContributionSchedule(1000, 200, 60, 360, 0)
    const expected = schedule.reduce(
      (sum, c) => sum + getLcxResult(c.principal, 100, 95, c.days).interestAmount,
      0,
    )
    expect(getRecurringLcxResult(schedule, 100, 95).interestAmount).toBeCloseTo(expected, 6)
  })

  it('sums Poupança interest per deposit', () => {
    const schedule = buildContributionSchedule(1000, 200, 30, 360, 0)
    const expected = schedule.reduce(
      (sum, c) => sum + getPoupancaResult(c.principal, 0.5, c.days).interestAmount,
      0,
    )
    expect(getRecurringPoupancaResult(schedule, 0.5).interestAmount).toBeCloseTo(expected, 6)
  })
})

describe('buildBreakdown', () => {
  const grow = (principal: number, days: number) => principal * Math.pow(1.0002, days)

  it('reports cumulative contributed amounts and interest per snapshot', () => {
    const schedule = buildContributionSchedule(1000, 100, 30, 90, 0)
    const entries = buildBreakdown(schedule, 30, 90, grow)

    const last = entries.at(-1)!
    expect(last.day).toBe(90)
    // initial + two recurring deposits (day 30 and day 60)
    expect(last.contributed).toBeCloseTo(1200, 6)
    expect(last.interest).toBeCloseTo(last.balance - last.contributed, 6)
    expect(last.balance).toBeGreaterThan(last.contributed)
  })

  it('always includes a snapshot on the redemption day', () => {
    const schedule = buildContributionSchedule(1000, 100, 30, 100, 0)
    const entries = buildBreakdown(schedule, 30, 100, grow)
    expect(entries.at(-1)!.day).toBe(100)
  })

  it('aggregates into buckets when intervals exceed maxRows', () => {
    // 365 daily contributions, capped at 12 rows
    const schedule = buildContributionSchedule(1000, 10, 1, 365, 0)
    const entries = buildBreakdown(schedule, 1, 365, grow, 12)
    expect(entries.length).toBeLessThanOrEqual(13) // maxRows buckets + redemption day
    expect(entries.at(-1)!.day).toBe(365)
  })

  it('returns an empty breakdown for invalid parameters', () => {
    expect(buildBreakdown([], 0, 360, grow)).toEqual([])
    expect(buildBreakdown([], 30, 0, grow)).toEqual([])
  })
})
