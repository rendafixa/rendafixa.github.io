<template>
  <div>
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      Simulação
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult
      name="Poupança"
      :amount="totalContributed"
      :interest-amount="resultPoupanca.interestAmount"
      :loading="!investment.poupanca"
      :breakdown="breakdownPoupanca"
      class="mb-2"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="totalContributed"
      :interest-amount="resultCDB.interestAmount"
      :tax-amount="resultCDB.taxAmount"
      :tax-percentage="resultCDB.taxPercentage"
      :loading="!investment.di"
      :iof-amount="resultCDB.iofAmount"
      :breakdown="breakdownCDB"
      class="mb-2"
    />
    <InvestmentResult
      name="LCI / LCA"
      :amount="totalContributed"
      :interest-amount="resultLcx.interestAmount"
      :loading="!investment.di"
      :breakdown="breakdownLcx"
    />
  </div>
</template>

<script setup lang='ts'>
import InvestmentResult from '~/components/InvestmentResult.vue'
import { computed } from 'vue'
import { buildBreakdown, buildContributionSchedule, getRecurringCdbResult, getRecurringLcxResult, getRecurringPoupancaResult } from '~/src/aportes'
import { getCDBResult } from '~/src/cdb'
import { getLcxResult } from '~/src/lcx'
import { getPoupancaResult } from '~/src/poupanca'
import { PeriodTypes, useInvestmentStore } from '~/store/investment'

const investment = useInvestmentStore()

const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365,
}

// Deposit schedule shared by every product: the initial amount plus the
// (optional) recurring contributions. When there is no recurring contribution
// it holds a single deposit, so the results match the single-deposit case.
const schedule = computed(() => buildContributionSchedule(
  investment.amount,
  investment.recurringAmount,
  getFrequencyInDays(),
  getDurationInDays(),
  investment.inflationEnabled ? (investment.inflationRate ?? 0) : 0,
))

const totalContributed = computed(() =>
  schedule.value.reduce((sum, contribution) => sum + contribution.principal, 0),
)

const resultCDB = computed(() => getRecurringCdbResult(schedule.value, investment.di, investment.cdb))

const resultLcx = computed(() => getRecurringLcxResult(schedule.value, investment.di, investment.lcx))

const resultPoupanca = computed(() => getRecurringPoupancaResult(schedule.value, investment.poupanca))

// Gross accumulation timeline per product, only when recurring contributions
// are active. Each product grows a deposit with its own compounding rule.
const hasRecurringContribution = computed(() => investment.recurringAmount > 0)

const breakdownCDB = computed(() => buildProductBreakdown(
  (principal, days) => principal + getCDBResult(principal, investment.di, investment.cdb, days).interestAmount,
))

const breakdownLcx = computed(() => buildProductBreakdown(
  (principal, days) => principal + getLcxResult(principal, investment.di, investment.lcx, days).interestAmount,
))

const breakdownPoupanca = computed(() => buildProductBreakdown(
  (principal, days) => principal + getPoupancaResult(principal, investment.poupanca, days).interestAmount,
))

function buildProductBreakdown(grow: (principal: number, days: number) => number) {
  if (!hasRecurringContribution.value) {
    return []
  }
  return buildBreakdown(schedule.value, getFrequencyInDays(), getDurationInDays(), grow)
}

function getDurationInDays() {
  return Math.floor(investment.period * periodMultiplier[investment.periodType])
}

function getFrequencyInDays() {
  return Math.floor(investment.recurringFrequency * periodMultiplier[investment.recurringFrequencyType])
}
</script>
