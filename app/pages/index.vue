<template>
  <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
    <div class="sm:col-span-5 md:col-span-4">
      <InvestmentInput />
    </div>
    <div class="sm:col-span-7 md:col-span-8">
      <InvestmentSimulation />
    </div>
  </div>
</template>
<script setup lang='ts'>
useSeoMeta({
  title: 'Calculadora',
  description: 'Calculadora de investimentos Renda Fixa para simulação de rentabilidade em CDB, RDB, LC, LCI, LCA, Poupança e Tesouro Direto'
})
import { useInvestmentStore } from '~/store/investment'
import { onMounted } from 'vue'
const store = useInvestmentStore()
onMounted(() => {
  store.initializeStore()
})

</script>
