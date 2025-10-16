<template>
  <div class="mb-6 flex-1">
    <label for="period-input" class="block text-sm font-medium text-gray-700 mb-1">
      Vencimento
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
      <input
        id="period-input"
        v-model.number="period"
        type="number"
        min="1"
        class="block w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
        :class="{ 'border-red-500': !isValid }"
      />
    </div>
    <p v-if="!isValid && period !== null" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import {computed} from 'vue'
import {useInvestmentStore} from '~/store/investment'

const store = useInvestmentStore();

const period = computed({
  get: () => store.period,
  set: (newPeriod) => store.setPeriod(newPeriod),
})

const isValid = computed(() => {
  if (!period.value) {
    return false
  }
  return Number.parseInt(period.value.toString()) > 0
})

const errorMessage = computed(() => {
  if (!period.value) {
    return 'Obrigatório'
  }
  if (Number.parseInt(period.value.toString()) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>

