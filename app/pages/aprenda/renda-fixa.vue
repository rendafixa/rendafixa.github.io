<script setup lang="ts">
useSeoMeta({ title: 'Como comparar renda fixa' })
</script>

<template>
  <EducationArticleLayout
    title="Como comparar renda fixa sem confundir taxa com resultado"
    summary="Duas aplicações com a mesma taxa podem entregar valores líquidos diferentes. O prazo, o índice, os impostos e a proteção de crédito explicam a diferença."
    :sources="[{ label: 'Portal do Investidor — renda fixa', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/renda-fixa' }]"
  >
    <h2>Comece pelo objetivo e pelo vencimento</h2><p>Uma comparação útil usa o mesmo valor inicial e horizonte. Depois separa retorno bruto, impostos, liquidez e risco do emissor. Misturar prazos favorece o investimento mais longo sem deixar esse custo explícito.</p>
    <h2>Compare o valor líquido</h2><p>Taxas prefixadas travam uma remuneração. Pós-fixadas acompanham um índice. IPCA+ combina inflação e ganho real. A calculadora transforma essas estruturas em valor líquido no vencimento, sem arredondar centavos durante o cálculo.</p>
    <h2>O risco não cabe em uma taxa</h2><p>FGC reduz parte do risco de crédito em produtos elegíveis, mas tem limites por instituição e conglomerado. Títulos públicos têm garantia do Tesouro Nacional e oscilam antes do vencimento.</p>
  </EducationArticleLayout>
</template>
