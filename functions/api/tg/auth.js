// Sign in to Pro Football with the Telegram account (inside the Mini App).
// POST { initData, create } → { token_hash, type } for supabase.auth.verifyOtp, or { linked: false }.
// The account is found through tg_users.user_id. A new one (create: true) gets a placeholder email
// that never receives mail: tg<id>@telegram.pro-football.pages.dev.
import { config, json, verifyInitData, sb, saveTgUser, getTgUser } from './_lib.js'

export const tgEmail = (id) => `tg${Number(id)}@telegram.pro-football.pages.dev`

export async function onRequestPost({ request, env }) {
  const cfg = config(env)
  if (cfg.missing.length) return json({ error: 'not_configured', missing: cfg.missing }, 503)
  const body = await request.json().catch(() => ({}))
  const user = await verifyInitData(body.initData, cfg.token)
  if (!user) return json({ error: 'bad_init_data' }, 401)

  const row = await getTgUser(cfg, user.id)
  let email = null
  if (row && row.user_id) {
    const u = await sb(cfg, `/auth/v1/admin/users/${row.user_id}`)
    if (u.ok && u.data && u.data.email) email = u.data.email
  }
  if (!email) {
    if (!body.create) {
      await saveTgUser(cfg, user, { user_id: null })
      return json({ linked: false })
    }
    email = tgEmail(user.id)
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ')
    // 422 = already exists (an earlier attempt): fine, the link below still works.
    const c = await sb(cfg, '/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email, email_confirm: true, user_metadata: { tg_id: user.id, tg_name: name, tg_username: user.username || null } }),
    })
    if (!c.ok && c.status !== 422) return json({ error: 'create_failed', detail: c.data }, 502)
  }

  const g = await sb(cfg, '/auth/v1/admin/generate_link', { method: 'POST', body: JSON.stringify({ type: 'magiclink', email }) })
  const props = (g.data && g.data.properties) || g.data || {}
  const uid = (g.data && g.data.user && g.data.user.id) || (g.data && g.data.id)
  if (!g.ok || !props.hashed_token || !uid) return json({ error: 'link_failed', detail: g.data }, 502)
  await saveTgUser(cfg, user, { user_id: uid })
  return json({ token_hash: props.hashed_token, type: props.verification_type === 'signup' ? 'signup' : 'magiclink' })
}
