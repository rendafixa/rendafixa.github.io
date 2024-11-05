<template>
  <span>
    <v-btn icon to="/" @click="page.isSideBarOpen(true)">
      <v-icon>mdi-chart-bar</v-icon>
    </v-btn>
    <v-btn icon to="/sobre" @click="page.isSideBarOpen(false)">
      <v-icon>mdi-information-variant</v-icon>
    </v-btn>
  </span>
</template>

<script setup lang="ts">
import { usePageStore } from "~/store/page";

const page = usePageStore();
</script>
