import type { DomainResult, SimulationError, SimulationWarning } from '../contracts/errors'
import type { InvestmentInput, IsoDate } from '../contracts/investment'
import type { MarketSnapshot } from '../contracts/market'
import type { InvestmentResult, TimelinePoint } from '../contracts/simulation'
import { businessDates } from '../calendar/business-days'
import { addYears, calendarDaysBetween, compareDates, datesAfterStartThroughEnd } from '../calendar/dates'
import { savingsAnniversaries } from '../calendar/monthly-anniversary'
import { decimal } from '../finance/decimal'
import { evaluateFgc } from '../finance/fgc'
import { cdiRateForDate, ipcaRateForDate, selicRateForDate } from '../finance/rate-curves'
import { calculateTaxes, taxBracketAlert } from '../finance/taxes'
import { cdiLinkedFactor } from '../products/cdi-linked'
import { fixedRateFactor } from '../products/fixed-rate'
import { ipcaLinkedFactor } from '../products/ipca-linked'
import { isExemptInvestment, isTreasuryInvestment } from '../products/registry'
import { savingsMonthlyFactor } from '../products/savings'
import { TREASURY_WARNING } from '../products/treasury'
import { buildMonthlyYields } from './monthly-yield'
import { compactTimeline } from './timeline'

export function simulateInvestment(input: InvestmentInput, startDate: IsoDate, principalValue: string, useProjections: boolean, market: MarketSnapshot): DomainResult<InvestmentResult> {
  const errors = validateInput(input, startDate, market)
  if (errors.length) return { ok: false, errors }
  const principal = decimal(principalValue)
  const holidays = new Set(market.holidays.dates.map(item => item.date))
  const earningDates = businessDates(startDate, input.maturityDate, holidays)
  const earningDateSet = new Set(earningDates)
  const calendarDays = calendarDaysBetween(startDate, input.maturityDate)
  let balance = principal
  const rawTimeline: TimelinePoint[] = []
  const savingsDates = new Set(savingsAnniversaries(startDate, input.maturityDate))
  const allDates = datesAfterStartThroughEnd(startDate, input.maturityDate)

  for (const date of allDates) {
    if (input.type === 'poupanca' && savingsDates.has(date)) {
      balance = balance.mul(savingsMonthlyFactor(market, date, useProjections))
    }
    else if (input.type !== 'poupanca' && earningDateSet.has(date)) {
      balance = balance.mul(factorFor(input, date, useProjections, market))
    }
    const grossProfit = balance.minus(principal)
    const taxes = calculateTaxes(grossProfit, calendarDays, isExemptInvestment(input.type))
    rawTimeline.push({
      date,
      grossValue: balance.toString(),
      netValue: balance.minus(taxes.iof).minus(taxes.incomeTax).toString(),
    })
  }

  const grossProfit = balance.minus(principal)
  const taxes = calculateTaxes(grossProfit, calendarDays, isExemptInvestment(input.type))
  const netProfit = grossProfit.minus(taxes.iof).minus(taxes.incomeTax)
  const netFinalValue = principal.plus(netProfit)
  const warnings: SimulationWarning[] = []
  if (isTreasuryInvestment(input.type)) warnings.push({ code: 'treasury-held-to-maturity', message: TREASURY_WARNING, investmentId: input.id })
  const timeline = compactTimeline(rawTimeline)
  const years = decimal(calendarDays).div(365)
  const annualized = years.gt(0) ? netFinalValue.div(principal).pow(decimal(1).div(years)).minus(1).mul(100) : decimal(0)
  return {
    ok: true,
    warnings,
    value: {
      investmentId: input.id,
      calendarDays,
      businessDays: earningDates.length,
      grossProfit: grossProfit.toString(),
      iof: taxes.iof.toString(),
      incomeTax: taxes.incomeTax.toString(),
      netProfit: netProfit.toString(),
      grossFinalValue: balance.toString(),
      netFinalValue: netFinalValue.toString(),
      netReturnPct: netProfit.div(principal).mul(100).toString(),
      annualizedNetPct: annualized.toString(),
      fgc: evaluateFgc(isTreasuryInvestment(input.type), startDate, principalValue, rawTimeline),
      taxBracketAlert: isExemptInvestment(input.type) ? undefined : taxBracketAlert(calendarDays),
      warnings,
      timeline,
      monthlyYields: buildMonthlyYields(startDate, input.maturityDate, principalValue, rawTimeline),
    },
  }
}

function factorFor(input: InvestmentInput, date: IsoDate, projected: boolean, market: MarketSnapshot) {
  switch (input.rate.kind) {
    case 'fixed': return fixedRateFactor(decimal(input.rate.annualPct))
    case 'cdi-percent': return cdiLinkedFactor(cdiRateForDate(date, market, projected), decimal(input.rate.percentOfCdi))
    case 'ipca-plus': return ipcaLinkedFactor(ipcaRateForDate(date, market, projected), decimal(input.rate.realAnnualPct))
    case 'selic': return fixedRateFactor(selicRateForDate(date, market, projected))
    case 'savings': return decimal(1)
  }
}

function validateInput(input: InvestmentInput, startDate: IsoDate, market: MarketSnapshot): SimulationError[] {
  const errors: SimulationError[] = []
  const supportedTypes = new Set(['poupanca', 'cdb-pre', 'lci-pre', 'tesouro-pre', 'cdb-cdi', 'lci-cdi', 'cdb-ipca', 'lci-ipca', 'tesouro-ipca', 'tesouro-selic'])
  if (!supportedTypes.has(input.type)) return [{ code: 'unsupported-investment-type', message: 'Tipo de investimento não suportado.', investmentId: input.id, field: 'type' }]
  if (compareDates(input.maturityDate, startDate) <= 0) errors.push({ code: 'maturity-before-start', message: 'O vencimento deve ser posterior à data inicial.', investmentId: input.id, field: 'maturityDate' })
  if (compareDates(input.maturityDate, addYears(startDate, 30)) > 0) errors.push({ code: 'invalid-maturity', message: 'O vencimento deve estar dentro de 30 anos.', investmentId: input.id, field: 'maturityDate' })
  if (input.maturityDate > market.holidays.supportedUntil || input.maturityDate < market.holidays.supportedFrom) errors.push({ code: 'maturity-outside-holiday-coverage', message: 'Vencimento fora da cobertura de feriados.', investmentId: input.id, field: 'maturityDate' })
  const rate = input.rate.kind === 'fixed' ? input.rate.annualPct : input.rate.kind === 'cdi-percent' ? input.rate.percentOfCdi : input.rate.kind === 'ipca-plus' ? input.rate.realAnnualPct : '1'
  try {
    if (!decimal(rate).isFinite() || decimal(rate).lte(input.rate.kind === 'ipca-plus' ? -100 : 0)) errors.push({ code: 'invalid-rate', message: 'Informe uma taxa válida.', investmentId: input.id, field: 'rate' })
  }
  catch {
    errors.push({ code: 'invalid-rate', message: 'Informe uma taxa válida.', investmentId: input.id, field: 'rate' })
  }
  return errors
}
