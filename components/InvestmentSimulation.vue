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
      :iof-amount="resultCDB.iofAmount"
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
import { DurationType } from '~/store/investment'
export default {
  components: { InvestmentResult },
  data() {
    return {
      investment: this.$store.state.investment,
      periodMultiplier: {
        [DurationType.Days]: 1,
        [DurationType.Months]: 365 / 12,
        [DurationType.Years]: 365
      }
    }
  },
  computed: {
    resultCDB() {
      return getCDBResult(
        this.investment.amount,
        this.investment.di,
        this.investment.cdb,
        this.getDurationInDays()
      )
    },
    resultLcx() {
      return getLcxResult(
        this.investment.amount,
        this.investment.di,
        this.investment.lcx,
        this.getDurationInDays()
      )
    },
    resultPoupanca() {
      return getPoupancaResult(
        this.investment.amount,
        this.investment.poupanca,
        this.getDurationInDays()
      )
    }
  },
  methods: {
    getDurationInDays() {
      return Math.floor(
        this.investment.duration *
          this.periodMultiplier[this.investment.durationType]
      )
    }
  }
}
</script>
