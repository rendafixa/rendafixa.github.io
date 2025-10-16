/**
 * Calcula juros compostos
 * @param amount Valor inicial do investimento
 * @param dailyRate Taxa de juros diária aplicada (em formato decimal, ex: 0.01 para 1%)
 * @param days Número de dias do investimento
 * @returns Valor dos juros calculados com duas casas decimais
 */
export function compoundInterest(amount: number, dailyRate: number, days: number): number {
  // Validação dos parâmetros de entrada
  if (amount <= 0) {
    console.warn('Valor do investimento deve ser positivo');
    return 0;
  }
  
  if (dailyRate < 0) {
    console.warn('Taxa de juros diária deve ser não negativa');
    return 0;
  }
  
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return 0;
  }

  // Fórmula de juros compostos: M = C * (1 + i)^n
  // Onde M = montante, C = capital, i = taxa de juros, n = período
  const finalAmount = amount * Math.pow(1 + dailyRate, days);
  const interest = finalAmount - amount;
  return parseFloat(interest.toFixed(2));
}

/**
 * Obtém a alíquota do Imposto de Renda (IR) com base no período de investimento
 * @param days Número de dias do investimento
 * @returns Percentual do IR aplicável
 */
export function getIndexIR(days: number): number {
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return 0;
  }

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

/**
 * Obtém a porcentagem do Imposto sobre Operações Financeiras (IOF) com base nos dias até o resgate
 * @param daysToRedeem Número de dias até o resgate do investimento (progressivo nos primeiros 30 dias)
 * @returns Percentual do IOF aplicável
 */
export function getIOFPercentage(daysToRedeem: number): number {
  if (daysToRedeem <= 0) {
    console.warn('Dias até resgate deve ser positivo');
    return 0;
  }

  // Tabela regressiva de IOF para os primeiros 30 dias
  // Fonte: http://normas.receita.fazenda.gov.br/sijut2consulta/AtoDownload?id=87191
  const iofTable: number[] = [
    96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36,
    33, 30, 26, 23, 20, 16, 13, 10, 6, 3, 0
  ];

  if (daysToRedeem <= 30) {
    // Usamos o dia 1 como índice 0, dia 2 como índice 1, etc.
    const index: number = Math.min(daysToRedeem - 1, iofTable.length - 1);
    // Verifica se o índice está dentro dos limites da tabela
    if (index >= 0 && index < iofTable.length) {
      return iofTable[index];
    } else {
      console.warn(`Índice de IOF fora dos limites: ${index}`);
      return 0;
    }
  }

  return 0; // Não há IOF após 30 dias
}

/**
 * Calcula o valor do IOF com base nos dias até o resgate e no valor dos juros
 * @param daysToRedeem Número de dias até o resgate do investimento
 * @param interestAmount Valor dos juros brutos
 * @returns Valor do IOF a ser descontado
 */
export function getIOFAmount(daysToRedeem: number, interestAmount: number): number {
  if (daysToRedeem <= 0 || interestAmount <= 0) {
    return 0;
  }

  const iofPercentage: number = getIOFPercentage(daysToRedeem)
  return interestAmount * (iofPercentage / 100)
}

