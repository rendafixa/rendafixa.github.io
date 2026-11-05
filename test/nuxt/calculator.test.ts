import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { axe } from 'vitest-axe'
import {
  CalculationNotes,
  ChartSeriesControls,
  ComparisonChart,
  ComparisonSummary,
  EducationArticleLayout,
  FormulaExample,
  HolidayList,
  InvestmentDesktopTable,
  InvestmentEditorFields,
  InvestmentMobileCard,
  InvestmentMobileList,
  MarketIndicators,
  MonthlyYieldDetails,
  NavigationBar,
  OfficialSourceList,
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

  it.each([
    ['poupanca', { kind: 'savings' }],
    ['tesouro-selic', { kind: 'selic' }],
    ['cdb-pre', { kind: 'fixed', annualPct: '12' }],
    ['cdb-cdi', { kind: 'cdi-percent', percentOfCdi: '100' }],
    ['cdb-ipca', { kind: 'ipca-plus', realAnnualPct: '6' }],
  ] as const)('maps %s to its editor rate contract', async (type, rate) => {
    const wrapper = await mountSuspended(InvestmentEditorFields, { props: { investment } })
    await wrapper.get('select').setValue(type)
    expect(wrapper.emitted('update')?.at(-1)?.[0]).toMatchObject({ type, rate })
  })

  it.each([
    [{ kind: 'fixed', annualPct: '12' }, '13.5', { annualPct: '13.5' }],
    [{ kind: 'cdi-percent', percentOfCdi: '100' }, '105', { percentOfCdi: '105' }],
    [{ kind: 'ipca-plus', realAnnualPct: '6' }, '6.5', { realAnnualPct: '6.5' }],
  ] as const)('updates the %s rate field', async (rate, value, expectedRate) => {
    const wrapper = await mountSuspended(InvestmentEditorFields, {
      props: { investment: { ...investment, rate } as InvestmentInput },
    })
    await wrapper.get('input[type="number"]').setValue(value)
    expect(wrapper.emitted('update')?.at(-1)?.[0]).toMatchObject({ rate: expectedRate })
  })

  it('updates investment maturity dates', async () => {
    const wrapper = await mountSuspended(InvestmentEditorFields, { props: { investment } })
    await wrapper.get('input[type="date"]').setValue('2029-08-09')
    expect(wrapper.emitted('update')?.at(-1)?.[0]).toMatchObject({ maturityDate: '2029-08-09' })
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

  it('shows the manual-copy field when clipboard access is denied', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = await mountSuspended(SimulationToolbar, {
      props: { request, chart: { mode: 'value', range: 'full', reference: 'none', labels: false } },
    })
    await wrapper.findAll('button')[1]!.trigger('click')
    const fallback = wrapper.get('#fallback-share')
    await fallback.trigger('focus')
    expect((fallback.element as HTMLInputElement).value).toContain('?sim=')
  })

  it('renders mobile ranking and every investment warning state', async () => {
    const investmentResult = {
      ...result.investments[0]!,
      fgc: { covered: true as const, limit: '250000', exceeded: true as const, exceededOn: '2027-08-09' as const, balanceOnDate: '260000', uncoveredAtMaturity: '10000' },
      taxBracketAlert: { nextDay: 181 as const, daysRemaining: 3, currentRatePct: '22.5', nextRatePct: '20' },
    }
    const wrapper = await mountSuspended(InvestmentMobileCard, {
      props: { investment: request.investments[0]!, result: investmentResult, rank: 1, showTaxes: true, errors: ['Taxa inválida'] },
    })
    expect(wrapper.text()).toContain('#1')
    expect(wrapper.text()).toContain('Acima do limite simplificado do FGC')
    expect(wrapper.text()).toContain('Faltam 3 dias')
    await wrapper.findAll('button').at(-1)!.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('forwards mobile-card events with the investment id', async () => {
    const wrapper = await mountSuspended(InvestmentMobileList, { props: { investments: request.investments, result, showTaxes: false } })
    const card = wrapper.findComponent(InvestmentMobileCard)
    card.vm.$emit('update', request.investments[0])
    card.vm.$emit('remove')
    expect(wrapper.emitted('update')?.[0]).toEqual(['one', request.investments[0]])
    expect(wrapper.emitted('remove')?.[0]).toEqual(['one'])
  })

  it('renders educational components and secure official-source links', async () => {
    const sources = [{ label: 'Banco Central', url: 'https://www.bcb.gov.br/' }]
    const components = [
      await mountSuspended(FormulaExample, { props: { title: 'Juros', formula: 'M = C × (1 + i)', example: 'Exemplo prático' } }),
      await mountSuspended(OfficialSourceList, { props: { sources } }),
      await mountSuspended(EducationArticleLayout, { props: { title: 'Poupança', summary: 'Como funciona', reviewed: '10/08/2026', sources }, slots: { default: '<p>Conteúdo</p>' } }),
    ]
    expect(components[0]!.text()).toContain('M = C × (1 + i)')
    const link = components[1]!.get('a')
    expect(link.attributes()).toMatchObject({ href: 'https://www.bcb.gov.br/', target: '_blank', rel: 'noopener noreferrer' })
    expect(components[2]!.text()).toContain('Última revisão: 10/08/2026')
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

  it('reports an invalid simulation before requesting clipboard access', async () => {
    const writeText = vi.fn()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const sharing = useShareSimulation()
    const invalidRequest = { ...request, investments: Array.from({ length: 41 }, () => request.investments[0]!) }

    expect(await sharing.copySimulation(invalidRequest, { mode: 'value', range: 'full', reference: 'none', labels: false })).toBe(false)
    expect(sharing.shareError.value).toContain('Não foi possível compartilhar')
    expect(writeText).not.toHaveBeenCalled()
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
