import marketData from '~/assets/market-data.json'
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
    const request = structuredClone(toPlain(store.request))
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

function toPlain<T>(value: T): T {
  const raw = toRaw(value) as T
  if (Array.isArray(raw)) return raw.map(item => toPlain(item)) as T
  if (raw !== null && typeof raw === 'object') {
    return Object.fromEntries(Object.entries(raw).map(([key, item]) => [key, toPlain(item)])) as T
  }
  return raw
}
