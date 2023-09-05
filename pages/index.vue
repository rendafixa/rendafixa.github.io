<template>
  <v-row>
    <v-col cols="12" sm="5" md="4">
      Input
    </v-col>
    <v-col cols="12" sm="7" md="8">
      <AmountInput />
    </v-col>
  </v-row>
</template>
<script setup lang='ts'>
  import { useInvestmentStore } from '~/store/investment'
  import AmountInput from '~/components/investment/AmountInput.vue'
  const store = useInvestmentStore()
  store.initializeStore()
</script>
