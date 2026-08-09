<template>
  <div
    data-testid="result-card"
    class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-black/20 overflow-hidden border border-slate-200/80 dark:border-slate-800 hover:shadow-md dark:hover:shadow-black/30 transition-shadow duration-300 not-prose"
  >
    <!-- Header with gradient background -->
    <div
      class="px-6 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-900"
    >
      <h3 class="text-xl font-bold text-white drop-shadow-sm">
        {{ name }}
      </h3>
    </div>

    <div class="p-6">
      <!-- Main metrics grid - Most important information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Total Amount Card -->
        <div class="bg-sky-50 dark:bg-sky-950/40 rounded-lg p-4 border border-sky-200 dark:border-sky-900/80">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full bg-sky-500 dark:bg-sky-400" />
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              Valor Total Líquido
            </p>
          </div>
          <p
            data-testid="result-total-amount"
            class="text-2xl font-bold text-slate-950 dark:text-slate-50"
          >
            {{ totalAmountDisplay }}
          </p>
        </div>

        <!-- Liquid Profit Card -->
        <div class="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-4 border border-emerald-200 dark:border-emerald-900/80">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              Rendimento Líquido
            </p>
          </div>
          <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {{ liquidAmountDisplay }}
          </p>
        </div>
      </div>

      <!-- Progress bar showing profitability -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Rentabilidade</span>
          <span
            class="text-sm font-bold text-emerald-700 dark:text-emerald-300"
          >{{ totalProfitPercentageDisplay }}</span>
        </div>
        <div class="relative h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 ease-out rounded-full"
            :style="{ width: `${Math.min(totalProfitPercentage, 100)}%` }"
          />
        </div>
      </div>

      <!-- Detailed breakdown section -->
      <div>
        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400" />
            <span class="text-sm text-slate-600 dark:text-slate-400">Valor Investido</span>
          </div>
          <span class="text-sm font-semibold text-slate-950 dark:text-slate-50">{{ amountDisplay }}</span>
        </div>

        <div
          v-if="hasInterestAmount"
          class="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span class="text-sm text-slate-600 dark:text-slate-400">Rendimento Bruto</span>
          </div>
          <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{{ interestAmountDisplay }}</span>
        </div>
      </div>

      <!-- Deductions section - highlighted -->
      <div
        v-if="hasDeductions"
        class="bg-rose-50 dark:bg-rose-950/30 rounded-lg p-4 border border-rose-200 dark:border-rose-900/70 space-y-3"
      >
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full bg-rose-500 dark:bg-rose-400" />
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Deduções
          </p>
        </div>

        <div
          v-if="hasTaxAmount"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2 flex-1">
            <span class="text-sm text-slate-600 dark:text-slate-400">Imposto de Renda</span>
            <span
              v-if="!!taxPercentage"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-200 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200"
            >
              {{ taxPercentageDisplay }}
            </span>
          </div>
          <span class="text-sm font-semibold text-rose-700 dark:text-rose-300">-{{ taxAmountDisplay }}</span>
        </div>

        <div
          v-if="hasIofAmount"
          class="flex items-center justify-between"
        >
          <span class="text-sm text-slate-600 dark:text-slate-400">IOF</span>
          <span class="text-sm font-semibold text-rose-700 dark:text-rose-300">-{{ iofAmountDisplay }}</span>
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
    validator: (value: number) => Number.parseFloat(value.toString()) > 0,
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
    validator: (value: number | null) => (value === null ? true : Number.isFinite(value) && value > 0),
  },
  iofAmount: {
    type: Number,
    required: false,
    default: null,
  },
})

const hasInterestAmount = computed(() => props.interestAmount !== 0)
const hasTaxAmount = computed(() => props.taxAmount !== null && props.taxAmount !== undefined && props.taxAmount !== 0)
const hasIofAmount = computed(() => props.iofAmount !== null && props.iofAmount !== undefined && props.iofAmount !== 0)
const hasDeductions = computed(() => hasTaxAmount.value || hasIofAmount.value)

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
