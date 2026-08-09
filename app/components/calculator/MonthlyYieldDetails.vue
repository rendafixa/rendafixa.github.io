<script setup lang="ts">
import type { ComparisonResult } from '~/src/contracts/simulation'
import type { InvestmentInput } from '~/src/contracts/investment'

defineProps<{ result: ComparisonResult, investments: InvestmentInput[] }>()
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <div class="space-y-2">
    <details
      v-for="item in result.investments"
      :key="item.investmentId"
      class="rounded-lg border border-default p-4"
    >
      <summary class="min-h-11 cursor-pointer font-semibold">
        {{ investments.find(investment => investment.id === item.investmentId)?.name }}
      </summary>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[520px] text-sm">
          <thead>
            <tr>
              <th class="p-2 text-left">
                Mês
              </th><th class="p-2 text-right">
                Acréscimo líquido
              </th><th class="p-2 text-left">
                Período
              </th>
            </tr>
          </thead><tbody>
            <tr
              v-for="month in item.monthlyYields"
              :key="month.month"
            >
              <td class="p-2">
                {{ month.month }}
              </td><td class="p-2 text-right">
                {{ money.format(Number(month.netYield)) }}
              </td><td class="p-2">
                {{ month.partial ? 'Parcial' : 'Completo' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
