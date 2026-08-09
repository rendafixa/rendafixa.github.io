import type { DomainResult } from '../contracts/errors'
import { shareSchema, type SharePayload } from './schema'

export const MAX_SHARE_PAYLOAD_BYTES = 12 * 1024

export function encodeSharePayload(payload: SharePayload): DomainResult<string> {
  const parsed = shareSchema.safeParse(payload)
  if (!parsed.success) return { ok: false, errors: [{ code: 'invalid-share-payload', message: 'Não foi possível compartilhar esta simulação.' }] }
  const bytes = new TextEncoder().encode(JSON.stringify(parsed.data))
  if (bytes.byteLength > MAX_SHARE_PAYLOAD_BYTES) return { ok: false, errors: [{ code: 'share-payload-too-large', message: 'A simulação excede o tamanho permitido para um link.' }] }
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return { ok: true, value: btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, ''), warnings: [] }
}

export function decodeSharePayload(value: string): DomainResult<SharePayload> {
  if (value.length > MAX_SHARE_PAYLOAD_BYTES * 2) return { ok: false, errors: [{ code: 'share-payload-too-large', message: 'O link compartilhado é grande demais.' }] }
  try {
    const padded = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
    const json = JSON.parse(new TextDecoder().decode(bytes))
    if (json?.v !== 1) return { ok: false, errors: [{ code: 'unsupported-share-version', message: 'Esta versão de link não é compatível.' }] }
    const parsed = shareSchema.safeParse(json)
    return parsed.success
      ? { ok: true, value: parsed.data, warnings: [] }
      : { ok: false, errors: [{ code: 'invalid-share-payload', message: 'O link compartilhado é inválido.' }] }
  }
  catch {
    return { ok: false, errors: [{ code: 'invalid-share-payload', message: 'O link compartilhado é inválido.' }] }
  }
}
