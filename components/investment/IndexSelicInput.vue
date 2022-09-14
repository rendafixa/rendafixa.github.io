<template>
  <v-text-field
    v-model.number="selic"
    type="number"
    label="Taxa SELIC"
    prepend-icon="mdi-finance"
    suffix="% ao ano"
    min="0"
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
    selic: {
      get() {
        return this.$store.state.investment.selic
      },
      set(value) {
        if (value > 0) {
          this.$store.commit('investment/setSelic', value)
        }
      }
    }
  }
}
</script>
