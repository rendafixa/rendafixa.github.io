<script setup lang="ts">
const articles = [
  ['/aprenda/renda-fixa', 'Renda fixa sem atalhos', 'Como prazo, risco e liquidez mudam uma comparação.'],
  ['/aprenda/cdb-rdb-lc', 'CDB, RDB e LC', 'Remuneração, impostos e cobertura do FGC.'],
  ['/aprenda/lci-lca', 'LCI e LCA', 'Quando a isenção de IR compensa uma taxa menor.'],
  ['/aprenda/tesouro-direto', 'Tesouro Direto', 'Prefixado, Selic e IPCA+ até o vencimento.'],
  ['/aprenda/indices-selic-cdi-ipca-tr', 'Selic, CDI, IPCA e TR', 'O papel de cada índice na renda fixa.'],
  ['/aprenda/impostos-ir-iof', 'IR e IOF', 'As tabelas regressivas que afetam o resultado líquido.'],
  ['/aprenda/poupanca', 'Poupança', 'Aniversário, Selic e TR.'],
  ['/aprenda/fgc', 'FGC', 'O que a cobertura protege — e o que não protege.'],
]
useSeoMeta({ title: 'Aprenda sobre renda fixa', description: 'Guias sobre produtos, índices, impostos e garantias da renda fixa brasileira.' })
</script>

<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-4xl font-bold">
        Aprenda a comparar renda fixa
      </h1><p class="mt-3 max-w-3xl text-lg text-muted">
        A taxa anunciada é só o começo. Prazo, tributação, inflação, liquidez e risco determinam o resultado que chega ao seu bolso.
      </p>
    </header><div class="grid gap-4 md:grid-cols-2">
      <UCard
        v-for="[to, title, description] in articles"
        :key="to"
        class="flex flex-col"
      >
        <h2 class="text-xl font-semibold">
          {{ title }}
        </h2><p class="mt-2 text-muted">
          {{ description }}
        </p><UButton
          :to="to"
          variant="link"
          class="mt-4 px-0"
        >
          Ler guia
        </UButton>
      </UCard>
    </div>
  </div>
</template>
