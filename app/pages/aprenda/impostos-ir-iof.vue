<script setup lang="ts">
useSeoMeta({ title: 'IR e IOF na renda fixa' })
</script>

<template>
  <EducationArticleLayout
    title="IR e IOF: o prazo muda a rentabilidade líquida"
    summary="O IOF penaliza resgates nos primeiros 29 dias. O IR regressivo cria novos patamares nos dias 181, 361 e 721."
    :sources="[{ label: 'Receita Federal — tabelas 2026', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026' }, { label: 'Decreto nº 6.306 — IOF', url: 'https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6306compilado.htm' }]"
  >
    <h2>O IOF vem antes do IR</h2><p>Nos primeiros 29 dias, o IOF consome uma parcela decrescente do lucro. O IR incide sobre o rendimento positivo restante. No 30º dia, o IOF chega a zero.</p><FormulaExample
      title="Ordem de cálculo"
      formula="IR = (lucro bruto - IOF) × alíquota de IR"
      example="Rendimentos nulos ou negativos não geram esses impostos na simulação."
    />
    <h2>Isenção não elimina os demais critérios</h2><p>Poupança, LCI e LCA são tratadas como isentas para pessoa física. Ainda vale comparar taxa, prazo, liquidez e risco.</p>
  </EducationArticleLayout>
</template>
