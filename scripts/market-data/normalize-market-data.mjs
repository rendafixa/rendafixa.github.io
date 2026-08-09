import { latestFocusDate, normalizeIpcaProjections, normalizeSelicProjections } from './fetch-focus.mjs'

export function normalizeMarketData({ referenceDate, now, rates, focus, copom, holidays, previous }) {
  const generatedAt = now.toISOString()
  const source = (key, url, section, sectionReferenceDate, stale) => {
    const prior = previous?.sources?.[key]
    if (!section) return { ...(prior ?? { url, referenceDate: sectionReferenceDate, lastSuccessfulAt: previous?.generatedAt ?? generatedAt }), retrievedAt: generatedAt, status: 'stale' }
    return { url, retrievedAt: generatedAt, referenceDate: sectionReferenceDate, status: stale ? 'stale' : 'fresh', lastSuccessfulAt: generatedAt }
  }
  const ratesReferenceDate = rates ? Object.values(rates).map(rate => rate.referenceDate).sort((left, right) => left.localeCompare(right)).at(-1) : referenceDate
  const ratesStale = !rates
    || ['selicEffective', 'selicTarget', 'cdi', 'trMonthly'].some(key => businessDaysBetween(rates[key].referenceDate, referenceDate) > 3)
    || calendarDaysBetween(rates.ipca12m.referenceDate, referenceDate) > 75
  const focusReferenceDate = focus
    ? [latestFocusDate(focus.selic), latestFocusDate(focus.ipca)].sort((left, right) => left.localeCompare(right))[0]
    : referenceDate
  return {
    schemaVersion: 1,
    generatedAt,
    brazilReferenceDate: referenceDate,
    rates: rates ?? previous?.rates,
    projections: focus ? { selic: normalizeSelicProjections(focus.selic, copom ?? previous?.projections?.selic ?? []), ipca: normalizeIpcaProjections(focus.ipca) } : previous?.projections,
    holidays: holidays ?? previous?.holidays,
    sources: {
      'bcb-sgs': source('bcb-sgs', 'https://dadosabertos.bcb.gov.br/', rates, ratesReferenceDate, ratesStale),
      'focus': source('focus', 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/', focus, focusReferenceDate, calendarDaysBetween(focusReferenceDate, referenceDate) > 10),
      'copom': source('copom', 'https://www.bcb.gov.br/controleinflacao/copom', copom, referenceDate, false),
      'anbima': source('anbima', 'https://www.anbima.com.br/feriados/', holidays, referenceDate, false),
    },
  }
}

function calendarDaysBetween(start, end) {
  return Math.floor((new Date(`${end}T12:00:00Z`) - new Date(`${start}T12:00:00Z`)) / 86_400_000)
}

function businessDaysBetween(start, end) {
  let count = 0
  for (let date = new Date(`${start}T12:00:00Z`); date < new Date(`${end}T12:00:00Z`);) {
    date.setUTCDate(date.getUTCDate() + 1)
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) count++
  }
  return count
}
