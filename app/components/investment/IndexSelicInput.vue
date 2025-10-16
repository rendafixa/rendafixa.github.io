<template>
  <div class="mb-6">
    <label for="selic-input" class="block text-sm font-medium text-gray-700 mb-1">
      Taxa SELIC
    </label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </div>
      <input
        id="selic-input"
        v-model.number="selic"
        type="number"
        min="0"
        class="block w-full pl-10 pr-20 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
        :class="{ 'border-red-500': !isValid }"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 text-sm">% ao ano</span>
      </div>
    </div>
    <p v-if="!isValid && selic !== null" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang='ts'>
import {computed} from 'vue'
import {useInvestmentStore} from '~/store/investment'
import {usePositiveNumberValidation} from '~/composables/usePositiveNumberValidation'

const store = useInvestmentStore()

const selic = computed({
  get: () => store.selic,
  set: (data) => store.setSelic(data)
})

const { isValid, errorMessage } = usePositiveNumberValidation(selic)
</script>

