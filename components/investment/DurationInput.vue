<template>
  <v-text-field
    v-model.number="duration"
    type="number"
    label="Vencimento"
    prepend-icon="mdi-calendar"
    min="1"
    :rules="[rules.required, rules.positive]"
  />
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
    duration: {
      get() {
        return this.$store.state.investment.duration
      },
      set(value) {
        if (value > 0) {
          this.$store.commit('investment/setDuration', value)
        }
      }
    }
  }
}
</script>
