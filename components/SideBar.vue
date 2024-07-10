<template>
  <div>
    <v-navigation-drawer v-model="isOpen" width="300">
      <v-container class="d-flex flex-column align-center">
        <v-sheet class="">
          <NuxtLink to="/">
            <v-img
              src="/images/budget.svg"
              alt="Calculadora Renda Fixa"
              title="Calculadora Renda Fixa"
              width="64"
              height="64"
            ></v-img>
          </NuxtLink>
        </v-sheet>

        <v-sheet class="pt-5">
          <div class="text-h6 font-weight-regular">Investimento</div>
        </v-sheet>
      </v-container>

      <v-divider></v-divider>

      <v-container class="pa-6 flex-1-1-100">
        <v-form @submit.prevent class="">
          <div class="pa-2">
            <AmountInput />
          </div>
          <div class="pa-2">
            <PeriodInput />
          </div>
          <div class="pa-2">
            <PeriodTypeInput />
          </div>
          <div class="pa-2">
            <IndexDiInput />
          </div>
          <div class="pa-2">
            <IndexSelicInput />
          </div>
          <div class="pa-2">
            <IndexCdbInput />
          </div>
          <div class="pa-2">
            <IndexLcxInput />
          </div>
        </v-form>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import AmountInput from "~/components/investment/AmountInput.vue";
import IndexDiInput from "~/components/investment/IndexDiInput.vue";
import IndexSelicInput from "~/components/investment/IndexSelicInput.vue";
import IndexCdbInput from "~/components/investment/IndexCdbInput.vue";
import IndexLcxInput from "~/components/investment/IndexLcxInput.vue";
import PeriodInput from "~/components/investment/PeriodInput.vue";
import PeriodTypeInput from "~/components/investment/PeriodTypeInput.vue";
import { usePageStore } from "~/store/page";

const page = usePageStore();

const { isOpen } = storeToRefs(page);
</script>

<style></style>
