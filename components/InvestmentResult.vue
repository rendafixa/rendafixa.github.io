<template>
  <div>
    <v-card elevation="2">
      <v-card-title class="font-weight-medium">{{ name }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-if="hasAmount" lg="4" cols="12">
            <v-card style="background-color: #fafafa">
              <v-card-text>
                <div class="d-flex align-center justify-center flex-column">
                  <div>Valor Investido</div>
                  <div class="font-weight-bold" :class="colorType()">
                    {{ amountDisplay }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="!!interestAmount" lg="4" cols="12">
            <v-card style="background-color: #fafafa">
              <v-card-text>
                <div class="d-flex align-center justify-center flex-column">
                  <div>Rendimento Bruto</div>
                  <div class="font-weight-bold" :class="colorType()">
                    {{ interestAmountDisplay }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col lg="4" cols="12">
            <v-card style="background-color: #fafafa">
              <v-card-text>
                <div class="d-flex align-center justify-center flex-column">
                  <div>Valor Total Líquido</div>
                  <div class="font-weight-bold" :class="colorType()">
                    {{ totalAmountDisplay }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="!!iofAmount" lg="4" cols="12">
            <v-card style="background-color: #fafafa">
              <v-card-text>
                <div class="d-flex align-center justify-center flex-column">
                  <div>IOF</div>
                  <div class="font-weight-bold" :class="colorType()">
                    {{ iofAmountDisplay }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="!!taxAmount" lg="8" cols="12">
            <v-card style="background-color: #fafafa">
              <v-card-text>
                <div class="d-flex align-center justify-center flex-column">
                  <div>
                    Imposto de Renda
                    <v-badge
                      inline
                      v-if="!!taxPercentage"
                      :content="taxPercentageDisplay"
                      color="red lighten-2"
                    />
                  </div>
                  <div class="font-weight-bold text-red-lighten-1">
                    -{{ taxAmountDisplay }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const defaultLocale = "pt-BR";
const filters = {
  percent(amount: number) {
    return (
      amount.toLocaleString(defaultLocale, { maximumFractionDigits: 2 }) + "%"
    );
  },
  number(amount: number) {
    return amount.toLocaleString(defaultLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  },
  currency(amount: number) {
    return amount.toLocaleString(defaultLocale, {
      style: "currency",
      currency: "BRL",
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    });
  },
};

const props = defineProps({
  loading: Boolean,
  name: {
    type: String,
    required: true,
    validator: (content: string) => !!content,
  },
  amount: {
    type: Number,
    required: true,
    validator: (value: number) => parseFloat(value.toString()) > 0,
  },
  interestAmount: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    required: false,
    default: null,
  },
  taxPercentage: {
    type: Number,
    required: false,
    default: null,
    validator: (value: number | null) =>
      value !== null ? parseInt(value.toString()) > 0 : true,
  },
  iofAmount: {
    type: Number,
    required: false,
    default: null,
  },
  color: {
    type: String,
    required: false,
    default: "amber",
  },
});

const hasAmount = computed(() => !!props.amount);

const totalProfit = computed(
  () => props.interestAmount - props.iofAmount - (props.taxAmount ?? 0)
);
const totalAmount = computed(() => props.amount + totalProfit.value);
const totalProfitPercentage = computed(
  () => (totalProfit.value / props.amount) * 100
);

const taxPercentageDisplay = computed(() =>
  filters.percent(props.taxPercentage)
);
const taxAmountDisplay = computed(() => filters.currency(props.taxAmount));
const amountDisplay = computed(() => filters.currency(props.amount));
const iofAmountDisplay = computed(() => filters.currency(props.iofAmount));
const totalAmountDisplay = computed(() => filters.currency(totalAmount.value));
const interestAmountDisplay = computed(() =>
  filters.currency(props.interestAmount)
);
const totalProfitPercentageDisplay = computed(() =>
  filters.percent(totalProfitPercentage.value)
);

function colorType() {
  let color;
  switch (props.name) {
    case "Poupança":
      color = "text-blue-lighten-1";
      break;

    case "CDB / RDB":
      color = "text-deep-purple-darken-3";
      break;

    case "LCI / LCA":
      color = "text-green-accent-4";
      break;

    default:
      color = "grey-darken-4";
      break;
  }

  return color;
}
</script>
