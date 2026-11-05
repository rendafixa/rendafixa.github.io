import { describe, expect, it } from 'vitest'
import { validateMarketSnapshot } from '../../../app/src/market/validate-snapshot'
import { marketFixture } from '../../fixtures/market-data/snapshot'

describe('runtime market snapshot validation', () => {
  it('accepts the immutable test fixture', () => {
    expect(validateMarketSnapshot(marketFixture)).toMatchObject({ ok: true, value: marketFixture })
  })

  it.each([
    { ...marketFixture, brazilReferenceDate: '2026-02-30' },
    { ...marketFixture, rates: { ...marketFixture.rates, cdi: { annualPct: '', referenceDate: '2026-08-06' } } },
    { ...marketFixture, holidays: { supportedFrom: '2027-01-01', supportedUntil: '2026-01-01', dates: marketFixture.holidays.dates } },
  ])('returns a domain error for malformed snapshots', (snapshot) => {
    expect(validateMarketSnapshot(snapshot)).toEqual({
      ok: false,
      errors: [{ code: 'market-data-unavailable', message: 'Snapshot de mercado inválido.' }],
    })
  })
})
