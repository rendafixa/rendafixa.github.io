<script setup lang="ts">
import type { MarketSnapshot } from '~/src/contracts/market'

defineProps<{ market: MarketSnapshot }>()
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Curva Selic
        </h3>
      </template><ul class="space-y-2 text-sm">
        <li
          v-for="point in market.projections.selic"
          :key="point.meeting"
          class="flex justify-between"
        >
          <span>{{ point.meeting }} · {{ point.effectiveDate }} <UBadge
            v-if="point.estimated"
            color="warning"
            size="xs"
          >estimada</UBadge></span><strong>{{ point.annualPct }}%</strong>
        </li>
      </ul>
    </UCard>
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Projeção IPCA
        </h3>
      </template><ul class="space-y-2 text-sm">
        <li
          v-for="point in market.projections.ipca"
          :key="point.year"
          class="flex justify-between"
        >
          <span>{{ point.year }}</span><strong>{{ point.annualPct }}%</strong>
        </li>
      </ul>
    </UCard>
  </div>
</template>
