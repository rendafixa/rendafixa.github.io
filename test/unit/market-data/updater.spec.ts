import { describe, expect, it, vi } from 'vitest'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { buildSgsUrl, fetchBcbRates, fetchWithRetry, latestSgsRecord, parseBcbDate, parseBrazilianDecimal } from '../../../scripts/market-data/fetch-bcb-sgs.mjs'
import { fetchFocus, latestFocusDate, normalizeIpcaProjections, normalizeSelicProjections } from '../../../scripts/market-data/fetch-focus.mjs'
import { fetchAnbimaRange, fetchAnbimaYear, parseAnbimaHolidays } from '../../../scripts/market-data/fetch-anbima.mjs'
import { fetchCopom, PUBLISHED_COPOM_MEETINGS } from '../../../scripts/market-data/fetch-copom.mjs'
import { normalizeMarketData } from '../../../scripts/market-data/normalize-market-data.mjs'
import { validateMarketData } from '../../../scripts/market-data/validate-market-data.mjs'

const anbimaFixturePath = fileURLToPath(new URL('../../fixtures/market-data/anbima-2026.html', import.meta.url))

function validSnapshot() {
  const rate = { annualPct: '10', referenceDate: '2026-08-07' }
  return {
    schemaVersion: 1,
    generatedAt: '2026-08-09T12:00:00.000Z',
    brazilReferenceDate: '2026-08-09',
    rates: { selicEffective: rate, selicTarget: rate, cdi: rate, ipca12m: rate, trMonthly: rate },
    projections: {
      selic: [{ meeting: 'R6/2026', effectiveDate: '2026-09-17', annualPct: '10', estimated: false }],
      ipca: [{ year: 2026, annualPct: '4' }],
    },
    holidays: { supportedFrom: '2026-01-01', supportedUntil: '2026-12-31', dates: [{ date: '2026-01-01', name: 'Confraternização Universal' }] },
    sources: {
      anbima: { url: 'https://www.anbima.com.br/feriados/', retrievedAt: '2026-08-09T12:00:00.000Z', referenceDate: '2026-08-09', status: 'fresh', lastSuccessfulAt: '2026-08-09T12:00:00.000Z' },
    },
  }
}

