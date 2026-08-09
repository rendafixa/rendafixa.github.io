<script setup lang="ts">
const { store, market } = useComparisonCalculator()
const { readFromLocation, shareError } = useShareSimulation()

onMounted(() => {
  const shared = readFromLocation()
  if (shared) {
    store.applyRequest(shared.request)
    store.chart = shared.chart
  }
})

function loadExamples() {
  if (globalThis.confirm('Substituir os dados atuais pelos exemplos?')) store.loadExamples()
}

useSeoMeta({
  title: 'Comparador de renda fixa',
  description: 'Compare Poupança, CDB, LCI, LCA e Tesouro Direto com impostos, projeções e dados de mercado.',
})
</script>

<template>
  <div class="space-y-8">
    <section class="py-6 sm:py-10">
      <UBadge
        color="primary"
        variant="subtle"
      >
        Simulação educacional
      </UBadge>
      <h1 class="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">
        Compare investimentos de renda fixa com regras brasileiras
      </h1>
      <p class="mt-4 max-w-3xl text-base text-muted sm:text-lg">
        Veja rentabilidade líquida, IR, IOF, FGC e projeções de Selic e IPCA em uma única comparação.
      </p>
    </section>

    <MarketIndicators
      v-if="market"
      :market="market"
    />

    <UCard>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">
            Sua simulação
          </h2><p class="text-sm text-muted">
            Um valor inicial para até 40 investimentos.
          </p>
        </div>
      </template>
      <div class="space-y-6">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <UFormField label="Valor inicial (R$)">
            <UInput
              v-model="store.principal"
              type="number"
              min="0.01"
              step="0.01"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Data inicial">
            <UInput
              v-model="store.startDate"
              type="date"
              class="w-full"
            />
          </UFormField>
          <label class="flex min-h-11 items-center gap-2 pt-6"><USwitch v-model="store.useProjections" />Usar projeções</label>
          <label class="flex min-h-11 items-center gap-2 pt-6"><USwitch v-model="store.showTaxDetails" />Detalhes tributários</label>
        </div>
        <SimulationToolbar
          :request="store.request"
          :chart="store.chart"
          @examples="loadExamples"
        />
        <UAlert
          v-if="shareError"
          color="warning"
          :description="shareError"
        />
        <UAlert
          v-if="store.errorMessage"
          color="error"
          :description="store.errorMessage"
        />
        <UAlert
          v-if="store.result?.warnings.length"
          color="warning"
          title="Atenção às premissas"
          :description="[...new Set(store.result.warnings.map(warning => warning.message))].join(' ')"
        />
        <div
          v-if="store.loading"
          class="space-y-3"
          aria-live="polite"
        >
          <USkeleton class="h-32 w-full" /><USkeleton class="h-32 w-full" />
        </div>
        <template v-else>
          <InvestmentMobileList
            :investments="store.investments"
            :result="store.result"
            :show-taxes="store.showTaxDetails"
            @update="store.updateInvestment"
            @remove="store.removeInvestment"
          />
          <InvestmentDesktopTable
            :investments="store.investments"
            :result="store.result"
            :show-taxes="store.showTaxDetails"
            @update="store.updateInvestment"
            @remove="store.removeInvestment"
          />
        </template>
        <UButton
          :disabled="store.investments.length >= 40"
          icon="i-lucide-plus"
          @click="store.addInvestment"
        >
          Adicionar investimento
        </UButton>
      </div>
    </UCard>

    <ComparisonSummary
      v-if="store.result"
      :result="store.result"
      :investments="store.investments"
    />

    <UCard v-if="store.result">
      <template #header>
        <h2 class="text-xl font-semibold">
          Evolução comparativa
        </h2>
      </template>
      <ChartSeriesControls v-model="store.chart" />
      <div
        class="mt-5 overflow-x-auto"
        aria-describedby="chart-note"
      >
        <ComparisonChart
          :result="store.result"
          :investments="store.investments"
          :principal="store.principal"
          :preferences="store.chart"
        />
      </div>
      <p
        id="chart-note"
        class="mt-3 text-xs text-muted"
      >
        O gráfico representa aplicações mantidas até seus vencimentos; consulte o detalhamento textual mensal abaixo.
      </p>
    </UCard>

    <UCard v-if="store.result">
      <template #header>
        <h2 class="text-xl font-semibold">
          Detalhamento mensal
        </h2>
      </template><MonthlyYieldDetails
        :result="store.result"
        :investments="store.investments"
      />
    </UCard>
    <CalculationNotes />
    <ProjectionTables
      v-if="market"
      :market="market"
    />
    <HolidayList
      v-if="market"
      :market="market"
    />
  </div>
</template>
