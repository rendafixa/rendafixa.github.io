<template>
  <v-card elevation="2" v-if="store.conversion && store.conversion.rates">
    <v-card-title class="text-h6">Conversão entre Moedas</v-card-title>
    <v-card-text>
      <v-form @submit.prevent>
        <CurrencyAmountInput />
        <div class="currency-container">
          <CurrencyTypeInput />
        </div>
        <div>{{ store.amount }} {{ store.origin.title }} é igual a</div>
        <div class="text-h5">
          {{ store.conversionRate }} {{ store.target.title }}
        </div>
        <div>
          {{ new Date(store.conversion.date).toLocaleDateString("pt-BR") }}
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useCurrencyStore } from "~/store/currencies";
const store = useCurrencyStore();
let debounce = false;
watch(
  () => [store.amount, store.origin, store.target],
  () => {
    //"debouncing"
    if (debounce) return;
    debounce = true;
    setTimeout(() => {
      store.fetchConversion();
      store.fetchHistoricalData();
      debounce = false;
    }, 500);
  }
);
</script>

<style scoped>
.currency-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
