// Attach the Telegram account to the account the coach just signed in with (email + password inside the Mini App),
// so next time the Mini App signs them straight into it.
// POST { initData } with Authorization: Bearer <supabase access token>.
import { config, json, verifyInitData, userOf, saveTgUser, bearer } from './_lib.js'

export async function onRequestPost({ request, env }) {
  const cfg = config(env)
  if (cfg.missing.length) return json({ error: 'not_configured' }, 503)
  const body = await request.json().catch(() => ({}))
  const user = await verifyInitData(body.initData, cfg.token)
  if (!user) return json({ error: 'bad_init_data' }, 401)
  const me = await userOf(cfg, bearer(request))
  if (!me) return json({ error: 'not_signed_in' }, 401)
  const r = await saveTgUser(cfg, user, { user_id: me.id })
  return r.ok ? json({ ok: true }) : json({ error: 'save_failed' }, 502)
}
