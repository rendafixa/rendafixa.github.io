<template>
  <v-text-field
    v-model.number="lcx"
    type="number"
    label="LCI/LCA"
    prepend-icon="mdi-finance"
    suffix="% DI"
    min="0"
    :rules="[rules.required, rules.positive]"
  ></v-text-field>
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
    lcx: {
      get() {
        return this.$store.state.investment.lcx
      },
      set(value) {
        if (value > 0) {
          this.$store.commit('investment/setLcx', value)
        }
      }
    }
  }
}
</script>
