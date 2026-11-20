import { mountPageAndSettleHead } from './seo-head'
import { describe, it, expect, beforeEach } from 'vitest'
import SobrePage from '~/pages/sobre.vue'

describe('SEO head — sobre', () => {
  beforeEach(async () => {
    await mountPageAndSettleHead(SobrePage)
  })

  // NOTE: full title composition is verified by `pnpm verify:seo`. See
  // SeoHome.test.ts for why document.title is unreliable in the vitest
  // nuxt environment (ssr: false harness).

  it('describes the project', () => {
    const description = document.head.querySelector('meta[name="description"]')
    expect(description?.getAttribute('content')).toContain('projeto')
  })

  it('shares an open graph title with a property attribute', () => {
    const ogTitle = document.head.querySelector('meta[property="og:title"]')
    expect(ogTitle?.getAttribute('content')).toContain('Sobre')
  })
})
