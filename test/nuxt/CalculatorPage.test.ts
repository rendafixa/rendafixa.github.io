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
    it('renders all three result card headers', () => {
      const cards = wrapper.findAll('[data-testid="result-card"]')
      const headers = cards.map(card => card.find('h3').text())
      expect(headers).toContain('Poupança')
      expect(headers).toContain('CDB / RDB')
      expect(headers).toContain('LCI / LCA')
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
})
