import Decimal from 'decimal.js'

Decimal.set({ precision: 32, rounding: Decimal.ROUND_HALF_UP })

export { Decimal }

export function decimal(value: Decimal.Value): Decimal {
  return new Decimal(value)
}

export function annualToDailyFactor(annualPct: Decimal.Value, base = 252): Decimal {
  return decimal(annualPct).div(100).plus(1).pow(decimal(1).div(base))
}

export function annualToMonthlyRate(annualPct: Decimal.Value): Decimal {
  return decimal(annualPct).div(100).plus(1).pow(decimal(1).div(12)).minus(1)
}
