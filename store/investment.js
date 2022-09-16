const defaultAmount = 1000
const defaultCdb = 100
const defaultDuration = 12
const defaultLcx = 100

export const state = () => ({
  amount: defaultAmount,
  cdb: defaultCdb,
  di: null,
  duration: defaultDuration,
  lcx: defaultLcx,
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
    state.amount = localStorage.getItem('investment.amount') || defaultAmount
    state.cdb = localStorage.getItem('investment.cdb') || defaultCdb
    state.duration =
      localStorage.getItem('investment.duration') || defaultDuration
    state.di = localStorage.getItem('investment.di')
    state.lcx = localStorage.getItem('investment.lcx') || defaultLcx
    state.selic = localStorage.getItem('investment.selic')
    state.poupanca = localStorage.getItem('investment.poupanca')
  }
}
