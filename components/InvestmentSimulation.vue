<template>
  <div>
    <h2>Simulação do Investimento</h2>
    <p class="grey--text">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult
      name="Poupança"
      :amount="amount"
      :interest-amount="resultPoupanca.interestAmount"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="amount"
      :interest-amount="resultCDB.interestAmount"
      :tax-amount="resultCDB.taxAmount"
      :tax-percentage="resultCDB.taxPercentage"
    />
  </div>
</template>
<script>
import InvestmentResult from './InvestmentResult.vue'
import { getCDBResult } from '~/src/cdb'
import { getPoupancaResult } from '~/src/poupanca'
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
      return getCDBResult(this.amount, this.di, this.cdb, this.duration)
    },
    resultPoupanca() {
      return getPoupancaResult(this.amount, this.duration)
    }
  }
}
</script>
