// Verifies the SEO output of `pnpm generate` in .output/public.
// Run after generate: catches title, JSON-LD, og:image, sitemap and robots
// regressions that the vitest nuxt environment cannot assert (it loads Nuxt
// with ssr: false — see AGENTS.md, Testing).
//
// The checks are exported so test/unit/verify-seo.spec.ts can exercise the
// visibility logic against fixtures; the script only runs when invoked
// directly (see the update-indexes.mjs precedent).
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'
import process from 'node:process'

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' ' }

function decodeEntities(text) {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (/^#x/i.test(entity)) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))
    return ENTITIES[entity.toLowerCase()] ?? match
  })
}

export function normalizeText(text) {
  return text.replace(/\s+/g, ' ').trim()
}

export function visibleMarkup(html) {
  // Rendered body text only: script (including the JSON-LD itself), style and
  // comment content is dropped, then every remaining tag is stripped so
  // attributes and head metadata cannot satisfy a visibility check. Tags
  // become spaces so a phrase split by inline markup still matches, and
  // whitespace is collapsed for the same reason.
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? ''
  return normalizeText(decodeEntities(
    body
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  ))
}

export function runChecks(distDir) {
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

  const HOME_TITLE = 'Calculadora de Renda Fixa: CDB, LCI, LCA e Tesouro Direto'
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
    check(`${page.path}: og:image dimensions`, html.includes('<meta property="og:image:width" content="1200">') && html.includes('<meta property="og:image:height" content="600">'), 'og:image:width/height 1200x600 missing (WhatsApp and other scrapers need explicit dimensions)')
    check(`${page.path}: og:image alt`, (() => {
      const alt = html.match(/<meta property="og:image:alt" content="([^"]*)"/)
      return alt !== null && alt[1].trim().length > 0
    })(), 'og:image:alt missing or empty')
    check(`${page.path}: twitter card`, html.includes('name="twitter:card" content="summary_large_image"'))

    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => m[1]).join('\n')
    check(`${page.path}: JSON-LD ${page.schema}`, jsonLd.includes(`"@type":"${page.schema}"`))

    if (page.schema === 'FAQPage') {
      // Structured data must describe content the user can actually see:
      // every JSON-LD question must appear as visible text in the page.
      const visible = visibleMarkup(html)
      const questions = [...jsonLd.matchAll(/"@type":"Question","name":"((?:[^"\\]|\\.)*)"/g)].map(m => normalizeText(m[1].replaceAll('\\', '')))
      check(`${page.path}: FAQ questions extracted`, questions.length > 0, 'no Question names found in JSON-LD — the visibility check would pass vacuously')
      for (const question of questions) {
        check(`${page.path}: FAQ question visible on page`, visible.includes(question), `"${question}" in JSON-LD but not in visible page text`)
      }
    }

    if (jsonLd.includes('"@type":"BreadcrumbList"')) {
      // Same visibility rule as the FAQ check: every breadcrumb name in the
      // JSON-LD must appear as visible text somewhere in the page markup.
      const visible = visibleMarkup(html)
      const crumbs = [...jsonLd.matchAll(/"@type":"ListItem","name":"((?:[^"\\]|\\.)*)"/g)].map(m => normalizeText(m[1].replaceAll('\\', '')))
      check(`${page.path}: breadcrumb names extracted`, crumbs.length > 0, 'no ListItem names found in JSON-LD — the visibility check would pass vacuously')
      for (const crumb of crumbs) {
        check(`${page.path}: breadcrumb "${crumb}" visible on page`, visible.includes(crumb), `"${crumb}" in JSON-LD but not in visible page text`)
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

  const notFound = readPage('404.html')
  if (notFound) {
    check('404.html declares noindex', notFound.includes('name="robots" content="noindex"'))
    check('404.html uses pt-BR', notFound.includes('lang="pt-BR"'))
    check('404.html links back to the calculator', notFound.includes('href="/"'))
  }

  return { checks, failures }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const distDir = process.argv[2] ?? '.output/public'
  const { checks, failures } = runChecks(distDir)
  console.log(checks.join('\n'))
  if (failures.length > 0) {
    console.error(`\n${failures.length} SEO check(s) failed in ${distDir}`)
    process.exit(1)
  }
  console.log(`\nAll ${checks.length} SEO checks passed in ${distDir}`)
}
