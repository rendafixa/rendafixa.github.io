<template>
  <v-text-field
    v-model.number="store.amount"
    type="number"
    variant="underlined"
    label="Valor"
    prepend-icon="mdi-cash-multiple"
    min="0"
    :rules="[rules.required, rules.positive]"
  >
  </v-text-field>
</template>

<script setup lang="ts">
import { useCurrencyStore } from "~/store/currencies";
const store = useCurrencyStore();

const rules = {
  required: (value: any) => !!value || "Obrigatório",
  positive: (value: any) =>
    parseInt(value) > 0 || "Deve ser um número positivo",
};
</script>
