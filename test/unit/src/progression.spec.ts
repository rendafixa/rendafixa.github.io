import { describe, it, expect } from 'vitest'
import { getNetProgression } from '../../../app/src/progression'
import { getCDBResult } from '../../../app/src/cdb'
import { getPoupancaResult } from '../../../app/src/poupanca'
import { getLcxResult } from '../../../app/src/lcx'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from '../../../app/src/prefixado'

const baseInput = {
  amount: 1000,
  di: 100,
  periodDays: 360,
  cdbIndex: 100,
  lcxIndex: 90,
  poupancaIndex: 6.17,
}

function netFromCDBResult(amount: number, result: ReturnType<typeof getCDBResult>) {
  return amount + result.interestAmount - result.iofAmount - result.taxAmount
}

describe('getNetProgression - sample points', () => {
  it('starts every series at the invested amount on day 0', () => {
    const points = getNetProgression(baseInput)

    expect(points[0].day).toBe(0)
    expect(points[0].poupanca).toBe(1000)
    expect(points[0].cdb).toBe(1000)
    expect(points[0].lcx).toBe(1000)
  })

  it('starts and ends on the requested period boundaries', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 360 })

    expect(points[0].day).toBe(0)
    expect(points[points.length - 1].day).toBe(360)
  })

  it('returns a single point for a zero-day period', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 0 })

    expect(points).toHaveLength(1)
    expect(points[0]).toMatchObject({ day: 0, poupanca: 1000, cdb: 1000, lcx: 1000 })
  })

  it('caps long periods at 40 points while keeping both boundaries', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 3650 })

    expect(points.length).toBeLessThanOrEqual(40)
    expect(points[0].day).toBe(0)
    expect(points[points.length - 1].day).toBe(3650)
  })
})

describe('getNetProgression - net value semantics (redeem on that day)', () => {
  it('ends at the same net value the result cards show', () => {
    const points = getNetProgression(baseInput)
    const last = points[points.length - 1]

    const cdb = getCDBResult(baseInput.amount, baseInput.di, baseInput.cdbIndex, baseInput.periodDays)
    const poupanca = getPoupancaResult(baseInput.amount, baseInput.poupancaIndex, baseInput.periodDays)
    const lcx = getLcxResult(baseInput.amount, baseInput.di, baseInput.lcxIndex, baseInput.periodDays)

    expect(last.cdb).toBeCloseTo(netFromCDBResult(baseInput.amount, cdb), 2)
    expect(last.poupanca).toBeCloseTo(baseInput.amount + poupanca.interestAmount, 2)
    expect(last.lcx).toBeCloseTo(baseInput.amount + lcx.interestAmount, 2)
  })

  it('never decreases over time for any series', () => {
    const points = getNetProgression(baseInput)

    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1]
      const current = points[i]

      expect(current.poupanca).toBeGreaterThanOrEqual(previous.poupanca)
      expect(current.cdb).toBeGreaterThanOrEqual(previous.cdb)
      expect(current.lcx).toBeGreaterThanOrEqual(previous.lcx)
    }
  })

  it('credits poupança interest only on full 30-day anniversaries', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 60 })

    const day20 = points.find(point => point.day === 20)!
    const day30 = points.find(point => point.day === 30)!

    expect(day20.poupanca).toBe(1000)
    expect(day30.poupanca).toBeGreaterThan(1000)
  })
})

describe('getNetProgression - prefixado series', () => {
  it('omits prefixado series when no rate is provided', () => {
    const points = getNetProgression(baseInput)

    for (const point of points) {
      expect(point).not.toHaveProperty('cdbPre')
      expect(point).not.toHaveProperty('lcxPre')
    }
  })

  it('includes prefixado series, ending at the prefixado card values, when rates are positive', () => {
    const points = getNetProgression({ ...baseInput, cdbPreIndex: 14, lcxPreIndex: 14 })
    const last = points[points.length - 1]

    const cdbPre = getPrefixadoCdbResult(baseInput.amount, 14, baseInput.periodDays)
    const lcxPre = getPrefixadoLcxResult(baseInput.amount, 14, baseInput.periodDays)

    expect(last.cdbPre).toBeCloseTo(netFromCDBResult(baseInput.amount, cdbPre), 2)
    expect(last.lcxPre).toBeCloseTo(baseInput.amount + lcxPre.interestAmount, 2)
  })

  it('ignores non-positive or non-finite prefixado rates', () => {
    const points = getNetProgression({ ...baseInput, cdbPreIndex: 0, lcxPreIndex: Number.POSITIVE_INFINITY })

    expect(points[points.length - 1]).not.toHaveProperty('cdbPre')
    expect(points[points.length - 1]).not.toHaveProperty('lcxPre')
  })
})