describe('market updater normalization', () => {
  it.each([['14,90', '14.9'], ['14.90', '14.9'], ['1.234,56', '1234.56']])('parses %s as %s', (input, expected) => {
    expect(parseBrazilianDecimal(input)).toBe(expected)
  })

  it.each(['invalid', '', '2026-08-09'])('rejects invalid BCB date %s', (input) => {
    expect(() => parseBcbDate(input)).toThrow('Invalid BCB date')
  })

  it('retries transport failures and returns the first valid JSON response', async () => {
    vi.useFakeTimers()
    const fetchImpl = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => [{ value: 1 }] })
    const pending = fetchWithRetry('https://example.test/rate', { retries: 2, fetchImpl })
    await vi.runAllTimersAsync()
    await expect(pending).resolves.toEqual([{ value: 1 }])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('throws the final HTTP failure without retrying when retries is one', async () => {
    await expect(fetchWithRetry('https://example.test/rate', {
      retries: 1,
      fetchImpl: async () => ({ ok: false, status: 503 }),
    })).rejects.toThrow('HTTP 503')
  })

  it('fetches every configured SGS series and rejects an all-future series', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => [{ data: '08/08/2026', valor: '10,5' }] }))
    const rates = await fetchBcbRates('2026-08-09', { fetchImpl })
    expect(Object.keys(rates)).toEqual(['selicEffective', 'selicTarget', 'cdi', 'ipca12m', 'trMonthly'])
    expect(fetchImpl).toHaveBeenCalledTimes(5)
    await expect(fetchBcbRates('2026-08-09', {
      fetchImpl: async () => ({ ok: true, json: async () => [{ data: '10/08/2026', valor: '10,5' }] }),
      retries: 1,
    })).rejects.toThrow('No non-future record')
  })

  it('ignores a future SGS record', () => {
    expect(latestSgsRecord([{ data: '31/07/2026', valor: '14,9' }, { data: '10/08/2026', valor: '99' }], '2026-08-09')).toEqual({ annualPct: '14.9', referenceDate: '2026-07-31' })
  })

  it('requests an explicit one-year SGS range', () => {
    expect(buildSgsUrl(1178, '2026-08-09')).toContain('dataInicial=09/08/2025&dataFinal=09/08/2026')
  })

  it('selects the latest Focus date with baseCalculo 1', () => {
    expect(latestFocusDate([{ Data: '2026-07-30', DataReferencia: '2027', baseCalculo: 1 }, { Data: '2026-08-01', DataReferencia: '2027', baseCalculo: 0 }, { Data: '2026-07-31', DataReferencia: '2028', baseCalculo: 1 }])).toBe('2026-07-31')
  })

  it('normalizes only valid IPCA values from the latest Focus publication', () => {
    expect(normalizeIpcaProjections([
      { Data: '2026-08-01', DataReferencia: '2027', baseCalculo: 1, Mediana: '4,20' },
      { Data: '2026-08-02', DataReferencia: '2028', baseCalculo: 1, Mediana: '3,80' },
      { Data: '2026-08-02', DataReferencia: 'invalid', baseCalculo: 1, Mediana: '3,50' },
      { Data: '2026-08-02', DataReferencia: '2029', baseCalculo: 0, Mediana: '3,40' },
    ])).toEqual([{ year: 2028, annualPct: '3.8' }])
  })

  it('requests both Focus datasets and normalizes absent values to empty arrays', async () => {
    const fetchImpl = vi.fn(async url => ({
      ok: true,
      json: async () => String(url).includes('Selic') ? { value: [{ Data: '2026-08-02' }] } : {},
    }))
    await expect(fetchFocus({ fetchImpl })).resolves.toEqual({ selic: [{ Data: '2026-08-02' }], ipca: [] })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('joins official Copom meetings and estimates later dates', () => {
    const records = [{ Data: '2026-07-31', baseCalculo: 1, Reuniao: 'R1/2027', Mediana: '12,50' }, { Data: '2026-07-31', baseCalculo: 1, Reuniao: 'R2/2027', Mediana: '12,00' }]
    const result = normalizeSelicProjections(records, [{ meeting: 'R1/2027', effectiveDate: '2027-01-28' }])
    expect(result[0]).toMatchObject({ effectiveDate: '2027-01-28', estimated: false, annualPct: '12.4' })
    expect(result[1]?.estimated).toBe(true)
  })

  it('returns the immutable published Copom calendar', async () => {
    expect(await fetchCopom()).toBe(PUBLISHED_COPOM_MEETINGS)
    expect(PUBLISHED_COPOM_MEETINGS).toContainEqual({ meeting: 'R8/2027', effectiveDate: '2027-12-09' })
  })

  it('parses the one-digit dates and HTML entities returned by ANBIMA', async () => {
    const html = await fs.readFile(anbimaFixturePath, 'utf8')
    expect(parseAnbimaHolidays(html, 2026)).toEqual([
      { date: '2026-01-01', name: 'Confraternização Universal' },
      { date: '2026-04-21', name: 'Tiradentes' },
      { date: '2026-11-15', name: 'Proclamação da República' },
    ])
  })

  it('retries ANBIMA requests and only accepts parsed holidays', async () => {
    let calls = 0
    const html = await fs.readFile(anbimaFixturePath, 'utf8')
    const fetchImpl = async () => {
      calls++
      if (calls === 1) throw new Error('network')
      return { ok: true, text: async () => html }
    }
    expect(await fetchAnbimaYear(2026, { fetchImpl, backoffMs: 0 })).toHaveLength(3)
    expect(calls).toBe(2)
  })

  it('rejects an empty first ANBIMA year instead of creating inverted coverage', async () => {
    const fetchImpl = async () => ({ ok: true, text: async () => '<html></html>' })
    await expect(fetchAnbimaRange(2026, 2027, { fetchImpl, retries: 1 })).rejects.toThrow('ANBIMA unavailable from 2026')
  })

  it('stops ANBIMA coverage at the last populated year', async () => {
    const html = await fs.readFile(anbimaFixturePath, 'utf8')
    const fetchImpl = async url => ({ ok: true, text: async () => String(url).includes('/2026.asp') ? html : '<html></html>' })
    const result = await fetchAnbimaRange(2026, 2027, { fetchImpl, retries: 1 })
    expect(result.supportedUntil).toBe('2026-12-31')
    expect(result.dates).toHaveLength(3)
  })

  it('rejects empty or inverted holiday coverage', () => {
    const snapshot = validSnapshot()
    snapshot.holidays = { supportedFrom: '2026-01-01', supportedUntil: '2025-12-31', dates: [] }
    expect(() => validateMarketData(snapshot)).toThrow()
  })

  it('marks old daily rates and Focus observations as stale', () => {
    const rates = Object.fromEntries(['selicEffective', 'selicTarget', 'cdi', 'ipca12m', 'trMonthly'].map(key => [key, { annualPct: '10', referenceDate: '2026-07-01' }]))
    const focus = { selic: [{ Data: '2026-07-01', baseCalculo: 1, Reuniao: 'R1', Mediana: '10' }], ipca: [{ Data: '2026-07-01', DataReferencia: '2027', baseCalculo: 1, Mediana: '4' }] }
    const snapshot = normalizeMarketData({ referenceDate: '2026-07-31', now: new Date('2026-07-31T14:00:00Z'), rates, focus, copom: [], holidays: { supportedFrom: '2026-01-01', supportedUntil: '2026-12-31', dates: [] } })
    expect(snapshot.sources['bcb-sgs'].status).toBe('stale')
    expect(snapshot.sources.focus.status).toBe('stale')
  })

  it('respects the monthly publication cadence of IPCA', () => {
    const rates = {
      selicEffective: { annualPct: '10', referenceDate: '2026-08-07' },
      selicTarget: { annualPct: '10', referenceDate: '2026-08-09' },
      cdi: { annualPct: '10', referenceDate: '2026-08-06' },
      ipca12m: { annualPct: '4', referenceDate: '2026-06-01' },
      trMonthly: { annualPct: '0.1', referenceDate: '2026-08-06' },
    }
    const snapshot = normalizeMarketData({
      referenceDate: '2026-08-09',
      now: new Date('2026-08-09T14:00:00Z'),
      rates,
      focus: undefined,
      copom: undefined,
      holidays: undefined,
      previous: validSnapshot(),
    })
    expect(snapshot.sources['bcb-sgs']).toMatchObject({ referenceDate: '2026-08-09', status: 'fresh' })
  })
})
