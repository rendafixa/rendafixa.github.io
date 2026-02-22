<template>
  <div class="flex gap-2">
    <NuxtLink
      to="/"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors"
      aria-label="Calculator"
    >
      <ion-icon
        name="calculator-outline"
        size="large"
        class="opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/como-calcular-juros-da-poupanca"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors"
      aria-label="Savings Account Calculator Guide"
    >
      <ion-icon
        name="today-outline"
        size="large"
        class="opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/como-calcular-imposto-de-renda"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors"
      aria-label="Income Tax Calculation Guide"
    >
      <ion-icon
        name="card-outline"
        size="large"
        class="opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
    <NuxtLink
      to="/sobre"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors"
      aria-label="Information"
    >
      <ion-icon
        name="information-circle-outline"
        size="large"
        class="opacity-60 hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </NuxtLink>
  </div>
</template>
