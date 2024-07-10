<template>
  <v-select
    v-model="periodType"
    label="Período"
    variant="outlined"
    :items="periodTypesOptions"
    item-title=""
    return-object
  ></v-select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PeriodTypes, useInvestmentStore } from "~/store/investment";
const store = useInvestmentStore();

const periodTypesOptions = computed(() => Object.values(PeriodTypes));
const periodType = computed({
  get: () => store.periodType,
  set: (newType) => store.setPeriodType(newType),
});
</script>
