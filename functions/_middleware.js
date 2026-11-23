// Cloudflare Pages middleware: for now the site opens only in Uzbekistan.
// - Visitors whose request comes from Uzbekistan (request.cf.country === 'UZ') see the site.
// - Search engine crawlers are let through so the site can still be found on Google/Yandex/Bing.
// - The owner can open it from anywhere with ?ruxsat=<code> once (a cookie remembers it for a year).
//   The code comes from the GEO_BYPASS environment variable in Cloudflare (fallback below).
// - ALLOWED_COUNTRIES (comma separated, e.g. "UZ,KZ") changes the list without a code change;
//   ALLOWED_COUNTRIES="*" turns the restriction off.
// Only "/" and "/index.html" run through here (see public/_routes.json); hash routes (#admin) are all "/".

const BOTS = /googlebot|google-inspectiontool|googleother|adsbot-google|mediapartners-google|bingbot|yandex|duckduckbot|applebot|facebookexternalhit|telegrambot|twitterbot|whatsapp/i
const COOKIE = 'pf_pass'

export async function onRequest(context) {
  const { request, env, next } = context
  const allowed = String(env.ALLOWED_COUNTRIES || 'UZ').toUpperCase().split(',').map((s) => s.trim()).filter(Boolean)
  if (allowed.includes('*')) return next()

  const pass = env.GEO_BYPASS || '_f6CFJWGV8d_'
  const url = new URL(request.url)
  if (url.searchParams.get('ruxsat') === pass) {
    url.searchParams.delete('ruxsat')
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.pathname + url.search + url.hash,
        'Set-Cookie': `${COOKIE}=${pass}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`,
      },
    })
  }

  const country = String((request.cf && request.cf.country) || '').toUpperCase()
  const cookie = request.headers.get('Cookie') || ''
  const ua = request.headers.get('User-Agent') || ''
  if (allowed.includes(country) || cookie.includes(`${COOKIE}=${pass}`) || BOTS.test(ua)) return next()

  return new Response(BLOCKED, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  })
}

const BLOCKED = `<!doctype html>
<html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Pro Football</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F3F6F2;color:#16241c;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:24px;box-sizing:border-box}
.c{max-width:460px;text-align:center}.logo{width:72px;height:72px;margin:0 auto 20px}h1{font-size:24px;margin:0 0 12px}p{line-height:1.5;margin:0 0 10px;color:#3b4a41}hr{border:0;border-top:1px solid #d6ded8;margin:22px 0}
@media (prefers-color-scheme:dark){body{background:#0f1a14;color:#e8efe9}p{color:#b8c6bd}hr{border-color:#2a3a30}}</style></head>
<body><div class="c">
<svg class="logo" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#1F6B4A"/><rect x="96" y="128" width="320" height="256" rx="12" fill="none" stroke="#fff" stroke-width="18"/><line x1="256" y1="128" x2="256" y2="384" stroke="#fff" stroke-width="18"/><circle cx="256" cy="256" r="48" fill="none" stroke="#fff" stroke-width="18"/><path d="M380 300l36 76h-72z" fill="#E46E26"/></svg>
<h1>Pro Football</h1>
<p>Hozircha sayt faqat O'zbekistonda ishlaydi.</p>
<p>Agar O'zbekistonda bo'lsangiz va bu xabarni ko'rayotgan bo'lsangiz, VPN'ni o'chirib, sahifani yangilang.</p>
<hr>
<p>Пока сайт доступен только в Узбекистане.</p>
<p>Если вы в Узбекистане и видите это сообщение, отключите VPN и обновите страницу.</p>
</div></body></html>`
