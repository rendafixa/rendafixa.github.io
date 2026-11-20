<script lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { ChartColors } from '~/lib/chart'
import { buildProgressionDatasets, buildProgressionOptions } from '~/lib/chart'
import type { ProgressionPoint } from '~/src/progression'
import { useTheme } from '~/composables/useTheme'

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
)
</script>

<template>
  <section
    class="bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-black/20 border border-slate-200/80 dark:border-slate-800 p-6 not-prose"
  >
    <h3 class="m-0 text-lg font-semibold text-slate-950 dark:text-slate-50">
      Evolução do investimento
    </h3>
    <p class="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-300">
      Valor líquido se o resgate acontecesse no dia indicado. Para CDB, o IR da tabela
      regressiva e o IOF já são descontados, por isso o início da curva fica abaixo das
      aplicações isentas.
    </p>

    <div
      v-if="hasData"
      class="relative h-64 md:h-80"
    >
      <Line
        :data="chartData"
        :options="chartOptions"
        role="img"
        aria-label="Evolução do valor líquido dos investimentos ao longo do tempo"
      />
    </div>
    <div
      v-else
      data-testid="chart-loading"
      class="h-64 md:h-80 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400"
    >
      Carregando indicadores…
    </div>
  </section>
</template>

<script setup lang='ts'>
const props = defineProps<{
  points: ProgressionPoint[]
}>()

const { isDark } = useTheme()

// Chart.js needs a real 2D canvas context; in DOM-less environments (tests)
// we keep the placeholder instead of letting the chart crash on resize.
const canRenderChart = ref(false)

onMounted(() => {
  canRenderChart.value = document.createElement('canvas').getContext('2d') !== null
})

const hasData = computed(() => canRenderChart.value && props.points.length > 0)

const palette = computed<ChartColors>(() => {
  const suffix = isDark.value ? '400' : '500'

  return {
    poupanca: cssVar(`--color-amber-${suffix}`, isDark.value ? '#fbbf24' : '#f59e0b'),
    cdb: cssVar(`--color-sky-${suffix}`, isDark.value ? '#38bdf8' : '#0ea5e9'),
    cdbPre: cssVar(`--color-emerald-${suffix}`, isDark.value ? '#34d399' : '#10b981'),
    lcx: cssVar(`--color-violet-${suffix}`, isDark.value ? '#a78bfa' : '#8b5cf6'),
    lcxPre: cssVar(`--color-indigo-${suffix}`, isDark.value ? '#818cf8' : '#6366f1'),
    grid: isDark.value ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.18)',
    text: cssVar(isDark.value ? '--color-slate-200' : '--color-slate-700', isDark.value ? '#e2e8f0' : '#334155'),
    muted: cssVar(isDark.value ? '--color-slate-400' : '--color-slate-500', isDark.value ? '#94a3b8' : '#64748b'),
    tooltipBackground: cssVar(isDark.value ? '--color-slate-800' : '--color-slate-900', isDark.value ? '#1e293b' : '#0f172a'),
    tooltipText: cssVar('--color-slate-50', '#f8fafc'),
  }
})

const chartData = computed(() => ({
  labels: props.points.map(point => String(point.day)),
  datasets: buildProgressionDatasets(props.points, palette.value),
}))

const chartOptions = computed(() => buildProgressionOptions(palette.value))

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') {
    return fallback
  }

  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
}
</script>
