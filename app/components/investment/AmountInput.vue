<template>
  <div class="mb-6">
    <label
      for="amount-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Valor da Aplicação
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="cash-outline"
          size="small"
          class="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="amount-input"
        v-model.number="amount"
        type="number"
        min="1"
        class="block w-full pl-10 pr-16 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
        :class="{ 'border-red-500 dark:border-red-400': !isValid }"

        :aria-describedby="!isValid && amount !== null ? 'amount-error' : null"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-sm">R$ ,00</span>
      </div>
    </div>
    <p
      v-if="!isValid && amount !== null"
      id="amount-error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
      aria-live="polite"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()
const validateAmount = (value: number | null): boolean => {
  if (!value) {
    return false
  }
  return Number(value) > 0
}

const amount = computed({
  get: () => store.amount,
  set: (newValue) => {
    if (validateAmount(newValue)) {
      store.setAmount(Number(newValue))
    }
  },
})

const isValid = computed(() => validateAmount(store.amount))

const errorMessage = computed(() => {
  if (!store.amount) {
    return 'Obrigatório'
  }
  if (Number(store.amount) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>
