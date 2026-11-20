// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
    '@nuxtjs/seo',
  ],
  ssr: true,

  devtools: { enabled: true },
  app: {
    head: {
      // No explicit titleTemplate: nuxt-seo-utils installs a function-based
      // "%s | %siteName" template. String templates from nuxt.config do not
      // resolve %s client-side under unhead v3.
      htmlAttrs: {
        lang: 'pt-BR',
      },
      meta: [
        {
          name: 'apple-mobile-web-app-title',
          content: 'Renda Fixa',
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
      script: [
        {
          type: 'module',
          src: 'https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.esm.js',
          integrity: 'sha384-ka/QOj1/87D5umY1GYq4GS0y8e8vwy0Wj0BKvxJTWpNFUIarDm645Kvr8QaxM3jy',
          crossorigin: 'anonymous',
        },
        {
          nomodule: true,
          src: 'https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.js',
          integrity: 'sha384-Y7BxOV3n1SuhJ7sIgm/VmA+gWujL0HGJ8RLKBfH8hU6O2zXCCLZ2C0v5jGM+8THd',
          crossorigin: 'anonymous',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('ion-'),
    },
  },

  site: {
    url: 'https://rendafixa.github.io',
    name: 'Calculadora de Renda Fixa',
    description: 'Calculadora de renda fixa para simular CDB, RDB, LCI, LCA, Poupança e Tesouro Direto com CDI e SELIC atualizados.',
    defaultLocale: 'pt-BR',
    // GitHub Pages serves directory-style URLs (/sobre/)
    trailingSlash: true,
  },

  // og:image per page, rendered at build time from the OgImage/Main template.
  // Wired via route rules (not defineOgImage) because the vitest nuxt
  // environment loads the app with ssr: false, where nuxt-og-image bails
  // out entirely and its composables don't exist.
  routeRules: {
    '/': {
      ogImage: {
        component: 'Main',
        props: {
          title: 'Calculadora de Renda Fixa',
          description: 'Simule CDB, LCI, LCA, Poupança e Tesouro Direto com CDI e SELIC atualizados.',
        },
      },
    },
    '/como-calcular-imposto-de-renda': {
      ogImage: {
        component: 'Main',
        props: {
          title: 'Como Calcular Imposto de Renda sobre Investimentos',
          description: 'Tabela regressiva do IR, IOF em resgates curtos e investimentos isentos, com exemplos passo a passo.',
        },
      },
    },
    '/como-calcular-juros-da-poupanca': {
      ogImage: {
        component: 'Main',
        props: {
          title: 'Como Calcular Juros da Poupança',
          description: 'Regras de remuneração da poupança: TR, Selic, data de aniversário e crédito dos rendimentos.',
        },
      },
    },
    '/sobre': {
      ogImage: {
        component: 'Main',
        props: {
          title: 'Sobre a Calculadora de Renda Fixa',
          description: 'Conheça o projeto e quem o desenvolve.',
        },
      },
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-01-16',

  vite: {
    optimizeDeps: {
      include: ['chart.js', 'vue-chartjs'],
    },
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

  // Fully static deploy (GitHub Pages): every og:image is prerendered at
  // build time, so there is no runtime rendering endpoint to protect.
  // Signing URLs with NUXT_APP_SECRET would be dead weight — disable it
  // so nuxt-og-image does not demand a secret in dev.
  ogImage: {
    security: {
      secret: false,
    },
  },
})
