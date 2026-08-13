import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { marketFixture } from '../../fixtures/market-data/snapshot'

import { brazilDate, updateIndexes } from '../../../update-indexes.mjs'

const mocks = vi.hoisted(() => ({
  fetchBcbRates: vi.fn(),
  fetchFocus: vi.fn(),
  fetchCopom: vi.fn(),
  fetchAnbimaRange: vi.fn(),
}))

vi.mock('../../../scripts/market-data/fetch-bcb-sgs.mjs', async importOriginal => ({
  ...await importOriginal<typeof import('../../../scripts/market-data/fetch-bcb-sgs.mjs')>(),
  fetchBcbRates: mocks.fetchBcbRates,
}))
vi.mock('../../../scripts/market-data/fetch-focus.mjs', async importOriginal => ({
  ...await importOriginal<typeof import('../../../scripts/market-data/fetch-focus.mjs')>(),
  fetchFocus: mocks.fetchFocus,
}))
vi.mock('../../../scripts/market-data/fetch-copom.mjs', () => ({ fetchCopom: mocks.fetchCopom }))
vi.mock('../../../scripts/market-data/fetch-anbima.mjs', async importOriginal => ({
  ...await importOriginal<typeof import('../../../scripts/market-data/fetch-anbima.mjs')>(),
  fetchAnbimaRange: mocks.fetchAnbimaRange,
}))

const temporaryDirectories: string[] = []
const now = new Date('2026-08-09T14:00:00.000Z')

function configureSuccessfulSources() {
  mocks.fetchBcbRates.mockResolvedValue(structuredClone(marketFixture.rates))
  mocks.fetchFocus.mockResolvedValue({
    selic: [{ Data: '2026-08-07', baseCalculo: 1, Reuniao: 'R6/2026', Mediana: '13,75' }],
    ipca: [{ Data: '2026-08-07', DataReferencia: '2027', baseCalculo: 1, Mediana: '4,27' }],
  })
  mocks.fetchCopom.mockResolvedValue(structuredClone(marketFixture.projections.selic))
  mocks.fetchAnbimaRange.mockResolvedValue(structuredClone(marketFixture.holidays))
}

async function targetPath() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'rendafixa-market-'))
  temporaryDirectories.push(directory)
  return path.join(directory, 'market-data.json')
}

beforeEach(() => {
  vi.clearAllMocks()
  configureSuccessfulSources()
})

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => fs.rm(directory, { recursive: true, force: true })))
})

describe('market snapshot updater orchestration', () => {
  it('uses the São Paulo civil date at the UTC boundary', () => {
    expect(brazilDate(new Date('2026-08-10T01:00:00.000Z'))).toBe('2026-08-09')
  })

  it('writes a validated snapshot atomically', async () => {
    const target = await targetPath()
    const snapshot = await updateIndexes(target, { now })

    expect(JSON.parse(await fs.readFile(target, 'utf8'))).toEqual(snapshot)
    await expect(fs.access(`${target}.tmp`)).rejects.toThrow()
  })

  it('preserves the previous projections when Focus fails', async () => {
    const target = await targetPath()
    await fs.writeFile(target, `${JSON.stringify(marketFixture, null, 2)}\n`)
    mocks.fetchFocus.mockRejectedValue(new Error('Focus offline'))
    const warn = vi.fn()

    const snapshot = await updateIndexes(target, { now, logger: { warn } })

    expect(snapshot.projections).toEqual(marketFixture.projections)
    expect(snapshot.sources.focus.status).toBe('stale')
    expect(warn).toHaveBeenCalledWith('[WARN] Focus: Focus offline')
  })

  it('does not write an invalid snapshot when required sources fail without fallback', async () => {
    const target = await targetPath()
    mocks.fetchBcbRates.mockRejectedValue(new Error('BCB offline'))

    await expect(updateIndexes(target, { now })).rejects.toThrow('no valid previous snapshot')
    await expect(fs.access(target)).rejects.toThrow()
  })
})
