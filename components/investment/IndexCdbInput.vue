<template>
  <v-text-field
    v-model.number="cdb"
    type="number"
    label="CDB/RDB/LC"
    prepend-icon="mdi-finance"
    suffix="% DI"
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
    cdb: {
      get() {
        return this.$store.state.investment.cdb
      },
      set(value) {
        if (value > 0) {
          this.$store.commit('investment/setCdb', value)
        }
      }
    }
  }
}
</script>
