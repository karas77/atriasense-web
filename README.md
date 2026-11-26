# AtriaSense web sitesi

AtriaLens (altyazı gözlüğü) ve Atria Attention (bileklik) için tek sayfalık, kaydırma animasyonlu tanıtım sitesi. Tasarım ve geçişler kgunes.com örnek alınarak yapıldı.

## Çalıştırma

Node.js 20 veya üstü gerekir.

```bash
npm install
npm run dev      # geliştirme: http://localhost:3000
npm run build    # üretim derlemesi
npm run start    # derlenmiş siteyi çalıştırır
npm run lint     # kod denetimi
```

`node_modules` ve `.next` klasörleri pakete konmadı; `npm install` ile yeniden oluşur.

## Kullanılanlar

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 ve shadcn/ui (Base UI tabanlı; `src/components/ui`)
- GSAP + ScrollTrigger (`@gsap/react` ile `useGSAP`): kaydırmaya bağlı animasyonlar
- Lenis: yumuşak kaydırma (GSAP ticker'ına bağlı)
- Motion (`motion/react`): hover ve form geçişleri

## Nerede ne var

| Ne değişecek | Dosya |
|---|---|
| Tüm metinler (TR ve EN) | `src/lib/content.ts` |
| Sayfa sırası | `src/app/page.tsx` |
| Renkler ve tüm stiller | `src/app/globals.css` |
| Fontlar ve sayfa başlığı | `src/app/layout.tsx` |
| Açılış videosu | `src/components/intro-loader.tsx`, `public/media/` |
| Üst menü | `src/components/site-header.tsx` |
| Bölümler | `src/components/sections/` (hero, products, about, partners, color-transition, contact) |
| Görseller ve logolar | `public/img/`, `public/logos/` |

Sayfa akışı: açılış videosu, hero (logo ve slogan), ürünler, neden varız, kurumlar (kayan cam kartlar, tıklayınca bilgi paneli), lacivertten beje renk geçişi, iletişim formu ve altbilgi.

Marka renkleri `globals.css` başında: Deep Navy `#062045`, Warm Ivory `#FEFDF0`, Electric Lime `#CDFC8A`, Pastel Canary `#FFFC8C`.

## Kurallar ve kararlar

- Metinler Atria Sense Rehberi'ne (2026-2027) dayanır. Ürünler için teknik değer yazılmaz (gecikme, pil, işlemci gibi); yalnız kullanıcıya faydası anlatılır.
- Bileklik adı "Atria Attention".
- Site iki dillidir; her metin değişikliği `content.ts` içinde hem `tr` hem `en` için yapılmalı.
- Erişilebilirlik önemli (hedef kitle işitme kaybı yaşayanlar): her animasyon `prefers-reduced-motion` ayarında kapanır, butonlar en az 44 px, klavyeyle gezilebilir.
- Türkçe büyük harflerin (İ, Ş, Ğ) kesilmemesi için başlıklarda `line-height` en az 1.06 ve split maskesinde üst/alt pay var; bunları azaltma.

## Bilinen eksikler

- Talep formu `https://atriasense.com/api/waitlist` adresine gönderir. Site atriasense.com dışında bir adreste yayınlanırsa bu istek reddedilebilir (CORS). Kalıcı yayında ya site atriasense.com'a taşınmalı ya da API'ye yeni adres için izin verilmeli.
- Ürünler bölümünden önce bir "kutu açılış" kaydırma videosu düşünülmüştü; henüz eklenmedi.
- Kalıcı yayın için önerilen yer Vercel.
