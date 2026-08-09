import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { axe } from 'vitest-axe'
import { InvestmentEditorFields, MarketIndicators } from '#components'
import marketData from '../../app/assets/market-data.json'
import type { InvestmentInput } from '../../app/src/contracts/investment'
import type { MarketSnapshot } from '../../app/src/contracts/market'
import { useComparisonStore } from '../../app/stores/comparison'

describe('comparison store', () => {
  it('starts with Poupança and a CDB at 100% CDI', () => {
    const store = useComparisonStore()
    store.loadExamples()
    expect(store.principal).toBe('10000')
    expect(store.investments.map(item => item.type)).toEqual(['poupanca', 'cdb-cdi'])
  })

  it('enforces the 40-investment limit', () => {
    const store = useComparisonStore()
    store.loadExamples()
    while (store.investments.length < 40) expect(store.addInvestment()).toBe(true)
    expect(store.addInvestment()).toBe(false)
    expect(store.investments).toHaveLength(40)
  })
})

describe('calculator components', () => {
  const investment: InvestmentInput = { id: 'one', name: 'CDB', type: 'cdb-cdi', maturityDate: '2028-08-09', rate: { kind: 'cdi-percent', percentOfCdi: '100' } }

  it('uses the same editor contract for responsive presentations', async () => {
    const wrapper = await mountSuspended(InvestmentEditorFields, { props: { investment } })
    await wrapper.find('input').setValue('CDB atualizado')
    expect(wrapper.emitted('update')?.[0]?.[0]).toMatchObject({ id: 'one', name: 'CDB atualizado' })
  })

  it('renders market indicators without basic accessibility violations', async () => {
    const wrapper = await mountSuspended(MarketIndicators, { props: { market: marketData as MarketSnapshot } })
    expect((await axe(wrapper.element)).violations).toHaveLength(0)
  })
})
