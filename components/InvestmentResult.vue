<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      loading
      type="card-heading, text@6"
      class="mb-5"
      tile
      elevation="2"
    ></v-skeleton-loader>
    <v-card v-if="!loading" elevation="2" class="mb-2">
      <v-card-title>{{ name }}</v-card-title>
      <v-card-text>
        <div v-if="!!amount">Valor Investido: {{ amount | currency }}</div>
        <div v-if="!!interestAmount">
          Valor Bruto: {{ interestAmount | currency }}
        </div>
        <div v-if="!!taxAmount">
          Impostos: {{ taxAmount | currency }}
          <v-badge
            v-if="!!taxPercentage"
            :content="taxPercentage | percent"
            class="pl-1"
            color="red lighten-2"
          />
        </div>
        <div>Valor Total Líquido: {{ totalAmount | currency }}</div>
        <v-progress-linear
          v-model="totalProfitPercentage"
          :color="color"
          height="25"
          >{{ totalProfitPercentage | percent }}</v-progress-linear
        >
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  filters: {
    percent(amount) {
      return amount.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + '%'
    },
    number(amount) {
      return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    },
    currency(amount) {
      return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2
      })
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
      required: false
    },
    name: {
      type: String,
      required: true,
      validator: (content) => !!content
    },
    amount: {
      type: Number,
      required: true,
      validator: (value) => parseFloat(value) > 0
    },
    interestAmount: {
      type: Number,
      required: true
      // validator: (value) => parseInt(value) > 0
    },
    taxAmount: {
      type: Number,
      required: false,
      default: null
      // validator: (value) => parseInt(value) > 0
    },
    taxPercentage: {
      type: Number,
      required: false,
      default: null,
      validator: (value) => parseInt(value) > 0
    },
    color: {
      type: String,
      required: false,
      default: 'amber'
    }
  },
  computed: {
    totalProfit() {
      return this.interestAmount - this.taxAmount
    },
    totalAmount() {
      return this.amount + this.totalProfit
    },
    totalProfitPercentage() {
      return (this.totalProfit / this.amount) * 100
    }
  }
}
</script>
