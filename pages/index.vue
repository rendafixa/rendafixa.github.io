<template>
  <v-row>
    <v-col cols="12" sm="5" md="4">
      <InvestmentInput />
    </v-col>
    <v-col cols="12" sm="7" md="8">
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
  fetch() {
    this.$store.commit('investment/initializeStore')
    this.$store.dispatch('investment/fetchPoupanca')
    this.$store.dispatch('investment/fetchDi')
    this.$store.dispatch('investment/fetchSelic')
  },
  head: {
    title: 'Calculadora Renda Fixa',
    titleTemplate: null
  }
}
</script>
