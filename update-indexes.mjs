import axios from 'axios'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const USER_AGENT = 'rendafixa-updater/1.0 (+https://github.com/rendafixa/rendafixa.github.io)'
export const REQUEST_TIMEOUT_MS = 15_000
export const MAX_RETRIES = 3
export const INITIAL_BACKOFF_MS = 1_000

export const URLS = {
  poupanca: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json',
  cdi: 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json',
  selic: 'https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros',
}

export const apiClient = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'User-Agent': USER_AGENT },
})

export async function fetchWithRetry(url, retries = MAX_RETRIES, backoffMs = INITIAL_BACKOFF_MS) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await apiClient.get(url)
    }
    catch (error) {
      const status = error.response?.status
      const isRetryable = !status || status >= 500
      if (attempt < retries && isRetryable) {
        console.warn(`  Attempt ${attempt}/${retries} failed (${error.message}). Retrying in ${backoffMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
        backoffMs *= 2
      }
      else {
        throw error
      }
    }
  }
}

function parseBcbSeriesValue(data, label) {
  if (!Array.isArray(data) || data.length === 0) {
    console.error(`[ERROR] BCB API returned no data for ${label}:`, data)
    return null
  }
  const first = data[0]
  if (!first?.valor) {
    console.error(`[ERROR] Unexpected BCB API payload shape for ${label} (missing "valor"):`, data)
    return null
  }
  const value = Number.parseFloat(first.valor)
  if (!Number.isFinite(value)) {
    console.error(`[ERROR] Invalid ${label} value (not a finite number):`, first.valor)
    return null
  }
  return value
}

export async function fetchPoupanca() {
  try {
    console.log('Fetching Poupanca...')
    const response = await fetchWithRetry(URLS.poupanca)
    const value = parseBcbSeriesValue(response.data, 'Poupanca')
    if (value !== null) {
      console.log('Poupanca value fetched:', value)
    }
    return value
  }
  catch (error) {
    console.error(`Error fetching Poupanca after ${MAX_RETRIES} attempts:`, error.message)
    return null
  }
}

export async function fetchDi() {
  try {
    console.log('Fetching DI...')
    const response = await fetchWithRetry(URLS.cdi)
    const value = parseBcbSeriesValue(response.data, 'CDI')
    if (value !== null) {
      console.log('DI value fetched:', value)
    }
    return value
  }
  catch (error) {
    console.error(`Error fetching DI after ${MAX_RETRIES} attempts:`, error.message)
    return null
  }
}

export async function fetchSelic() {
  try {
    console.log('Fetching Selic...')
    const response = await fetchWithRetry(URLS.selic)
    const value = response.data?.conteudo?.[0]?.MetaSelic
    if (value == null || !Number.isFinite(value)) {
      console.error('[ERROR] Invalid Selic response:', response.data)
      return null
    }
    console.log('Selic value fetched:', value)
    return value
  }
  catch (error) {
    console.error(`Error fetching Selic after ${MAX_RETRIES} attempts:`, error.message)
    return null
  }
}

export async function updateIndicadores(targetPath) {
  const raw = fs.readFileSync(targetPath, 'utf-8')
  const indicadores = JSON.parse(raw)

  const [poupancaValue, selicValue, cdiValue] = await Promise.all([
    fetchPoupanca(),
    fetchSelic(),
    fetchDi(),
  ])

  let updated = 0

  if (poupancaValue != null) {
    indicadores.poupanca.value = poupancaValue
    updated++
  }
  else {
    console.warn('Skipping update: Invalid poupanca value.')
  }

  if (selicValue != null) {
    indicadores.selic.value = selicValue
    updated++
  }
  else {
    console.warn('Skipping update: Invalid selic value.')
  }

  if (cdiValue != null) {
    indicadores.cdi.value = cdiValue
    updated++
  }
  else {
    console.warn('Skipping update: Invalid cdi value.')
  }

  if (updated === 0) {
    throw new Error('All API calls failed. No values updated.')
  }

  fs.writeFileSync(targetPath, `${JSON.stringify(indicadores, null, 2)}\n`)
  console.log(`indicadores.json updated successfully (${updated}/3 values).`)
}

// Only run when executed directly (not imported by tests)
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const indicadoresPath = path.join(__dirname, 'app', 'assets', 'indicadores.json')
  try {
    await updateIndicadores(indicadoresPath)
  }
  catch (error) {
    console.error(`[FATAL] ${error.message}`)
    process.exit(1)
  }
}
