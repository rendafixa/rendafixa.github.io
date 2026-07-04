<template>
  <div class="mb-6">
    <label
      for="recurring-amount-input"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Aporte recorrente <span class="text-gray-400 dark:text-gray-500">(opcional)</span>
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ion-icon
          name="repeat-outline"
          size="small"
          class="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <input
        id="recurring-amount-input"
        v-model.number="recurringAmount"
        type="number"
        min="0"
        class="block w-full pl-10 pr-16 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
      >
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 dark:text-gray-400 text-sm">R$ ,00</span>
      </div>
    </div>

    <div
      v-if="hasRecurringContribution"
      class="frequency-container"
    >
      <div class="mb-6 flex-1">
        <label
          for="recurring-frequency-input"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          A cada
        </label>
        <input
          id="recurring-frequency-input"
          v-model.number="recurringFrequency"
          type="number"
          min="1"
          class="block w-full py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-hidden transition-colors"
        >
      </div>
      <div class="mb-6 flex-1">
        <label
          for="recurring-frequency-type-input"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Frequência
        </label>
        <div class="relative">
          <select
            id="recurring-frequency-type-input"
            v-model="recurringFrequencyType"
            class="block w-full py-2 px-3 border-b-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-hidden transition-colors appearance-none cursor-pointer"
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
    </div>

    <div v-if="hasRecurringContribution">
      <label class="flex items-center gap-2 mt-1 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
        <input
          v-model="inflationEnabled"
          type="checkbox"
          class="cursor-pointer"
        >
        Corrigir aportes pela inflação
      </label>

      <div
        v-if="inflationEnabled"
        class="mt-3"
      >
        <label
          for="inflation-rate-input"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Taxa de inflação
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ion-icon
              name="trending-up-outline"
              size="small"
              class="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />
          </div>
          <input
            id="inflation-rate-input"
            v-model.number="inflationRate"
            type="number"
            min="0"
            class="block w-full pl-10 pr-16 py-2 border-b-2 border-gray-300 dark:border-gray-600 dark:bg-transparent text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 text-sm">% ao ano</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { PeriodTypes, useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()

const periodTypesOptions = computed(() => Object.values(PeriodTypes))

const recurringAmount = computed({
  get: () => store.recurringAmount,
  set: newValue => store.setRecurringAmount(Number(newValue) > 0 ? Number(newValue) : 0),
})

const hasRecurringContribution = computed(() => store.recurringAmount > 0)

const recurringFrequency = computed({
  get: () => store.recurringFrequency,
  set: newValue => store.setRecurringFrequency(Number(newValue) > 0 ? Number(newValue) : 1),
})

const recurringFrequencyType = computed({
  get: () => store.recurringFrequencyType,
  set: newType => store.setRecurringFrequencyType(newType),
})

const inflationEnabled = computed({
  get: () => store.inflationEnabled,
  set: enabled => store.setInflationEnabled(enabled),
})

const inflationRate = computed({
  get: () => store.inflationRate,
  set: newRate => store.setInflationRate(Number(newRate) > 0 ? Number(newRate) : 0),
})
</script>

<style scoped>
.frequency-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
