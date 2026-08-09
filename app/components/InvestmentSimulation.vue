<template>
  <div>
    <h2 class="text-lg font-semibold text-slate-950 dark:text-slate-50 mb-2">
      Simulação
    </h2>
    <p class="text-slate-600 dark:text-slate-300 mb-4">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult
      name="Poupança"
      :amount="investment.amount"
      :interest-amount="resultPoupanca.interestAmount"
      :loading="!investment.poupanca"
      class="mb-2"
    />
    <InvestmentResult
      name="CDB / RDB"
      :amount="investment.amount"
      :interest-amount="resultCDB.interestAmount"
      :tax-amount="resultCDB.taxAmount"
      :tax-percentage="resultCDB.taxPercentage"
      :loading="!investment.di"
      :iof-amount="resultCDB.iofAmount"
      class="mb-2"
    />
    <InvestmentResult
      v-if="resultCdbPre"
      name="CDB / RDB prefixado"
      :amount="investment.amount"
      :interest-amount="resultCdbPre.interestAmount"
      :tax-amount="resultCdbPre.taxAmount"
      :tax-percentage="resultCdbPre.taxPercentage"
      :iof-amount="resultCdbPre.iofAmount"
      class="mb-2"
    />
    <InvestmentResult
      name="LCI / LCA"
      :amount="investment.amount"
      :interest-amount="resultLcx.interestAmount"
      :loading="!investment.di"
      class="mb-2"
    />
    <InvestmentResult
      v-if="resultLcxPre"
      name="LCI / LCA prefixado"
      :amount="investment.amount"
      :interest-amount="resultLcxPre.interestAmount"
      class="mb-4"
    />
    <aside
      aria-label="Premissas da simulação prefixada"
      class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-slate-300"
    >
      <p class="font-semibold text-slate-950 dark:text-slate-50">
        Estimativa de investimentos prefixados
      </p>
      <p class="mt-1">
        A simulação usa a aproximação de 365 dias corridos adotada pela calculadora.
        Contratos podem usar bases de 252 dias úteis ou 360 dias corridos; confirme a
        convenção e as condições no contrato do emissor. Consulte os manuais da
        <a
          href="https://www.b3.com.br/data/files/E9/24/20/40/0D331610D1820216790D8AA8/Manual-do-Produto-Certificado-de-Deposito-Bancario-CDB.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
        >B3 para CDB</a>
        e
        <a
          href="https://www.b3.com.br/data/files/1E/00/80/73/5E331610C2BD3316790D8AA8/Manual-do-Produto-Letra-de-Credito-Imobiliario-LCI.pdf"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
        >B3 para LCI</a>.
      </p>
      <p class="mt-2">
        Para LCI/LCA, não validamos vencimento, liquidez nem condições de resgate. O
        prazo mínimo atual para títulos não indexados a índice de preços é de seis
        meses, conforme a
        <a
          href="https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=5215&amp;tipo=Resolu%C3%A7%C3%A3o+CMN"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200"
        >Resolução CMN nº 5.215</a>.
      </p>
    </aside>
  </div>
</template>

<script setup lang='ts'>
import InvestmentResult from '~/components/InvestmentResult.vue'
import { computed } from 'vue'
import { getCDBResult } from '~/src/cdb'
import { getLcxResult } from '~/src/lcx'
import { getPoupancaResult } from '~/src/poupanca'
import { getPrefixadoCdbResult, getPrefixadoLcxResult } from '~/src/prefixado'
import { PeriodTypes, useInvestmentStore } from '~/stores/investment'

const investment = useInvestmentStore()

const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365,
}

const resultCDB = computed(() => {
  return getCDBResult(
    investment.amount,
    investment.di,
    investment.cdb,
    getDurationInDays(),
  )
})

const resultLcx = computed(() => {
  return getLcxResult(
    investment.amount,
    investment.di,
    investment.lcx,
    getDurationInDays(),
  )
})

const resultPoupanca = computed(() => {
  return getPoupancaResult(
    investment.amount,
    investment.poupanca,
    getDurationInDays(),
  )
})

const resultCdbPre = computed(() => {
  if (!isPositiveFinite(investment.cdbPre)) {
    return null
  }

  return getPrefixadoCdbResult(
    investment.amount,
    investment.cdbPre,
    getDurationInDays(),
  )
})

const resultLcxPre = computed(() => {
  if (!isPositiveFinite(investment.lcxPre)) {
    return null
  }

  return getPrefixadoLcxResult(
    investment.amount,
    investment.lcxPre,
    getDurationInDays(),
  )
})

function getDurationInDays() {
  return Math.floor(investment.period * periodMultiplier[investment.periodType])
}

function isPositiveFinite(value: number | null): value is number {
  return value !== null && Number.isFinite(value) && value > 0
}
</script>
