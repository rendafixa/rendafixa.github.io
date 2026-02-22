<template>
  <div class="mb-6">
    <label
      for="di-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Taxa DI
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calculator-outline"
          size="small"
          class="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="di-input"
        v-model.number="di"
        type="number"
        min="0"
        step=".01"
        class="block w-full pl-10 pr-20 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
        :class="{ 'border-red-500 dark:border-red-400': !isValid }"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-sm">% ao ano</span>
      </div>
    </div>
    <p
      v-if="!isValid && di !== null"
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

const di = computed({
  get: () => store.di,
  set: data => store.setDi(data),
})

const isValid = computed(() => {
  if (!di.value) {
    return false
  }
  return Number(di.value) > 0
})

const errorMessage = computed(() => {
  if (!di.value) {
    return 'Obrigatório'
  }
  if (Number(di.value) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>
