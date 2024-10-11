<template>
    <v-card elevation='2' class='mb-2' max-width='400px'>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-text>
        <v-table density="compact">
          <tbody>
            <tr v-if="hasAmount">
              <td class="border-0">Valor Investido</td>
              <td class="border-0 text-right">
                <code>{{ amountDisplay }}</code>
              </td>
            </tr>
            <tr v-if='!!interestAmount'>
              <td class="border-0">Rendimento Bruto</td>
              <td class="border-0 text-right">
                <code>{{ interestAmountDisplay }}</code>
              </td>
            </tr>
            <tr v-if='!!iofAmount'>
              <td class="border-0">IOF</td>
              <td class="border-0 text-right">
                <code>{{ iofAmountDisplay }}</code>
              </td>
            </tr>
            <tr>
              <td class="border-0">Imposto de Renda <v-badge
                inline
                v-if='!!taxPercentage'
                :content='taxPercentageDisplay'
                color='red lighten-2'
              /></td>
              <td class="border-0 text-right">
                <code>{{ taxAmountDisplay }}</code>
              </td>
            </tr>
            <tr>
              <td class="border-0 border-t-sm">Valor Total Líquido</td>
              <td class="border-0 border-t-sm text-right">
                <code>{{ totalAmountDisplay }}</code>
              </td>
            </tr>
            <tr>
              <td colspan="2">
              <v-progress-linear v-model='totalProfitPercentage' :color='color' height='25'>
                {{ totalProfitPercentageDisplay }}
              </v-progress-linear>
              </td>
            </tr>
          </tbody>
        </v-table>
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
const taxAmountDisplay = computed(() => filters.currency((props.taxAmount ? props.taxAmount * -1 : 0)))
const amountDisplay = computed(() => filters.currency(props.amount))
const iofAmountDisplay = computed(() => filters.currency(props.iofAmount))
const totalAmountDisplay = computed(() => filters.currency(totalAmount.value))
const interestAmountDisplay = computed(() => filters.currency(props.interestAmount))
const totalProfitPercentageDisplay = computed(() => filters.percent(totalProfitPercentage.value))
</script>
