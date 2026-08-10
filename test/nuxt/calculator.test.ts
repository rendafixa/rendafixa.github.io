import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { axe } from 'vitest-axe'
import {
  CalculationNotes,
  ChartSeriesControls,
  ComparisonChart,
  ComparisonSummary,
  HolidayList,
  InvestmentDesktopTable,
  InvestmentEditorFields,
  InvestmentMobileList,
  MarketIndicators,
  MonthlyYieldDetails,
  NavigationBar,
  ProjectionTables,
  SimulationToolbar,
} from '#components'
import type { InvestmentInput } from '../../app/src/contracts/investment'
import type { MarketSnapshot } from '../../app/src/contracts/market'
import { simulateComparison } from '../../app/src/simulation/simulate-comparison'
import { useComparisonStore } from '../../app/stores/comparison'
import { useShareSimulation } from '../../app/composables/useShareSimulation'
import { useSimulationWorker } from '../../app/composables/useSimulationWorker'
import { marketFixture } from '../fixtures/market-data/snapshot'

const market = marketFixture as MarketSnapshot
const request = {
  schemaVersion: 1 as const,
  startDate: '2026-08-09' as const,
  principal: '10000',
  useProjections: true,
  investments: [
    { id: 'one', name: 'CDB', type: 'cdb-cdi' as const, maturityDate: '2028-08-09' as const, rate: { kind: 'cdi-percent' as const, percentOfCdi: '100' } },
    { id: 'two', name: 'Poupança', type: 'poupanca' as const, maturityDate: '2028-08-09' as const, rate: { kind: 'savings' as const } },
  ],
}
const simulation = simulateComparison(request, market)
if (!simulation.ok) throw new Error('The calculator fixture must be valid')
const result = simulation.value

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  history.replaceState({}, '', '/')
})

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

  it('adds, edits, removes and applies a complete request', () => {
    const store = useComparisonStore()
    store.applyRequest(request)
    expect(store.request).toMatchObject({ principal: '10000', useProjections: true })

    expect(store.addInvestment()).toBe(true)
    const added = store.investments.at(-1)!
    store.updateInvestment(added.id, { ...added, name: 'Editado' })
    expect(store.investments.at(-1)?.name).toBe('Editado')
    store.removeInvestment(added.id)
    expect(store.investments.some(item => item.id === added.id)).toBe(false)
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
    const wrapper = await mountSuspended(MarketIndicators, { props: { market } })
    expect((await axe(wrapper.element)).violations).toHaveLength(0)
  })

  it('renders navigation and theme controls accessibly', async () => {
    const wrapper = await mountSuspended(NavigationBar)
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Navegação principal')
    expect(wrapper.findAll('a').map(link => link.attributes('href'))).toEqual(['/', '/aprenda', '/metodologia', '/sobre'])
    expect((await axe(wrapper.element)).violations).toHaveLength(0)
  })

  it('updates all chart preferences from keyboard-accessible native controls', async () => {
    const wrapper = await mountSuspended(ChartSeriesControls, {
      props: { modelValue: { mode: 'value', range: 'full', reference: 'none', labels: false } },
    })
    await wrapper.get('#chart-metric').setValue('percent')
    await wrapper.get('#chart-range').setValue('year')
    await wrapper.get('#chart-reference').setValue('cdi')
    expect(wrapper.emitted('update:modelValue')?.map(events => events[0])).toEqual([
      { mode: 'percent', range: 'full', reference: 'none', labels: false },
      { mode: 'value', range: 'year', reference: 'none', labels: false },
      { mode: 'value', range: 'full', reference: 'cdi', labels: false },
    ])
  })

  it('renders responsive result presentations and supporting tables', async () => {
    const components = [
      await mountSuspended(InvestmentMobileList, { props: { investments: request.investments, result, showTaxes: true } }),
      await mountSuspended(InvestmentDesktopTable, { props: { investments: request.investments, result, showTaxes: true } }),
      await mountSuspended(ComparisonSummary, { props: { investments: request.investments, result } }),
      await mountSuspended(MonthlyYieldDetails, { props: { investments: request.investments, result } }),
      await mountSuspended(ProjectionTables, { props: { market } }),
      await mountSuspended(HolidayList, { props: { market } }),
      await mountSuspended(CalculationNotes),
    ]
    expect(components.every(wrapper => wrapper.text().length > 0)).toBe(true)
  })

  it('renders the chart and exercises year, percent, labels and reference modes', async () => {
    const wrapper = await mountSuspended(ComparisonChart, {
      props: {
        result,
        investments: request.investments,
        principal: request.principal,
        preferences: { mode: 'percent', range: 'year', reference: 'cdi', labels: true },
      },
      global: { stubs: { Line: { template: '<canvas aria-label="Gráfico comparativo" />' } } },
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('emits toolbar actions and reports a copied link', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } })
    const wrapper = await mountSuspended(SimulationToolbar, {
      props: { request, chart: { mode: 'value', range: 'full', reference: 'none', labels: false } },
    })
    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('examples')).toHaveLength(1)
    expect(wrapper.emitted('share')).toHaveLength(1)
    expect(wrapper.text()).toContain('Link copiado')
  })
})

describe('calculator orchestration', () => {
  it('falls back to synchronous calculation when workers are unavailable', async () => {
    const { simulate, workerAvailable } = useSimulationWorker()
    const calculated = await simulate(request, market)
    expect(workerAvailable.value).toBe(false)
    expect(calculated.ok).toBe(true)
  })

  it('copies and restores a shared simulation link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const sharing = useShareSimulation()
    const chart = { mode: 'value' as const, range: 'full' as const, reference: 'none' as const, labels: false }

    expect(await sharing.copySimulation(request, chart)).toBe(true)
    const sharedUrl = new URL(writeText.mock.calls[0]![0])
    history.replaceState({}, '', `${sharedUrl.pathname}${sharedUrl.search}`)
    expect(sharing.readFromLocation()).toEqual({ request, chart })
  })

  it('exposes a manual link when clipboard access fails and rejects invalid links', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const sharing = useShareSimulation()
    const chart = { mode: 'percent' as const, range: 'year' as const, reference: 'ipca' as const, labels: true }

    expect(await sharing.copySimulation(request, chart)).toBe(false)
    expect(sharing.fallbackUrl.value).toContain('?sim=')
    history.replaceState({}, '', '/?sim=invalid')
    expect(sharing.readFromLocation()).toBeUndefined()
    expect(sharing.shareError.value).toBeTruthy()
  })

  it('calculates through the page composable and renders the main route', async () => {
    vi.useFakeTimers()
    const confirm = vi.fn().mockReturnValue(true)
    vi.stubGlobal('confirm', confirm)
    // @ts-expect-error Nuxt's test transform resolves Vue SFC imports.
    const Page = (await import('../../app/pages/index.vue')).default
    const wrapper = await mountSuspended(Page, {
      global: { stubs: { ComparisonChart: true } },
    })
    await vi.advanceTimersByTimeAsync(150)
    await nextTick()
    expect(wrapper.get('h1').text()).toContain('Compare investimentos')
    const exampleButton = wrapper.findAll('button').find(button => button.text().includes('Preencher com exemplos'))!
    await exampleButton.trigger('click')
    expect(confirm).toHaveBeenCalled()
  })
})
