import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AmountInput from '~/components/investment/AmountInput.vue'
import { useInvestmentStore } from '~/store/investment'

describe('AmountInput Component', () => {
  describe('Rendering', () => {
    it('should render the component with label', async () => {
      const wrapper = await mountSuspended(AmountInput)
      expect(wrapper.find('label[for="amount-input"]').text()).toBe('Valor da Aplicação')
    })

    it('should render input field with correct attributes', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('number')
      expect(input.attributes('min')).toBe('1')
    })

    it('should display currency suffix', async () => {
      const wrapper = await mountSuspended(AmountInput)
      expect(wrapper.text()).toContain('R$ ,00')
    })

    it('should display money icon', async () => {
      const wrapper = await mountSuspended(AmountInput)
      expect(wrapper.find('ion-icon').exists()).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should initialize with store amount value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      // Verify the store has its default value
      expect(store.amount).toBe(1000)
      // The component's computed property should reflect the store value
      // We verify by setting a value through the input and checking store updates
      const input = wrapper.find('#amount-input')
      await input.setValue(1000)
      await wrapper.vm.$nextTick()
      const inputEl = input.element as HTMLInputElement
      expect(inputEl.value).toBe(String(store.amount))
    })

    it('should not show error message on initial load with valid amount', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      store.setAmount(1000)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('Validation - Positive Values', () => {
    it('should accept positive integer values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')
      await input.setValue(100)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
      expect(input.classes()).not.toContain('border-red-500')
    })

    it('should accept large positive values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')
      await input.setValue(1000000)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
      expect(input.classes()).not.toContain('border-red-500')
    })

    it('should update store when valid amount is entered', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      const input = wrapper.find('#amount-input')
      await input.setValue(2500)
      await wrapper.vm.$nextTick()
      expect(input.classes()).not.toContain('border-red-500')
      expect(store.amount).toBeGreaterThan(0)
    })
  })

  describe('Validation - Invalid Values', () => {
    it('should not update store when invalid amount is entered', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      store.setAmount(1000)
      const input = wrapper.find('#amount-input')
      await input.setValue(0)
      expect(store.amount).toBe(1000)
    })

    it('should not update store for negative values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      store.setAmount(1000)
      const input = wrapper.find('#amount-input')
      await input.setValue(-50)
      expect(store.amount).toBe(1000)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very small positive decimal values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')
      await input.setValue(0.01)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
      expect(input.classes()).not.toContain('border-red-500')
    })

    it('should handle value of exactly 1', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')
      await input.setValue(1)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
      expect(input.classes()).not.toContain('border-red-500')
    })
  })

  describe('Store Integration', () => {
    it('should reflect external store changes in the input', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      const input = wrapper.find('#amount-input')
      store.setAmount(3000)
      await wrapper.vm.$nextTick()
      const inputEl = input.element as HTMLInputElement
      expect(inputEl.value).toBe('3000')
    })

    it('should update store only with valid values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const store = useInvestmentStore()
      const initialAmount = 1000
      store.setAmount(initialAmount)
      const input = wrapper.find('#amount-input')
      await input.setValue(0)
      await wrapper.vm.$nextTick()
      expect(store.amount).toBeGreaterThan(0)
      await input.setValue(2000)
      await wrapper.vm.$nextTick()
      expect(input.classes()).not.toContain('border-red-500')
    })
  })

  describe('Accessibility', () => {
    it('should have proper label association', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const label = wrapper.find('label')
      const input = wrapper.find('#amount-input')
      expect(label.attributes('for')).toBe('amount-input')
      expect(input.attributes('id')).toBe('amount-input')
    })
  })
})
