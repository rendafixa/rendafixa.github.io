<script setup lang='ts'>
import AmountInput from '~/components/investment/AmountInput.vue'
import IndexDiInput from '~/components/investment/IndexDiInput.vue'
import IndexSelicInput from '~/components/investment/IndexSelicInput.vue'
import IndexCdbInput from '~/components/investment/IndexCdbInput.vue'
import IndexLcxInput from '~/components/investment/IndexLcxInput.vue'
import PeriodInput from './investment/PeriodInput.vue'
import PeriodTypeInput from './investment/PeriodTypeInput.vue'
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 transition-colors">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Investimento
      </h2>
    </div>
    <div class="px-6 py-4">
      <form @submit.prevent>
        <AmountInput />
        <div class="period-container">
          <PeriodInput />
          <PeriodTypeInput />
        </div>
        <IndexDiInput />
        <IndexSelicInput />
        <IndexCdbInput />
        <IndexLcxInput />
      </form>
    </div>
  </div>
</template>

<style scoped>
.period-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}
</style>
