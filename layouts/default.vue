<template>
  <v-app>
    <v-app-bar app><RendaFixaLogo width="60" height="60" /></v-app-bar>
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
