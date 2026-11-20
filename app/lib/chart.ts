import type { ChartDataset, ChartOptions } from 'chart.js'
import type { ProgressionPoint } from '../src/progression'

export interface ChartColors {
  poupanca: string
  cdb: string
  cdbPre: string
  lcx: string
  lcxPre: string
  grid: string
  text: string
  muted: string
  tooltipBackground: string
  tooltipText: string
}

type SeriesKey = 'poupanca' | 'cdb' | 'cdbPre' | 'lcx' | 'lcxPre'

export const seriesLabels: Record<SeriesKey, string> = {
  poupanca: 'Poupança',
  cdb: 'CDB / RDB',
  cdbPre: 'CDB / RDB prefixado',
  lcx: 'LCI / LCA',
  lcxPre: 'LCI / LCA prefixado',
}

const SERIES_ORDER: SeriesKey[] = ['poupanca', 'cdb', 'cdbPre', 'lcx', 'lcxPre']

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

export function formatBRL(value: number): string {
  return currencyFormatter.format(value)
}

export interface ProgressionDataPoint {
  x: number
  y: number
}

export function buildProgressionDatasets(
  points: ProgressionPoint[],
  colors: ChartColors,
): ChartDataset<'line', ProgressionDataPoint[]>[] {
  return SERIES_ORDER
    .filter(key => points.some(point => point[key] !== undefined))
    .map(key => ({
      label: seriesLabels[key],
      data: points.map(point => ({ x: point.day, y: point[key] ?? 0 })),
      borderColor: colors[key],
      fill: false,
      tension: 0.25,
      pointRadius: 0,
      pointHitRadius: 12,
      borderWidth: 2,
    }))
}

export function buildProgressionOptions(colors: ChartColors, maxDay: number): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: colors.text,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBackground,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        callbacks: {
          title: items => `Dia ${items[0]?.parsed.x ?? ''}`,
          label: (context) => {
            const value = context.parsed.y ?? 0
            return `${context.dataset.label}: ${formatBRL(value)}`
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: maxDay,
        grid: { color: colors.grid },
        ticks: { color: colors.muted, maxTicksLimit: 8 },
        title: {
          display: true,
          text: 'Dias',
          color: colors.muted,
        },
      },
      y: {
        grid: { color: colors.grid },
        ticks: {
          color: colors.muted,
          maxTicksLimit: 6,
          callback: value => formatBRL(Number(value)),
        },
      },
    },
  }
}
