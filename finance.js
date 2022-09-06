export function getCDBResult(amount, di, yearlyIndex, periods) {
  const interestAmount = coupoundInterest(
    amount,
    getIndexCDB(yearlyIndex, di),
    periods
  )
  const taxPercentage = getIndexIR(periods)
  const taxAmount = interestAmount * (taxPercentage / 100)
  return { interestAmount, taxAmount, taxPercentage }
}

function coupoundInterest(amount, index, periods) {
  return amount * Math.pow(index, periods) - amount
}

function getIndexCDB(yearlyInterest, di) {
  const index = yearlyInterest / 100
  return Math.pow((index * di) / 100 + 1, 1 / 12)
}

function getIndexIR(periods) {
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
