<template>
  <div class="mb-6 flex-1">
    <label
      for="period-input"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
    >
      Vencimento
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calendar-outline"
          size="small"
          class="text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="period-input"
        v-model.number="period"
        type="number"
        min="1"
        class="block w-full pl-10 pr-3 py-2 border-b-2 border-slate-300 dark:border-slate-700 dark:bg-transparent text-slate-950 dark:text-slate-50 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-400/30 transition-colors"
        :class="{ 'border-rose-600 dark:border-rose-400': !isValid }"
      >
    </div>
    <p
      v-if="!isValid && period !== null"
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
