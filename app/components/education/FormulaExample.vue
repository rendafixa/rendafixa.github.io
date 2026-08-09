<script setup lang="ts">
defineProps<{ title: string, formula: string, example: string }>()
</script>

<template>
  <UCard variant="subtle">
    <h3 class="font-semibold">
      {{ title }}
    </h3><code class="my-3 block overflow-x-auto rounded-md bg-elevated p-3">{{ formula }}</code><p class="text-sm text-muted">
      {{ example }}
    </p>
  </UCard>
</template>
