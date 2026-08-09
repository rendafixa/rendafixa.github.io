<script setup lang="ts">
const props = defineProps<{ title: string, summary: string, reviewed?: string, sources: { label: string, url: string }[] }>()

useSchemaOrg([
  defineArticle({
    headline: props.title,
    description: props.summary,
    dateModified: props.reviewed ?? '2026-08-09',
    author: { name: 'Calculadora Renda Fixa' },
  }),
])
</script>

<template>
  <article class="mx-auto max-w-4xl space-y-8">
    <header>
      <UBadge
        color="primary"
        variant="subtle"
      >
        Aprenda
      </UBadge><h1 class="mt-4 text-3xl font-bold sm:text-5xl">
        {{ title }}
      </h1><p class="mt-4 text-lg text-muted">
        {{ summary }}
      </p>
    </header>
    <div class="prose prose-slate max-w-none dark:prose-invert">
      <slot />
    </div>
    <section>
      <h2 class="mb-3 text-xl font-semibold">
        Fontes oficiais
      </h2><OfficialSourceList :sources="sources" />
    </section>
    <UAlert
      color="neutral"
      variant="subtle"
      :description="`Conteúdo educacional, não é recomendação de investimento. Última revisão: ${reviewed ?? '09/08/2026'}.`"
    />
    <UButton
      to="/"
      icon="i-lucide-calculator"
    >
      Levar para a calculadora
    </UButton>
  </article>
</template>
