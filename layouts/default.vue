<template>
  <v-app>
    <v-app-bar app>
      <RendaFixaLogo width="54" height="54" />
      <h1 class="pl-4">Calculadora Renda Fixa</h1>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import RendaFixaLogo from '~/components/RendaFixaLogo.vue'
export default {
  name: 'DefaultLayout',
  components: { RendaFixaLogo },
  data() {
    return {
      title: ''
    }
  }
}
</script>
