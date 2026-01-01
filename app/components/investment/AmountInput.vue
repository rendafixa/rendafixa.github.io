<template>
  <div class="mb-6">
    <label
      for="amount-input"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      Valor da Aplicação
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
<input
         id="amount-input"
         v-model.number='amount'
         type='number'
         min='1'
         class="block w-full pl-10 pr-16 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
         :class="{ 'border-red-500': !isValid }"

         :aria-describedby="!isValid && amount !== null ? 'amount-error' : null"
       />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 text-sm">R$ ,00</span>
      </div>
    </div>
<p v-if="!isValid && amount !== null" class="mt-1 text-sm text-red-600" id="amount-error" aria-live="polite">
       {{ errorMessage }}
     </p>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()
const storeAmount = ref(store.amount)

const validateAmount = (value: number | null): boolean => {
  if (!value) {
    return false
  }
  return Number(value) > 0
}

const amount = computed({
  get: () => storeAmount.value,
  set: (newValue) => {
    storeAmount.value = newValue
    if (validateAmount(newValue)) {
      store.setAmount(Number(newValue))
    }
  },
})

const isValid = computed(() => validateAmount(storeAmount.value))

const errorMessage = computed(() => {
  if (!storeAmount.value) {
    return 'Obrigatório'
  }
  if (Number(storeAmount.value) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>
