<script setup lang="ts">
import type { InvestmentResult } from '~/src/contracts/simulation'

defineProps<{ result?: InvestmentResult, showTaxes: boolean }>()
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <div
    v-if="result"
    class="grid grid-cols-2 gap-3 text-sm md:grid-cols-4"
  >
    <div><span class="text-muted">Valor líquido</span><strong class="block text-lg text-emerald-600 dark:text-emerald-400">{{ money.format(Number(result.netFinalValue)) }}</strong></div>
    <div><span class="text-muted">Lucro líquido</span><strong class="block">{{ money.format(Number(result.netProfit)) }}</strong></div>
    <div><span class="text-muted">Retorno</span><strong class="block">{{ Number(result.netReturnPct).toFixed(2) }}%</strong></div>
    <div><span class="text-muted">Dias úteis</span><strong class="block">{{ result.businessDays }}</strong></div>
    <template v-if="showTaxes">
      <div><span class="text-muted">Lucro bruto</span><strong class="block">{{ money.format(Number(result.grossProfit)) }}</strong></div>
      <div><span class="text-muted">IOF</span><strong class="block">{{ money.format(Number(result.iof)) }}</strong></div>
      <div><span class="text-muted">IR</span><strong class="block">{{ money.format(Number(result.incomeTax)) }}</strong></div>
      <div><span class="text-muted">Taxa líquida anual</span><strong class="block">{{ Number(result.annualizedNetPct).toFixed(2) }}%</strong></div>
    </template>
  </div>
  <p
    v-else
    class="text-sm text-error"
  >
    Revise os dados deste investimento.
  </p>
</template>
