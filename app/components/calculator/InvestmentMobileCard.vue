<script setup lang="ts">
import type { InvestmentInput } from '~/src/contracts/investment'
import type { InvestmentResult } from '~/src/contracts/simulation'

defineProps<{ investment: InvestmentInput, result?: InvestmentResult, rank?: number, showTaxes: boolean, errors?: string[] }>()
const emit = defineEmits<{ update: [value: InvestmentInput], remove: [] }>()
</script>

<template>
  <UCard>
    <details open>
      <summary class="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-semibold">
        <span>{{ investment.name }}</span><UBadge
          v-if="rank"
          color="primary"
        >
          #{{ rank }}
        </UBadge>
      </summary>
      <div class="mt-4 space-y-4">
        <InvestmentEditorFields
          :investment="investment"
          @update="emit('update', $event)"
        />
        <InvestmentResultDetails
          :result="result"
          :show-taxes="showTaxes"
        />
        <UAlert
          v-if="errors?.length"
          color="error"
          title="Revise este investimento"
          :description="errors.join(' ')"
        />
        <UAlert
          v-if="result?.fgc.covered && result.fgc.exceeded"
          color="warning"
          title="Acima do limite simplificado do FGC"
        />
        <UAlert
          v-if="result?.taxBracketAlert"
          color="warning"
          :description="`Faltam ${result.taxBracketAlert.daysRemaining} dias para uma alíquota menor de IR.`"
        />
        <UButton
          color="error"
          variant="soft"
          icon="i-lucide-trash-2"
          @click="emit('remove')"
        >
          Excluir
        </UButton>
      </div>
    </details>
  </UCard>
</template>
