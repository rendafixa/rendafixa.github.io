<template>
  <div class="mb-6">
    <label
      for="di-input"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
    >
      Taxa DI
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calculator-outline"
          size="small"
          class="text-slate-400 dark:text-slate-300"
          aria-hidden="true"
        />
      </div>
      <div
        v-if="isLoading"
        class="block w-full pl-10 pr-20 py-2 border-b-2 border-slate-300 dark:border-slate-700 dark:bg-transparent"
      >
        <span
          class="sr-only"
          aria-live="polite"
        >Carregando</span>
        <div class="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
      <input
        v-else
        id="di-input"
        v-model.number="di"
        type="number"
        min="0"
        step=".01"
        :disabled="isLoading"
        :aria-busy="isLoading"
        class="block w-full pl-10 pr-20 py-2 border-b-2 border-slate-300 dark:border-slate-700 dark:bg-transparent text-slate-950 dark:text-slate-50 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-400/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'border-rose-600 dark:border-rose-400': !isValid }"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-slate-500 dark:text-slate-400 text-sm">% ao ano</span>
      </div>
    </div>
    <p
      v-if="!isValid && di !== null && !isLoading"
      class="mt-1 text-sm text-rose-700 dark:text-rose-300"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/stores/investment'

const store = useInvestmentStore()

const di = computed({
  get: () => store.di,
  set: data => store.setDi(data),
})

const isLoading = computed(() => di.value === null)

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
