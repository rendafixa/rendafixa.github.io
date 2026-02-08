import { describe, expect, it } from 'vitest'
import { getLcxResult } from '../../../app/src/lcx'

describe('getLcxResult function', () => {
  it('calculates LCI/LCA interest correctly with typical values', () => {
    const result = getLcxResult(1000, 1.0003105377556554, 13.75, 365)
    
    expect(result.interestAmount).toBeCloseTo(1.38, 2)
  })

  it('calculates LCI/LCA interest for shorter period', () => {
    const result = getLcxResult(5000, 1.0003105377556554, 12.5, 180)
    
    expect(result.interestAmount).toBeCloseTo(3.08, 2)
  })

  it('returns zero interest for zero amount', () => {
    const result = getLcxResult(0, 1.0003105377556554, 13.75, 365)
    
    expect(result.interestAmount).toBe(0)
  })

  it('handles zero yearly index rate', () => {
    const result = getLcxResult(1000, 1.0003105377556554, 0, 365)
    
    expect(result.interestAmount).toBe(0)
  })

  it('calculates interest correctly for high yearly rate', () => {
    const result = getLcxResult(10000, 1.0003105377556554, 20, 365)
    
    expect(result.interestAmount).toBeCloseTo(20.01, 2)
  })

  it('returns only interestAmount (no tax/IOF for LCI/LCA)', () => {
    const result = getLcxResult(1000, 1.0003105377556554, 13.75, 365)
    
    expect(result).toHaveProperty('interestAmount')
    expect(result).not.toHaveProperty('taxAmount')
    expect(result).not.toHaveProperty('iofAmount')
    expect(result).not.toHaveProperty('taxPercentage')
  })

  it('works with realistic DI index from BCB', () => {
    const result = getLcxResult(10000, 1.0003105377556554, 14.25, 730)
    expect(result.interestAmount).toBeCloseTo(28.53, 2)
  })

  it('calculates higher interest for longer periods', () => {
    const shortTerm = getLcxResult(1000, 1.0003105377556554, 13.75, 180)
    const longTerm = getLcxResult(1000, 1.0003105377556554, 13.75, 720)
    
    expect(longTerm.interestAmount).toBeGreaterThan(shortTerm.interestAmount)
  })

  it('scales proportionally with principal amount', () => {
    const small = getLcxResult(1000, 1.0003105377556554, 13.75, 365)
    const large = getLcxResult(10000, 1.0003105377556554, 13.75, 365)
    
    expect(large.interestAmount).toBeCloseTo(small.interestAmount * 10, 1)
  })
})