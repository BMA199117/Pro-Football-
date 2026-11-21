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

1. [supabase.com](https://supabase.com) da bepul loyiha yarating.
2. **SQL Editor** da `supabase/schema.sql` faylini ishga tushiring.
3. **Authentication → URL Configuration** bo'limida *Site URL* ga ilova manzilini yozing
   (masalan `https://bma199117.github.io/Pro-Football-/`).
4. **Project Settings → API** dan `Project URL` va `anon public` kalitini oling.
5. GitHub repo'da **Settings → Secrets and variables → Actions** ga ikkita secret qo'shing:
   `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY`.
   Lokal ishlash uchun ularni `.env` fayliga yozing (`.env.example` ga qarang).

Kalitlar bo'lmasa ham ilova ishlaydi, faqat ma'lumot shu qurilmada saqlanadi.

## Internetga joylash (GitHub Pages, bepul)

Repo'da **Settings → Pages → Source: GitHub Actions** ni tanlang. `main` ga har push qilinganda
ilova `https://bma199117.github.io/Pro-Football-/` manzilida yangilanadi.

## Texnologiyalar

React 19, TypeScript, Vite, vite-plugin-pwa, Supabase (auth + Postgres + realtime).
