import { defineStore } from 'pinia'

export enum PeriodTypes {
  Days = 'dias',
  Months = 'meses',
  Years = 'anos'
}

export const useInvestmentStore = defineStore('investment', {
  state: () => {
    return {
      amount: 1000,
      cdb: 100,
      di: null as Number | null,
      period: 360,
      periodType: PeriodTypes.Days,
      lcx: 100,
      poupanca: null as Number | null,
      selic: null as Number | null
    }
  },
  persist: true,
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
    initializeStore() {
      this.fetchPoupanca()
      this.fetchDi()
      this.fetchSelic()
    },
    fetchPoupanca() {
      fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json')
        .then((response) => response.json())
        .then((data) => this.poupanca = parseFloat(data[0].valor))
        .catch((error) => console.log(error));
    },
    fetchDi() {
      fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados/ultimos/13?formato=json')
        .then((response) => response.json())
        .then((data: { valor: string }[]) => this.di = data
          .slice(1) // Ignores the partial value of current month
          .map((item: any) => parseFloat(item.valor))
          .reduce((acc, value) => acc + value, 0)
        )
        .catch((error) => console.log(error));
    },
    fetchSelic() {
      fetch('https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros')
        .then((response) => response.json())
        .then((data) => this.selic = data.conteudo[0].MetaSelic)
        .catch((error) => console.log(error))
    }
  }
})
