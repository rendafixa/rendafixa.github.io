/// <reference lib="webworker" />
import type { SimulationWorkerRequest, SimulationWorkerResponse } from '../src/contracts/simulation'
import { simulateComparison } from '../src/simulation/simulate-comparison'

self.addEventListener('message', (event: MessageEvent<SimulationWorkerRequest>) => {
  if (event.origin !== '' && event.origin !== self.location.origin) return
  if (!event.data || event.data.type !== 'simulate') return
  const response: SimulationWorkerResponse = {
    requestId: event.data.requestId,
    type: 'result',
    result: simulateComparison(event.data.request, event.data.market),
  }
  self.postMessage(response)
})
