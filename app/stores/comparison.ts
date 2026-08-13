import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ComparisonRequest, InvestmentInput, IsoDate } from '~/src/contracts/investment'
import type { ComparisonResult } from '~/src/contracts/simulation'
import { addYears, brazilToday } from '~/src/calendar/dates'

export interface ChartPreferences {
  mode: 'value' | 'percent'
  range: 'full' | 'year'
  reference: 'none' | 'cdi' | 'savings' | 'ipca'
  labels: boolean
}

let nextId = 2

export const useComparisonStore = defineStore('comparison', () => {
  const startDate = ref<IsoDate>(brazilToday())
  const principal = ref('10000')
  const useProjections = ref(true)
  const showTaxDetails = ref(false)
  const investments = ref<InvestmentInput[]>(defaultInvestments(startDate.value))
  const chart = ref<ChartPreferences>({ mode: 'value', range: 'full', reference: 'none', labels: false })
  const loading = ref(false)
  const result = ref<ComparisonResult>()
  const errorMessage = ref('')

  const request = computed<ComparisonRequest>(() => ({
    schemaVersion: 1,
    startDate: startDate.value,
    principal: principal.value,
    useProjections: useProjections.value,
    investments: investments.value,
  }))

  function addInvestment() {
    if (investments.value.length >= 40) return false
    let id: string
    do id = `investment-${++nextId}`
    while (investments.value.some(item => item.id === id))
    investments.value.push({ id, name: `CDB ${investments.value.length + 1}`, type: 'cdb-cdi', maturityDate: addYears(startDate.value, 2), rate: { kind: 'cdi-percent', percentOfCdi: '100' } })
    return true
  }

  function updateInvestment(id: string, investment: InvestmentInput) {
    const index = investments.value.findIndex(item => item.id === id)
    if (index >= 0) investments.value[index] = investment
  }

  function removeInvestment(id: string) {
    investments.value = investments.value.filter(item => item.id !== id)
  }

  function loadExamples() {
    principal.value = '10000'
    useProjections.value = true
    investments.value = defaultInvestments(startDate.value)
  }

  function applyRequest(value: ComparisonRequest) {
    startDate.value = value.startDate
    principal.value = value.principal
    useProjections.value = value.useProjections
    investments.value = value.investments
  }

  return {
    startDate, principal, useProjections, showTaxDetails, investments, chart,
    loading, result, errorMessage, request, addInvestment, updateInvestment,
    removeInvestment, loadExamples, applyRequest,
  }
})

function defaultInvestments(startDate: IsoDate): InvestmentInput[] {
  const maturityDate = addYears(startDate, 2)
  return [
    { id: 'investment-1', name: 'Poupança', type: 'poupanca', maturityDate, rate: { kind: 'savings' } },
    { id: 'investment-2', name: 'CDB 100% CDI', type: 'cdb-cdi', maturityDate, rate: { kind: 'cdi-percent', percentOfCdi: '100' } },
  ]
}
