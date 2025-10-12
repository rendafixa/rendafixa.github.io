<template>
  <v-row>
    <v-col cols="12">
      <InvestmentInfo />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" sm="12" md="5" lg="4">
      <InvestmentInput />
    </v-col>
    <v-col cols="12" sm="12" md="7" lg="8">
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
import InvestmentInfo from '~/components/InvestmentInfo.vue'

const store = useInvestmentStore()
store.initializeStore()
</script>
