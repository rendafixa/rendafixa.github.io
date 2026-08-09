import { fetchWithRetry, parseBrazilianDecimal } from './fetch-bcb-sgs.mjs'

export function latestFocusDate(records) {
  return records.filter(record => Number(record.baseCalculo) === 1).map(record => record.Data).sort().at(-1)
}

export function normalizeIpcaProjections(records) {
  const latest = latestFocusDate(records)
  return records.filter(record => Number(record.baseCalculo) === 1 && record.Data === latest)
    .map(record => ({ year: Number(record.DataReferencia), annualPct: parseBrazilianDecimal(record.Mediana) }))
    .filter(record => Number.isInteger(record.year))
    .sort((left, right) => left.year - right.year)
}

export function normalizeSelicProjections(records, meetings = []) {
  const latest = latestFocusDate(records)
  const official = new Map(meetings.map(item => [item.meeting, item.effectiveDate]))
  const filtered = records.filter(record => Number(record.baseCalculo) === 1 && record.Data === latest)
  let lastDate = meetings.map(item => item.effectiveDate).sort().at(-1) ?? latest
  return filtered.map((record, index) => {
    const meeting = record.Reuniao ?? `R${index + 1}`
    let effectiveDate = official.get(meeting)
    const estimated = !effectiveDate
    if (!effectiveDate) {
      const date = new Date(`${lastDate}T12:00:00Z`)
      date.setUTCDate(date.getUTCDate() + Math.round(45.5))
      effectiveDate = date.toISOString().slice(0, 10)
    }
    lastDate = effectiveDate
    return { meeting, effectiveDate, annualPct: String(Number(parseBrazilianDecimal(record.Mediana)) - 0.1), estimated }
  }).sort((left, right) => left.effectiveDate.localeCompare(right.effectiveDate))
}

export async function fetchFocus(options = {}) {
  const base = 'https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata'
  const selicQuery = '?$format=json&$filter=baseCalculo%20eq%201&$orderby=Data%20desc&$top=500'
  const ipcaQuery = '?$format=json&$filter=baseCalculo%20eq%201%20and%20Indicador%20eq%20%27IPCA%27&$orderby=Data%20desc&$top=500'
  const [selic, ipca] = await Promise.all([
    fetchWithRetry(`${base}/ExpectativasMercadoSelic${selicQuery}`, options),
    fetchWithRetry(`${base}/ExpectativasMercadoAnuais${ipcaQuery}`, options),
  ])
  return { selic: selic.value ?? [], ipca: ipca.value ?? [] }
}
