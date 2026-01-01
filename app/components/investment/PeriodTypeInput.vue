<template>
  <div class="mb-6 flex-1">
    <label
      for="period-type-input"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      Tipo de período
    </label>
    <div class="relative">
      <select
        id="period-type-input"
        v-model="periodType"
        class="block w-full py-2 px-3 border-b-2 border-gray-300 bg-white focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer"
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
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
