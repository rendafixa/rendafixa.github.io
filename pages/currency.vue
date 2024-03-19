<template>
  <v-row>
    <v-col cols="12" sm="5" md="4">
      <CurrencyInput />
    </v-col>
    <v-col cols="12" sm="7" md="8">
      <CurrencyTimeSeriesChart />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useCurrencyStore } from "~/store/currencies";
const store = useCurrencyStore();
store.initializeStore();
</script>

<style scoped></style>
