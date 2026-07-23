<template>
  <div class="mb-6 flex-1">
    <label
      for="period-type-input"
      class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
    >
      Tipo de período
    </label>
    <div class="relative">
      <select
        id="period-type-input"
        v-model="periodType"
        class="block w-full py-2 px-3 border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 focus:border-emerald-600 dark:focus:border-emerald-400 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-400/30 transition-colors appearance-none cursor-pointer"
      >
        <option
          v-for="option in periodTypesOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ion-icon
          name="chevron-down-outline"
          size="small"
          class="text-slate-400 dark:text-slate-500"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { PeriodTypes, useInvestmentStore } from '~/stores/investment'

const store = useInvestmentStore()

const periodTypesOptions = computed(() => Object.values(PeriodTypes))
const periodType = computed({
  get: () => store.periodType,
  set: newType => store.setPeriodType(newType),
})
</script>
