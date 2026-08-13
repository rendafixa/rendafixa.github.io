<script setup lang="ts">
useSeoMeta({ title: 'FGC e renda fixa' })
</script>

<template>
  <EducationArticleLayout
    title="FGC é uma rede de proteção com limites"
    summary="A garantia cobre produtos elegíveis quando uma instituição quebra, mas não substitui a análise do emissor nem protege qualquer investimento."
    :sources="[{ label: 'FGC — sobre a garantia', url: 'https://www.fgc.org.br/sobre-garantia-fgc' }]"
  >
    <h2>A cobertura não é por título isolado</h2><p>O limite de R$ 250 mil considera principal e rendimentos por CPF ou CNPJ, instituição ou conglomerado. Existe também um teto global em período de quatro anos.</p><h2>O alerta da calculadora é deliberadamente conservador</h2><p>A tela avalia cada investimento separado porque não conhece suas outras aplicações nem o conglomerado do emissor. Tesouro Direto recebe a indicação Tesouro Nacional, não FGC.</p>
  </EducationArticleLayout>
</template>
