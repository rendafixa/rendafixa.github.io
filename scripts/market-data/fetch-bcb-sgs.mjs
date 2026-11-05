export const SGS_SERIES = { selicEffective: 1178, selicTarget: 432, cdi: 4389, ipca12m: 13522, trMonthly: 226 }

export async function fetchWithRetry(url, { retries = 3, timeoutMs = 10_000, fetchImpl = fetch } = {}) {
  let lastError
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetchImpl(url, { signal: controller.signal, headers: { 'User-Agent': 'rendafixa-updater/2.0 (+https://github.com/rendafixa/rendafixa.github.io)' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    }
    catch (error) {
      lastError = error
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, 250 * 2 ** (attempt - 1)))
    }
    finally {
      clearTimeout(timeout)
    }
  }
  throw lastError
}

export function parseBrazilianDecimal(value) {
  const normalized = String(value).trim().replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.')
  const number = Number.parseFloat(normalized)
  if (!Number.isFinite(number)) throw new Error(`Invalid decimal: ${String(value).slice(0, 40)}`)
  return String(number)
}

export function parseBcbDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) throw new Error(`Invalid BCB date: ${value}`)
  return `${match[3]}-${match[2]}-${match[1]}`
}

export function latestSgsRecord(records, referenceDate) {
  return records
    .map(record => ({ annualPct: parseBrazilianDecimal(record.valor), referenceDate: parseBcbDate(record.data) }))
    .filter(record => record.referenceDate <= referenceDate)
    .sort((left, right) => right.referenceDate.localeCompare(left.referenceDate))[0]
}

export function buildSgsUrl(series, referenceDate) {
  const endDate = new Date(`${referenceDate}T12:00:00Z`)
  const startDate = new Date(endDate)
  startDate.setUTCFullYear(startDate.getUTCFullYear() - 1)
  const format = date => [date.getUTCDate(), date.getUTCMonth() + 1, date.getUTCFullYear()]
    .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
    .join('/')
  return `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${series}/dados?formato=json&dataInicial=${format(startDate)}&dataFinal=${format(endDate)}`
}

export async function fetchBcbRates(referenceDate, options = {}) {
  const entries = await Promise.all(Object.entries(SGS_SERIES).map(async ([name, series]) => {
    const records = await fetchWithRetry(buildSgsUrl(series, referenceDate), options)
    const latest = latestSgsRecord(records, referenceDate)
    if (!latest) throw new Error(`No non-future record for SGS ${series}`)
    return [name, latest]
  }))
  return Object.fromEntries(entries)
}
