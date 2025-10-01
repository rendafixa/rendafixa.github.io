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
        <div>Valor Total Líquido: {{ totalAmountDisplay }}</div>
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

const totalProfit = computed(() => props.interestAmount - props.iofAmount - (props.taxAmount ?? 0))
const totalAmount = computed(() => props.amount + totalProfit.value)
const totalProfitPercentage = computed(() => (totalProfit.value / props.amount) * 100)

const taxPercentageDisplay = computed(() => filters.percent(props.taxPercentage))
const taxAmountDisplay = computed(() => filters.currency(props.taxAmount))
const amountDisplay = computed(() => filters.currency(props.amount))
const iofAmountDisplay = computed(() => filters.currency(props.iofAmount))
const liquidAmountDisplay = computed(() => filters.currency(totalProfit.value))
const totalAmountDisplay = computed(() => filters.currency(totalAmount.value))
const interestAmountDisplay = computed(() => filters.currency(props.interestAmount))
const totalProfitPercentageDisplay = computed(() => filters.percent(totalProfitPercentage.value))
</script>
