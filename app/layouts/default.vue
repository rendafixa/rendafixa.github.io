<template>
  <div class="min-h-screen bg-default transition-colors">
    <header class="sticky top-0 z-50 border-b border-default bg-default/90 shadow-sm backdrop-blur">
      <div class="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
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
            <span class="ml-3 hidden whitespace-nowrap text-lg font-semibold sm:block">
              Calculadora Renda Fixa
            </span>
          </div>
          <NavigationBar />
        </div>
      </div>
    </header>
    <main class="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import '~/assets/css/main.css'
</script>
