<template>
  <div>
    <h2 class='text-h6'>Simulação</h2>
    <p class='font-weight-light'>
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult name='Poupança' :amount='investment.amount' :interest-amount='resultPoupanca.interestAmount'
      :loading='!investment.poupanca' />
    <InvestmentResult name='CDB / RDB' :amount='investment.amount'
                      :interest-amount='resultCDB.interestAmount'
                      :tax-amount='resultCDB.taxAmount'
                      :tax-percentage='resultCDB.taxPercentage'
                      :loading='!investment.di'
                      :iof-amount='resultCDB.iofAmount' />
    <InvestmentResult name='LCI / LCA' :amount='investment.amount' :interest-amount='resultLcx.interestAmount'
      :loading='!investment.di' />
  </div>
</template>

<script setup lang='ts'>
import InvestmentResult from '~/components/InvestmentResult.vue'
import { computed } from 'vue'
import { getCDBResult } from '~/src/cdb'
import { getLcxResult } from '~/src/lcx'
import { getPoupancaResult } from '~/src/poupanca'
import { PeriodTypes, useInvestmentStore } from '~/store/investment'

const investment = useInvestmentStore()

const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365
}

const resultCDB = computed(() => {
  return getCDBResult(
    investment.amount,
    investment.di,
    investment.cdb,
    getDurationInDays()
  )
})

const resultLcx = computed(() => {
  return getLcxResult(
    investment.amount,
    investment.di,
    investment.lcx,
    getDurationInDays()
  )
})

const resultPoupanca = computed(() => {
  return getPoupancaResult(
    investment.amount,
    investment.poupanca,
    getDurationInDays()
  )
})

function getDurationInDays() {
  return Math.floor(investment.period * periodMultiplier[investment.periodType])
}
</script>
