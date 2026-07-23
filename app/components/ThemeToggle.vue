<template>
  <button
    type="button"
    class="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    @click="toggleTheme"
  >
    <ion-icon
      :name="isDark ? 'sunny-outline' : 'moon-outline'"
      size="large"
      class="text-current opacity-70 group-hover:opacity-100 transition-opacity"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>
