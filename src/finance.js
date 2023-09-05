export function compoundInterest(amount, index, days) {
  return amount * Math.pow(index, days) - amount
}

export function getIndexIR(days) {
  if (days <= 180) {
    return 22.5
  } else if (days <= 360) {
    return 20
  } else if (days <= 720) {
    return 17.5
  } else {
    return 15
  }
}
