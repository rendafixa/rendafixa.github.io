import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}, 'Invalid ISO date')
const decimal = z.string().refine(value => value.trim() !== '' && Number.isFinite(Number(value)), 'Invalid decimal')
const rate = z.object({ annualPct: decimal, referenceDate: isoDate })
const holidays = z.object({
  supportedFrom: isoDate,
  supportedUntil: isoDate,
  dates: z.array(z.object({ date: isoDate, name: z.string().min(1) })).min(1),
}).superRefine((value, context) => {
  if (value.supportedFrom > value.supportedUntil) context.addIssue({ code: 'custom', message: 'Holiday coverage is inverted' })
  value.dates.forEach((holiday, index) => {
    if (holiday.date < value.supportedFrom || holiday.date > value.supportedUntil) {
      context.addIssue({ code: 'custom', path: ['dates', index, 'date'], message: 'Holiday is outside the supported range' })
    }
  })
})
export const snapshotSchema = z.object({
  schemaVersion: z.literal(1), generatedAt: z.string(), brazilReferenceDate: isoDate,
  rates: z.object({ selicEffective: rate, selicTarget: rate, cdi: rate, ipca12m: rate, trMonthly: rate }),
  projections: z.object({
    selic: z.array(z.object({ meeting: z.string(), effectiveDate: isoDate, annualPct: decimal, estimated: z.boolean() })).min(1),
    ipca: z.array(z.object({ year: z.number().int(), annualPct: decimal })).min(1),
  }),
  holidays,
  sources: z.record(z.string(), z.object({ url: z.string().url(), retrievedAt: z.string(), referenceDate: isoDate, status: z.enum(['fresh', 'stale']), lastSuccessfulAt: z.string() })),
})

export function validateMarketData(value) {
  return snapshotSchema.parse(value)
}
