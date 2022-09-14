<template>
  <v-card elevation="2">
    <v-card-title class="text-h6">Investimento</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submit">
        <AmountInput />
        <DurationInput />
        <IndexDiInput />
        <IndexSelicInput />
        <IndexCdbInput />
        <IndexLcxInput />
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import AmountInput from './investment/AmountInput.vue'
import DurationInput from './investment/DurationInput.vue'
import IndexDiInput from './investment/IndexDiInput.vue'
import IndexSelicInput from './investment/IndexSelicInput.vue'
import IndexCdbInput from './investment/IndexCdbInput.vue'
import IndexLcxInput from './investment/IndexLcxInput.vue'
export default {
  components: {
    AmountInput,
    DurationInput,
    IndexDiInput,
    IndexSelicInput,
    IndexCdbInput,
    IndexLcxInput
  }
}
</script>
