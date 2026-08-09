import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import IndexPage from '~/pages/index.vue'
import { useInvestmentStore } from '~/stores/investment'

function getResultCard(wrapper: VueWrapper, name: string) {
  return wrapper
    .findAll('[data-testid="result-card"]')
    .find(card => card.find('h3').text() === name)!
}

function getTotalAmount(card: VueWrapper) {
  return card.find('[data-testid="result-total-amount"]').text()
}

// Helper to ensure all reactivity has settled
async function waitForReactivity(_wrapper: VueWrapper) {
  await flushPromises()
  await nextTick()
  await flushPromises()
}

describe('Calculator Page — Smoke Tests', () => {
  let wrapper: VueWrapper
  let store: ReturnType<typeof useInvestmentStore>

  beforeEach(async () => {
    wrapper = await mountSuspended(IndexPage)
    store = useInvestmentStore()
    store.initializeStore()
    await flushPromises()
  })

  describe('Page Load', () => {
    it('renders all five result card headers', () => {
      const cards = wrapper.findAll('[data-testid="result-card"]')
      const headers = cards.map(card => card.find('h3').text())
      expect(headers).toContain('Poupança')
      expect(headers).toContain('CDB / RDB')
      expect(headers).toContain('CDB / RDB prefixado')
      expect(headers).toContain('LCI / LCA')
      expect(headers).toContain('LCI / LCA prefixado')
    })

    it('shows the prefixado assumptions and safe reference links', () => {
      const assumptions = wrapper.find('[aria-label="Premissas da simulação prefixada"]')
      const links = assumptions.findAll('a')

      expect(assumptions.text()).toContain('aproximação de 365 dias corridos')
      expect(assumptions.text()).toContain('não validamos vencimento, liquidez nem condições de resgate')
      expect(links).toHaveLength(3)
      expect(links.every(link => link.attributes('target') === '_blank')).toBe(true)
      expect(links.every(link => link.attributes('rel') === 'noopener noreferrer')).toBe(true)
    })

    it('displays a non-empty formatted total amount for Poupança', () => {
      const total = getTotalAmount(getResultCard(wrapper, 'Poupança'))
      expect(total).not.toBe('')
      expect(total).toMatch(/R\$/)
    })
  })

  describe('Amount Change', () => {
    it('updates CDB result when amount changes', async () => {
      const card = getResultCard(wrapper, 'CDB / RDB')
      const before = getTotalAmount(card)

      await wrapper.find('#amount-input').setValue(5000)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'CDB / RDB'))
      expect(after).not.toBe(before)
      expect(after).not.toBe('')
    })
  })

  describe('DI Rate Change', () => {
    it('updates CDB result when DI rate changes', async () => {
      const before = getTotalAmount(getResultCard(wrapper, 'CDB / RDB'))

      store.setDi(10)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'CDB / RDB'))
      expect(after).not.toBe(before)
      expect(after).not.toBe('')
    })
  })

  describe('CDB Percentage Change', () => {
    it('updates CDB result when CDB % changes', async () => {
      const before = getTotalAmount(getResultCard(wrapper, 'CDB / RDB'))

      await wrapper.find('#cdb-input').setValue(110)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'CDB / RDB'))
      expect(after).not.toBe(before)
      expect(after).not.toBe('')
    })
  })

  describe('LCI/LCA Percentage Change', () => {
    it('updates LCI/LCA result when LCX % changes', async () => {
      const before = getTotalAmount(getResultCard(wrapper, 'LCI / LCA'))

      await wrapper.find('#lcx-input').setValue(90)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'LCI / LCA'))
      expect(after).not.toBe(before)
      expect(after).not.toBe('')
    })
  })

  describe('Prefixado Rate Change', () => {
    it('updates CDB prefixado result when its annual rate changes', async () => {
      const before = getTotalAmount(getResultCard(wrapper, 'CDB / RDB prefixado'))

      await wrapper.find('#cdb-pre-input').setValue(12.5)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'CDB / RDB prefixado'))
      expect(store.cdbPre).toBe(12.5)
      expect(after).not.toBe(before)
    })

    it('updates LCI/LCA prefixado result when its annual rate changes', async () => {
      const before = getTotalAmount(getResultCard(wrapper, 'LCI / LCA prefixado'))

      await wrapper.find('#lcx-pre-input').setValue(11.75)
      await waitForReactivity(wrapper)

      const after = getTotalAmount(getResultCard(wrapper, 'LCI / LCA prefixado'))
      expect(store.lcxPre).toBe(11.75)
      expect(after).not.toBe(before)
    })
  })

  describe('Prefixado Rate Validation', () => {
    it('suppresses the CDB prefixado result when its rate is cleared', async () => {
      const input = wrapper.find('#cdb-pre-input')

      await input.setValue('')
      await waitForReactivity(wrapper)

      expect(store.cdbPre).toBeNull()
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('cdb-pre-error')
      expect(wrapper.find('#cdb-pre-error').text()).toBe('Obrigatório')
      expect(getResultCard(wrapper, 'CDB / RDB prefixado')).toBeUndefined()
      expect(wrapper.text()).not.toContain('NaN')
    })

    it('suppresses the LCI/LCA prefixado result for a non-positive rate', async () => {
      const input = wrapper.find('#lcx-pre-input')

      await input.setValue(-1)
      await waitForReactivity(wrapper)

      expect(store.lcxPre).toBe(-1)
      expect(input.attributes('min')).toBe('0.01')
      expect(input.attributes('step')).toBe('0.01')
      expect(wrapper.find('#lcx-pre-error').text()).toBe('Deve ser um número positivo')
      expect(getResultCard(wrapper, 'LCI / LCA prefixado')).toBeUndefined()
      expect(wrapper.text()).not.toContain('NaN')
    })
  })
})
