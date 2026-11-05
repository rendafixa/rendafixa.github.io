import type { DomainResult, SimulationError, SimulationWarning } from './errors'
import type { ComparisonRequest, IsoDate } from './investment'
import type { MarketSnapshot } from './market'

export interface TimelinePoint {
  date: IsoDate
  grossValue: string
  netValue: string
}

export interface MonthlyYield {
  month: `${number}-${number}`
  netYield: string
  partial: boolean
}

export interface TaxBracketAlert {
  nextDay: 181 | 361 | 721
  daysRemaining: number
  currentRatePct: string
  nextRatePct: string
}

export type FgcResult
  = { covered: false, label: 'Tesouro Nacional' }
    | { covered: true, limit: string, exceeded: false }
    | { covered: true, limit: string, exceeded: true, exceededOn: IsoDate, balanceOnDate: string, uncoveredAtMaturity: string }

export interface InvestmentResult {
  investmentId: string
  calendarDays: number
  businessDays: number
  grossProfit: string
  iof: string
  incomeTax: string
  netProfit: string
  grossFinalValue: string
  netFinalValue: string
  netReturnPct: string
  annualizedNetPct: string
  fgc: FgcResult
  taxBracketAlert?: TaxBracketAlert
  warnings: SimulationWarning[]
  timeline: TimelinePoint[]
  monthlyYields: MonthlyYield[]
}

export interface ComparisonResult {
  investments: InvestmentResult[]
  errors: SimulationError[]
  ranking: string[]
  bestInvestmentId?: string
  runnerUpDifference?: string
  benchmarkDifferences: { cdi: string, savings: string, ipca: string }
  benchmarkTimelines: Record<'cdi' | 'savings' | 'ipca', TimelinePoint[]>
  warnings: SimulationWarning[]
}

export interface SimulationWorkerRequest {
  requestId: number
  type: 'simulate'
  request: ComparisonRequest
  market: MarketSnapshot
}

export interface SimulationWorkerResponse {
  requestId: number
  type: 'result'
  result: DomainResult<ComparisonResult>
}
