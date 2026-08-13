import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SimulationWorkerRequest } from '../../../app/src/contracts/simulation'
import { marketFixture } from '../../fixtures/market-data/snapshot'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('simulation worker boundary', () => {
  it('ignores foreign origins and responds to valid simulation messages', async () => {
    let handler: ((event: MessageEvent<SimulationWorkerRequest>) => void) | undefined
    const postMessage = vi.fn()
    vi.stubGlobal('self', {
      location: { origin: 'https://rendafixa.github.io' },
      addEventListener: (_type: string, listener: typeof handler) => { handler = listener },
      postMessage,
    })
    await import('../../../app/workers/simulation.worker')
    const data: SimulationWorkerRequest = {
      requestId: 7,
      type: 'simulate',
      request: {
        schemaVersion: 1,
        startDate: '2026-08-09',
        principal: '10000',
        useProjections: false,
        investments: [{ id: 'one', name: 'CDB', type: 'cdb-cdi', maturityDate: '2027-08-09', rate: { kind: 'cdi-percent', percentOfCdi: '100' } }],
      },
      market: structuredClone(marketFixture),
    }

    handler?.({ origin: 'https://attacker.example', data } as MessageEvent<SimulationWorkerRequest>)
    handler?.({ origin: '', data: { ...data, type: 'ignored' } } as unknown as MessageEvent<SimulationWorkerRequest>)
    expect(postMessage).not.toHaveBeenCalled()
    handler?.({ origin: '', data } as MessageEvent<SimulationWorkerRequest>)
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({ requestId: 7, type: 'result', result: expect.objectContaining({ ok: true }) }))
  })
})
