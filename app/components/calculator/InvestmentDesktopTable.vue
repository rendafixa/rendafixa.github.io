<script setup lang="ts">
import type { InvestmentInput } from '~/src/contracts/investment'
import { INVESTMENT_TYPE_LABELS } from '~/src/contracts/investment'
import type { ComparisonResult } from '~/src/contracts/simulation'

const props = defineProps<{ investments: InvestmentInput[], result?: ComparisonResult, showTaxes: boolean }>()
const emit = defineEmits<{ update: [id: string, value: InvestmentInput], remove: [id: string] }>()
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function resultFor(id: string) {
  return props.result?.investments.find(item => item.investmentId === id)
}

function rateLabel(investment: InvestmentInput) {
  if (investment.rate.kind === 'fixed') return `${investment.rate.annualPct}% a.a.`
  if (investment.rate.kind === 'cdi-percent') return `${investment.rate.percentOfCdi}% CDI`
  if (investment.rate.kind === 'ipca-plus') return `IPCA + ${investment.rate.realAnnualPct}%`
  return investment.rate.kind === 'savings' ? 'Regra da Poupança' : 'Selic'
}
</script>

<template>
  <div class="hidden overflow-x-auto rounded-lg border border-default xl:block">
    <table class="w-full min-w-[1100px] text-sm">
      <thead class="bg-elevated text-left text-muted">
        <tr>
          <th class="p-3">
            Nome
          </th>
          <th class="p-3">
            Produto
          </th>
          <th class="p-3">
            Taxa
          </th>
          <th class="p-3">
            Vencimento
          </th>
          <th class="p-3 text-right">
            Dias úteis
          </th>
          <th class="p-3">
            Proteção
          </th>
          <th class="p-3 text-right">
            Lucro líquido
          </th>
          <th class="p-3">
            <span class="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="investment in investments"
          :key="investment.id"
        >
          <tr class="border-t border-default">
            <td class="p-3 font-semibold">
              {{ investment.name }}
            </td>
            <td class="p-3">
              {{ INVESTMENT_TYPE_LABELS[investment.type] }}
            </td>
            <td class="p-3">
              {{ rateLabel(investment) }}
            </td>
            <td class="p-3">
              {{ investment.maturityDate }}
            </td>
            <td class="p-3 text-right">
              {{ resultFor(investment.id)?.businessDays ?? '—' }}
            </td>
            <td class="p-3">
              {{ resultFor(investment.id)?.fgc.covered === false ? 'Tesouro Nacional' : 'FGC' }}
            </td>
            <td class="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
              {{ resultFor(investment.id) ? money.format(Number(resultFor(investment.id)!.netProfit)) : '—' }}
            </td>
            <td class="p-3 text-right">
              <UButton
                aria-label="Excluir investimento"
                color="error"
                variant="ghost"
                icon="i-lucide-trash-2"
                @click="emit('remove', investment.id)"
              />
            </td>
          </tr>
          <tr class="border-t border-default bg-muted/30">
            <td
              colspan="8"
              class="space-y-4 p-4"
            >
              <InvestmentEditorFields
                :investment="investment"
                @update="emit('update', investment.id, $event)"
              />
              <InvestmentResultDetails
                :result="resultFor(investment.id)"
                :show-taxes="showTaxes"
              />
              <UAlert
                v-if="result?.errors.some(error => error.investmentId === investment.id)"
                color="error"
                title="Revise este investimento"
                :description="result.errors.filter(error => error.investmentId === investment.id).map(error => error.message).join(' ')"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
