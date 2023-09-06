<template>
  <v-text-field
    v-model.number='amount'
    type='number'
    variant="underlined"
    label='Valor da Aplicação'
    prepend-icon='mdi-cash-multiple'
    prefix='R$'
    suffix=',00'
    min='1'
    :rules='[rules.required, rules.positive]'
  >
  </v-text-field>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'
const store = useInvestmentStore();

const rules = {
  required: (value: any) => !!value || 'Obrigatório',
  positive: (value: any) => parseInt(value) > 0 || 'Deve ser um número positivo'
}

const amount = computed({
  get: () => store.amount,
  set: (newValue) => store.setAmount(newValue),
})
</script>
