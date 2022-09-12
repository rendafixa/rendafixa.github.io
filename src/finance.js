export function compoundInterest(amount, index, periods) {
  return amount * Math.pow(index, periods) - amount
}

export function getIndexIR(periods) {
  if (periods <= 6) {
    return 22.5
  } else if (periods <= 12) {
    return 20
  } else if (periods <= 24) {
    return 17.5
  } else {
    return 15
  }
}
