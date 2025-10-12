import * as finance from './finance';

/**
 * Interface que define o resultado do cálculo de um investimento em poupança
 */
export interface PoupancaResult {
  interestAmount: number;      // Valor dos juros brutos
  netAmount: number;           // Valor líquido total (aplicação + juros líquidos)
  grossAmount: number;         // Valor bruto total (aplicação + juros brutos)
}

/**
 * Calcula o resultado de um investimento em poupança
 * @param amount Valor do investimento
 * @param monthlyIndex Taxa mensal da poupança
 * @param days Número de dias do investimento
 * @returns Objeto com os resultados do cálculo
 */
export function getPoupancaResult(
  amount: number,
  monthlyIndex: number,
  days: number
): PoupancaResult {
  // Validação dos parâmetros de entrada
  if (amount <= 0) {
    console.warn('Valor do investimento deve ser positivo');
    return { 
      interestAmount: 0, 
      netAmount: amount,
      grossAmount: amount
    };
  }
  
  if (monthlyIndex < 0) {
    console.warn('Taxa mensal da poupança não pode ser negativa');
    monthlyIndex = 0;
  }
  
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return { 
      interestAmount: 0, 
      netAmount: amount,
      grossAmount: amount
    };
  }

  const fullMonthsDays = calculateFullMonthsDays(days);
  const dailyIndex = getIndexPoupanca(monthlyIndex);
  const interestAmount = finance.compoundInterest(
    amount,
    dailyIndex,
    fullMonthsDays
  );

  const grossAmount = amount + interestAmount;
  // Poupança é isenta de IR e IOF
  const netAmount = grossAmount;

  return { 
    interestAmount, 
    netAmount,
    grossAmount
  };
}

/**
 * Calcula a quantidade de dias equivalentes a meses completos
 * @param days Número total de dias do investimento
 * @returns Número de dias equivalentes a meses completos (30 dias cada)
 */
export function calculateFullMonthsDays(days: number): number {
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return 0;
  }

  const daysInMonth = 30;
  return days < daysInMonth ? 0 : Math.floor(days / daysInMonth) * daysInMonth;
}

/**
 * Converte a taxa mensal da poupança para taxa diária
 * @param monthlyIndex Taxa mensal da poupança
 * @returns Taxa diária equivalente em formato decimal
 */
function getIndexPoupanca(monthlyIndex: number): number {
  // Converte a taxa mensal para taxa diária: (1 + taxa_mensal)^(1/30) - 1
  return Math.pow(1 + monthlyIndex / 100, 1 / 30) - 1;
}
