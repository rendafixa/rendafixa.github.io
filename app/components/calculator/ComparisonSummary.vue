<script setup lang="ts">
import type { ComparisonResult } from '~/src/contracts/simulation'
import type { InvestmentInput } from '~/src/contracts/investment'

const props = defineProps<{ result: ComparisonResult, investments: InvestmentInput[] }>()
const best = computed(() => props.result.investments.find(item => item.investmentId === props.result.bestInvestmentId))
const name = computed(() => props.investments.find(item => item.id === props.result.bestInvestmentId)?.name)
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <UCard
    v-if="best"
    class="border-primary/30 bg-primary/5"
  >
    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-medium text-primary">
          Melhor resultado líquido
        </p><h2 class="text-2xl font-bold">
          {{ name }}
        </h2>
      </div>
      <div class="sm:text-right">
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ money.format(Number(best.netFinalValue)) }}
        </p><p
          v-if="result.runnerUpDifference"
          class="text-sm text-muted"
        >
          {{ money.format(Number(result.runnerUpDifference)) }} acima do segundo
        </p>
      </div>
    </div>
  </UCard>
</template>
