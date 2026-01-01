<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="flex items-center"
            >
              <img
                src="/images/budget.svg"
                alt="Calculadora Renda Fixa"
                title="Calculadora Renda Fixa"
                class="w-12 h-12"
              >
            </NuxtLink>
<h1 class="ml-3 text-xl font-semibold text-gray-900 hidden sm:block whitespace-nowrap">
  Calculadora Renda Fixa
</h1>
          </div>
          <NavigationBar />
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/main.css'
</script>
