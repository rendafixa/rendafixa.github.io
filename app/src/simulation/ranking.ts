import type { InvestmentResult } from '../contracts/simulation'
import { decimal } from '../finance/decimal'

export function rankInvestments(results: InvestmentResult[]): string[] {
  return results
    .map((result, index) => ({ result, index }))
    .sort((left, right) => decimal(right.result.netProfit).comparedTo(left.result.netProfit) || left.index - right.index)
    .map(item => item.result.investmentId)
}
