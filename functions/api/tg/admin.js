// Admin panel → "Telegram bot". Only for admins (checked with the same is_admin() as the rest of the app).
// POST { action: 'status' | 'setup' | 'broadcast', ... } with Authorization: Bearer <admin's access token>.
import { config, json, tg, sb, isAdmin, bearer, webhookSecret } from './_lib.js'
import { appUrl, openButton } from './webhook.js'

const BATCH = 30 // Cloudflare's free plan allows 50 outgoing requests per call

async function count(cfg, filter) {
  const r = await fetch(`${cfg.sbUrl}/rest/v1/tg_users?select=tg_id${filter}`, {
    method: 'HEAD',
    headers: { apikey: cfg.service, Authorization: `Bearer ${cfg.service}`, Prefer: 'count=exact' },
  })
  const n = Number((r.headers.get('Content-Range') || '').split('/')[1])
  return r.ok && Number.isFinite(n) ? n : null
}

export async function onRequestPost({ request, env }) {
  const cfg = config(env)
  if (!cfg.sbUrl) return json({ error: 'not_configured', missing: cfg.missing }, 503)
  if (!(await isAdmin(cfg, bearer(request)))) return json({ error: 'not_admin' }, 403)
  if (cfg.missing.length) return json({ error: 'not_configured', missing: cfg.missing })
  const body = await request.json().catch(() => ({}))
  const url = appUrl(env, request)

  if (body.action === 'status') {
    const [me, hook, total, subs, linked] = await Promise.all([
      tg(cfg.token, 'getMe'),
      tg(cfg.token, 'getWebhookInfo'),
      count(cfg, ''),
      count(cfg, '&subscribed=eq.true&blocked=eq.false'),
      count(cfg, '&user_id=not.is.null'),
    ])
    if (!me.ok) return json({ error: 'bad_token', detail: me.description })
    const want = new URL('/api/tg/webhook', url).href
    return json({
      bot: { username: me.result.username, name: me.result.first_name },
      webhook: { ok: hook.ok && hook.result.url === want, url: hook.ok ? hook.result.url : '', error: hook.ok ? hook.result.last_error_message || null : hook.description },
      users: { total, subscribed: subs, linked },
      tableMissing: total === null,
      appUrl: url,
    })
  }

  if (body.action === 'setup') {
    const steps = {}
    steps.webhook = await tg(cfg.token, 'setWebhook', {
      url: new URL('/api/tg/webhook', url).href,
      secret_token: await webhookSecret(cfg.token),
      allowed_updates: ['message', 'my_chat_member'],
    })
    const cmds = (l) => [
      { command: 'start', description: l === 'ru' ? 'Открыть приложение' : 'Ilovani ochish' },
      { command: 'help', description: l === 'ru' ? 'Помощь' : 'Yordam' },
      { command: 'stop', description: l === 'ru' ? 'Отключить уведомления' : "Xabarlarni o'chirish" },
    ]
    steps.commands = await tg(cfg.token, 'setMyCommands', { commands: cmds('uz') })
    steps.commandsRu = await tg(cfg.token, 'setMyCommands', { commands: cmds('ru'), language_code: 'ru' })
    steps.menu = await tg(cfg.token, 'setChatMenuButton', { menu_button: { type: 'web_app', text: 'Pro Football', web_app: { url } } })
    steps.desc = await tg(cfg.token, 'setMyDescription', { description: "Futbol murabbiylari uchun: kitobdagi chizma va animatsiyali 300+ mashq, tayyor mashg'ulot va mavsum rejalari, taktik doska, davomat. «Start» bosing." })
    steps.descRu = await tg(cfg.token, 'setMyDescription', { language_code: 'ru', description: 'Для футбольных тренеров: 300+ упражнений со схемами и анимацией из книг, готовые планы тренировок и сезона, тактическая доска, посещаемость. Нажмите «Старт».' })
    steps.short = await tg(cfg.token, 'setMyShortDescription', { short_description: "Futbol murabbiylari uchun mashqlar va mashg'ulot rejalari" })
    steps.shortRu = await tg(cfg.token, 'setMyShortDescription', { language_code: 'ru', short_description: 'Упражнения и планы тренировок для футбольных тренеров' })
    const failed = Object.entries(steps).filter(([, r]) => !r.ok).map(([k, r]) => `${k}: ${r.description}`)
    return json({ ok: !failed.length, failed })
  }

  if (body.action === 'broadcast') {
    const text = String(body.text || '').trim()
    if (!text || text.length > 3500) return json({ error: 'bad_text' }, 400)
    const after = Number(body.after || 0)
    const r = await sb(cfg, `/rest/v1/tg_users?select=tg_id,lang&subscribed=eq.true&blocked=eq.false&tg_id=gt.${after}&order=tg_id.asc&limit=${BATCH}`)
    if (!r.ok) return json({ error: 'read_failed', detail: r.data }, 502)
    const rows = r.data || []
    let sent = 0, failed = 0
    const gone = []
    for (const row of rows) {
      const lang = row.lang === 'ru' ? 'ru' : 'uz'
      const res = await tg(cfg.token, 'sendMessage', {
        chat_id: row.tg_id, text,
        reply_markup: body.button === false ? undefined : openButton(lang, url),
        link_preview_options: { is_disabled: true },
      })
      if (res.ok) sent++
      else { failed++; if (res.error_code === 403) gone.push(row.tg_id) }
    }
    if (gone.length) await sb(cfg, `/rest/v1/tg_users?tg_id=in.(${gone.join(',')})`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ blocked: true, subscribed: false }) })
    return json({ sent, failed, next: rows.length === BATCH ? rows[rows.length - 1].tg_id : null })
  }

  return json({ error: 'bad_action' }, 400)
}
