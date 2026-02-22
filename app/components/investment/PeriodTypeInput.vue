<template>
  <div class="mb-6 flex-1">
    <label
      for="period-type-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Tipo de período
    </label>
    <div class="relative">
      <select
        id="period-type-input"
        v-model="periodType"
        class="block w-full py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none cursor-pointer"
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
          class="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { PeriodTypes, useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()

const periodTypesOptions = computed(() => Object.values(PeriodTypes))
const periodType = computed({
  get: () => store.periodType,
  set: newType => store.setPeriodType(newType),
})
</script>
