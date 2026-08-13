<script setup lang="ts">
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import datalabels from 'chartjs-plugin-datalabels'
import { Line } from 'vue-chartjs'
import type { ComparisonResult } from '~/src/contracts/simulation'
import type { InvestmentInput } from '~/src/contracts/investment'
import type { ChartPreferences } from '~/stores/comparison'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin, datalabels)
const props = defineProps<{ result: ComparisonResult, investments: InvestmentInput[], principal: string, preferences: ChartPreferences }>()
const colors = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']
const labels = computed(() => {
  const all = [...new Set(props.result.investments.flatMap(item => item.timeline.map(point => point.date)))].sort()
  if (props.preferences.range === 'full' || !all.length) return all
  const threshold = new Date(`${all.at(-1)}T12:00:00Z`)
  threshold.setUTCFullYear(threshold.getUTCFullYear() - 1)
  return all.filter(date => date >= threshold.toISOString().slice(0, 10))
})
const referenceValues = computed(() => {
  if (props.preferences.reference === 'none' || !labels.value.length) return undefined
  const points = new Map(props.result.benchmarkTimelines[props.preferences.reference].map(point => [point.date, Number(point.netValue)]))
  return labels.value.map(date => points.get(date) ?? null)
})
function formatYAxisTick(value: string | number) {
  if (props.preferences.mode === 'value') return `R$ ${Number(value).toLocaleString('pt-BR')}`
  return `${value}%`
}
function formatDataLabel(value: unknown) {
  if (value == null) return ''
  const decimalPlaces = props.preferences.mode === 'value' ? 0 : 1
  return Number(value).toFixed(decimalPlaces)
}
const data = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    ...props.result.investments.map((result, index) => {
      const values = new Map(result.timeline.map(point => [point.date, point]))
      return {
        label: props.investments.find(item => item.id === result.investmentId)?.name ?? result.investmentId,
        data: labels.value.map((date) => {
          const point = values.get(date)
          if (!point) return null
          const value = Number(point.netValue)
          const reference = referenceValues.value?.[labels.value.indexOf(date)]
          if (reference != null) return props.preferences.mode === 'value' ? value - reference : (value / reference - 1) * 100
          if (referenceValues.value) return null
          return props.preferences.mode === 'value' ? value : (value / Number(props.principal) - 1) * 100
        }),
        borderColor: colors[index % colors.length], backgroundColor: colors[index % colors.length], spanGaps: true, tension: 0.2,
      }
    }),
    ...(referenceValues.value
      ? [{ label: `Referência: ${props.preferences.reference}`, data: referenceValues.value.map(value => value == null ? null : 0), borderColor: '#64748b', backgroundColor: '#64748b', borderDash: [6, 4], pointRadius: 0 }]
      : []),
  ],
}))
const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true, maintainAspectRatio: false, interaction: { intersect: false, mode: 'index' },
  plugins: { datalabels: { display: props.preferences.labels, align: 'top', formatter: formatDataLabel } },
  scales: { x: { ticks: { maxTicksLimit: 8 } }, y: { ticks: { callback: formatYAxisTick } } },
}))
</script>

<template>
  <div class="h-[360px] min-w-[620px] xl:h-[520px]">
    <Line
      :data="data"
      :options="options"
    />
  </div>
</template>
