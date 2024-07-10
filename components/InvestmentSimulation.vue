<template>
  <div class="ma-10">
    <v-row>
      <v-col cols="12" lg="7">
        <div class="pb-3">
          <!-- Antigo -->
          <InvestmentResult
            name="Poupança"
            :amount="investment.amount"
            :interest-amount="resultPoupanca.interestAmount"
            :loading="!investment.poupanca"
          />
        </div>
        <div class="pb-3">
          <InvestmentResult
            name="CDB / RDB"
            :amount="investment.amount"
            :interest-amount="resultCDB.interestAmount"
            :tax-amount="resultCDB.taxAmount"
            :tax-percentage="resultCDB.taxPercentage"
            :loading="!investment.di"
            :iof-amount="resultCDB.iofAmount"
          />
        </div>
        <div class="pb-3">
          <InvestmentResult
            name="LCI / LCA"
            :amount="investment.amount"
            :interest-amount="resultLcx.interestAmount"
            :loading="!investment.di"
          />
        </div>
      </v-col>
      <v-col cols="12" lg="5">
        <!-- Novo -->
        <InvestmentChart />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import InvestmentResult from "~/components/InvestmentResult.vue";
import InvestmentChart from "~/components/InvestmentChart.vue";
import { computed } from "vue";
import { getCDBResult } from "~/src/cdb";
import { getLcxResult } from "~/src/lcx";
import { getPoupancaResult } from "~/src/poupanca";
import { PeriodTypes, useInvestmentStore } from "~/store/investment";

const investment = useInvestmentStore();

const periodMultiplier = {
  [PeriodTypes.Days]: 1,
  [PeriodTypes.Months]: 365 / 12,
  [PeriodTypes.Years]: 365,
};

const resultCDB = computed(() => {
  return getCDBResult(
    investment.amount,
    investment.di,
    investment.cdb,
    getDurationInDays()
  );
});

const resultLcx = computed(() => {
  return getLcxResult(
    investment.amount,
    investment.di,
    investment.lcx,
    getDurationInDays()
  );
});

const resultPoupanca = computed(() => {
  return getPoupancaResult(
    investment.amount,
    investment.poupanca,
    getDurationInDays()
  );
});

function getDurationInDays() {
  return Math.floor(
    investment.period * periodMultiplier[investment.periodType]
  );
}
</script>
