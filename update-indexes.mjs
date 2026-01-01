import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, 'app', 'assets', 'indicadores.json')
let indicadores
if (!fs.existsSync(filePath)) {
  console.error(`[ERROR] File not found or inaccessible: ${filePath}`)
  process.exit(1)
}
try {
  const rawData = fs.readFileSync(filePath, 'utf-8')
  try {
    indicadores = JSON.parse(rawData)
  } catch (parseError) {
    console.error(`[ERROR] Malformed JSON in indicadores.json at ${filePath}`)
    console.error(parseError.stack || parseError)
    process.exit(1)
  }
} catch (fileError) {
  console.error(`[ERROR] Unable to read indicadores.json at ${filePath}`)
  console.error(fileError.stack || fileError)
  process.exit(1)
}

async function fetchPoupanca() {
  try {
    console.log('Fetching Poupanca...')
    const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json')
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.error('[ERROR] BCB API returned no data for Poupanca:', response.data)
      return null
    }
    const first = response.data[0]
    if (!first || typeof first.valor === 'undefined') {
      console.error('[ERROR] Unexpected BCB API payload shape (missing "valor"): ', response.data)
      return null
    }
    const value = Number.parseFloat(first.valor)
    if (!Number.isFinite(value)) {
      console.error('[ERROR] Invalid Poupanca value received (not a finite number):', first.valor)
      console.error('Full payload:', response.data)
      return null
    }
    console.log('Poupanca value fetched:', value)
    return value
  }
  catch (error) {
    console.error('Error fetching Poupanca:', error)
    return null
  }
}

async function fetchDi() {
  try {
    console.log('Fetching DI...')
    const response = await axios.get('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados/ultimos/13?formato=json')
    if (!Array.isArray(response.data) || response.data.length <= 1) {
      console.error('[ERROR] BCB API returned insufficient DI data (need at least 2 items):', response.data)
      return 0
    }
    const data = response.data.slice(1) // Ignores the partial value of current month
    const value = data.reduce((acc, item) => {
      const num = Number.parseFloat(item.valor)
      if (!Number.isFinite(num)) {
        console.warn('[WARN] Skipping non-numeric DI value:', item.valor)
        return acc
      }
      return acc + num
    }, 0)
    console.log('DI value fetched:', value)
    return value
  }
  catch (error) {
    console.error('Error fetching DI:', error)
    return null
  }
}

async function fetchSelic() {
  try {
    console.log('Fetching Selic...')
    const response = await axios.get('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros')
    const value = response.data.conteudo[0].MetaSelic
    console.log('Selic value fetched:', value)
    return value
  }
  catch (error) {
    console.error('Error fetching Selic:', error)
    return null
  }
}

async function updateIndicadores() {
  try {
    const poupancaValue = await fetchPoupanca()
    const selicValue = await fetchSelic()
    const cdiValue = await fetchDi()

    if (!poupancaValue || isNaN(poupancaValue)) {
      console.warn('Skipping update: Invalid poupanca value.')
    }
    else {
      indicadores.poupanca.value = poupancaValue
    }

    if (selicValue !== null && selicValue !== undefined && !isNaN(selicValue)) {
      indicadores.selic.value = selicValue
    } else {
      console.warn('Skipping update: Invalid selic value.')
    }
    if (cdiValue !== null && cdiValue !== undefined && !isNaN(cdiValue)) {
      indicadores.cdi.value = cdiValue
    } else {
      console.warn('Skipping update: Invalid cdi value.')
    }

    fs.writeFileSync(filePath, JSON.stringify(indicadores, null, 2))
    console.log('indicadores.json updated successfully')
  }
  catch (error) {
    console.error('Error updating indicadores.json:', error)
  }
}

await updateIndicadores()
