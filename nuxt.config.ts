// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    'nuxt-schema-org',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
  ],

  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | Renda Fixa',
      htmlAttrs: {
        lang: 'pt',
      },
      title: 'Calculadora',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Renda Fixa',
        },
        {
          name: 'og:title',
          content: 'Calculadora Renda Fixa',
        },
        {
          name: 'og:site_name',
          content: 'Calculadora Renda Fixa',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  site: {
    url: 'https://rendafixa.github.io',
    name: 'Calculadora Renda Fixa',
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-01-16',

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    // Enable stylistic rules for formatting
    config: {
      stylistic: true, // can be an object or true for default stylistic rules
    },
    // Optionally enable integration with the dev server checker
    checker: true,
  },
})
