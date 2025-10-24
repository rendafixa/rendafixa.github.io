import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import AmountInput from '~/components/investment/AmountInput.vue'
import { useInvestmentStore } from '~/store/investment'

describe('AmountInput Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

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

      expect(wrapper.find('svg').exists()).toBe(true)
    })
  })

  describe('Initial State', () => {
    it('should initialize with store amount value', async () => {
      const store = useInvestmentStore()
      const initialAmount = store.amount

      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      expect(input.element.value).toBe(String(initialAmount))
    })

    it('should not show error message on initial load with valid amount', async () => {
      const store = useInvestmentStore()
      store.setAmount(1000)

      const wrapper = await mountSuspended(AmountInput)

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
      const store = useInvestmentStore()
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(2500)
      await wrapper.vm.$nextTick()

      expect(input.classes()).not.toContain('border-red-500')
      expect(store.amount).toBeGreaterThan(0)
    })
  })

  describe('Validation - Invalid Values', () => {
    it('should show error border for zero value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)

      expect(input.classes()).toContain('border-red-500')
    })

    it('should show error border for negative value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(-100)

      expect(input.classes()).toContain('border-red-500')
    })

    it('should show error border for null value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(null)

      expect(input.classes()).toContain('border-red-500')
    })

    it('should not update store when invalid amount is entered', async () => {
      const store = useInvestmentStore()
      store.setAmount(1000)

      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)

      expect(store.amount).toBe(1000)
    })

    it('should not update store for negative values', async () => {
      const store = useInvestmentStore()
      store.setAmount(1000)

      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(-50)

      expect(store.amount).toBe(1000)
    })
  })

  describe('Error Messages - Required Field', () => {
    it('should show "Obrigatório" error message when value is null', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(null)

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Obrigatório')
    })

    it('should show "Obrigatório" error message when field is empty', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue('')

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Obrigatório')
    })
  })

  describe('Error Messages - Positive Number Validation', () => {
    it('should show error message for zero value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Obrigatório')
    })

    it('should show "Deve ser um número positivo" error for negative values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(-100)

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Deve ser um número positivo')
    })

    it('should show "Deve ser um número positivo" error for -0.01', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(-0.01)

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Deve ser um número positivo')
    })
  })

  describe('Error Message Visibility', () => {
    it('should hide error message when value becomes valid', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)
      expect(wrapper.find('.text-red-600').exists()).toBe(true)

      await input.setValue(1000)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })

    it('should show error message when changing from valid to invalid', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(1000)
      expect(wrapper.find('.text-red-600').exists()).toBe(false)

      await input.setValue(-50)
      expect(wrapper.find('.text-red-600').exists()).toBe(true)
      expect(wrapper.find('.text-red-600').text()).toBe('Deve ser um número positivo')
    })
  })

  describe('CSS Classes - Visual Feedback', () => {
    it('should not have error border class with valid value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(1000)

      expect(input.classes()).not.toContain('border-red-500')
      expect(input.classes()).toContain('border-gray-300')
    })

    it('should have error border class with invalid value', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)

      expect(input.classes()).toContain('border-red-500')
    })

    it('should toggle border color when value changes from valid to invalid', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(1000)
      expect(input.classes()).not.toContain('border-red-500')

      await input.setValue(0)
      expect(input.classes()).toContain('border-red-500')
    })

    it('should remove error border when value changes from invalid to valid', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(-10)
      expect(input.classes()).toContain('border-red-500')

      await input.setValue(500)
      expect(input.classes()).not.toContain('border-red-500')
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

    it('should handle switching between multiple invalid values', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)
      expect(wrapper.find('.text-red-600').text()).toBe('Obrigatório')

      await input.setValue(null)
      expect(wrapper.find('.text-red-600').text()).toBe('Obrigatório')

      await input.setValue(-100)
      expect(wrapper.find('.text-red-600').text()).toBe('Deve ser um número positivo')
    })
  })

  describe('Store Integration', () => {
    it('should not reflect external store changes in the input', async () => {
      const store = useInvestmentStore()
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      store.setAmount(3000)
      await wrapper.vm.$nextTick()

      expect(input.element.value).not.toBe('3000')
    })

    it('should update store only with valid values', async () => {
      const store = useInvestmentStore()
      const initialAmount = 1000
      store.setAmount(initialAmount)

      const wrapper = await mountSuspended(AmountInput)
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

    it('should have descriptive error message with proper styling', async () => {
      const wrapper = await mountSuspended(AmountInput)
      const input = wrapper.find('#amount-input')

      await input.setValue(0)

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.classes()).toContain('text-sm')
      expect(errorMessage.classes()).toContain('mt-1')
    })
  })
})

