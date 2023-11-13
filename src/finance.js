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

export function getIOFPercentage(daysToRedeem) {
  const iofTable = [
    96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36,
    33, 30, 26, 23, 20, 16, 13, 10, 6, 3, 0
  ]

  if (daysToRedeem <= 30) {
    const index = daysToRedeem - 1
    return iofTable[index]
  }

  return 0 // No IOF for redemption after 30 days
}

export function getIOFAmount(daysToRedeem, interestAmount) {
  const iofPercentage = getIOFPercentage(daysToRedeem)
  return interestAmount * (iofPercentage / 100)
}
