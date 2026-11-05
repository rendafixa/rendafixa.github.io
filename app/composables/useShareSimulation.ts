import type { ComparisonRequest } from '~/src/contracts/investment'
import { decodeSharePayload, encodeSharePayload } from '~/src/sharing/codec'
import type { ChartPreferences } from '~/stores/comparison'

export function useShareSimulation() {
  const fallbackUrl = ref('')
  const shareError = ref('')

  async function copySimulation(request: ComparisonRequest, chart: ChartPreferences) {
    const encoded = encodeSharePayload({ v: 1, p: request.principal, d: request.startDate, projected: request.useProjections, investments: request.investments, chart })
    if (!encoded.ok) {
      shareError.value = encoded.errors[0]?.message ?? 'Não foi possível criar o link.'
      return false
    }
    const url = new URL(globalThis.location?.href ?? 'https://rendafixa.github.io/')
    url.searchParams.set('sim', encoded.value)
    try {
      await navigator.clipboard.writeText(url.toString())
      fallbackUrl.value = ''
      return true
    }
    catch {
      fallbackUrl.value = url.toString()
      return false
    }
  }

  function readFromLocation(): { request: ComparisonRequest, chart: ChartPreferences } | undefined {
    if (!import.meta.client) return undefined
    const value = new URLSearchParams(location.search).get('sim')
    if (!value) return undefined
    const decoded = decodeSharePayload(value)
    if (!decoded.ok) {
      shareError.value = decoded.errors[0]?.message ?? 'Link inválido.'
      return undefined
    }
    return {
      request: { schemaVersion: 1, principal: decoded.value.p, startDate: decoded.value.d as ComparisonRequest['startDate'], useProjections: decoded.value.projected, investments: decoded.value.investments as ComparisonRequest['investments'] },
      chart: { mode: decoded.value.chart?.mode ?? 'value', range: decoded.value.chart?.range ?? 'full', reference: decoded.value.chart?.reference ?? 'none', labels: decoded.value.chart?.labels ?? false },
    }
  }

  return { fallbackUrl, shareError, copySimulation, readFromLocation }
}
