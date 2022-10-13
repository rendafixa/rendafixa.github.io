<template>
  <div>
    <h1 class="text-h5 pb-5">{{ indicador.title }}</h1>
    <p>{{ indicador.description }}</p>
  </div>
</template>
<script>
import indicadores from 'assets/indicadores.json'

export default {
  name: 'IndicadorPage',
  asyncData(context) {
    const indicador = indicadores[context.route.params.name]
    if (undefined === indicador) {
      context.error({
        statusCode: 404,
        message: 'Indicador não encontrado'
      })
    }
    return { indicador }
  },
  head() {
    return {
      title: 'Indicador de ' + this.indicador.title,
      meta: [
        {
          hid: 'description',
          name: `Indicador ${this.indicador.title} - Calculadora Renda Fixa`,
          content: `${this.indicador.description}`
        }
      ]
    }
  }
}
</script>
