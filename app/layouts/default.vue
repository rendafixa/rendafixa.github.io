<template>
  <v-app>
    <v-app-bar app>
      <NuxtLink to="/">
        <img
            src="/images/budget.svg"
            alt="Calculadora Renda Fixa"
            title="Calculadora Renda Fixa"
            class="pa-1"
            width="64"
            height="64"
        />
      </NuxtLink>
      <v-app-bar-title
          shrink-on-scroll
          class="pl-2 text-no-wrap d-none d-sm-flex"
      >Calculadora Renda Fixa
      </v-app-bar-title
      >
      <v-spacer/>
      <NavigationBar/>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
<script setup lang="ts">
</script>