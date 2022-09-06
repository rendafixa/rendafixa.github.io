<template>
  <v-card elevation="2" class="mb-2">
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text>
      <div v-if="!!beforeTaxAmount">Valor Bruto: R$ {{ beforeTaxAmount }}</div>
      <div v-if="!!taxAmount">
        Imposto de Renda: R$ {{ taxAmount.toFixed(2) }}
      </div>
      <div v-if="!!taxPercentage">
        Imposto de Renda: {{ taxPercentage.toFixed(2) }}%
      </div>
      <div>Valor Líquido: R$ {{ amount.toFixed(2) }}</div>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      validator: (content) => !!content
    },
    amount: {
      type: Number,
      required: true,
      validator: (value) => parseInt(value) > 0
    },
    beforeTaxAmount: {
      type: String,
      required: false,
      default: null
      // validator: (value: Number) => parseInt(value) > 0
    },
    taxAmount: {
      type: Number,
      required: false,
      default: null,
      validator: (value) => parseInt(value) > 0
    },
    taxPercentage: {
      type: Number,
      required: false,
      default: null,
      validator: (value) => parseInt(value) > 0
    }
  }
}
</script>
