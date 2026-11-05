import type { InvestmentInput } from '../contracts/investment'

export function isExemptInvestment(type: InvestmentInput['type']): boolean {
  return type === 'poupanca' || type.startsWith('lci-')
}

export function isTreasuryInvestment(type: InvestmentInput['type']): boolean {
  return type.startsWith('tesouro-')
}
