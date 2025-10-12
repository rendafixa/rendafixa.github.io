<template>
    <v-card elevation='2' class='mb-2'>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-text>
        <div v-if="hasAmount">Valor Investido: {{ amountDisplay }}</div>
        <div v-if='!!interestAmount'>
          Rendimento Bruto: {{ interestAmountDisplay }}
        </div>
        <div v-if='!!iofAmount'>IOF: {{ iofAmountDisplay }}</div>
        <div v-if='!!taxAmount'>
          Imposto de Renda: {{ taxAmountDisplay }}
          <v-badge
            inline
            v-if='!!taxPercentage'
            :content='taxPercentageDisplay'
            color='red lighten-2'
          />
        </div>
        <div>
          Rendimento Líquido: {{ liquidAmountDisplay }}
        </div>
        <div>Valor Total Líquido: {{ netAmountDisplay }}</div>
        <v-progress-linear v-model='totalProfitPercentage' :color='color' height='25'>
          {{ totalProfitPercentageDisplay }}
        </v-progress-linear>
      </v-card-text>
    </v-card>
</template>

<script setup lang='ts'>
import { computed } from 'vue'

const defaultLocale = 'pt-BR'
const filters = {
  percent(amount: number) {
    return amount.toLocaleString(defaultLocale, { maximumFractionDigits: 2 }) + '%'
  },
  number(amount: number) {
    return amount.toLocaleString(defaultLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  },
  currency(amount: number) {
    return amount.toLocaleString(defaultLocale, {
      style: 'currency',
      currency: 'BRL',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2
    })
  }
}

const props = defineProps({
  loading: Boolean,
  name: {
    type: String,
    required: true,
    validator: (content: string) => !!content
  },
  amount: {
    type: Number,
    required: true,
    validator: (value: number) => parseFloat(value.toString()) > 0
  },
  interestAmount: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: false,
    default: null
  },
  taxAmount: {
    type: Number,
    required: false,
    default: null
  },
  taxPercentage: {
    type: Number,
    required: false,
    default: null,
    validator: (value: number | null) => (value !== null ? parseInt(value.toString()) > 0 : true)
  },
  iofAmount: {
    type: Number,
    required: false,
    default: null
  },
  color: {
    type: String,
    required: false,
    default: 'amber'
  }
})
const hasAmount = computed(() => !!props.amount)

// Se netAmount for fornecido, usamos esse valor; caso contrário, calculamos
const totalAmount = computed(() => {
  if (props.netAmount !== null && props.netAmount !== undefined) {
    return props.netAmount;
  }
  // Fallback para cálculo antigo se netAmount não for fornecido
  const calculatedNet = props.interestAmount - (props.iofAmount ?? 0) - (props.taxAmount ?? 0);
  return props.amount + calculatedNet;
})

// Cálculo do rendimento líquido baseado no valor total líquido
const totalProfit = computed(() => totalAmount.value - props.amount)

// Percentual de lucro baseado no valor investido
const totalProfitPercentage = computed(() => (totalProfit.value / props.amount) * 100)

const taxPercentageDisplay = computed(() => filters.percent(props.taxPercentage))
const taxAmountDisplay = computed(() => filters.currency(props.taxAmount))
const amountDisplay = computed(() => filters.currency(props.amount))
const iofAmountDisplay = computed(() => filters.currency(props.iofAmount))
const liquidAmountDisplay = computed(() => filters.currency(totalProfit.value))
const netAmountDisplay = computed(() => filters.currency(totalAmount.value))
const interestAmountDisplay = computed(() => filters.currency(props.interestAmount))
const totalProfitPercentageDisplay = computed(() => filters.percent(totalProfitPercentage.value))
</script>
