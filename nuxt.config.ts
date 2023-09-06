// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    app: {
        head: {
            titleTemplate: '%s | Renda Fixa',
            htmlAttrs: {
                lang: 'pt'
            },
            title: 'Calculadora',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    hid: 'apple-mobile-web-app-title',
                    name: 'apple-mobile-web-app-title',
                    content: 'Renda Fixa'
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    content: 'Calculadora Renda Fixa'
                },
                {
                    hid: 'og:site_name',
                    name: 'og:site_name',
                    content: 'Calculadora Renda Fixa'
                },
                { name: 'format-detection', content: 'telephone=no' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                {
                    rel: 'apple-touch-icon',
                    sizes: '180x180',
                    href: '/apple-touch-icon.png'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: '/favicon-32x32.png'
                },
                {
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16',
                    href: '/favicon-16x16.png'
                },
                { rel: 'manifest', href: '/site.webmanifest' }
            ]
        },
        pageTransition: { name: 'page', mode: 'out-in' }
    },
    modules: [
        '@invictus.codes/nuxt-vuetify',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],
    extends: [
        'nuxt-seo-kit'
    ],
    runtimeConfig: {
        public: {
          siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://rendafixa.github.io',
          siteName: 'Calculadora Renda Fixa',
          siteDescription: 'Calculadora de investimentos Renda Fixa para simulação de ' +
          'rentabilidade em CDB, RDB, LC, LCI, LCA, Poupança e Tesouro Direto',
          language: 'pt'
        }
      },
    devtools: { enabled: true },
    piniaPersistedstate: {
        storage: 'localStorage'
    },
    vuetify: {
        vuetifyOptions: {
        },
        moduleOptions: {
            treeshaking: true,
            useIconCDN: true,

            /* vite-plugin-vuetify options */
            styles: true,
            autoImport: true,
            useVuetifyLabs: false
        }
    }
})
