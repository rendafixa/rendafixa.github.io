<script setup lang="ts">
// Renders the visible counterpart of each page's BreadcrumbList JSON-LD.
// The `current` prop must match the last itemListElement name exactly —
// verify-seo.mjs enforces that both appear in the generated markup.
const props = defineProps<{
  current: string
}>()
</script>

<template>
  <nav
    aria-label="Você está aqui"
    class="not-prose mb-2 text-sm"
  >
    <ol class="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
      <li>
        <NuxtLink
          to="/"
          class="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 underline"
        >
          Início
        </NuxtLink>
      </li>
      <li aria-hidden="true">
        /
      </li>
      <li
        aria-current="page"
        class="text-slate-600 dark:text-slate-300"
      >
        {{ props.current }}
      </li>
    </ol>
  </nav>
</template>
