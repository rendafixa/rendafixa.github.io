import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { runChecks, visibleMarkup } from '../../verify-seo.mjs'

const FAQ_PAGE = 'como-calcular-imposto-de-renda/index.html'

function jsonLdPage(body: string, question: string): string {
  const jsonLd = JSON.stringify({
    '@type': 'FAQPage',
    'mainEntity': [{ '@type': 'Question', 'name': question }],
  })
  return `<!DOCTYPE html><html lang="pt-BR"><head><title>fixture</title></head><body>${body}<script type="application/ld+json">${jsonLd}</script></body></html>`
}

describe('visibleMarkup', () => {
  it('keeps body text nodes', () => {
    expect(visibleMarkup('<html><body><h4>Como a poupança é remunerada?</h4></body></html>'))
      .toContain('Como a poupança é remunerada?')
  })

  it('rejects a name that appears only in an attribute', () => {
    const html = '<html><body><div aria-label="Como a poupança é remunerada?" title="Como a poupança é remunerada?"></div></body></html>'
    expect(visibleMarkup(html)).not.toContain('Como a poupança é remunerada?')
  })

  it('rejects a name that appears only in head metadata', () => {
    const html = '<html><head><title>Nome apenas no título</title><meta name="description" content="Nome apenas na descrição"></head><body><p>oi</p></body></html>'
    expect(visibleMarkup(html)).not.toContain('Nome apenas no título')
    expect(visibleMarkup(html)).not.toContain('Nome apenas na descrição')
  })

  it('rejects a name that appears only in JSON-LD', () => {
    const html = '<html><body><script type="application/ld+json">{"name":"Nome apenas no JSON-LD"}</script><p>oi</p></body></html>'
    expect(visibleMarkup(html)).not.toContain('Nome apenas no JSON-LD')
  })

  it('rejects a name that appears only in a comment', () => {
    const html = '<html><body><!-- Nome apenas no comentário --><p>oi</p></body></html>'
    expect(visibleMarkup(html)).not.toContain('Nome apenas no comentário')
  })

  it('matches a phrase split by inline tags', () => {
    const html = '<html><body><p>Como <em>calcular</em> juros</p></body></html>'
    expect(visibleMarkup(html)).toContain('Como calcular juros')
  })

  it('decodes entities in visible text', () => {
    const html = '<html><body><p>Renda &amp; Fixa</p></body></html>'
    expect(visibleMarkup(html)).toBe('Renda & Fixa')
  })
})

describe('runChecks visibility assertions', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-seo-test-'))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  function writeFaqPage(body: string, question: string) {
    const file = path.join(tmpDir, FAQ_PAGE)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, jsonLdPage(body, question))
  }

  it('fails the FAQ visibility check when the name appears only in an attribute', () => {
    const question = 'Como a poupança é remunerada?'
    writeFaqPage(`<div aria-label="${question}"></div>`, question)

    const { failures } = runChecks(tmpDir)

    expect(failures).toContain(`${FAQ_PAGE}: FAQ question visible on page`)
  })

  it('passes the FAQ visibility check when the name appears as visible text', () => {
    const question = 'Como a poupança é remunerada?'
    writeFaqPage(`<h4>${question}</h4>`, question)

    const { failures } = runChecks(tmpDir)

    expect(failures).not.toContain(`${FAQ_PAGE}: FAQ question visible on page`)
  })
})
