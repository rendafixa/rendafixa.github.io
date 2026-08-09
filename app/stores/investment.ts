import { defineStore } from 'pinia'
import { ref } from 'vue'
import indicadores from '~/assets/indicadores.json'

export enum PeriodTypes {
  Days = 'dias',
  Months = 'meses',
  Years = 'anos',
}

export const useInvestmentStore = defineStore('investment', () => {
  const amount = ref(1000)
  const cdb = ref(100)
  const di = ref<number | null>(null)
  const period = ref(360)
  const periodType = ref<PeriodTypes>(PeriodTypes.Days)
  const lcx = ref(100)
  const cdbPre = ref<number | null>(14)
  const lcxPre = ref<number | null>(14)
  const poupanca = ref<number | null>(null)
  const selic = ref<number | null>(null)

  function setAmount(newAmount: number) {
    amount.value = newAmount
  }

  function setPeriod(newPeriod: number) {
    period.value = newPeriod
  }

  function setPeriodType(newType: PeriodTypes) {
    periodType.value = newType
  }

  function setCdb(newCdb: number) {
    cdb.value = newCdb
  }

  function setDi(newDi: number) {
    di.value = newDi
  }

  function setLcx(newLcx: number) {
    lcx.value = newLcx
  }

  function setCdbPre(newCdbPre: number | null) {
    cdbPre.value = normalizeRate(newCdbPre)
  }

  function setLcxPre(newLcxPre: number | null) {
    lcxPre.value = normalizeRate(newLcxPre)
  }

  function setSelic(newSelic: number) {
    selic.value = newSelic
  }

  function initializeStore() {
    loadIndexes()
  }

  function loadIndexes() {
    di.value = indicadores.cdi.value
    selic.value = indicadores.selic.value
    poupanca.value = indicadores.poupanca.value
  }

  function $reset() {
    amount.value = 1000
    cdb.value = 100
    di.value = null
    period.value = 360
    periodType.value = PeriodTypes.Days
    lcx.value = 100
    cdbPre.value = 14
    lcxPre.value = 14
    poupanca.value = null
    selic.value = null
  }

  return {
    amount,
    cdb,
    di,
    period,
    periodType,
    lcx,
    cdbPre,
    lcxPre,
    poupanca,
    selic,
    setAmount,
    setPeriod,
    setPeriodType,
    setCdb,
    setDi,
    setLcx,
    setCdbPre,
    setLcxPre,
    setSelic,
    initializeStore,
    loadIndexes,
    $reset,
  }
})

function normalizeRate(rate: number | null): number | null {
  return rate !== null && Number.isFinite(rate) ? rate : null
}
