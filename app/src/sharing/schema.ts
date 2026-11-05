import { z } from 'zod'

const investmentSchema = z.object({
  id: z.string().min(1), name: z.string().min(1).max(60), maturityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['poupanca', 'cdb-pre', 'lci-pre', 'tesouro-pre', 'cdb-cdi', 'lci-cdi', 'cdb-ipca', 'lci-ipca', 'tesouro-ipca', 'tesouro-selic']),
  rate: z.record(z.string(), z.string()),
})

export const shareSchema = z.object({
  v: z.literal(1),
  p: z.string(),
  d: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projected: z.boolean(),
  investments: z.array(investmentSchema).max(40),
  chart: z.object({ mode: z.enum(['value', 'percent']), range: z.enum(['full', 'year']), reference: z.enum(['none', 'cdi', 'savings', 'ipca']), labels: z.boolean().optional() }).optional(),
})

export type SharePayload = z.infer<typeof shareSchema>
