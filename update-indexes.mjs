import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchAnbimaRange } from './scripts/market-data/fetch-anbima.mjs'
import { fetchBcbRates } from './scripts/market-data/fetch-bcb-sgs.mjs'
import { fetchCopom } from './scripts/market-data/fetch-copom.mjs'
import { fetchFocus } from './scripts/market-data/fetch-focus.mjs'
import { normalizeMarketData } from './scripts/market-data/normalize-market-data.mjs'
import { validateMarketData } from './scripts/market-data/validate-market-data.mjs'

const currentFile = fileURLToPath(import.meta.url)
const root = path.dirname(currentFile)
export const MARKET_DATA_PATH = path.join(root, 'app/assets/market-data.json')

export function brazilDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export async function updateIndexes(targetPath = MARKET_DATA_PATH, options = {}) {
  const now = options.now ?? new Date()
  const referenceDate = brazilDate(now)
  let previous
  try {
    previous = validateMarketData(JSON.parse(await fs.readFile(targetPath, 'utf8')))
  }
  catch {
    previous = undefined
  }

  const settled = await Promise.allSettled([
    fetchBcbRates(referenceDate, options), fetchFocus(options), fetchCopom(options),
    fetchAnbimaRange(Number(referenceDate.slice(0, 4)) - 1, Number(referenceDate.slice(0, 4)) + 30, options),
  ])
  const labels = ['BCB SGS', 'Focus', 'Copom', 'ANBIMA']
  settled.forEach((result, index) => {
    if (result.status === 'rejected') options.logger?.warn?.(`[WARN] ${labels[index]}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`)
  })
  const value = index => settled[index].status === 'fulfilled' ? settled[index].value : undefined
  const [rates, focus, copom, holidays] = [value(0), value(1), value(2), value(3)]
  if ((!rates || !focus || !holidays) && !previous) throw new Error('Market sources failed and no valid previous snapshot exists.')
  const snapshot = validateMarketData(normalizeMarketData({ referenceDate, now, rates, focus, copom, holidays, previous }))
  const output = `${JSON.stringify(snapshot, null, 2)}\n`
  const oldOutput = previous ? `${JSON.stringify(previous, null, 2)}\n` : ''
  if (output !== oldOutput) {
    const temporaryPath = `${targetPath}.tmp`
    await fs.writeFile(temporaryPath, output)
    await fs.rename(temporaryPath, targetPath)
  }
  return snapshot
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  try {
    const snapshot = await updateIndexes(MARKET_DATA_PATH, { logger: console })
    const stale = Object.entries(snapshot.sources).filter(([, source]) => source.status === 'stale').map(([name]) => name)
    console.log(stale.length ? `market-data.json updated with stale sources: ${stale.join(', ')}.` : 'market-data.json updated successfully; all sources are fresh.')
  }
  catch (error) {
    console.error(`[FATAL] ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}
