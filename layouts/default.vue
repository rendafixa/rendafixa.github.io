<template>
  <v-app>
    <v-layout>
      <SideBar />

      <v-app-bar app>
        <v-app-bar-nav-icon @click="isOpen = !isOpen"></v-app-bar-nav-icon>
        <v-app-bar-title
          shrink-on-scroll
          class="text-no-wrap d-flex font-weight-regular"
          >{{ onPage ? "Calculadora Renda Fixa" : "Sobre este Projeto" }}
        </v-app-bar-title>

        <NavigationBar class="pr-2" />
      </v-app-bar>

      <v-main>
        <v-sheet>
          <SeoKit />
          <NuxtPage />
        </v-sheet>
      </v-main>
    </v-layout>
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

::-webkit-scrollbar {
  display: none;
}
</style>
<script setup lang="ts">
import { usePageStore } from "~/store/page";

const page = usePageStore();

const { isOpen, onPage } = storeToRefs(page);
</script>
