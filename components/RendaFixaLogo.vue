<template>
  <img
    src="images/budget.svg"
    alt="Calculadora Renda Fixa"
    title="Calculadora Renda Fixa"
    :width="width"
    :height="height"
  />
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      required: false,
      default: 64,
      validator: (value) => parseInt(value) > 0
    },
    height: {
      type: Number,
      required: false,
      default: 64,
      validator: (value) => parseInt(value) > 0
    }
  }
}
</script>
