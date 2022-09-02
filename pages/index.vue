<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <RendaFixaLogo />
      <!-- <v-card class="logo py-4 d-flex justify-center">
        <RendaFixaLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline">
          Some headline
        </v-card-title>
        <v-card-text>
          Here you are
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/sobre"> Continue </v-btn>
        </v-card-actions>
      </v-card> -->
    </v-col>
  </v-row>
</template>

<script>
import RendaFixaLogo from '~/components/RendaFixaLogo.vue'
export default {
  name: 'IndexPage',
  components: { RendaFixaLogo }
}
</script>
