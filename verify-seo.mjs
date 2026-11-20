// Verifies the SEO output of `pnpm generate` in .output/public.
// Run after generate: catches title, JSON-LD, og:image, sitemap and robots
// regressions that the vitest nuxt environment cannot assert (it loads Nuxt
// with ssr: false — see AGENTS.md, Testing).
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const distDir = process.argv[2] ?? '.output/public'
const failures = []
const checks = []

function check(name, ok, detail = '') {
  checks.push(`${ok ? '✓' : '✗'} ${name}${ok ? '' : ` — ${detail}`}`)
  if (!ok) failures.push(name)
}

function readPage(path) {
  const file = join(distDir, path)
  if (!existsSync(file)) {
    check(`file ${path} exists`, false, 'missing from generate output')
    return ''
  }
  return readFileSync(file, 'utf8')
}

const HOME_TITLE = 'Calculadora de Renda Fixa: CDB, LCI, LCA, Poupança e Tesouro Direto'
const SITE = 'https://rendafixa.github.io'
const pages = [
  { path: 'index.html', title: HOME_TITLE, schema: 'SoftwareApplication' },
  { path: 'como-calcular-imposto-de-renda/index.html', title: 'Como Calcular Imposto de Renda sobre Investimentos | Calculadora de Renda Fixa', schema: 'FAQPage' },
  { path: 'como-calcular-juros-da-poupanca/index.html', title: 'Como Calcular Juros da Poupança | Calculadora de Renda Fixa', schema: 'FAQPage' },
  { path: 'sobre/index.html', title: 'Sobre | Calculadora de Renda Fixa', schema: 'BreadcrumbList' },
]

for (const page of pages) {
  const html = readPage(page.path)
  if (!html) continue

  check(`${page.path}: exact title`, html.includes(`<title>${page.title}</title>`), `got ${html.match(/<title>[^<]*<\/title>/)?.[0] ?? 'no title'}`)
  check(`${page.path}: lang pt-BR`, html.includes('lang="pt-BR"'))
  const canonicalPath = page.path === 'index.html' ? '/' : `/${page.path.replace('index.html', '')}`
  check(`${page.path}: canonical`, html.includes(`<link rel="canonical" href="${SITE}${canonicalPath}">`))
  check(`${page.path}: og:image with rendered file`, (() => {
    const og = html.match(/<meta property="og:image" content="([^"]+)"/)
    if (!og) return false
    const ogPath = og[1].replace(SITE, '')
    return existsSync(join(distDir, ogPath))
  })(), 'og:image meta missing or PNG not rendered')
  check(`${page.path}: twitter card`, html.includes('name="twitter:card" content="summary_large_image"'))

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => m[1]).join('\n')
  check(`${page.path}: JSON-LD ${page.schema}`, jsonLd.includes(`"@type":"${page.schema}"`))
}

const sitemap = readPage('sitemap.xml')
if (sitemap) {
  for (const loc of ['/', '/como-calcular-imposto-de-renda/', '/como-calcular-juros-da-poupanca/', '/sobre/']) {
    check(`sitemap lists ${loc}`, sitemap.includes(`<loc>${SITE}${loc}</loc>`))
  }
}

const robots = readPage('robots.txt')
if (robots) {
  check('robots.txt references sitemap', robots.includes(`Sitemap: ${SITE}/sitemap.xml`))
}

console.log(checks.join('\n'))
if (failures.length > 0) {
  console.error(`\n${failures.length} SEO check(s) failed in ${distDir}`)
  process.exit(1)
}
console.log(`\nAll ${checks.length} SEO checks passed in ${distDir}`)
