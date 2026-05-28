import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  apiClient,
  fetchDi,
  fetchPoupanca,
  fetchSelic,
  fetchWithRetry,
  updateIndicadores,
  URLS,
} from '../../update-indexes.mjs'

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('fetchWithRetry', () => {
  it('returns response on first success', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: 'ok' })

    const result = await fetchWithRetry('http://example.com')

    expect(result).toEqual({ data: 'ok' })
    expect(apiClient.get).toHaveBeenCalledTimes(1)
  })

  it('retries on 5xx and succeeds', async () => {
    vi.spyOn(apiClient, 'get')
      .mockRejectedValueOnce({ response: { status: 502 }, message: 'Bad Gateway' })
      .mockResolvedValueOnce({ data: 'ok' })

    const result = await fetchWithRetry('http://example.com', 3, 1)

    expect(result).toEqual({ data: 'ok' })
    expect(apiClient.get).toHaveBeenCalledTimes(2)
  })

  it('retries on network error (no response)', async () => {
    vi.spyOn(apiClient, 'get')
      .mockRejectedValueOnce({ message: 'ECONNRESET' })
      .mockResolvedValueOnce({ data: 'ok' })

    const result = await fetchWithRetry('http://example.com', 3, 1)

    expect(result).toEqual({ data: 'ok' })
    expect(apiClient.get).toHaveBeenCalledTimes(2)
  })

  it('does not retry on 4xx error', async () => {
    const error = { response: { status: 404 }, message: 'Not Found' }
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce(error)

    await expect(fetchWithRetry('http://example.com', 3, 1)).rejects.toEqual(error)
    expect(apiClient.get).toHaveBeenCalledTimes(1)
  })

  it('throws after exhausting retries', async () => {
    const error = { response: { status: 500 }, message: 'Internal Server Error' }
    vi.spyOn(apiClient, 'get')
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error)

    await expect(fetchWithRetry('http://example.com', 3, 1)).rejects.toEqual(error)
    expect(apiClient.get).toHaveBeenCalledTimes(3)
  })
})

describe('fetchPoupanca', () => {
  it('returns parsed value on success', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [{ data: '15/05/2026', valor: '0.6737' }],
    })

    const result = await fetchPoupanca()

    expect(result).toBe(0.6737)
  })

  it('returns null when API returns empty array', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: [] })

    const result = await fetchPoupanca()

    expect(result).toBeNull()
  })

  it('returns null when valor is missing', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [{ data: '15/05/2026' }],
    })

    const result = await fetchPoupanca()

    expect(result).toBeNull()
  })

  it('returns null on network error', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue({ message: 'ECONNREFUSED' })

    const result = await fetchPoupanca()

    expect(result).toBeNull()
  })
})

describe('fetchDi', () => {
  it('returns parsed value on success', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: [{ data: '15/05/2026', valor: '14.40' }],
    })

    const result = await fetchDi()

    expect(result).toBe(14.4)
  })

  it('returns null on error', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue({ message: 'timeout' })

    const result = await fetchDi()

    expect(result).toBeNull()
  })
})

describe('fetchSelic', () => {
  it('returns MetaSelic value on success', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { conteudo: [{ MetaSelic: 14.5 }] },
    })

    const result = await fetchSelic()

    expect(result).toBe(14.5)
  })

  it('returns null on invalid response shape', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { conteudo: [] },
    })

    const result = await fetchSelic()

    expect(result).toBeNull()
  })

  it('returns null on network error', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue({ message: 'ECONNREFUSED' })

    const result = await fetchSelic()

    expect(result).toBeNull()
  })
})

describe('updateIndicadores', () => {
  let tmpDir: string
  let tmpFile: string

  const baseIndicadores = {
    poupanca: { title: 'Poupanca', value: 0.5 },
    selic: { title: 'SELIC', value: 10.0 },
    cdi: { title: 'CDI', value: 10.0 },
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'update-indexes-test-'))
    tmpFile = path.join(tmpDir, 'indicadores.json')
    fs.writeFileSync(tmpFile, JSON.stringify(baseIndicadores, null, 2))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it('updates all values when all APIs succeed', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
      if (url === URLS.poupanca) {
        return Promise.resolve({ data: [{ valor: '0.6737' }] })
      }
      if (url === URLS.selic) {
        return Promise.resolve({ data: { conteudo: [{ MetaSelic: 14.5 }] } })
      }
      if (url === URLS.cdi) {
        return Promise.resolve({ data: [{ valor: '14.40' }] })
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`))
    })

    await updateIndicadores(tmpFile)

    const result = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'))
    expect(result.poupanca.value).toBe(0.6737)
    expect(result.selic.value).toBe(14.5)
    expect(result.cdi.value).toBe(14.4)
  })

  it('updates partial values when some APIs fail', async () => {
    vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
      if (url === URLS.poupanca) {
        return Promise.reject({ response: { status: 502 }, message: 'Bad Gateway' })
      }
      if (url === URLS.selic) {
        return Promise.resolve({ data: { conteudo: [{ MetaSelic: 14.5 }] } })
      }
      if (url === URLS.cdi) {
        return Promise.resolve({ data: [{ valor: '14.40' }] })
      }
      return Promise.reject(new Error(`Unexpected URL: ${url}`))
    })

    await updateIndicadores(tmpFile)

    const result = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'))
    expect(result.poupanca.value).toBe(0.5) // unchanged
    expect(result.selic.value).toBe(14.5)
    expect(result.cdi.value).toBe(14.4)
  })

  it('throws when all APIs fail', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue({ message: 'ECONNREFUSED' })

    await expect(updateIndicadores(tmpFile)).rejects.toThrow('All API calls failed')

    const result = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'))
    expect(result).toEqual(baseIndicadores) // unchanged
  })

  it('throws on missing file', async () => {
    await expect(updateIndicadores('/nonexistent/path.json')).rejects.toThrow()
  })
})
