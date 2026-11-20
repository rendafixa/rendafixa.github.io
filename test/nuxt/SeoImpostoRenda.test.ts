import { mountPageAndSettleHead } from './seo-head'
import { describe, it, expect, beforeEach } from 'vitest'
import ImpostoDeRendaPage from '~/pages/como-calcular-imposto-de-renda.vue'

describe('SEO head — como-calcular-imposto-de-renda', () => {
  beforeEach(async () => {
    await mountPageAndSettleHead(ImpostoDeRendaPage)
  })

  // NOTE: full title composition is verified by `pnpm verify:seo`. See
  // SeoHome.test.ts for why document.title is unreliable in the vitest
  // nuxt environment (ssr: false harness).

  it('describes the IR guide content', () => {
    const description = document.head.querySelector('meta[name="description"]')
    expect(description?.getAttribute('content')).toContain('IR')
  })

  it('shares an open graph title with a property attribute', () => {
    const ogTitle = document.head.querySelector('meta[property="og:title"]')
    expect(ogTitle?.getAttribute('content')).toContain('Como Calcular Imposto de Renda')
  })
  // NOTE: the FAQPage graph is verified by `pnpm verify:seo` instead: the
  // vitest harness loads Nuxt with ssr: false, where nuxt-schema-org's
  // client plugin cannot push the graph.
})
