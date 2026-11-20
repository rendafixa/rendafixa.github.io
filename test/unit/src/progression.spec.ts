import { describe, it, expect } from 'vitest'
import { getNetProgression } from '../../../app/src/progression'
import { getCDBResult } from '../../../app/src/cdb'
import { getPoupancaResult } from '../../../app/src/poupanca'
import { getLcxResult } from '../../../app/src/lcx'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from '../../../app/src/prefixado'
import { getIndexIR, getIOFAmount, getIOFPercentage } from '../../../app/src/finance'

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
  it('matches the result-card net values exactly at the final day', () => {
    const points = getNetProgression(baseInput)
    const last = points[points.length - 1]

    const cdb = getCDBResult(baseInput.amount, baseInput.di, baseInput.cdbIndex, baseInput.periodDays)
    const poupanca = getPoupancaResult(baseInput.amount, baseInput.poupancaIndex, baseInput.periodDays)
    const lcx = getLcxResult(baseInput.amount, baseInput.di, baseInput.lcxIndex, baseInput.periodDays)

    expect(last.cdb).toBe(netFromCDBResult(baseInput.amount, cdb))
    expect(last.poupanca).toBe(baseInput.amount + poupanca.interestAmount)
    expect(last.lcx).toBe(baseInput.amount + lcx.interestAmount)
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
    const beforeAnniversary = getNetProgression({ ...baseInput, periodDays: 29 })
    const onAnniversary = getNetProgression({ ...baseInput, periodDays: 30 })

    expect(beforeAnniversary[beforeAnniversary.length - 1].poupanca).toBe(1000)
    expect(onAnniversary[onAnniversary.length - 1].poupanca).toBeGreaterThan(1000)
  })

  it('samples typical periods at monthly marks', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 360 })
    const days = points.map(point => point.day)

    expect(days).toEqual([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360])
  })
})

describe('getNetProgression - early redemption tax semantics', () => {
  // Independent re-derivation of the net value, mirroring the financial math.
  function expectedNetAt(amount: number, di: number, yearlyIndex: number, days: number) {
    const dailyFactor = Math.pow(((yearlyIndex / 100) * di) / 100 + 1, 1 / 365)
    const interest = Number.parseFloat((amount * Math.pow(dailyFactor, days) - amount).toFixed(2))
    const iof = getIOFAmount(days, interest)
    const tax = (interest - iof) * (getIndexIR(days) / 100)

    return amount + interest - iof - tax
  }

  it('applies IOF inside the 30-day window and none at day 30', () => {
    const day15 = getNetProgression({ ...baseInput, periodDays: 15 })
    const day30 = getNetProgression({ ...baseInput, periodDays: 30 })

    expect(getIOFPercentage(15)).toBeGreaterThan(0)
    expect(getIOFPercentage(30)).toBe(0)

    expect(day15[day15.length - 1].cdb).toBeCloseTo(
      expectedNetAt(baseInput.amount, baseInput.di, baseInput.cdbIndex, 15),
      2,
    )
    expect(day30[day30.length - 1].cdb).toBeCloseTo(
      expectedNetAt(baseInput.amount, baseInput.di, baseInput.cdbIndex, 30),
      2,
    )
  })

  it('uses the IR bracket of each sampled day, not the final bracket', () => {
    const points = getNetProgression({ ...baseInput, periodDays: 181 })
    const day180 = points.find(point => point.day === 180)!
    const day181 = points.find(point => point.day === 181)!

    expect(getIndexIR(180)).toBe(22.5)
    expect(getIndexIR(181)).toBe(20)

    expect(day180.cdb).toBeCloseTo(
      expectedNetAt(baseInput.amount, baseInput.di, baseInput.cdbIndex, 180),
      2,
    )
    expect(day181.cdb).toBeCloseTo(
      expectedNetAt(baseInput.amount, baseInput.di, baseInput.cdbIndex, 181),
      2,
    )
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

    expect(last.cdbPre).toBe(netFromCDBResult(baseInput.amount, cdbPre))
    expect(last.lcxPre).toBe(baseInput.amount + lcxPre.interestAmount)
  })

  it('ignores non-positive or non-finite prefixado rates', () => {
    const points = getNetProgression({ ...baseInput, cdbPreIndex: 0, lcxPreIndex: Number.POSITIVE_INFINITY })

    expect(points[points.length - 1]).not.toHaveProperty('cdbPre')
    expect(points[points.length - 1]).not.toHaveProperty('lcxPre')
  })
})
