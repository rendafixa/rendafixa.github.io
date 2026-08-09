<template>
  <nav
    class="flex items-center gap-1"
    aria-label="Navegação principal"
  >
    <NuxtLink
      to="/"
      exact-active-class="bg-emerald-50 text-emerald-700! dark:bg-emerald-950/60 dark:text-emerald-300!"
      class="hidden items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-elevated sm:inline-flex"
      aria-label="Calculadora"
    >
      Calculadora
    </NuxtLink>
    <NuxtLink
      to="/aprenda"
      exact-active-class="bg-emerald-50 text-emerald-700! dark:bg-emerald-950/60 dark:text-emerald-300!"
      class="hidden items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-elevated md:inline-flex"
      aria-label="Aprenda"
    >
      Aprenda
    </NuxtLink>
    <NuxtLink
      to="/metodologia"
      exact-active-class="bg-emerald-50 text-emerald-700! dark:bg-emerald-950/60 dark:text-emerald-300!"
      class="hidden items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-elevated lg:inline-flex"
      aria-label="Metodologia"
    >
      Metodologia
    </NuxtLink>
    <NuxtLink
      to="/sobre"
      exact-active-class="bg-emerald-50 text-emerald-700! dark:bg-emerald-950/60 dark:text-emerald-300!"
      class="hidden items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-elevated lg:inline-flex"
      aria-label="Sobre"
    >
      Sobre
    </NuxtLink>
    <UColorModeButton aria-label="Alternar tema" />
  </nav>
</template>
