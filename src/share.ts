import type { Drill } from './types'

/*
 * Drill links for an assistant coach.
 *  - a book drill:        …#d=<id>
 *  - the coach's own one: …#s=<packed drill>  (the whole drill with its drawing travels in the link,
 *    deflate-compressed where the browser can, so the assistant needs no account)
 */

const b64url = (bytes: Uint8Array) => {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const unb64url = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
  const out = new Uint8Array(b.length)
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i)
  return out
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream as unknown as TransformStream<Uint8Array, Uint8Array>))
  return new Uint8Array(await res.arrayBuffer())
}
const canZip = () => typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined'

/** The link to send. */
export async function drillLink(d: Drill): Promise<string> {
  const base = location.href.split('#')[0]
  if (!d.custom) return `${base}#d=${encodeURIComponent(d.id)}`
  const { id, name, desc, equip, cat, dia, age, min, players, points, scene } = d
  const json = new TextEncoder().encode(JSON.stringify({ id, name, desc, equip, cat, dia, age, min, players, points, scene }))
  if (canZip()) {
    try { return `${base}#s=1${b64url(await pipe(json, new CompressionStream('deflate-raw')))}` } catch { /* fall back to plain */ }
  }
  return `${base}#s=0${b64url(json)}`
}

export type Shared = { kind: 'book'; id: string } | { kind: 'own'; drill: Drill } | { kind: 'bad' }

/** Read a drill link from the address (null when the address has none). */
export async function readShared(hash = location.hash): Promise<Shared | null> {
  const m = /^#(d|s)=(.+)$/.exec(hash)
  if (!m) return null
  if (m[1] === 'd') return { kind: 'book', id: decodeURIComponent(m[2]) }
  try {
    const zipped = m[2][0] === '1'
    let bytes: Uint8Array = unb64url(m[2].slice(1))
    if (zipped) bytes = await pipe(bytes, new DecompressionStream('deflate-raw'))
    const d = JSON.parse(new TextDecoder().decode(bytes)) as Drill
    if (!d || typeof d.id !== 'string' || !d.name || typeof d.name.uz !== 'string') return { kind: 'bad' }
    return { kind: 'own', drill: { ...d, custom: true, desc: d.desc ?? { uz: '', ru: '' }, equip: d.equip ?? { uz: '', ru: '' } } }
  } catch {
    return { kind: 'bad' }
  }
}

/** Remove the link part from the address once it has been opened. */
export const clearShared = () => { try { history.replaceState(null, '', location.href.split('#')[0]) } catch { /* sandboxed */ } }
