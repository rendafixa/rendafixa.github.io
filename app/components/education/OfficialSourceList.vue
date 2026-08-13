<script setup lang="ts">
defineProps<{ sources: { label: string, url: string }[] }>()
</script>

<template>
  <ul class="space-y-2">
    <li
      v-for="source in sources"
      :key="source.url"
    >
      <a
        class="text-primary underline underline-offset-4"
        :href="source.url"
        target="_blank"
        rel="noopener noreferrer"
      >{{ source.label }}</a>
    </li>
  </ul>
</template>
