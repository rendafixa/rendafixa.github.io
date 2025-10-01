<template>
  <v-text-field
    v-model.number="lcx"
    type="number"
    variant="underlined"
    label="LCI/LCA"
    prepend-icon="mdi-finance"
    suffix="% DI"
    min="0"
    :rules="[rules.required, rules.positive]"
  ></v-text-field>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import { useInvestmentStore } from '~/store/investment'

const store = useInvestmentStore()

const rules = {
  required: (value: any) => !!value || 'Obrigatório',
  positive: (value: any) => parseInt(value) > 0 || 'Deve ser um número positivo'
}

const lcx = computed({
  get: () => store.lcx,
  set: (data) => store.setLcx(data)
})
</script>
