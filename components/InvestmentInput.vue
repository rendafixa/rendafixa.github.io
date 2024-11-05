<script setup lang="ts">
import AmountInput from "~/components/investment/AmountInput.vue";
import IndexDiInput from "~/components/investment/IndexDiInput.vue";
import IndexSelicInput from "~/components/investment/IndexSelicInput.vue";
import IndexCdbInput from "~/components/investment/IndexCdbInput.vue";
import IndexLcxInput from "~/components/investment/IndexLcxInput.vue";
import PeriodInput from "./investment/PeriodInput.vue";
import PeriodTypeInput from "./investment/PeriodTypeInput.vue";
</script>

<template>
  <v-card elevation="2" class="d-flex justify-center">
    <v-container class="pa-6 flex-1-1-100">
      <v-form @submit.prevent class="">
        <div class="pa-2">
          <AmountInput />
        </div>
        <v-row>
          <v-col>
            <div class="pa-2">
              <PeriodInput />
            </div>
          </v-col>
          <v-col>
            <div class="pa-2">
              <PeriodTypeInput />
            </div>
          </v-col>
        </v-row>
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
  </v-card>
</template>
