export type IsoDate = `${number}-${number}-${number}`

export interface InvestmentBase {
  id: string
  name: string
  maturityDate: IsoDate
}

export type InvestmentInput = InvestmentBase & (
  | { type: 'poupanca', rate: { kind: 'savings' } }
  | { type: 'cdb-pre' | 'lci-pre' | 'tesouro-pre', rate: { kind: 'fixed', annualPct: string } }
  | { type: 'cdb-cdi' | 'lci-cdi', rate: { kind: 'cdi-percent', percentOfCdi: string } }
  | { type: 'cdb-ipca' | 'lci-ipca' | 'tesouro-ipca', rate: { kind: 'ipca-plus', realAnnualPct: string } }
  | { type: 'tesouro-selic', rate: { kind: 'selic' } }
)

export interface ComparisonRequest {
  schemaVersion: 1
  startDate: IsoDate
  principal: string
  useProjections: boolean
  investments: InvestmentInput[]
}

export const INVESTMENT_TYPE_LABELS: Record<InvestmentInput['type'], string> = {
  'poupanca': 'Poupança',
  'cdb-pre': 'CDB / RDB / LC prefixado',
  'cdb-cdi': 'CDB / RDB / LC (% CDI)',
  'cdb-ipca': 'CDB / RDB / LC (IPCA+)',
  'lci-pre': 'LCI / LCA prefixada',
  'lci-cdi': 'LCI / LCA (% CDI)',
  'lci-ipca': 'LCI / LCA (IPCA+)',
  'tesouro-pre': 'Tesouro Prefixado',
  'tesouro-selic': 'Tesouro Selic',
  'tesouro-ipca': 'Tesouro IPCA+',
}
