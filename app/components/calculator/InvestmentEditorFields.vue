<script setup lang="ts">
import type { InvestmentInput } from '~/src/contracts/investment'
import { INVESTMENT_TYPE_LABELS } from '~/src/contracts/investment'

const props = defineProps<{ investment: InvestmentInput }>()
const emit = defineEmits<{ update: [value: InvestmentInput] }>()
const types = Object.entries(INVESTMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))

function updateField(field: 'name' | 'maturityDate', value: string) {
  emit('update', { ...props.investment, [field]: value } as InvestmentInput)
}

function updateType(value: string) {
  const base = { id: props.investment.id, name: props.investment.name, maturityDate: props.investment.maturityDate }
  let next: InvestmentInput
  if (value === 'poupanca') next = { ...base, type: 'poupanca', rate: { kind: 'savings' } }
  else if (value === 'tesouro-selic') next = { ...base, type: 'tesouro-selic', rate: { kind: 'selic' } }
  else if (value.endsWith('-pre')) next = { ...base, type: value as 'cdb-pre', rate: { kind: 'fixed', annualPct: '12' } }
  else if (value.endsWith('-cdi')) next = { ...base, type: value as 'cdb-cdi', rate: { kind: 'cdi-percent', percentOfCdi: '100' } }
  else next = { ...base, type: value as 'cdb-ipca', rate: { kind: 'ipca-plus', realAnnualPct: '6' } }
  emit('update', next)
}

function updateRate(value: string) {
  const current = props.investment
  if (current.rate.kind === 'fixed') emit('update', { ...current, rate: { ...current.rate, annualPct: value } })
  if (current.rate.kind === 'cdi-percent') emit('update', { ...current, rate: { ...current.rate, percentOfCdi: value } })
  if (current.rate.kind === 'ipca-plus') emit('update', { ...current, rate: { ...current.rate, realAnnualPct: value } })
}

const rateValue = computed(() => {
  if (props.investment.rate.kind === 'fixed') return props.investment.rate.annualPct
  if (props.investment.rate.kind === 'cdi-percent') return props.investment.rate.percentOfCdi
  if (props.investment.rate.kind === 'ipca-plus') return props.investment.rate.realAnnualPct
  return ''
})
const rateLabel = computed(() => props.investment.rate.kind === 'cdi-percent' ? '% do CDI' : props.investment.rate.kind === 'ipca-plus' ? 'Taxa real (% a.a.)' : 'Taxa (% a.a.)')
</script>

<template>
  <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    <UFormField label="Nome">
      <UInput
        :model-value="investment.name"
        maxlength="60"
        class="w-full"
        @update:model-value="updateField('name', String($event))"
      />
    </UFormField>
    <UFormField label="Produto">
      <select
        :value="investment.type"
        class="h-11 w-full rounded-md border border-default bg-default px-3 text-sm"
        @change="updateType(($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="type in types"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
    </UFormField>
    <UFormField
      v-if="rateValue"
      :label="rateLabel"
    >
      <UInput
        :model-value="rateValue"
        type="number"
        step="0.01"
        class="w-full"
        @update:model-value="updateRate(String($event))"
      />
    </UFormField>
    <UFormField label="Vencimento">
      <UInput
        :model-value="investment.maturityDate"
        type="date"
        class="w-full"
        @update:model-value="updateField('maturityDate', String($event))"
      />
    </UFormField>
  </div>
</template>
