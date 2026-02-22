<template>
  <div class="mb-6 flex-1">
    <label
      for="period-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Vencimento
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calendar-outline"
          size="small"
          class="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="period-input"
        v-model.number="period"
        type="number"
        min="1"
        class="block w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
        :class="{ 'border-red-500 dark:border-red-400': !isValid }"
      >
    </div>
    <p
      v-if="!isValid && period !== null"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()

const period = computed({
  get: () => store.period,
  set: newPeriod => store.setPeriod(newPeriod),
})

const isValid = computed(() => {
  if (!period.value) {
    return false
  }
  return Number(period.value) > 0
})

const errorMessage = computed(() => {
  if (!period.value) {
    return 'Obrigatório'
  }
  if (Number(period.value) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>
