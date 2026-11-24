// An account made in the Telegram bot has a placeholder email and no password.
// This adds a real email + password, so the coach can sign in on a computer too.
// POST { email, password } with Authorization: Bearer <access token>. Only for Telegram-made accounts.
import { config, json, sb, userOf, bearer } from './_lib.js'

export async function onRequestPost({ request, env }) {
  const cfg = config(env)
  if (!cfg.sbUrl || !cfg.service) return json({ error: 'not_configured' }, 503)
  const me = await userOf(cfg, bearer(request))
  if (!me) return json({ error: 'not_signed_in' }, 401)
  if (!/@telegram\.pro-football\.pages\.dev$/i.test(me.email || '')) return json({ error: 'not_telegram_account' }, 400)
  const body = await request.json().catch(() => ({}))
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@telegram\.pro-football\.pages\.dev$/.test(email)) return json({ error: 'bad_email' }, 400)
  if (password.length < 6) return json({ error: 'weak_password' }, 400)
  const r = await sb(cfg, `/auth/v1/admin/users/${me.id}`, { method: 'PUT', body: JSON.stringify({ email, password, email_confirm: true }) })
  if (r.ok) return json({ ok: true })
  const code = (r.data && (r.data.error_code || r.data.code)) || ''
  if (r.status === 422 && /exist|registered/i.test(JSON.stringify(r.data))) return json({ error: 'exists' }, 409)
  if (/weak/i.test(String(code))) return json({ error: 'weak_password' }, 400)
  return json({ error: 'failed', detail: r.data }, 502)
}
