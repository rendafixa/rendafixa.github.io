<template>
  <button
    type="button"
    class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    @click="toggleTheme"
  >
    <ion-icon
      :name="isDark ? 'sunny-outline' : 'moon-outline'"
      size="large"
      class="text-gray-700 dark:text-gray-200 opacity-60 hover:opacity-100 transition-opacity"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>
