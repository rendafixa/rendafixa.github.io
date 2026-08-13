<script setup lang="ts">
useSeoMeta({ title: 'Tesouro Direto' })
</script>

<template>
  <EducationArticleLayout
    title="Tesouro Direto: vencimento e venda antecipada são contas diferentes"
    summary="Tesouro Prefixado, Selic e IPCA+ têm lógicas distintas. Antes do vencimento, todos podem oscilar por marcação a mercado."
    :sources="[{ label: 'Tesouro Direto — conheça os títulos', url: 'https://www.tesourodireto.com.br/titulos/tipos-de-tesouro.htm' }]"
  >
    <h2>A calculadora mostra o caminho até o vencimento</h2><p>O modelo não calcula preço de venda antecipada, cupons, spread, corretagem ou custódia. Ele acumula a taxa contratada ou projetada e aplica a tributação no prazo final.</p><h2>IPCA+ protege uma taxa real contratada</h2><p>O retorno nominal combina inflação e juros reais de forma multiplicativa. Essa proteção depende de manter o título até o vencimento; vender antes expõe o investidor ao preço de mercado.</p>
  </EducationArticleLayout>
</template>
