<script setup lang="ts">
import type { MarketSnapshot } from '~/src/contracts/market'

defineProps<{ market: MarketSnapshot }>()

const items = [
  ['Selic', 'selicEffective'], ['CDI', 'cdi'], ['IPCA (12 meses)', 'ipca12m'], ['TR mensal', 'trMonthly'],
] as const
</script>

<template>
  <section aria-labelledby="market-title">
    <h2
      id="market-title"
      class="sr-only"
    >
      Indicadores de mercado
    </h2>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <UCard
        v-for="[label, key] in items"
        :key="key"
        variant="subtle"
      >
        <p class="text-sm text-muted">
          {{ label }}
        </p>
        <p class="mt-1 text-2xl font-semibold">
          {{ market.rates[key].annualPct }}%
        </p>
        <p class="mt-1 text-xs text-muted">
          Referência {{ market.rates[key].referenceDate }}
        </p>
        <UBadge
          class="mt-2"
          :color="market.sources['bcb-sgs']?.status === 'stale' ? 'warning' : 'success'"
          variant="subtle"
          size="xs"
        >
          {{ market.sources['bcb-sgs']?.status === 'stale' ? 'Fonte desatualizada' : 'Fonte atualizada' }}
        </UBadge>
      </UCard>
    </div>
  </section>
</template>
