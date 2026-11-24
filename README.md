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

## Administrator paneli

Manzil: sayt manzili oxiriga `#admin` qo'shing (masalan `https://.../Pro-Football-/#admin`). Admin bo'lgan hisob bilan kirilganda ilova menyusida ham «⚙ Admin panel» tugmasi chiqadi.

Imkoniyatlar:
- **Kontent**: mashqlar (chizma va animatsiya Taktik doskada), tayyor rejalar, Bilim kartalari, yosh bosqichlari, tamoyillar, kitoblar. Har birini qo'shish, tahrirlash, o'chirish (murabbiylardan yashiriladi, qaytarish mumkin), kitobdagi asl holiga qaytarish. Qoralama: saqlanadi, lekin murabbiylar hali ko'rmaydi.
- **Kuzatish**: murabbiylar soni, kunlik faollik, yangi ro'yxatdan o'tganlar, mashg'ulotlar soni; murabbiylar ro'yxati (CSV), hisobni o'chirish; adminlarni qo'shish/olib tashlash.
- **Tarix**: har bir o'zgarish yoziladi, eski holatni bir tugma bilan tiklash mumkin. Zaxira nusxa (JSON).

Qanday ishlaydi: ichki kontent kodda qoladi (`src/library*.ts`, `src/knowledge.ts`, ...). Admin o'zgarishlari Supabase `content_items` jadvaliga yoziladi va ilova ularni ichki kontent ustiga qo'yadi (`src/content.ts`). Hamma o'qiy oladi, faqat adminlar yoza oladi (RLS). O'zgarish murabbiylarga darhol (realtime) yetadi va qurilmada saqlanadi.

O'rnatish: `supabase/schema.sql` dan keyin `supabase/admin.sql` ni SQL Editor'da ishga tushiring, so'ng birinchi adminni qo'shing:

```sql
insert into public.admins (user_id) select id from auth.users where lower(email) = lower('SIZNING@EMAIL') on conflict do nothing;
```

## Internetga joylash (Cloudflare Pages, bepul)

Sayt Cloudflare Pages orqali `main` tarmog'idan avtomatik quriladi: `main` ga har push qilinganda
bir-ikki daqiqada yangilanadi. Sozlamalar:

- Framework preset: **Vite** (yoki None), Build command: `npm run build`, Output: `dist`
- Environment variables: `NODE_VERSION=22`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  (ixtiyoriy: `VITE_CONTACT_URL`, `VITE_PRICE_TEXT`)
- Supabase → Authentication → URL Configuration: **Site URL** va **Redirect URLs** ga sayt manzilini yozing.

GitHub Pages workflow (`.github/workflows/deploy.yml`) faqat qo'lda ishga tushiriladigan zaxira yo'l sifatida qoldirilgan.

## Texnologiyalar

React 19, TypeScript, Vite, vite-plugin-pwa, Supabase (auth + Postgres + realtime).

## Telegram bot

Bot ichida sayt Mini App bo'lib ochiladi (Telegram bilan kirish, konspekt PDF chatga, admin paneldan xabar yuborish).
Cloudflare Pages → Settings → Variables and Secrets (Production, turi Secret): `TG_BOT_TOKEN` (BotFather tokeni)
va `SUPABASE_SERVICE_ROLE_KEY`. Supabase'da `supabase/telegram.sql` ni ishga tushiring, keyin admin panel →
«Telegram bot» → «Botni sozlash».
