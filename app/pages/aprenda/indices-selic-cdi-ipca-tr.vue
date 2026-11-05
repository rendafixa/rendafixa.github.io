<script setup lang="ts">
useSeoMeta({ title: 'Selic, CDI, IPCA e TR' })
</script>

<template>
  <EducationArticleLayout
    title="Selic, CDI, IPCA e TR cumprem papéis diferentes"
    summary="Tratar todos os índices como uma única taxa esconde de onde vem o rendimento e qual risco o produto carrega."
    :sources="[{ label: 'Banco Central — taxa Selic', url: 'https://www.bcb.gov.br/controleinflacao/taxaselic' }, { label: 'IBGE — IPCA', url: 'https://www.ibge.gov.br/explica/inflacao.php' }]"
  >
    <h2>Selic e CDI medem juros</h2><p>A meta Selic orienta a política monetária. A Selic efetiva e o CDI refletem operações do mercado e costumam caminhar próximos. Produtos pós-fixados usam esses índices como base.</p><h2>IPCA mede preços; TR participa da Poupança</h2><p>IPCA+ procura preservar poder de compra e adicionar retorno real. A TR mensal entra na remuneração da Poupança junto à parcela definida pela meta Selic.</p>
  </EducationArticleLayout>
</template>
