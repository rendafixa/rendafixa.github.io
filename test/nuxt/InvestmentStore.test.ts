import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import indicadores from '~/assets/indicadores.json'
import { PeriodTypes, useInvestmentStore } from '~/stores/investment'

describe('Investment Store', () => {
  let store: ReturnType<typeof useInvestmentStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useInvestmentStore()
  })

  it('exposes the initial investment state', () => {
    expect(store.$state).toEqual({
      amount: 1000,
      cdb: 100,
      di: null,
      period: 360,
      periodType: PeriodTypes.Days,
      lcx: 100,
      cdbPre: 14,
      lcxPre: 14,
      poupanca: null,
      selic: null,
    })
  })

  it('updates state through its actions', () => {
    store.setAmount(2500)
    store.setCdb(110)
    store.setDi(12)
    store.setPeriod(18)
    store.setPeriodType(PeriodTypes.Months)
    store.setLcx(95)
    store.setCdbPre(13.25)
    store.setLcxPre(null)
    store.setSelic(10)

    expect(store.amount).toBe(2500)
    expect(store.cdb).toBe(110)
    expect(store.di).toBe(12)
    expect(store.period).toBe(18)
    expect(store.periodType).toBe(PeriodTypes.Months)
    expect(store.lcx).toBe(95)
    expect(store.cdbPre).toBe(13.25)
    expect(store.lcxPre).toBeNull()
    expect(store.selic).toBe(10)
  })

  it('normalizes non-finite prefixado rates to null', () => {
    store.setCdbPre(Number.NaN)
    store.setLcxPre(Number.POSITIVE_INFINITY)

    expect(store.cdbPre).toBeNull()
    expect(store.lcxPre).toBeNull()
  })

  it('initializes the bundled market indexes', () => {
    store.initializeStore()

    expect(store.di).toBe(indicadores.cdi.value)
    expect(store.poupanca).toBe(indicadores.poupanca.value)
    expect(store.selic).toBe(indicadores.selic.value)
  })

  it('resets all state to its initial values', () => {
    store.setAmount(2500)
    store.setCdb(110)
    store.setDi(12)
    store.setPeriod(18)
    store.setPeriodType(PeriodTypes.Years)
    store.setLcx(95)
    store.setCdbPre(null)
    store.setLcxPre(12)
    store.poupanca = 8
    store.setSelic(10)

    store.$reset()

    expect(store.$state).toEqual({
      amount: 1000,
      cdb: 100,
      di: null,
      period: 360,
      periodType: PeriodTypes.Days,
      lcx: 100,
      cdbPre: 14,
      lcxPre: 14,
      poupanca: null,
      selic: null,
    })
  })
})
