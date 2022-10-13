<template>
  <v-app>
    <v-app-bar app>
      <RendaFixaLogo width="54" height="54" />
      <v-app-bar-title
        shrink-on-scroll
        class="pl-2 text-no-wrap d-none d-sm-flex"
        >Calculadora Renda Fixa</v-app-bar-title
      >
      <v-spacer />
      <NavigationBar />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <Nuxt keep-alive />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import RendaFixaLogo from '~/components/RendaFixaLogo.vue'
import NavigationBar from '~/components/NavigationBar.vue'
export default {
  name: 'DefaultLayout',
  components: { RendaFixaLogo, NavigationBar },
  data() {
    return {
      title: ''
    }
  }
}
</script>
