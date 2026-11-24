// Shared helpers for the Telegram bot (Cloudflare Pages Functions).
//
// Secrets (Cloudflare → Workers & Pages → pro-football → Settings → Variables and Secrets):
//   TELEGRAM_BOT_TOKEN         the token from @BotFather
//   SUPABASE_SERVICE_ROLE_KEY  Supabase → Project Settings → API keys → service_role (secret)
// Already there for the build: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.
//
// Tables: supabase/telegram.sql (tg_users). Only these functions touch it, with the service key.

const enc = new TextEncoder()

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } })

export function config(env) {
  const token = env.TELEGRAM_BOT_TOKEN
  const sbUrl = (env.SUPABASE_URL || env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
  const service = env.SUPABASE_SERVICE_ROLE_KEY
  const anon = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
  const missing = [!token && 'TELEGRAM_BOT_TOKEN', !sbUrl && 'VITE_SUPABASE_URL', !service && 'SUPABASE_SERVICE_ROLE_KEY'].filter(Boolean)
  return { token, sbUrl, service, anon, missing }
}

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', typeof key === 'string' ? enc.encode(key) : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, enc.encode(data))
}

/** The secret Telegram sends back with every webhook call: derived from the token, so no extra setting. */
export async function webhookSecret(token) {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode('pf-webhook:' + token))).slice(0, 48)
}

/**
 * Check the Mini App's initData (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).
 * Returns the Telegram user, or null when the data is forged or older than maxAge seconds.
 */
export async function verifyInitData(initData, token, maxAge = 86400) {
  if (!initData || typeof initData !== 'string') return null
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null
  params.delete('hash')
  const check = [...params.entries()].map(([k, v]) => `${k}=${v}`).sort().join('\n')
  const secret = await hmac('WebAppData', token)
  const mine = hex(await hmac(secret, check))
  if (mine.length !== hash.length) return null
  let diff = 0
  for (let i = 0; i < mine.length; i++) diff |= mine.charCodeAt(i) ^ hash.charCodeAt(i)
  if (diff) return null
  const at = Number(params.get('auth_date') || 0)
  if (!at || Date.now() / 1000 - at > maxAge) return null
  try {
    const user = JSON.parse(params.get('user') || 'null')
    return user && user.id ? user : null
  } catch { return null }
}

/** Call the Bot API. Body: plain object (JSON) or FormData (files). */
export async function tg(token, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, body instanceof FormData
    ? { method: 'POST', body }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
  return r.json().catch(() => ({ ok: false, description: 'bad response' }))
}

/** Supabase REST/Auth with the service key (bypasses RLS: server only). */
export async function sb(cfg, path, init = {}) {
  const r = await fetch(cfg.sbUrl + path, {
    ...init,
    headers: { apikey: cfg.service, Authorization: `Bearer ${cfg.service}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  const text = await r.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  return { ok: r.ok, status: r.status, data }
}

/** The signed-in Supabase user behind an access token, or null. */
export async function userOf(cfg, accessToken) {
  if (!accessToken) return null
  const r = await fetch(cfg.sbUrl + '/auth/v1/user', { headers: { apikey: cfg.anon || cfg.service, Authorization: `Bearer ${accessToken}` } })
  if (!r.ok) return null
  const u = await r.json().catch(() => null)
  return u && u.id ? u : null
}

/** Is this access token an admin's? Uses the same is_admin() as the rest of the app. */
export async function isAdmin(cfg, accessToken) {
  if (!accessToken) return false
  const r = await fetch(cfg.sbUrl + '/rest/v1/rpc/is_admin', {
    method: 'POST',
    headers: { apikey: cfg.anon || cfg.service, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: '{}',
  })
  return r.ok && (await r.json().catch(() => false)) === true
}

export const langOf = (code) => (String(code || '').toLowerCase().startsWith('ru') ? 'ru' : 'uz')

/** Save (or refresh) a Telegram user. Extra fields (user_id, subscribed…) are merged in. */
export async function saveTgUser(cfg, user, extra = {}) {
  const row = {
    tg_id: user.id,
    first_name: [user.first_name, user.last_name].filter(Boolean).join(' ').slice(0, 120) || null,
    username: user.username || null,
    lang: langOf(user.language_code),
    updated_at: new Date().toISOString(),
    ...extra,
  }
  return sb(cfg, '/rest/v1/tg_users?on_conflict=tg_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  })
}

export async function getTgUser(cfg, tgId) {
  const r = await sb(cfg, `/rest/v1/tg_users?tg_id=eq.${Number(tgId)}&select=*`)
  return r.ok && Array.isArray(r.data) ? r.data[0] || null : null
}

/** The bearer token of a request. */
export const bearer = (request) => (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '') || null
