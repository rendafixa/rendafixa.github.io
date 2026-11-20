import { mountPageAndSettleHead } from './seo-head'
import { describe, it, expect, beforeEach } from 'vitest'
import IndexPage from '~/pages/index.vue'

describe('SEO head — home page', () => {
  beforeEach(async () => {
    await mountPageAndSettleHead(IndexPage)
  })

  // NOTE: full title composition is verified by `pnpm verify:seo` against
  // the generated HTML, the ground truth crawlers see. The vitest nuxt
  // environment loads the app with ssr: false, where unhead does not
  // reliably resolve document.title.

  it('describes the calculator with the target phrase', () => {
    const description = document.head.querySelector('meta[name="description"]')
    expect(description?.getAttribute('content')).toMatch(/calculadora de renda fixa/i)
  })

  it('shares an open graph title with a property attribute', () => {
    const ogTitle = document.head.querySelector('meta[property="og:title"]')
    expect(ogTitle?.getAttribute('content')).toContain('Calculadora de Renda Fixa')
  })
  // NOTE: the JSON-LD graph is verified by `pnpm verify:seo` instead: the
  // vitest harness loads Nuxt with ssr: false, where nuxt-schema-org's
  // client plugin cannot push the graph.
})
