<script setup lang="ts">
import type { InvestmentInput } from '~/src/contracts/investment'
import type { ComparisonResult } from '~/src/contracts/simulation'

defineProps<{ investments: InvestmentInput[], result?: ComparisonResult, showTaxes: boolean }>()
const emit = defineEmits<{ update: [id: string, value: InvestmentInput], remove: [id: string] }>()
</script>

<template>
  <div class="space-y-3 xl:hidden">
    <InvestmentMobileCard
      v-for="investment in investments"
      :key="investment.id"
      :investment="investment"
      :result="result?.investments.find(item => item.investmentId === investment.id)"
      :rank="result?.ranking.indexOf(investment.id) === -1 ? undefined : (result?.ranking.indexOf(investment.id) ?? 0) + 1"
      :show-taxes="showTaxes"
      :errors="result?.errors.filter(error => error.investmentId === investment.id).map(error => error.message)"
      @update="emit('update', investment.id, $event)"
      @remove="emit('remove', investment.id)"
    />
  </div>
</template>
