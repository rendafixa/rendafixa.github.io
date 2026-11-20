<template>
  <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">
    <h1 class="sr-only">
      Calculadora de Renda Fixa: CDB, LCI, LCA, Poupança e Tesouro Direto
    </h1>
    <div class="sm:col-span-5 md:col-span-4 sm:self-start sm:sticky sm:top-20">
      <InvestmentInput />
    </div>
    <div class="sm:col-span-7 md:col-span-8">
      <InvestmentSimulation />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useInvestmentStore } from '~/stores/investment'
import { onMounted } from 'vue'

useSeoMeta({
  // the homepage carries the full brand title; drop the "%s | Renda Fixa" template
  title: 'Calculadora de Renda Fixa: CDB, LCI, LCA, Poupança e Tesouro Direto',
  titleTemplate: null,
  description: 'Calculadora de renda fixa para simular CDB, RDB, LCI, LCA, Poupança e Tesouro Direto: rentabilidade bruta e líquida com CDI e SELIC atualizados, IR e IOF.',
  twitterCard: 'summary_large_image',
  ogImageAlt: 'Cartão de compartilhamento da Calculadora de Renda Fixa com o título e a descrição da página.',
})

useSchemaOrg([
  defineSoftwareApp({
    name: 'Calculadora de Renda Fixa',
    description: 'Simulador de investimentos em renda fixa: CDB, RDB, LCI, LCA, Poupança e Tesouro Direto.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://rendafixa.github.io/',
  }),
])

const store = useInvestmentStore()
onMounted(() => {
  store.initializeStore()
})
</script>
