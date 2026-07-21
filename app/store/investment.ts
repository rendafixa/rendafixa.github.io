import { defineStore } from 'pinia'
import indicadores from '~/assets/indicadores.json'

export enum PeriodTypes {
  Days = 'dias',
  Months = 'meses',
  Years = 'anos',
}

export const useInvestmentStore = defineStore('investment', {
  state: () => {
    return {
      amount: 1000,
      cdb: 100,
      di: null as number | null,
      period: 360,
      periodType: PeriodTypes.Days,
      lcx: 100,
      poupanca: null as number | null,
      selic: null as number | null,
      recurringAmount: 0,
      recurringFrequency: 1,
      recurringFrequencyType: PeriodTypes.Months,
      inflationEnabled: false,
      inflationRate: null as number | null,
    }
  },
  actions: {
    setAmount(newAmount: number) {
      this.amount = newAmount
    },
    setPeriod(newPeriod: number) {
      this.period = newPeriod
    },
    setPeriodType(newType: PeriodTypes) {
      this.periodType = newType
    },
    setCdb(newCdb: number) {
      this.cdb = newCdb
    },
    setDi(newDi: number) {
      this.di = newDi
    },
    setLcx(newLcx: number) {
      this.lcx = newLcx
    },
    setSelic(newSelic: number) {
      this.selic = newSelic
    },
    setRecurringAmount(newAmount: number) {
      this.recurringAmount = newAmount
    },
    setRecurringFrequency(newFrequency: number) {
      this.recurringFrequency = newFrequency
    },
    setRecurringFrequencyType(newType: PeriodTypes) {
      this.recurringFrequencyType = newType
    },
    setInflationEnabled(enabled: boolean) {
      this.inflationEnabled = enabled
    },
    setInflationRate(newRate: number) {
      this.inflationRate = newRate
    },
    initializeStore() {
      this.loadIndexes()
    },
    loadIndexes() {
      this.di = indicadores.cdi.value
      this.selic = indicadores.selic.value
      this.poupanca = indicadores.poupanca.value
    },
  },
})
