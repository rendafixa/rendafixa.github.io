<script setup lang="ts">
useSeoMeta({ title: 'LCI e LCA' })
</script>

<template>
  <EducationArticleLayout
    title="LCI e LCA: como avaliar a isenção de IR"
    summary="A isenção para pessoa física melhora o retorno líquido, mas não transforma toda LCI ou LCA na melhor opção."
    :sources="[{ label: 'B3 — LCI', url: 'https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-fixa/lci.htm' }, { label: 'B3 — LCA', url: 'https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/renda-fixa/lca.htm' }]"
  >
    <h2>Converta taxas para a mesma base</h2><p>Comparar uma LCI de 90% do CDI com um CDB de 100% exige descontar IR do CDB no prazo escolhido. A equivalência muda em cada faixa regressiva.</p><FormulaExample
      title="Equivalência aproximada"
      formula="taxa tributável equivalente = taxa isenta ÷ (1 - alíquota de IR)"
      example="Uma taxa isenta de 90% do CDI equivale a cerca de 116,13% do CDI na faixa de 22,5%."
    />
    <h2>Observe carência e emissor</h2><p>A simulação até o vencimento não garante liquidez. Leia a carência e confirme o emissor; a cobertura real do FGC consolida exposições que esta calculadora apresenta de forma simplificada.</p>
  </EducationArticleLayout>
</template>
