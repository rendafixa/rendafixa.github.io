import { describe, expect, it } from 'vitest'
import { evaluateFgc } from '../../../app/src/finance/fgc'

describe('FGC coverage', () => {
  it('does not cover Treasury investments', () => {
    expect(evaluateFgc(true, '2026-08-09', '10000', [])).toEqual({ covered: false, label: 'Tesouro Nacional' })
  })

  it('covers balances that remain within the limit', () => {
    expect(evaluateFgc(false, '2026-08-09', '10000', [{ date: '2027-08-09', grossValue: '250000', netValue: '240000' }]))
      .toEqual({ covered: true, limit: '250000', exceeded: false })
  })

  it('reports an initial balance that already exceeds the limit', () => {
    expect(evaluateFgc(false, '2026-08-09', '260000', [])).toEqual({
      covered: true, limit: '250000', exceeded: true, exceededOn: '2026-08-09', balanceOnDate: '260000', uncoveredAtMaturity: '10000',
    })
  })

  it('reports the first timeline balance that exceeds the limit', () => {
    expect(evaluateFgc(false, '2026-08-09', '10000', [
      { date: '2026-09-09', grossValue: '249999', netValue: '249999' },
      { date: '2026-10-09', grossValue: '250100', netValue: '250100' },
      { date: '2026-11-09', grossValue: '260000', netValue: '260000' },
    ])).toEqual({
      covered: true, limit: '250000', exceeded: true, exceededOn: '2026-10-09', balanceOnDate: '250100', uncoveredAtMaturity: '10000',
    })
  })
})
