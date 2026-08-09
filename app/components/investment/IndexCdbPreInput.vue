<template>
  <div class="mb-6">
    <label
      for="cdb-pre-input"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
    >
      CDB/RDB prefixado
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="calculator-outline"
          size="small"
          class="text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="cdb-pre-input"
        :value="cdbPre ?? ''"
        type="number"
        min="0.01"
        step="0.01"
        :aria-invalid="!isValid"
        :aria-describedby="!isValid ? 'cdb-pre-error' : null"
        class="block w-full pl-10 pr-16 py-2 border-b-2 border-slate-300 dark:border-slate-700 dark:bg-transparent text-slate-950 dark:text-slate-50 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-400/30 transition-colors"
        :class="{ 'border-rose-600 dark:border-rose-400': !isValid }"
        @input="updateRate"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-slate-500 dark:text-slate-400 text-sm">% a.a.</span>
      </div>
    </div>
    <p
      v-if="!isValid"
      id="cdb-pre-error"
      role="alert"
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
const cdbPre = computed(() => store.cdbPre)
const isValid = computed(() => {
  return cdbPre.value !== null
    && Number.isFinite(cdbPre.value)
    && cdbPre.value > 0
})
const errorMessage = computed(() => {
  if (cdbPre.value === null) {
    return 'Obrigatório'
  }
  if (cdbPre.value <= 0) {
    return 'Deve ser um número positivo'
  }
  return ''
})

function updateRate(event: Event) {
  const value = (event.target as HTMLInputElement).value
  store.setCdbPre(normalizeRate(value))
}

function normalizeRate(value: string): number | null {
  if (value.trim() === '') {
    return null
  }

  const rate = Number(value)
  return Number.isFinite(rate) ? rate : null
}
</script>
