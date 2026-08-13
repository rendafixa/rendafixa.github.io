import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default async function defineVitestConfig() {
  return defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text-summary', 'lcov', 'html'],
        reportsDirectory: 'coverage',
        all: true,
        include: [
          'app/src/**/*.ts',
          'app/stores/**/*.ts',
          'app/composables/**/*.ts',
          'app/workers/**/*.ts',
          'app/components/calculator/**/*.vue',
          'app/components/education/**/*.vue',
          'app/components/NavigationBar.vue',
          'app/pages/index.vue',
          'scripts/market-data/**/*.mjs',
          'update-indexes.mjs',
        ],
        exclude: [
          'app/src/contracts/**',
          'app/assets/**',
          'test/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/node_modules/**',
          '**/coverage/**',
        ],
        thresholds: {
          statements: 88,
          branches: 81,
          functions: 88,
          lines: 91,
        },
      },
      projects: [
        {
          test: {
            name: 'unit',
            include: ['test/{e2e,unit}/**/*.{test,spec}.ts'],
            environment: 'node',
          },
        },
        await defineVitestProject({
          test: {
            name: 'nuxt',
            include: ['test/nuxt/*.{test,spec}.ts'],
            environment: 'nuxt',
          },
        }),
      ],
    },
  })
}
