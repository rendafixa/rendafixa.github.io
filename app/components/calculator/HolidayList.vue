<script setup lang="ts">
import type { MarketSnapshot } from '~/src/contracts/market'

defineProps<{ market: MarketSnapshot }>()
</script>

<template>
  <details class="rounded-lg border border-default p-4">
    <summary class="min-h-11 cursor-pointer font-semibold">
      Feriados considerados
    </summary><p class="mb-3 text-sm text-muted">
      Cobertura: {{ market.holidays.supportedFrom }} a {{ market.holidays.supportedUntil }}
    </p><ul class="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="holiday in market.holidays.dates"
        :key="holiday.date"
      >
        {{ holiday.date }} · {{ holiday.name }}
      </li>
    </ul>
  </details>
</template>
