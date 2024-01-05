<template>
  <v-container>
    <v-row align="center" justify="center" class="switch-btn">
      <v-col cols="auto">
        <v-btn
          density="compact"
          icon="mdi-arrow-left-right"
          @click="store.flipCurrencies()"
        ></v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-select
        v-model="store.origin"
        :items="store.currencies"
        @update:modelValue="currencyOriginChange"
        item-title="title"
        item-value="value"
        label="Origin Currency"
        return-object
      ></v-select>
      <v-select
        v-model="store.target"
        :items="currenciesWOOrigin"
        item-title="title"
        item-value="value"
        label="Target Currency"
        return-object
      ></v-select>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useCurrencyStore } from "~/store/currencies";
const store = useCurrencyStore();
const currenciesWOOrigin = ref();
const currencyOriginChange = () => {
  currenciesWOOrigin.value = store.currencies.filter((o) => o != store.origin);
  store.target =
    store.origin === store.target ? currenciesWOOrigin.value[0] : store.target;
};
currencyOriginChange();
</script>
<style scoped>
.switch-btn {
  margin-top: -2em;
}
</style>
