<template>
  <v-card elevation="2" class="mb-2">
    <v-card-title>{{ name }}</v-card-title>
    <v-card-text>
      <div v-if="!!amount">Valor Investido: R$ {{ amount.toFixed(2) }}</div>
      <div v-if="!!interestAmount">
        Valor Bruto: R$ {{ interestAmount.toFixed(2) }}
      </div>
      <div v-if="!!taxAmount">
        Impostos: R$ {{ taxAmount.toFixed(2) }}
        <span v-if="!!taxPercentage">{{ taxPercentage.toFixed(2) }}%</span>
      </div>
      <div>Valor Total Líquido: R$ {{ totalAmount.toFixed(2) }}</div>
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
    interestAmount: {
      type: Number,
      required: true,
      validator: (value) => parseInt(value) > 0
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
  },
  computed: {
    totalAmount() {
      return this.amount + this.interestAmount - this.taxAmount
    }
  }
}
</script>
