<template>
  <v-row>
    <v-col cols="12" sm="5" md="4">
      <InvestmentInput />
    </v-col>
    <v-col cols="12" sm="7" md="8">
      <InvestmentSimulation />
    </v-col>
  </v-row>
</template>
<script setup lang='ts'>
useSeoMeta({
  title: 'Calculadora',
  description: 'Calculadora de investimentos Renda Fixa para simulação de rentabilidade em CDB, RDB, LC, LCI, LCA, Poupança e Tesouro Direto'
})
import { useInvestmentStore } from '~/store/investment'
const store = useInvestmentStore()
store.initializeStore()

</script>
