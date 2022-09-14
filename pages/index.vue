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
  data() {
    return {
      cdiFetch: null,
      selicFetch: null,
      poupancaFetch: null
    }
  },
  async fetch() {
    this.$store.commit('investment/initializeStore')
    this.poupancaFetch = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.195/dados/ultimos/1?formato=json'
    ).then((res) =>
      res.json().then(function (response) {
        return parseFloat(response[0].valor)
      })
    )
    this.cdiFetch = await fetch(
      'https://www2.cetip.com.br/ConsultarTaxaDi/ConsultarTaxaDICetip.aspx'
    ).then((res) =>
      res.json().then(function (response) {
        return parseFloat(response.taxa.replace(/[.]/g, '').replace(',', '.'))
      })
    )
    this.selicFetch = await fetch(
      'https://www.bcb.gov.br/api/servico/sitebcb/historicotaxasjuros'
    ).then((res) =>
      res.json().then(function (response) {
        return response.conteudo[0].MetaSelic
      })
    )
  },
  head: {
    title: 'Calculadora Renda Fixa',
    titleTemplate: null
  },
  watch: {
    cdiFetch(newValue, oldValue) {
      this.$store.commit('investment/setDi', newValue)
    },
    selicFetch(newValue, oldValue) {
      this.$store.commit('investment/setSelic', newValue)
    },
    poupancaFetch(newValue, oldValue) {
      this.$store.commit('investment/setPoupanca', newValue)
    }
  }
}
</script>
