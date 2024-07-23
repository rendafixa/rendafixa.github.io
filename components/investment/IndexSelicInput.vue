<template>
  <v-text-field
    v-model.number="selic"
    type="number"
    variant="outlined"
    label="Taxa SELIC"
    prepend-inner-icon="mdi-finance"
    suffix="% ao ano"
    min="0"
    :rules="[rules.required, rules.positive]"
  ></v-text-field>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useInvestmentStore } from "~/store/investment";

const store = useInvestmentStore();

const rules = {
  required: (value: any) => !!value || "Obrigatório",
  positive: (value: any) =>
    parseInt(value) > 0 || "Deve ser um número positivo",
};

const selic = computed({
  get: () => store.selic,
  set: (data) => store.setSelic(data),
});
</script>
