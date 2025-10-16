<template>
  <div class="bg-white rounded-lg shadow-md mb-4">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ name }}</h3>
    </div>
    <div class="px-6 py-4 space-y-2">
      <div v-if="hasAmount" class="text-gray-700">
        Valor Investido: {{ amountDisplay }}
      </div>
      <div v-if='!!interestAmount' class="text-gray-700">
        Rendimento Bruto: {{ interestAmountDisplay }}
      </div>
      <div v-if='!!iofAmount' class="text-gray-700">
        IOF: {{ iofAmountDisplay }}
      </div>
      <div v-if='!!taxAmount' class="text-gray-700 flex items-center gap-2">
        <span>Imposto de Renda: {{ taxAmountDisplay }}</span>
        <span
          v-if='!!taxPercentage'
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
        >
          {{ taxPercentageDisplay }}
        </span>
      </div>
      <div class="text-gray-700">
        Rendimento Líquido: {{ liquidAmountDisplay }}
      </div>
      <div class="text-gray-700 font-semibold">
        Valor Total Líquido: {{ totalAmountDisplay }}
      </div>
      <div class="mt-4">
        <div class="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 transition-all duration-300 flex items-center justify-center text-sm font-medium text-gray-900"
            :class="progressBarColor"
            :style="{ width: `${Math.min(totalProfitPercentage, 100)}%` }"
          >
            <span class="relative z-10 px-2">{{ totalProfitPercentageDisplay }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
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

const progressBarColor = computed(() => {
  const colorMap: Record<string, string> = {
    'amber': 'bg-amber-400',
    'green': 'bg-green-400',
    'blue': 'bg-blue-400',
    'red': 'bg-red-400',
  }
  return colorMap[props.color] || 'bg-amber-400'
})
</script>

