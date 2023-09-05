<template>
  <v-select
    v-model="durationType"
    label="Tipo de período"
    :items="durationTypeOptions"
    density="compact"
  ></v-select>
</template>
<script>
export default {
  computed: {
    durationTypeOptions: {
      get() {
        return this.$store.state.investment.durationTypeOptions
      }
    },
    durationType: {
      get() {
        return this.$store.state.investment.durationType
      },
      set(value) {
        this.$store.commit('investment/setDurationType', value)
      }
    }
  }
}
</script>
