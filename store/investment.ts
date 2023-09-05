import { defineStore } from 'pinia'

export const useInvestmentStore = defineStore('investment', {
  state: () => {
    return {
      amount: 1000,
      cdb: 100,
      di: 1,
      duration: 360,
      lcx: 100,
      poupanca: 0.6,
      selic: 1
    }
  },
  persist: true,
  actions: {
    setAmount(newAmount: number) {
      this.amount = newAmount
    },
    initializeStore(){
      console.log('Initializing...')
      this.fetchPoupanca()
      this.fetchDi()
      this.fetchSelic()
    },
    fetchPoupanca(){
      fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json')
        .then((response) => response.json())
        .then((data) => this.poupanca = parseFloat(data[0].valor))
        .catch((error) => console.log(error));
    },
    fetchDi() {
      fetch('https://www2.cetip.com.br/ConsultarTaxaDi/ConsultarTaxaDICetip.aspx')
        .then((response) => response.json())
        .then((data) => this.di = parseFloat(data.taxa.replace(/[.]/g, '').replace(',', '.')))
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
