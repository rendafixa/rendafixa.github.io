<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <!-- Header with gradient background -->
    <div
      class="px-6 py-4 bg-gradient-to-r"
      :class="headerGradientClass"
    >
      <h3 class="text-xl font-bold text-white drop-shadow-sm">
        {{ name }}
      </h3>
    </div>

    <div class="p-6">
      <!-- Main metrics grid - Most important information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Total Amount Card -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-3 h-3 rounded-full"
              :class="colorDotClass"
            />
            <p class="text-sm font-medium text-gray-600">
              Valor Total Líquido
            </p>
          </div>
          <p class="text-2xl font-bold text-gray-900">
            {{ totalAmountDisplay }}
          </p>
        </div>

        <!-- Liquid Profit Card -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full bg-green-500" />
            <p class="text-sm font-medium text-gray-600">
              Rendimento Líquido
            </p>
          </div>
          <p class="text-2xl font-bold text-green-700">
            {{ liquidAmountDisplay }}
          </p>
        </div>
      </div>

      <!-- Progress bar showing profitability -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600">Rentabilidade</span>
          <span
            class="text-sm font-bold"
            :class="profitabilityTextColor"
          >{{ totalProfitPercentageDisplay }}</span>
        </div>
        <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full"
            :class="progressBarColor"
            :style="{ width: `${Math.min(totalProfitPercentage, 100)}%` }"
          />
        </div>
      </div>

      <!-- Detailed breakdown section -->
      <div>
        <div class="flex items-center justify-between border-b border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500" />
            <span class="text-sm text-gray-600">Valor Investido</span>
          </div>
          <span class="text-sm font-semibold text-gray-900">{{ amountDisplay }}</span>
        </div>

        <div
          v-if="!!interestAmount"
          class="flex items-center justify-between py-2 border-b border-gray-100"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500" />
            <span class="text-sm text-gray-600">Rendimento Bruto</span>
          </div>
          <span class="text-sm font-semibold text-green-700">{{ interestAmountDisplay }}</span>
        </div>
      </div>

      <!-- Deductions section - highlighted -->
      <div
        v-if="hasDeductions"
        class="bg-red-50 rounded-lg p-4 border border-red-100 space-y-3"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-red-500" />
          <p class="text-sm font-semibold text-gray-700">
            Deduções
          </p>
        </div>

        <div
          v-if="!!taxAmount"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2 flex-1">
            <span class="text-sm text-gray-600">Imposto de Renda</span>
            <span
              v-if="!!taxPercentage"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-200 text-red-900"
            >
              {{ taxPercentageDisplay }}
            </span>
          </div>
          <span class="text-sm font-semibold text-red-700">-{{ taxAmountDisplay }}</span>
        </div>

        <div
          v-if="!!iofAmount"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-gray-600">IOF</span>
          <span class="text-sm font-semibold text-red-700">-{{ iofAmountDisplay }}</span>
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
      minimumFractionDigits: 2,
    })
  },
}

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
    validator: (value: number | null) => (value !== null ? parseInt(value.toString()) > 0 : true),
  },
  iofAmount: {
    type: Number,
    required: false,
    default: null,
  },
  color: {
    type: String,
    required: false,
    default: 'amber',
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hasAmount = computed(() => !!props.amount)
const hasDeductions = computed(() => !!props.taxAmount || !!props.iofAmount)

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
    amber: 'bg-amber-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
  }
  return colorMap[props.color] || 'bg-amber-400'
})

const headerGradientClass = computed(() => {
  const gradientMap: Record<string, string> = {
    amber: 'from-amber-400 to-amber-500',
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    red: 'from-red-400 to-red-500',
  }
  return gradientMap[props.color] || 'from-amber-400 to-amber-500'
})

const colorDotClass = computed(() => {
  const dotMap: Record<string, string> = {
    amber: 'bg-amber-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
  }
  return dotMap[props.color] || 'bg-amber-500'
})

const profitabilityTextColor = computed(() => {
  const textColorMap: Record<string, string> = {
    amber: 'text-amber-700',
    green: 'text-green-700',
    blue: 'text-blue-700',
    red: 'text-red-700',
  }
  return textColorMap[props.color] || 'text-amber-700'
})
</script>
