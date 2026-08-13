import type { MarketSnapshot } from '../../../app/src/contracts/market'

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === 'object') {
    Object.freeze(value)
    Object.values(value).forEach(deepFreeze)
  }
  return value
}

export const marketFixture = deepFreeze<MarketSnapshot>({
  schemaVersion: 1,
  generatedAt: '2026-08-09T12:00:00.000Z',
  brazilReferenceDate: '2026-08-09',
  rates: {
    selicEffective: { annualPct: '13.9', referenceDate: '2026-08-07' },
    selicTarget: { annualPct: '14', referenceDate: '2026-08-09' },
    cdi: { annualPct: '13.9', referenceDate: '2026-08-06' },
    ipca12m: { annualPct: '4.64', referenceDate: '2026-06-01' },
    trMonthly: { annualPct: '0.1707990097659211', referenceDate: '2026-08-06' },
  },
  projections: {
    selic: [
      { meeting: 'R5/2026', effectiveDate: '2026-08-06', annualPct: '13.9', estimated: false },
      { meeting: 'R6/2026', effectiveDate: '2026-09-17', annualPct: '13.65', estimated: false },
      { meeting: 'R1/2027', effectiveDate: '2027-01-28', annualPct: '12.65', estimated: false },
      { meeting: 'R1/2028', effectiveDate: '2028-01-25', annualPct: '11.4', estimated: true },
    ],
    ipca: [
      { year: 2026, annualPct: '5.0278' },
      { year: 2027, annualPct: '4.2722' },
      { year: 2028, annualPct: '3.8' },
    ],
  },
  holidays: {
    supportedFrom: '2025-01-01',
    supportedUntil: '2056-12-31',
    dates: [
      { date: '2026-09-07', name: 'Independência do Brasil' },
      { date: '2026-12-25', name: 'Natal' },
      { date: '2027-01-01', name: 'Confraternização Universal' },
      { date: '2027-09-07', name: 'Independência do Brasil' },
      { date: '2027-12-25', name: 'Natal' },
      { date: '2028-01-01', name: 'Confraternização Universal' },
    ],
  },
  sources: {
    'bcb-sgs': {
      url: 'https://dadosabertos.bcb.gov.br/',
      retrievedAt: '2026-08-09T12:00:00.000Z',
      referenceDate: '2026-08-09',
      status: 'fresh',
      lastSuccessfulAt: '2026-08-09T12:00:00.000Z',
    },
  },
})
