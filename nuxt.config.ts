// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s | Renda Fixa',
      htmlAttrs: {
        lang: 'pt'
      },
      title: 'Calculadora',
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
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
        {name: 'format-detection', content: 'telephone=no'}
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
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
        {rel: 'manifest', href: '/site.webmanifest'}
      ]
    },
    pageTransition: {name: 'page', mode: 'out-in'}
  },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-schema-org',
    '@nuxt/test-utils/module',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  devtools: {enabled: true},

  piniaPersistedstate: {
    storage: 'localStorage'
  },

  seo: {
    redirectToCanonicalSiteUrl: true
  },

  site: {
    url: 'https://rendafixa.github.io',
    name: 'Calculadora Renda Fixa'
  },

  compatibilityDate: '2025-01-16',
})

