<template>
  <div>
    <h2>Simulação do Investimento</h2>
    <p class="grey--text">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult
      name="LCI / LCA"
      :amount="amount"
      before-tax-amount="156.89"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="resultCDB.interestAmount"
      :tax-amount="resultCDB.taxAmount"
      :tax-percentage="resultCDB.taxPercentage"
    />
    <InvestmentResult
      name="Tesouro Selic"
      :amount="amount"
      before-tax-amount="158.89"
    />
    <InvestmentResult name="Poupança" :amount="amount" />
  </div>
</template>
<script>
import * as finance from '../finance.js'
import InvestmentResult from './InvestmentResult.vue'
export default {
  components: { InvestmentResult },
  data() {
    return {
      amount: 1000,
      duration: 12,
      di: 13.65,
      selic: 13.65,
      cdb: 105,
      lcx: 100,
      rules: {
        required: (value) => !!value || 'Obrigatório',
        positive: (value) => value > 0 || 'Deve ser um número positivo'
      }
    }
  },
  computed: {
    resultCDB() {
      return finance.getCDBResult(this.amount, this.di, this.cdb, this.duration)
    }
  }
}
</script>
