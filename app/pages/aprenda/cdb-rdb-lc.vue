<script setup lang="ts">
useSeoMeta({ title: 'CDB, RDB e LC' })
</script>

<template>
  <EducationArticleLayout
    title="CDB, RDB e LC: a taxa precisa pagar imposto e risco"
    summary="Esses títulos financiam instituições financeiras e podem render uma taxa prefixada, um percentual do CDI ou IPCA mais juros."
    :sources="[{ label: 'Portal do Investidor — CDB e RDB', url: 'https://www.gov.br/investidor/pt-br/investir/tipos-de-investimentos/renda-fixa/cdb-e-rdb' }, { label: 'FGC — garantia', url: 'https://www.fgc.org.br/sobre-garantia-fgc' }]"
  >
    <h2>O rendimento depende do contrato</h2><p>Um CDB de 100% do CDI aplica esse percentual ao rendimento diário do CDI. Um prefixado usa a taxa anual contratada. Um IPCA+ multiplica inflação e taxa real; somar os percentuais perde o efeito composto.</p><FormulaExample
      title="CDB de 100% do CDI"
      formula="fator diário = 1 + ((1 + CDI)^(1/252) - 1) × 100%"
      example="O saldo acumula o fator em cada dia útil do período."
    />
    <h2>IR e IOF reduzem o lucro</h2><p>O IR cai de 22,5% para 15% conforme o prazo. Nos primeiros 29 dias, o IOF incide antes do IR. A comparação deve usar o lucro após ambos.</p>
  </EducationArticleLayout>
</template>
