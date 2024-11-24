import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '../src/styles/custom.css'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
