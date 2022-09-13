<template>
  <div>
    <h2 class="text-h6">Simulação</h2>
    <p class="grey--text">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult
      name="Poupança"
      :amount="investment.amount"
      :interest-amount="resultPoupanca.interestAmount"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="investment.amount"
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
      investment: this.$store.state.investment
    }
  },
  computed: {
    resultCDB() {
      return getCDBResult(
        this.investment.amount,
        this.investment.di,
        this.investment.cdb,
        this.investment.duration
      )
    },
    resultPoupanca() {
      return getPoupancaResult(
        this.investment.amount,
        this.investment.poupanca,
        this.investment.duration
      )
    }
  }
}
</script>
