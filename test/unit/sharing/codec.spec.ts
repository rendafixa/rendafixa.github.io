import { describe, expect, it } from 'vitest'
import { decodeSharePayload, encodeSharePayload } from '../../../app/src/sharing/codec'

const payload = { v: 1 as const, p: '10000', d: '2026-08-09', projected: true, investments: [{ id: 'one', name: 'Poupança', type: 'poupanca' as const, maturityDate: '2028-08-09', rate: { kind: 'savings' } }] }

describe('share codec', () => {
  it('round-trips Unicode JSON through Base64URL', () => {
    const encoded = encodeSharePayload(payload)
    expect(encoded.ok).toBe(true)
    if (!encoded.ok) return
    expect(encoded.value).not.toMatch(/[+/=]/)
    expect(decodeSharePayload(encoded.value)).toEqual({ ok: true, value: payload, warnings: [] })
  })

  it('rejects malformed and unsupported payloads', () => {
    expect(decodeSharePayload('not-json').ok).toBe(false)
    const unsupported = btoa(JSON.stringify({ ...payload, v: 2 })).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
    const result = decodeSharePayload(unsupported)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors[0]?.code).toBe('unsupported-share-version')
  })
})
