<template>
  <v-card elevation="2">
    <v-card-title class="text-h6">Investimento</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="investment.amount"
          type="number"
          label="Valor da Aplicação"
          prepend-icon="mdi-cash-multiple"
          prefix="R$"
          suffix=",00"
          min="1"
          :rules="[rules.required, rules.positive]"
        >
        </v-text-field>
        <v-text-field
          v-model="investment.duration"
          type="number"
          label="Vencimento"
          prepend-icon="mdi-calendar"
          suffix="meses"
          min="1"
          :rules="[rules.required, rules.positive]"
        >
        </v-text-field>
        <v-text-field
          v-model="investment.di"
          type="number"
          label="Taxa DI"
          prepend-icon="mdi-finance"
          suffix="% ao ano"
          min="0"
          :rules="[rules.required, rules.positive]"
        >
        </v-text-field>
        <v-text-field
          v-model="investment.selic"
          type="number"
          label="Taxa SELIC"
          prepend-icon="mdi-finance"
          suffix="% ao ano"
          min="0"
          :rules="[rules.required, rules.positive]"
        >
        </v-text-field>
        <v-text-field
          v-model="investment.cdb"
          type="number"
          label="CDB/RDB/LC"
          prepend-icon="mdi-finance"
          suffix="% DI"
          min="0"
          :rules="[rules.required, rules.positive]"
        >
        </v-text-field>
        <v-text-field
          v-model="investment.lcx"
          type="number"
          label="LCI/LCA"
          prepend-icon="mdi-finance"
          suffix="% DI"
          min="0"
          :rules="[rules.required, rules.positive]"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      investment: this.$store.state.investment,
      rules: {
        required: (value) => !!value || 'Obrigatório',
        positive: (value) =>
          parseInt(value) > 0 || 'Deve ser um número positivo'
      }
    }
  }
}
</script>
