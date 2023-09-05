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
  import { useInvestmentStore } from '~/store/investment'
  const store = useInvestmentStore()
  store.initializeStore()
</script>
