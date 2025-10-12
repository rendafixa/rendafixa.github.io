import { defineStore } from 'pinia'
import indicadores from '~/assets/indicadores.json'

// Tipos para os tipos de período de investimento
export enum PeriodTypes {
  Days = 'dias',
  Months = 'meses',
  Years = 'anos'
}

// Interface para os índices econômicos
interface EconomicIndicators {
  poupanca: {
    title: string;
    description: string;
    unitDisplay: string;
    value: number;
  };
  selic: {
    title: string;
    description: string;
    unitDisplay: string;
    value: number;
  };
  cdi: {
    title: string;
    description: string;
    unitDisplay: string;
    value: number;
  };
}

// Interface para o estado do store de investimento
interface InvestmentState {
  amount: number;          // Valor do investimento
  cdb: number;             // Percentual do CDB em relação ao CDI
  di: number | null;       // Taxa DI (Depósito Interfinanceiro)
  period: number;          // Período do investimento
  periodType: PeriodTypes; // Tipo do período (dias, meses, anos)
  lcx: number;             // Percentual do LCI/LCA em relação ao CDI
  poupanca: number | null; // Taxa da poupança
  selic: number | null;    // Taxa SELIC
  tesouro: number | null;  // Taxa do Tesouro Direto (adicionado)
  lc: number | null;       // Percentual do LC em relação ao CDI (adicionado)
}

export const useInvestmentStore = defineStore('investment', {
  state: (): InvestmentState => {
    return {
      amount: 1000,
      cdb: 100,
      di: null,
      period: 360,
      periodType: PeriodTypes.Days,
      lcx: 100,
      poupanca: null,
      selic: null,
      tesouro: null,  // Novo índice para Tesouro Direto
      lc: null        // Novo índice para Letras de Crédito
    }
  },
  actions: {
    setAmount(newAmount: number) {
      if (newAmount >= 0) {
        this.amount = newAmount
      } else {
        console.warn('Valor do investimento não pode ser negativo')
      }
    },
    setPeriod(newPeriod: number) {
      if (newPeriod > 0) {
        this.period = newPeriod
      } else {
        console.warn('Período deve ser positivo')
      }
    },
    setPeriodType(newType: PeriodTypes) {
      this.periodType = newType
    },
    setCdb(newCdb: number) {
      if (newCdb >= 0) {
        this.cdb = newCdb
      } else {
        console.warn('Percentual do CDB não pode ser negativo')
      }
    },
    setDi(newDi: number) {
      if (newDi >= 0) {
        this.di = newDi
      } else {
        console.warn('Taxa DI não pode ser negativa')
      }
    },
    setLcx(newLcx: number) {
      if (newLcx >= 0) {
        this.lcx = newLcx
      } else {
        console.warn('Percentual do LCI/LCA não pode ser negativo')
      }
    },
    setSelic(newSelic: number) {
      if (newSelic >= 0) {
        this.selic = newSelic
      } else {
        console.warn('Taxa SELIC não pode ser negativa')
      }
    },
    setTesouro(newTesouro: number) {
      if (newTesouro >= 0) {
        this.tesouro = newTesouro
      } else {
        console.warn('Taxa do Tesouro Direto não pode ser negativa')
      }
    },
    setLc(newLc: number) {
      if (newLc >= 0) {
        this.lc = newLc
      } else {
        console.warn('Percentual do LC não pode ser negativo')
      }
    },
    initializeStore() {
      this.loadIndexes()
    },
    loadIndexes() {
      // Carrega os índices econômicos do arquivo JSON
      const economicIndicators = indicadores as EconomicIndicators;
      
      // Validação da estrutura do JSON
      if (!economicIndicators.cdi?.value || !economicIndicators.selic?.value || !economicIndicators.poupanca?.value) {
        console.error('Estrutura inválida no arquivo indicadores.json');
        throw new Error('Não foi possível carregar os indicadores econômicos');
      }
      
      this.di = economicIndicators.cdi.value;
      this.selic = economicIndicators.selic.value;
      this.poupanca = economicIndicators.poupanca.value;
    }
  }
})
