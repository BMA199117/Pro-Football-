// Send a PDF made in the Mini App (session konspekt, drill sheet) to the coach's chat with the bot.
// POST multipart/form-data: initData, file (PDF), caption (optional).
import { config, json, verifyInitData, tg } from './_lib.js'

const MAX = 20 * 1024 * 1024

export async function onRequestPost({ request, env }) {
  const cfg = config(env)
  if (!cfg.token) return json({ error: 'not_configured' }, 503)
  const form = await request.formData().catch(() => null)
  if (!form) return json({ error: 'bad_form' }, 400)
  const user = await verifyInitData(String(form.get('initData') || ''), cfg.token)
  if (!user) return json({ error: 'bad_init_data' }, 401)
  const file = form.get('file')
  if (!file || typeof file === 'string' || !file.size) return json({ error: 'no_file' }, 400)
  if (file.size > MAX) return json({ error: 'too_big' }, 413)
  const name = String(file.name || 'pro-football.pdf').replace(/[\\/]/g, '-').slice(0, 80)

  const out = new FormData()
  out.append('chat_id', String(user.id))
  out.append('document', new File([await file.arrayBuffer()], /\.pdf$/i.test(name) ? name : name + '.pdf', { type: 'application/pdf' }))
  const caption = String(form.get('caption') || '').slice(0, 900)
  if (caption) out.append('caption', caption)
  const r = await tg(cfg.token, 'sendDocument', out)
  if (r.ok) return json({ ok: true })
  // 403: the coach never pressed Start (or blocked the bot)
  return json({ error: r.error_code === 403 ? 'blocked' : 'send_failed', detail: r.description }, r.error_code === 403 ? 403 : 502)
}
