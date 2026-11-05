import type { ComparisonRequest } from '~/src/contracts/investment'
import type { MarketSnapshot } from '~/src/contracts/market'
import type { SimulationWorkerResponse } from '~/src/contracts/simulation'
import { simulateComparison } from '~/src/simulation/simulate-comparison'

export function useSimulationWorker() {
  let worker: Worker | undefined
  const workerAvailable = ref(false)
  let requestId = 0

  if (import.meta.client && typeof Worker !== 'undefined') {
    try {
      worker = new Worker(new URL('../workers/simulation.worker.ts', import.meta.url), { type: 'module' })
      workerAvailable.value = true
    }
    catch {
      worker = undefined
    }
  }

  function simulate(request: ComparisonRequest, market: MarketSnapshot) {
    const currentId = ++requestId
    if (!worker) return Promise.resolve(simulateComparison(request, market))
    const activeWorker = worker
    return new Promise<SimulationWorkerResponse['result']>((resolve) => {
      const cleanup = () => {
        activeWorker.removeEventListener('message', handler)
        activeWorker.removeEventListener('error', errorHandler)
      }
      const handler = (event: MessageEvent<SimulationWorkerResponse>) => {
        if (event.data.requestId !== currentId) return
        cleanup()
        resolve(event.data.result)
      }
      const errorHandler = () => {
        cleanup()
        activeWorker.terminate()
        if (worker === activeWorker) worker = undefined
        workerAvailable.value = false
        resolve(simulateComparison(request, market))
      }
      activeWorker.addEventListener('message', handler)
      activeWorker.addEventListener('error', errorHandler, { once: true })
      try {
        activeWorker.postMessage({ requestId: currentId, type: 'simulate', request, market })
      }
      catch {
        errorHandler()
      }
    })
  }

  onScopeDispose(() => worker?.terminate())
  return { simulate, workerAvailable: readonly(workerAvailable) }
}
