import { describe, it, expect } from 'vitest'
import type { ChartOptions } from 'chart.js'
import { buildProgressionDatasets, buildProgressionOptions, formatBRL, seriesLabels } from '../../../app/lib/chart'
import type { ProgressionPoint } from '../../../app/src/progression'
import type { ChartColors } from '../../../app/lib/chart'

const colors: ChartColors = {
  poupanca: '#f59e0b',
  cdb: '#0ea5e9',
  cdbPre: '#f43f5e',
  lcx: '#14b8a6',
  lcxPre: '#8b5cf6',
  grid: 'rgba(100,116,139,0.18)',
  text: '#334155',
  muted: '#64748b',
  tooltipBackground: '#0f172a',
  tooltipText: '#f8fafc',
}

const taxedPoints: ProgressionPoint[] = [
  { day: 0, poupanca: 1000, cdb: 1000, lcx: 1000 },
  { day: 30, poupanca: 1000, cdb: 1003.2, lcx: 1005.1 },
  { day: 60, poupanca: 1005.1, cdb: 1006.4, lcx: 1010.2 },
]

const pointsWithPrefixado: ProgressionPoint[] = [
  { day: 0, poupanca: 1000, cdb: 1000, cdbPre: 1000, lcx: 1000, lcxPre: 1000 },
  { day: 60, poupanca: 1005.1, cdb: 1006.4, cdbPre: 1022.3, lcx: 1010.2, lcxPre: 1023.5 },
]

describe('formatBRL', () => {
  it('formats values as Brazilian currency', () => {
    expect(formatBRL(1234.56)).toContain('1.234,56')
    expect(formatBRL(1234.56)).toContain('R$')
  })
})

describe('buildProgressionDatasets', () => {
  it('builds one dataset per available series', () => {
    const datasets = buildProgressionDatasets(taxedPoints, colors)

    expect(datasets.map(dataset => dataset.label)).toEqual([
      seriesLabels.poupanca,
      seriesLabels.cdb,
      seriesLabels.lcx,
    ])
    expect(datasets[1].data).toEqual([
      { x: 0, y: 1000 },
      { x: 30, y: 1003.2 },
      { x: 60, y: 1006.4 },
    ])
  })

  it('adds prefixado datasets only when their points are present', () => {
    const datasets = buildProgressionDatasets(pointsWithPrefixado, colors)

    expect(datasets).toHaveLength(5)
    expect(datasets.map(dataset => dataset.label)).toEqual([
      seriesLabels.poupanca,
      seriesLabels.cdb,
      seriesLabels.cdbPre,
      seriesLabels.lcx,
      seriesLabels.lcxPre,
    ])
    expect(datasets[2].data).toEqual([
      { x: 0, y: 1000 },
      { x: 60, y: 1022.3 },
    ])
  })

  it('styles each series as a line-only trace with its palette colour', () => {
    const datasets = buildProgressionDatasets(taxedPoints, colors)

    for (const dataset of datasets) {
      expect(dataset.fill).toBe(false)
      expect(dataset.backgroundColor).toBeUndefined()
    }

    const cdb = datasets.find(dataset => dataset.label === seriesLabels.cdb)!
    expect(cdb.borderColor).toBe(colors.cdb)
    expect(cdb.pointRadius).toBe(0)
  })
})

describe('buildProgressionOptions', () => {
  type TooltipOptions = {
    callbacks: {
      label: (context: { dataset: { label?: string }, parsed: { y: number } }) => string
      title: (items: Array<{ parsed: { x: number } }>) => string
    }
  }

  type AxesOptions = {
    x: { type: string, min: number, max: number, ticks: { color: string }, grid: { color: string } }
    y: { ticks: { callback: (value: number) => string } }
  }

  type LegendOptions = { labels: { color: string } }

  function tooltipOptions(options: ChartOptions<'line'>): TooltipOptions {
    return (options.plugins?.tooltip ?? {}) as unknown as TooltipOptions
  }

  function axesOptions(options: ChartOptions<'line'>): AxesOptions {
    return options.scales as unknown as AxesOptions
  }

  function legendOptions(options: ChartOptions<'line'>): LegendOptions {
    return (options.plugins?.legend ?? {}) as unknown as LegendOptions
  }

  it('formats tooltip body as currency alongside the series name', () => {
    const options = buildProgressionOptions(colors, 60)
    const label = tooltipOptions(options).callbacks.label({
      dataset: { label: seriesLabels.cdb },
      parsed: { y: 1234.56 },
    })

    expect(label).toContain(seriesLabels.cdb)
    expect(label).toContain('1.234,56')
  })

  it('labels tooltips with the sampled day', () => {
    const options = buildProgressionOptions(colors, 60)
    const title = tooltipOptions(options).callbacks.title([{ parsed: { x: 30 } }])

    expect(title).toBe('Dia 30')
  })

  it('uses a linear day axis so intervals keep true proportions', () => {
    const options = buildProgressionOptions(colors, 60)

    expect(axesOptions(options).x.type).toBe('linear')
  })

  it('ends the day axis exactly at the last sampled day', () => {
    const options = buildProgressionOptions(colors, 720)

    expect(axesOptions(options).x.min).toBe(0)
    expect(axesOptions(options).x.max).toBe(720)
  })

  it('formats the y axis ticks as currency', () => {
    const options = buildProgressionOptions(colors, 60)
    const tick = axesOptions(options).y.ticks.callback(1234.56)

    expect(tick).toContain('1.234,56')
    expect(tick).toContain('R$')
  })

  it('uses the provided palette for legend and axes', () => {
    const options = buildProgressionOptions(colors, 60)

    expect(legendOptions(options).labels.color).toBe(colors.text)
    expect(axesOptions(options).x.ticks.color).toBe(colors.muted)
    expect(axesOptions(options).x.grid.color).toBe(colors.grid)
  })
})
