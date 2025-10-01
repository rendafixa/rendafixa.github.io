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
  <v-card elevation="2">
    <v-card-title class="text-h6">Investimento</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <AmountInput />
        <div class="period-container">
          <PeriodInput />
          <PeriodTypeInput />
        </div>
        <IndexDiInput />
        <IndexSelicInput />
        <IndexCdbInput />
        <IndexLcxInput />
      </v-form>
    </v-card-text>
  </v-card>
</template>
<style scoped>
.period-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
