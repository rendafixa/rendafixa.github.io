export const state = () => ({
  amount: 10000,
  cdb: 105,
  di: null,
  duration: 12,
  lcx: 100,
  poupanca: null,
  selic: null
})

export const mutations = {
  setAmount(state, newAmount) {
    state.amount = newAmount
    localStorage.setItem('investment.amount', newAmount)
  },
  setCdb(state, newCdb) {
    state.cdb = newCdb
    localStorage.setItem('investment.cdb', newCdb)
  },
  setDuration(state, newDuration) {
    state.duration = newDuration
    localStorage.setItem('investment.duration', newDuration)
  },
  setDi(state, newDi) {
    state.di = newDi
    localStorage.setItem('investment.di', newDi)
  },
  setLcx(state, newLcx) {
    state.lcx = newLcx
    localStorage.setItem('investment.lcx', newLcx)
  },
  setSelic(state, newSelic) {
    state.selic = newSelic
    localStorage.setItem('investment.selic', newSelic)
  },
  setPoupanca(state, newPoupanca) {
    state.poupanca = newPoupanca
    localStorage.setItem('investment.poupanca', newPoupanca)
  },
  initializeStore(state) {
    state.amount = parseInt(localStorage.getItem('investment.amount'))
    state.cdb = parseInt(localStorage.getItem('investment.cdb'))
    state.di = localStorage.getItem('investment.di')
    state.lcx = localStorage.getItem('investment.lcx')
    state.selic = localStorage.getItem('investment.selic')
    state.poupanca = localStorage.getItem('investment.poupanca')
  }
}
