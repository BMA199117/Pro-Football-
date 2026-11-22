# Pro Football

Futbol murabbiylari uchun mashg'ulot ilovasi. Bolalar akademiyalari va havaskor jamoalar uchun.
Telefonda ilova kabi o'rnatiladi (PWA), kompyuterda brauzerda ishlaydi, internetsiz ham ishlaydi.
Tillar: o'zbekcha va ruscha.

## Imkoniyatlar

- **Mashg'ulotlar**: mashg'ulotni yaratish, uni razminka / asosiy qism / yakun bosqichlariga bo'lish, mashq qo'shish, umumiy vaqtni ko'rish.
- **Maydonda rejim**: "Mashg'ulotni boshlash" tugmasi mashqlarni birma-bir katta sxema, maslahatlar va taymer bilan ko'rsatadi. Ekran o'chmaydi.
- **Mashqlar kutubxonasi**: maydon sxemasi, tavsif, jihozlar va murabbiy maslahatlari bilan tayyor mashqlar. Turi, yoshi, sevimlilar bo'yicha filtr va qidiruv. O'z mashqingizni qo'shish.
- **Jamoa va davomat**: guruhlar (U10, U12...), o'yinchilar ro'yxati, har mashg'ulotda kim kelganini belgilash va davomat foizi.
- **Bilim**: murabbiy kitoblaridan qisqa g'oyalar va "qanday qo'llash" maslahatlari (uslubiyat, o'yin g'oyalari, bolalar bilan ishlash, jismoniy tayyorgarlik).
- **Kalendar**: haftalik ko'rinish, kunga bosib yangi mashg'ulot qo'shish.
- **Sinxronlash**: email orqali kirilsa, telefon va kompyuterdagi ma'lumotlar avtomatik bir xil bo'ladi.

## Mazmun manbalari

Mashqlar (`src/library-books.ts`) va bilim kartalari (`src/knowledge.ts`) murabbiy yuklagan kitoblardan qisqa qayta hikoya qilingan, kitob matni ko'chirilmagan. Har bir yozuvda manba ko'rsatiladi (`src/sources.ts`).

## Ishga tushirish (dasturchi uchun)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ papkasiga
```

## Sinxronlashni yoqish (Supabase, bepul)

Murabbiy hisobiga kiradi (email + parol, yoki emailga keladigan 6 xonali kod). Shundan keyin
mashg'ulotlar, o'yinchilar, guruhlar, o'z mashqlari (chizmalari bilan) va sevimlilar telefon va
kompyuterda bir xil bo'ladi. Har bir yozuv alohida birlashadi: internetsiz qilingan o'zgarishlar
internet qaytganda yuboriladi, bir yozuv ikki joyda o'zgartirilsa, keyingisi qoladi.

1. [supabase.com](https://supabase.com) da bepul loyiha yarating.
2. **SQL Editor** da `supabase/schema.sql` faylini ishga tushiring (qayta ishga tushirish xavfsiz).
3. **Authentication → Sign In / Providers → Email**: *Confirm email* ni o'chiring (shunda ro'yxatdan
   o'tish darhol ishlaydi), *Email OTP Length* = 6.
4. **Authentication → Emails → Templates**: *Magic Link* shabloniga `supabase/email/code.html`,
   *Confirm signup* shabloniga `supabase/email/confirm.html` ni qo'ying (xatda kod ko'rinadi).
5. **Authentication → URL Configuration**: *Site URL* ga ilova manzilini yozing.
6. **Project Settings → API** dan `Project URL` va `anon public` (publishable) kalitni oling va
   GitHub repo'da **Settings → Secrets and variables → Actions** ga `VITE_SUPABASE_URL` va
   `VITE_SUPABASE_ANON_KEY` qilib qo'shing. Lokal ishlash uchun `.env.local` ga yozing (`.env.example` ga qarang).

Supabase'ning o'z pochta xizmati soatiga bir nechta xat yuboradi va asosan loyiha a'zolariga.
Ko'p murabbiylar emailga kod bilan kirishi uchun ilovani ochishdan oldin o'z SMTP (masalan Resend)
ulash kerak. Email + parol bilan kirish xatsiz ishlaydi.

Kalitlar bo'lmasa ham ilova ishlaydi, faqat ma'lumot shu qurilmada saqlanadi.

## Internetga joylash (GitHub Pages, bepul)

Repo'da **Settings → Pages → Source: GitHub Actions** ni tanlang. `main` ga har push qilinganda
ilova `https://bma199117.github.io/Pro-Football-/` manzilida yangilanadi.

## Texnologiyalar

React 19, TypeScript, Vite, vite-plugin-pwa, Supabase (auth + Postgres + realtime).
