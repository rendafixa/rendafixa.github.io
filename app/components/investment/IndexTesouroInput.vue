<template>
  <v-text-field
    v-model.number='tesouro'
    type='number'
    variant="underlined"
    label='Tesouro Direto'
    prepend-icon='mdi-treasure-chest'
    suffix='% SELIC'
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
  required: (value: any) => !!value || 'Obrigatório',
  positive: (value: any) => parseInt(value) >= 0 || 'Deve ser um número não negativo'
}

const tesouro = computed({
  get: () => store.tesouro,
  set: (data) => store.setTesouro(data)
})
</script>