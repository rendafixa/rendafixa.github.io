<template>
  <div>
    <h2 class='text-h6'>Simulação</h2>
    <p class='font-weight-light'>
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult name='Poupança' 
                      :amount='investment.amount' 
                      :interest-amount='resultPoupanca.interestAmount'
                      :net-amount='resultPoupanca.netAmount'
                      :loading='!investment.poupanca' />
    <InvestmentResult name='CDB / RDB' 
                      :amount='investment.amount'
                      :interest-amount='resultCDB.interestAmount'
                      :net-amount='resultCDB.netAmount'
                      :tax-amount='resultCDB.taxAmount'
                      :tax-percentage='resultCDB.taxPercentage'
                      :loading='!investment.di'
                      :iof-amount='resultCDB.iofAmount' />
    <InvestmentResult name='LCI / LCA' 
                      :amount='investment.amount' 
                      :interest-amount='resultLcx.interestAmount'
                      :net-amount='resultLcx.netAmount'
                      :loading='!investment.di' />
    <!-- Novos investimentos adicionados -->
    <InvestmentResult name='LC' 
                      :amount='investment.amount' 
                      :interest-amount='resultLC.interestAmount'
                      :net-amount='resultLC.netAmount'
                      :loading='!investment.di || !investment.lc' />
    <InvestmentResult name='Tesouro Direto' 
                      :amount='investment.amount' 
                      :interest-amount='resultTesouro.interestAmount'
                      :net-amount='resultTesouro.netAmount'
                      :tax-amount='resultTesouro.taxAmount'
                      :tax-percentage='resultTesouro.taxPercentage'
                      :loading='!investment.selic || !investment.tesouro'
                      :iof-amount='resultTesouro.iofAmount' />
  </div>
</template>

<script setup lang='ts'>
import InvestmentResult from '~/components/InvestmentResult.vue'
import { computed } from 'vue'
import { getCDBResult } from '~/src/cdb'
import { getLcxResult } from '~/src/lcx'
import { getPoupancaResult } from '~/src/poupanca'
import { getTesouroResult } from '~/src/tesouro'
import { PeriodTypes, useInvestmentStore } from '~/store/investment'

const investment = useInvestmentStore()

// Multiplicadores para conversão de período para dias
const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365
}

// Função para converter o período para dias
function getDurationInDays(): number {
  if (!investment.period || investment.period <= 0) {
    return 0;
  }
  return Math.floor(investment.period * periodMultiplier[investment.periodType])
}

// Resultados dos cálculos para cada tipo de investimento
const resultCDB = computed(() => {
  if (!investment.di) {
    return {
      interestAmount: 0,
      taxAmount: 0,
      taxPercentage: 0,
      iofAmount: 0,
      netAmount: investment.amount,
      grossAmount: investment.amount
    };
  }
  return getCDBResult(
    investment.amount,
    investment.di,
    investment.cdb,
    getDurationInDays()
  )
})

const resultLcx = computed(() => {
  if (!investment.di) {
    return {
      interestAmount: 0,
      netAmount: investment.amount,
      grossAmount: investment.amount
    };
  }
  return getLcxResult(
    investment.amount,
    investment.di,
    investment.lcx,
    getDurationInDays()
  )
})

const resultPoupanca = computed(() => {
  if (!investment.poupanca) {
    return {
      interestAmount: 0,
      netAmount: investment.amount,
      grossAmount: investment.amount
    };
  }
  return getPoupancaResult(
    investment.amount,
    investment.poupanca,
    getDurationInDays()
  )
})

// Novos cálculos para LC e Tesouro Direto com funções próprias
const resultLC = computed(() => {
  if (!investment.di || !investment.lc) {
    return {
      interestAmount: 0,
      taxAmount: 0,
      taxPercentage: 0,
      iofAmount: 0,
      netAmount: investment.amount,
      grossAmount: investment.amount
    };
  }
  // LC tem tributação como CDB (IR regressivo e IOF regressivo nos primeiros 30 dias)
  return getCDBResult(
    investment.amount,
    investment.di,
    investment.lc,
    getDurationInDays()
  )
})

const resultTesouro = computed(() => {
  if (!investment.selic || !investment.tesouro) {
    return {
      interestAmount: 0,
      taxAmount: 0,
      taxPercentage: 0,
      iofAmount: 0,
      netAmount: investment.amount,
      grossAmount: investment.amount
    };
  }
  // Usando a função específica para cálculo do Tesouro Direto
  return getTesouroResult(
    investment.amount,
    investment.selic, // Usando SELIC como base para Tesouro Selic
    investment.tesouro, // Percentual do Tesouro em relação à SELIC
    getDurationInDays()
  )
})
</script>
