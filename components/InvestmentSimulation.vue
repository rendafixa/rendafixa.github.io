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
      :loading="!investment.poupanca"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="investment.amount"
      :interest-amount="resultCDB.interestAmount"
      :tax-amount="resultCDB.taxAmount"
      :tax-percentage="resultCDB.taxPercentage"
      :loading="!investment.di"
    />
    <InvestmentResult
      name="LCI / LCA"
      :amount="investment.amount"
      :interest-amount="resultLcx.interestAmount"
      :loading="!investment.di"
    />
  </div>
</template>
<script>
import InvestmentResult from './InvestmentResult.vue'
import { getCDBResult } from '~/src/cdb'
import { getLcxResult } from '~/src/lcx'
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
    resultLcx() {
      return getLcxResult(
        this.investment.amount,
        this.investment.di,
        this.investment.lcx,
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
