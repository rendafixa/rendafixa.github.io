export function compoundInterest(amount: number, index: number, days: number): number {
  const interest = amount * Math.pow(index, days) - amount;
  return parseFloat(interest.toFixed(2));
}

export function getIndexIR(days: number): number {
  if (days <= 180) {
    return 22.5;
  } else if (days <= 360) {
    return 20;
  } else if (days <= 720) {
    return 17.5;
  } else {
    return 15;
  }
}
