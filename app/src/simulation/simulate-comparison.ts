import type { DomainResult, SimulationError, SimulationWarning } from '../contracts/errors'
import type { ComparisonRequest, InvestmentInput } from '../contracts/investment'
import type { MarketSnapshot } from '../contracts/market'
import type { ComparisonResult, InvestmentResult } from '../contracts/simulation'
import { civilDate } from '../calendar/dates'
import { decimal } from '../finance/decimal'
import { MAX_INVESTMENTS } from '../finance/regulatory-constants'
import { simulateInvestment } from './simulate-investment'
import { rankInvestments } from './ranking'

export function simulateComparison(request: ComparisonRequest, market: MarketSnapshot): DomainResult<ComparisonResult> {
  const validationError = validateComparisonRequest(request, market)
  if (validationError) return { ok: false, errors: [validationError] }

  const warnings = marketWarnings(request, market)
  const { results, rowErrors, rowWarnings } = simulateRows(request, market)
  warnings.push(...rowWarnings)
  const ranking = rankInvestments(results)
  const best = results.find(result => result.investmentId === ranking[0])
  const runnerUp = results.find(result => result.investmentId === ranking[1])
  const winnerInput = request.investments.find(item => item.id === best?.investmentId)
  const benchmarks = best && winnerInput ? buildBenchmarks(request, market, winnerInput.maturityDate) : undefined
  return {
    ok: true,
    warnings,
    value: {
      investments: results,
      errors: rowErrors,
      ranking,
      bestInvestmentId: ranking[0],
      runnerUpDifference: best && runnerUp ? decimal(best.netProfit).minus(runnerUp.netProfit).toString() : undefined,
      benchmarkDifferences: buildBenchmarkDifferences(best, benchmarks),
      benchmarkTimelines: {
        cdi: benchmarks?.cdi.timeline ?? [],
        savings: benchmarks?.savings.timeline ?? [],
        ipca: benchmarks?.ipca.timeline ?? [],
      },
      warnings,
    },
  }
}

function validateComparisonRequest(request: ComparisonRequest, market: MarketSnapshot): SimulationError | undefined {
  let principal
  try {
    principal = decimal(request.principal)
  }
  catch {
    return { code: 'invalid-principal', message: 'Informe um valor inicial válido.', field: 'principal' }
  }
  if (!principal.isFinite() || principal.lte(0)) return { code: 'invalid-principal', message: 'Informe um valor inicial maior que zero.', field: 'principal' }
  try {
    civilDate(request.startDate)
  }
  catch {
    return { code: 'invalid-maturity', message: 'Informe uma data inicial válida.', field: 'startDate' }
  }
  if (request.investments.length > MAX_INVESTMENTS) return { code: 'too-many-investments', message: `Compare no máximo ${MAX_INVESTMENTS} investimentos.` }
  if (market.schemaVersion !== 1) return { code: 'market-data-unavailable', message: 'Os dados de mercado não estão disponíveis.' }
}

function marketWarnings(request: ComparisonRequest, market: MarketSnapshot): SimulationWarning[] {
  const warnings: SimulationWarning[] = Object.values(market.sources)
    .filter(source => source.status === 'stale')
    .map(() => ({ code: 'market-data-stale', message: 'Uma ou mais fontes de mercado estão desatualizadas.' }))
  if (request.useProjections && (!market.projections.selic.length || !market.projections.ipca.length)) {
    warnings.push({ code: 'fallback-current', message: 'Projeções incompletas; taxas atuais foram usadas onde necessário.' })
  }
  return warnings
}

function simulateRows(request: ComparisonRequest, market: MarketSnapshot) {
  const results: InvestmentResult[] = []
  const rowErrors: SimulationError[] = []
  const rowWarnings: SimulationWarning[] = []
  for (const investment of request.investments) {
    const result = simulateRow(investment, request, market)
    if (result.ok) {
      results.push(result.value)
      rowWarnings.push(...result.warnings)
    }
    else {
      rowErrors.push(...result.errors)
      rowWarnings.push(...result.errors.map(error => ({ code: error.code, message: error.message, investmentId: investment.id } as SimulationWarning)))
    }
  }
  return { results, rowErrors, rowWarnings }
}

function simulateRow(investment: InvestmentInput, request: ComparisonRequest, market: MarketSnapshot): DomainResult<InvestmentResult> {
  try {
    return simulateInvestment(investment, request.startDate, request.principal, request.useProjections, market)
  }
  catch {
    return { ok: false, errors: [{ code: 'invalid-maturity', message: 'Informe um vencimento válido.', investmentId: investment.id, field: 'maturityDate' }] }
  }
}

function buildBenchmarkDifferences(best: InvestmentResult | undefined, benchmarks: ReturnType<typeof buildBenchmarks> | undefined) {
  if (!best || !benchmarks) return { cdi: '0', savings: '0', ipca: '0' }
  return {
    cdi: decimal(best.netProfit).minus(benchmarks.cdi.netProfit).toString(),
    savings: decimal(best.netProfit).minus(benchmarks.savings.netProfit).toString(),
    ipca: decimal(best.netProfit).minus(benchmarks.ipca.netProfit).toString(),
  }
}

function buildBenchmarks(request: ComparisonRequest, market: MarketSnapshot, maturityDate: InvestmentInput['maturityDate']) {
  const benchmarkInputs: InvestmentInput[] = [
    { id: '__cdi', name: '100% CDI', type: 'cdb-cdi', maturityDate, rate: { kind: 'cdi-percent', percentOfCdi: '100' } },
    { id: '__savings', name: 'Poupança', type: 'poupanca', maturityDate, rate: { kind: 'savings' } },
    { id: '__ipca', name: 'IPCA', type: 'lci-ipca', maturityDate, rate: { kind: 'ipca-plus', realAnnualPct: '0' } },
  ]
  const results = benchmarkInputs.map((input) => {
    const result = simulateInvestment(input, request.startDate, request.principal, request.useProjections, market)
    if (!result.ok) throw new Error(`Benchmark ${input.id} could not be simulated`)
    return result.value
  })
  return {
    cdi: results[0]!,
    savings: results[1]!,
    ipca: results[2]!,
  }
}
