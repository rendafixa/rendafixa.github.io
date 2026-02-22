<template>
  <div class="mb-6">
    <label
      for="lcx-input"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      LCI/LCA
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calculator-outline"
          size="small"
          class="text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        id="lcx-input"
        v-model.number="lcx"
        type="number"
        min="0"
        class="block w-full pl-10 pr-16 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
        :class="{ 'border-red-500': !isValid }"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 text-sm">% DI</span>
      </div>
    </div>
    <p
      v-if="!isValid && lcx !== null"
      class="mt-1 text-sm text-red-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()
const lcx = computed({
  get: () => store.lcx,
  set: data => store.setLcx(data),
})
const isValid = computed(() => {
  if (!lcx.value) {
    return false
  }
  return Number(lcx.value) > 0
})
const errorMessage = computed(() => {
  if (!lcx.value) {
    return 'Obrigatório'
  }
  if (Number(lcx.value) <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})
</script>
