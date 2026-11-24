// Telegram calls this for every message to the bot (set up from the admin panel: Telegram bot → "Botni sozlash").
import { config, json, tg, webhookSecret, saveTgUser, langOf } from './_lib.js'

export const TEXT = {
  uz: {
    hello: (name) => `Salom${name ? ', ' + name : ''}! ⚽\n\n<b>Pro Football</b> — futbol murabbiylari uchun ilova: kitobdagi chizma va animatsiyali 300+ mashq, tayyor mashg'ulot va mavsum rejalari, taktik doska, davomat.\n\nPastdagi tugmani bosing, ilova shu yerning o'zida ochiladi. Telegram akkauntingiz bilan kirasiz, ma'lumotlaringiz telefon va kompyuterda bir xil bo'ladi.\n\nYangi mashqlar qo'shilganda shu yerga xabar yuboramiz. O'chirish: /stop`,
    open: '⚽ Ilovani ochish',
    help: `<b>Buyruqlar</b>\n/start — ilovani ochish\n/stop — yangiliklar haqidagi xabarlarni o'chirish\n/help — yordam\n\nMashg'ulot konspektini PDF qilib shu chatga olish uchun: ilovada mashg'ulotni oching → «PDF» tugmasi.`,
    stop: "Xabarlar o'chirildi. Qayta yoqish uchun /start bosing.",
    other: 'Ilovani ochish uchun pastdagi tugmani bosing.',
  },
  ru: {
    hello: (name) => `Здравствуйте${name ? ', ' + name : ''}! ⚽\n\n<b>Pro Football</b> — приложение для футбольных тренеров: 300+ упражнений со схемами и анимацией из книг, готовые планы тренировок и сезона, тактическая доска, посещаемость.\n\nНажмите кнопку ниже, приложение откроется прямо здесь. Вход через Telegram, данные одинаковы на телефоне и компьютере.\n\nКогда появятся новые упражнения, мы напишем сюда. Отключить: /stop`,
    open: '⚽ Открыть приложение',
    help: `<b>Команды</b>\n/start — открыть приложение\n/stop — отключить уведомления о новинках\n/help — помощь\n\nЧтобы получить конспект тренировки в PDF в этот чат: откройте тренировку в приложении → кнопка «PDF».`,
    stop: 'Уведомления отключены. Чтобы включить снова, нажмите /start.',
    other: 'Чтобы открыть приложение, нажмите кнопку ниже.',
  },
}

export const appUrl = (env, request) => (env.APP_URL || new URL(request.url).origin) + '/'
export const openButton = (lang, url) => ({ inline_keyboard: [[{ text: TEXT[lang].open, web_app: { url } }]] })

export async function onRequestPost({ request, env, waitUntil }) {
  const cfg = config(env)
  if (!cfg.token) return json({ ok: false }, 503)
  if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== (await webhookSecret(cfg.token))) return json({ ok: false }, 401)

  const update = await request.json().catch(() => null)
  const msg = update && update.message
  // Someone blocked or unblocked the bot: stop or resume news for them.
  const member = update && update.my_chat_member
  if (member && member.chat && member.chat.type === 'private' && !cfg.missing.length) {
    const status = member.new_chat_member && member.new_chat_member.status
    waitUntil(saveTgUser(cfg, member.from, { subscribed: status === 'member', blocked: status === 'kicked' }))
    return json({ ok: true })
  }
  if (!msg || !msg.from || !msg.chat || msg.chat.type !== 'private') return json({ ok: true })

  const lang = langOf(msg.from.language_code)
  const t = TEXT[lang]
  const url = appUrl(env, request)
  const cmd = String(msg.text || '').trim().split(/[\s@]/)[0].toLowerCase()
  const say = (text, markup) => tg(cfg.token, 'sendMessage', { chat_id: msg.chat.id, text, parse_mode: 'HTML', reply_markup: markup, link_preview_options: { is_disabled: true } })

  if (cmd === '/start') {
    if (!cfg.missing.length) waitUntil(saveTgUser(cfg, msg.from, { subscribed: true, blocked: false }))
    await say(t.hello(escapeHtml(msg.from.first_name || '')), openButton(lang, url))
  } else if (cmd === '/stop') {
    if (!cfg.missing.length) waitUntil(saveTgUser(cfg, msg.from, { subscribed: false }))
    await say(t.stop)
  } else if (cmd === '/help') {
    await say(t.help, openButton(lang, url))
  } else {
    await say(t.other, openButton(lang, url))
  }
  return json({ ok: true })
}

export const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
