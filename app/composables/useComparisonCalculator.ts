import marketData from '~/assets/market-data.json'
import type { ComparisonRequest } from '~/src/contracts/investment'
import { validateMarketSnapshot } from '~/src/market/validate-snapshot'
import { useComparisonStore } from '~/stores/comparison'

export function useComparisonCalculator() {
  const store = useComparisonStore()
  const { simulate } = useSimulationWorker()
  const validation = validateMarketSnapshot(marketData)
  const market = validation.ok ? validation.value : undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let calculationId = 0

  async function recalculate() {
    const currentCalculationId = ++calculationId
    if (!market) {
      store.errorMessage = 'Os dados de mercado não puderam ser carregados.'
      return
    }
    store.loading = !store.result
    const request = structuredClone(store.request) as ComparisonRequest
    const calculation = await simulate(request, market)
    if (currentCalculationId !== calculationId) return
    if (calculation.ok) {
      store.result = calculation.value
      store.errorMessage = ''
    }
    else {
      store.errorMessage = calculation.errors.map(error => error.message).join(' ')
    }
    store.loading = false
  }

  watch(() => store.request, () => {
    clearTimeout(timer)
    timer = setTimeout(recalculate, 120)
  }, { deep: true, immediate: true })
  onScopeDispose(() => clearTimeout(timer))
  return { store, market, recalculate }
}
