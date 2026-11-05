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
    <div>
      <label
        for="chart-metric"
        class="mb-1.5 block text-sm font-medium"
      >Métrica</label>
      <select
        id="chart-metric"
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
    </div>
    <div>
      <label
        for="chart-range"
        class="mb-1.5 block text-sm font-medium"
      >Período</label>
      <select
        id="chart-range"
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
    </div>
    <div>
      <label
        for="chart-reference"
        class="mb-1.5 block text-sm font-medium"
      >Referência</label>
      <select
        id="chart-reference"
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
    </div>
    <div class="flex min-h-11 items-center pt-6">
      <UCheckbox
        :model-value="modelValue.labels"
        label="Rótulos nas linhas"
        @update:model-value="patch({ labels: Boolean($event) })"
      />
    </div>
  </div>
</template>
