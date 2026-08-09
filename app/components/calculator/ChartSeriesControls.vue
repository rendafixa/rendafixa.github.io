<script setup lang="ts">
import type { ChartPreferences } from '~/stores/comparison'

const props = defineProps<{ modelValue: ChartPreferences }>()
const emit = defineEmits<{ 'update:modelValue': [value: ChartPreferences] }>()
function patch(value: Partial<ChartPreferences>) {
  emit('update:modelValue', { ...props.modelValue, ...value })
}
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <UFormField label="Métrica">
      <select
        :value="modelValue.mode"
        class="h-11 w-full rounded-md border border-default bg-default px-3"
        @change="patch({ mode: ($event.target as HTMLSelectElement).value as ChartPreferences['mode'] })"
      >
        <option value="value">
          Valor em BRL
        </option><option value="percent">
          Percentual
        </option>
      </select>
    </UFormField>
    <UFormField label="Período">
      <select
        :value="modelValue.range"
        class="h-11 w-full rounded-md border border-default bg-default px-3"
        @change="patch({ range: ($event.target as HTMLSelectElement).value as ChartPreferences['range'] })"
      >
        <option value="full">
          Período completo
        </option><option value="year">
          Últimos 12 meses
        </option>
      </select>
    </UFormField>
    <UFormField label="Referência">
      <select
        :value="modelValue.reference"
        class="h-11 w-full rounded-md border border-default bg-default px-3"
        @change="patch({ reference: ($event.target as HTMLSelectElement).value as ChartPreferences['reference'] })"
      >
        <option value="none">
          Nenhuma
        </option><option value="cdi">
          100% CDI
        </option><option value="savings">
          Poupança
        </option><option value="ipca">
          IPCA
        </option>
      </select>
    </UFormField>
    <label class="flex min-h-11 items-center gap-2 pt-6"><UCheckbox
      :model-value="modelValue.labels"
      @update:model-value="patch({ labels: Boolean($event) })"
    />Rótulos nas linhas</label>
  </div>
</template>
