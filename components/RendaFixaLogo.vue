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
      type: String,
      required: false,
      default: '64'
    },
    height: {
      type: String,
      required: false,
      default: '64'
    }
  }
}
</script>
