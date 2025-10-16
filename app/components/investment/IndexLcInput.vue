<template>
  <v-text-field
    v-model.number='lc'
    type='number'
    variant="underlined"
    label='LC'
    prepend-icon='mdi-finance'
    suffix='% DI'
    min='0'
    :rules='[rules.required, rules.positive]'
  >
  </v-text-field>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()

const rules = {
  required: (value: any) => (value !== null && value !== undefined && value !== '') || 'Obrigatório',
  positive: (value: any) => parseInt(value) >= 0 || 'Deve ser um número não negativo'
}

const lc = computed({
  get: () => store.lc,
  set: (data) => store.setLc(data)
})
</script>