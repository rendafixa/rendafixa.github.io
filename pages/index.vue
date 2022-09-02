<template>
  <v-row>
    <v-col cols="12" md="6">
      <InvestmentInput />
    </v-col>
    <v-col cols="12" md="6">
      <InvestmentSimulation />
    </v-col>
  </v-row>
</template>

<script>
import InvestmentInput from '~/components/InvestmentInput.vue'
import InvestmentSimulation from '~/components/InvestmentSimulation.vue'
export default {
  name: 'IndexPage',
  components: { InvestmentInput, InvestmentSimulation },
  head: {
    title: 'Calculadora Renda Fixa',
    titleTemplate: null
  }
}
</script>
