<template>
  <v-text-field
    v-model.number="period"
    type="number"
    variant="underlined"
    label="Vencimento"
    prepend-icon="mdi-calendar"
    min="1"
    :rules="[rules.required, rules.positive]"
  />
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'
const store = useInvestmentStore();

const rules = {
  required: (value: any) => !!value || 'Obrigatório',
  positive: (value: any) => parseInt(value) > 0 || 'Deve ser um número positivo'
}

const period = computed({
  get: () => store.period,
  set: (newPeriod) => store.setPeriod(newPeriod),
})
</script>
