<template>
  <v-text-field
    v-model.number="amount"
    type="number"
    label="Valor da Aplicação"
    prepend-icon="mdi-cash-multiple"
    prefix="R$"
    suffix=",00"
    min="1"
    :rules="[rules.required, rules.positive]"
  >
  </v-text-field>
</template>
<script>
export default {
  data() {
    return {
      rules: {
        required: (value) => !!value || 'Obrigatório',
        positive: (value) =>
          parseInt(value) > 0 || 'Deve ser um número positivo'
      }
    }
  },
  computed: {
    amount: {
      get() {
        return this.$store.state.investment.amount
      },
      set(value) {
        if (value > 0) {
          this.$store.commit('investment/setAmount', value)
        }
      }
    }
  }
}
</script>
