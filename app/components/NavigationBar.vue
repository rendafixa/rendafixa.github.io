<template>
  <div class="flex gap-2 items-center">
    <NuxtLink
      to="/"
      exact-active-class="bg-emerald-50 !text-emerald-700 dark:bg-emerald-950/60 dark:!text-emerald-300"
      class="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
      aria-label="Calculator"
    >
      <ion-icon
        name="calculator-outline"
        size="large"
        class="text-current opacity-70 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/como-calcular-juros-da-poupanca"
      exact-active-class="bg-emerald-50 !text-emerald-700 dark:bg-emerald-950/60 dark:!text-emerald-300"
      class="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
      aria-label="Savings Account Calculator Guide"
    >
      <ion-icon
        name="today-outline"
        size="large"
        class="text-current opacity-70 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/como-calcular-imposto-de-renda"
      exact-active-class="bg-emerald-50 !text-emerald-700 dark:bg-emerald-950/60 dark:!text-emerald-300"
      class="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
      aria-label="Income Tax Calculation Guide"
    >
      <ion-icon
        name="card-outline"
        size="large"
        class="text-current opacity-70 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/sobre"
      exact-active-class="bg-emerald-50 !text-emerald-700 dark:bg-emerald-950/60 dark:!text-emerald-300"
      class="group inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400"
      aria-label="Information"
    >
      <ion-icon
        name="information-circle-outline"
        size="large"
        class="text-current opacity-70 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <ThemeToggle />
  </div>
</template>
