import * as finance from './finance';

/**
 * Interface que define o resultado do cálculo de um investimento em Tesouro Direto
 */
export interface TesouroResult {
  interestAmount: number;      // Valor dos juros brutos
  taxAmount: number;           // Valor do imposto de renda
  taxPercentage: number;       // Percentual do imposto de renda
  iofAmount: number;           // Valor do IOF (não aplicável para Tesouro Direto após o primeiro dia)
  netAmount: number;           // Valor líquido total (aplicação + juros - impostos)
  grossAmount: number;         // Valor bruto total (aplicação + juros brutos)
}

/**
 * Calcula o resultado de um investimento em Tesouro Direto (considerando Tesouro Selic por simplicidade)
 * @param amount Valor do investimento
 * @param selic Taxa SELIC anual
 * @param yearlyIndex Percentual do título em relação à SELIC
 * @param days Número de dias do investimento
 * @returns Objeto com os resultados do cálculo
 */
export function getTesouroResult(
  amount: number,
  selic: number,
  yearlyIndex: number,
  days: number
): TesouroResult {
  // Validação dos parâmetros de entrada
  if (amount <= 0) {
    console.warn('Valor do investimento deve ser positivo');
    return { 
      interestAmount: 0, 
      taxAmount: 0, 
      taxPercentage: 0, 
      iofAmount: 0,
      netAmount: amount,
      grossAmount: amount
    };
  }
  
  if (selic < 0) {
    console.warn('Taxa SELIC não pode ser negativa');
    selic = 0;
  }
  
  if (yearlyIndex < 0) {
    console.warn('Percentual anual não pode ser negativo');
    yearlyIndex = 0;
  }
  
  if (days <= 0) {
    console.warn('Número de dias deve ser positivo');
    return { 
      interestAmount: 0, 
      taxAmount: 0, 
      taxPercentage: 0, 
      iofAmount: 0,
      netAmount: amount,
      grossAmount: amount
    };
  }

  const dailyIndex = getIndexTesouro(yearlyIndex, selic);
  const interestAmount = finance.compoundInterest(
    amount,
    dailyIndex,
    days
  );
  
  // Tesouro Direto tem tratamento fiscal diferente
  // IOF: Aplicável nos primeiros 30 dias (tabela regressiva)
  const iofAmount = finance.getIOFAmount(days, interestAmount);
  
  // IR: Regressivo baseado no tempo de investimento
  const taxPercentage = finance.getIndexIR(days);
  // O cálculo do IR para Tesouro Direto considera o ganho de capital (juros brutos - IOF)
  const taxableAmount = interestAmount - iofAmount;
  const taxAmount = taxableAmount * (taxPercentage / 100);
  
  const grossAmount = amount + interestAmount;
  const netAmount = grossAmount - taxAmount - iofAmount;

  return { 
    interestAmount, 
    taxAmount, 
    taxPercentage, 
    iofAmount,
    netAmount,
    grossAmount
  };
}

/**
 * Calcula a taxa diária do Tesouro Direto com base no percentual anual e na taxa SELIC
 * @param yearlyInterest Percentual anual do Tesouro em relação à SELIC
 * @param selic Taxa SELIC anual
 * @returns Taxa diária do Tesouro Direto em formato decimal
 */
function getIndexTesouro(yearlyInterest: number, selic: number): number {
  // Calcula a taxa anual efetiva (percentual * SELIC)
  const annualRate = (yearlyInterest * selic) / 100;
  // Converte a taxa anual para taxa diária: (1 + taxa_anual)^(1/365) - 1
  return Math.pow(1 + annualRate / 100, 1 / 365) - 1;
}