import * as finance from './finance';

/**
 * Interface que define o resultado do cálculo de um investimento em LCI/LCA
 */
export interface LCXResult {
  interestAmount: number;      // Valor dos juros brutos
  netAmount: number;           // Valor líquido total (aplicação + juros líquidos)
  grossAmount: number;         // Valor bruto total (aplicação + juros brutos)
}

/**
 * Calcula o resultado de um investimento em LCI (Letra de Crédito Imobiliário) ou LCA (Letra de Crédito do Agronegócio)
 * @param amount Valor do investimento
 * @param di Taxa DI (Depósito Interfinanceiro) anual
 * @param yearlyIndex Percentual do CDI (Certificado de Depósito Interbancário) anual
 * @param days Número de dias do investimento
 * @returns Objeto com os resultados do cálculo
 */
export function getLcxResult(
  amount: number,
  di: number,
  yearlyIndex: number,
  days: number
): LCXResult {
  // Validação dos parâmetros de entrada
  if (amount <= 0) {
    console.warn('Valor do investimento deve ser positivo');
    return { 
      interestAmount: 0, 
      netAmount: amount,
      grossAmount: amount
    };
  }
  
  if (di < 0) {
    console.warn('Taxa DI não pode ser negativa');
    di = 0;
  }
  
  if (yearlyIndex < 0) {
    console.warn('Percentual anual não pode ser negativo');
    yearlyIndex = 0;
  }
  
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return { 
      interestAmount: 0, 
      netAmount: amount,
      grossAmount: amount
    };
  }

  const dailyIndex = getIndexLcx(yearlyIndex, di);
  const interestAmount = finance.compoundInterest(
    amount,
    dailyIndex,
    days
  );

  const grossAmount = amount + interestAmount;
  // LCI e LCA são isentos de IR e IOF
  const netAmount = grossAmount;

  return { 
    interestAmount, 
    netAmount,
    grossAmount
  };
}

/**
 * Calcula a taxa diária do LCI/LCA com base no percentual anual e na taxa DI
 * @param yearlyInterest Percentual anual do LCI/LCA
 * @param di Taxa DI anual
 * @returns Taxa diária do LCI/LCA em formato decimal
 */
function getIndexLcx(yearlyInterest: number, di: number): number {
  // Calcula a taxa anual efetiva (percentual * DI)
  const annualRate = (yearlyInterest * di) / 100;
  // Converte a taxa anual para taxa diária: (1 + taxa_anual)^(1/365) - 1
  return Math.pow(1 + annualRate / 100, 1 / 365) - 1;
}

