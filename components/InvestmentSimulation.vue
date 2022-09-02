<template>
  <div>
    <h2>Simulação do Investimento</h2>
    <p class="grey--text">
      Simulação da rentabilidade do seu investimento conforme o tipo de
      aplicação:
    </p>
    <InvestmentResult name="Poupança" amount="86.40" />
    <InvestmentResult name="CDB / RDB" amount="123.45" before-tax-amount="156.89" />
  </div>
</template>
<script>
import InvestmentResult from './InvestmentResult.vue'
export default {
  components: { InvestmentResult },
  data() {
    return {
      amount: 1000,
      duration: 12,
      di: 13.65,
      selic: 13.65,
      cdb: 105,
      lcx: 100,
      rules: {
        required: (value) => !!value || 'Obrigatório',
        positive: (value) =>
          parseInt(value) > 0 || 'Deve ser um número positivo'
      }
    }
  }
}
</script>
