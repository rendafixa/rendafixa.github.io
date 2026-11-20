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
  const content = readFileSync(file, 'utf8')
  if (!content.trim()) {
    check(`file ${path} non-empty`, false, 'exists but is empty')
  }
  return content
}

const HOME_TITLE = 'Calculadora de Renda Fixa: CDB, LCI, LCA, Poupança e Tesouro Direto'
const SITE = 'https://rendafixa.github.io'
const pages = [
  { path: 'index.html', title: HOME_TITLE, schema: 'SoftwareApplication', h1: HOME_TITLE },
  { path: 'como-calcular-imposto-de-renda/index.html', title: 'Como Calcular Imposto de Renda sobre Investimentos | Calculadora de Renda Fixa', schema: 'FAQPage', h1: 'Como calcular o Imposto de Renda sobre investimentos' },
  { path: 'como-calcular-juros-da-poupanca/index.html', title: 'Como Calcular Juros da Poupança | Calculadora de Renda Fixa', schema: 'FAQPage', h1: 'Como calcular juros da Poupança' },
  { path: 'sobre/index.html', title: 'Sobre | Calculadora de Renda Fixa', schema: 'BreadcrumbList', h1: 'Sobre este projeto' },
]

for (const page of pages) {
  const html = readPage(page.path)
  if (!html) continue

  check(`${page.path}: exact title`, html.includes(`<title>${page.title}</title>`), `got ${html.match(/<title>[^<]*<\/title>/)?.[0] ?? 'no title'}`)
  check(`${page.path}: lang pt-BR`, html.includes('lang="pt-BR"'))

  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
  const h1Text = h1Matches.map(([, inner]) => inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  check(`${page.path}: exactly one h1`, h1Matches.length === 1, `found ${h1Matches.length}`)
  check(`${page.path}: h1 is the page topic`, h1Text[0] === page.h1, `got "${h1Text[0] ?? 'none'}", want "${page.h1}"`)

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

  if (page.schema === 'FAQPage') {
    // Structured data must describe content the user can actually see:
    // every JSON-LD question must appear as visible text in the page.
    // Compare against markup with scripts (including the JSON-LD itself),
    // styles and comments stripped, so the check cannot be satisfied by
    // the structured data alone.
    const visible = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
    const questions = [...jsonLd.matchAll(/"@type":"Question","name":"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replaceAll('\\', ''))
    for (const question of questions) {
      check(`${page.path}: FAQ question visible on page`, visible.includes(question), `"${question}" in JSON-LD but not in page markup`)
    }
  }

  if (jsonLd.includes('"@type":"BreadcrumbList"')) {
    // Same visibility rule as the FAQ check: every breadcrumb name in the
    // JSON-LD must appear as visible text somewhere in the page markup.
    const visible = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
    const crumbs = [...jsonLd.matchAll(/"@type":"ListItem","name":"((?:[^"\\]|\\.)*)"/g)].map(m => m[1].replaceAll('\\', ''))
    for (const crumb of crumbs) {
      check(`${page.path}: breadcrumb "${crumb}" visible on page`, visible.includes(crumb), `"${crumb}" in JSON-LD but not in page markup`)
    }
  }
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
