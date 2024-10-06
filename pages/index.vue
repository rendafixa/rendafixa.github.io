<template>
  <div>
    <InvestmentSimulation />
  </div>
</template>
<script setup lang="ts">
useSeoMeta({
  title: "Calculadora",
  description:
    "Calculadora de investimentos Renda Fixa para simulação de rentabilidade em CDB, RDB, LC, LCI, LCA, Poupança e Tesouro Direto",
});
import { useInvestmentStore } from "~/store/investment";
const store = useInvestmentStore();
store.initializeStore();
</script>
