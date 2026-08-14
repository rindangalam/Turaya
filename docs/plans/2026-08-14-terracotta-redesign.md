# Terracotta Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relaunch seluruh situs publik Turaya dari tema gelap noir/champagne menjadi tema terracotta "Rempah & Tanah" — terang dominan, aksen gelap, tipografi Fraunces + Inter, dengan perbaikan UX menyeluruh.

**Architecture:** Perubahan dimusnahkan ke token CSS. Palet baru (clay/terra/honey/roast/cream) ditambahkan di `@theme inline`, blok `.dark` dipetakan ulang ke nilai terracotta (situs publik selalu memakai `.dark`), dan seluruh class raw `noir-*`/`ivory-*`/`champagne-*` pada file publik diganti dengan token baru. Admin tidak tersentuh — blok `.admin` tetap netral dan 4 pemakaian raw `champagne-500` (ikon bintang admin) dibiarkan karena token lama tetap terdefinisi. Font dipindah di `src/app/layout.tsx` via `next/font/google`.

**Tech Stack:** Next.js 16 (App Router), Tailwind v4 (`@theme inline`), `next/font/google`, GSAP + Lenis (hero), Motion (reveal), shadcn-style components, Base UI.

**Reference:** Spesifikasi — `docs/specs/2026-08-14-terracotta-redesign-design.md`. Aturan anti-AI-slop terikat (bagian 3 spesifikasi + blok `.gitignore`).

---

## File Structure

**Modify (token & shell):**
- `src/app/layout.tsx` — swap font Cormorant→Fraunces, Figtree→Inter
- `src/app/globals.css` — tambah palet terracotta, remap `.dark`, base layer (scrollbar/selection/focus), shadow lembut
- `src/components/ui/button.tsx` — varian terracotta solid/outline (tanpa shadow)
- `src/components/layout/page-header.tsx` — header editorial terracotta
- `src/components/layout/public-nav.tsx` — nav terang + aksen gelap, state aktif
- `src/components/layout/public-footer.tsx` — footer gelap roast + honey accent
- `src/app/(public)/layout.tsx` — announcement bar terracotta

**Modify (homepage & produk):**
- `src/features/homepage/hero-timeline.tsx` — hero terang + blok gelap, gradient clay
- `src/features/homepage/homepage-sections.tsx` — about section terracotta
- `src/features/homepage/story-scene.tsx` — story terracotta
- `src/components/products/product-card.tsx` — kartu produk clay/cream
- `src/components/products/product-gallery.tsx` — galeri produk

**Modify (halaman):**
- `src/app/(public)/products/page.tsx`, `products/[slug]/page.tsx`
- `src/app/(public)/collections/page.tsx`, `collections/[slug]/page.tsx`
- `src/app/(public)/ingredients/page.tsx`, `gallery/page.tsx`
- `src/app/(public)/journal/page.tsx`, `journal/[slug]/page.tsx`
- `src/app/(public)/about/page.tsx`, `philosophy/page.tsx`, `contact/page.tsx`
- `src/app/(public)/stores/page.tsx`, `faq/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`
- `src/app/(public)/not-found.tsx`, `src/app/not-found.tsx`, `src/app/(public)/error.tsx`, `src/app/(public)/loading.tsx`
- `src/features/contact/contact-form.tsx`

**Not modified:** `src/app/admin/**`, `src/features/admin/**`, `src/components/ui/*` selain `button.tsx`, seluruh `src/lib/**` (format, seo, motion, validation), `src/services/**`, `supabase/**`.

---

## Token Mapping Table (GLOBAL — dipakai semua task)

Semua class berikut pada **file publik** diganti:

| Class lama | Class baru | Catatan |
|---|---|---|
| `bg-noir-950/90`, `bg-noir-950`, `bg-noir-950/95` | `bg-roast-800/90`, `bg-roast-800`, `bg-roast-800/95` | header/footer gelap |
| `bg-noir-900` | `bg-roast-700` | announcement, blok gelap |
| `bg-noir-800`, `bg-noir-700` | `bg-roast-700`, `bg-roast-600` | gradient gelap, placeholder |
| `bg-noir-600`, `bg-noir-500` | `bg-roast-500`, `bg-roast-300` | scrollbar, hover |
| `text-noir-800/60` (watermark 404) | `text-roast-700/25` | watermark terang |
| `text-ivory-50` | `text-roast-700` | teks utama di latar terang |
| `text-ivory-100` | `text-roast-700` | teks kuat di latar terang |
| `text-ivory-200` | `text-roast-500` | teks sekunder |
| `text-ivory-300` | `text-roast-500` | teks sekunder/muted |
| `text-ivory-400` | `text-roast-300` | label lemah |
| `text-ivory-500`, `text-ivory-600` | `text-roast-300`, `text-roast-300` | footer label |
| `bg-ivory-100` | `bg-clay-100` | tombol solid lama |
| `text-champagne-400` | `text-terra-500` | aksen utama di latar terang |
| `text-champagne-500`, `text-champagne-500/70` | `text-terra-500`, `text-terra-500/70` | aksen utama |
| `bg-champagne-500`, `bg-champagne-500/80` | `bg-terra-500`, `bg-terra-500/80` | garis/aksen |
| `border-champagne-400/40` | `border-terra-500/30` | border section |
| `ring-champagne-400` | `ring-terra-500` | focus ring |
| `::selection` bg champagne | `bg-honey-300` | selection |
| **Di dalam blok gelap** (hero/footer: bg roast) | | |
| `text-ivory-50` | `text-cream-100` | judul di atas gelap |
| `text-ivory-100` | `text-cream-200` | teks kuat di atas gelap |
| `text-ivory-300` | `text-clay-200` | teks sekunder di atas gelap |
| `text-champagne-400` (di atas gelap) | `text-honey-300` | aksen di atas gelap |
| `bg-champagne-500/80` (di atas gelap) | `bg-honey-300/80` | garis di atas gelap |

Palet baru yang ditambahkan (lihat Task 2): clay-50..300, terra-400..500, honey-300..400, roast-300..800, cream-100..200.

---

### Task 1: Swap font — Fraunces + Inter

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css:72-75`

- [ ] **Step 1: Ganti import font di `layout.tsx`**

```tsx
import { Fraunces, Inter } from "next/font/google";
```

Ganti konstanta `cormorant`/`figtree`:

```tsx
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
```

- [ ] **Step 2: Terapkan variable di `<html>`**

Ubah:

```tsx
className={`dark ${cormorant.variable} ${figtree.variable} h-full antialiased`}
```

menjadi:

```tsx
className={`dark ${fraunces.variable} ${inter.variable} h-full antialiased`}
```

- [ ] **Step 3: Perbarui `@theme inline` di `globals.css:72-75`**

Ubah:

```css
  /* Typography — DESIGN_SYSTEM.md §3 */
  --font-sans: var(--font-figtree);
  --font-display: var(--font-cormorant);
```

menjadi:

```css
  /* Typography — spesifikasi terracotta §2.2 */
  --font-sans: var(--font-inter);
  --font-display: var(--font-fraunces);
```

- [ ] **Step 4: Verifikasi & commit**

Run: `npm run typecheck`
Expected: PASS (tidak ada error)

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "style: swap public fonts to Fraunces + Inter"
```

---

### Task 2: Tambah palet terracotta & remap `.dark`

**Files:**
- Modify: `src/app/globals.css` (blok `@theme inline`, blok `.dark`, base layer)

- [ ] **Step 1: Tambah raw palette terracotta setelah blok champagne (`globals.css:24`)**

```css
  /* Terracotta palette — spesifikasi terracotta §2.1 */
  --color-clay-50: #f4eee3;
  --color-clay-100: #eae1d1;
  --color-clay-200: #dcd0bc;
  --color-clay-300: #c4b69d;
  --color-terra-400: #c66a3f;
  --color-terra-500: #a94d28;
  --color-honey-300: #e9c68f;
  --color-honey-400: #d9a441;
  --color-roast-300: #a68f72;
  --color-roast-500: #7a5c3e;
  --color-roast-600: #5a4430;
  --color-roast-700: #3e2c22;
  --color-roast-800: #2e2018;
  --color-cream-100: #f8f4eb;
  --color-cream-200: #ede5d8;
```

- [ ] **Step 2: Remap blok `.dark` ke terracotta (`globals.css:159-192`)**

Ganti seluruh isi `.dark { ... }`:

```css
.dark {
  /* Terracotta "Rempah & Tanah" — spesifikasi §2 (situs publik, terang dominan) */
  --background: var(--color-clay-50);
  --foreground: var(--color-roast-700);
  --card: var(--color-cream-100);
  --card-foreground: var(--color-roast-700);
  --popover: var(--color-cream-100);
  --popover-foreground: var(--color-roast-700);
  --primary: var(--color-terra-500);
  --primary-foreground: var(--color-cream-100);
  --secondary: var(--color-clay-100);
  --secondary-foreground: var(--color-roast-700);
  --muted: var(--color-clay-100);
  --muted-foreground: var(--color-roast-500);
  --accent: var(--color-clay-100);
  --accent-foreground: var(--color-roast-700);
  --destructive: #b4232c;
  --border: var(--color-clay-300);
  --input: var(--color-clay-200);
  --ring: var(--color-terra-500);
  --chart-1: var(--color-terra-500);
  --chart-2: var(--color-honey-400);
  --chart-3: var(--color-roast-300);
  --chart-4: var(--color-roast-500);
  --chart-5: var(--color-roast-600);
  --sidebar: var(--color-cream-100);
  --sidebar-foreground: var(--color-roast-700);
  --sidebar-primary: var(--color-terra-500);
  --sidebar-primary-foreground: var(--color-cream-100);
  --sidebar-accent: var(--color-clay-100);
  --sidebar-accent-foreground: var(--color-roast-700);
  --sidebar-border: var(--color-clay-300);
  --sidebar-ring: var(--color-terra-500);
}
```

- [ ] **Step 3: Perbarui base layer (`globals.css:252-279`)**

Ganti `::selection` dan scrollbar:

```css
  ::selection {
    background: var(--color-honey-300);
    color: var(--color-roast-800);
  }

  :focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 2px;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-clay-50);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-roast-300);
    border: 2px solid var(--color-clay-50);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-roast-500);
  }
```

- [ ] **Step 4: Soften shadow tokens (`globals.css:113-114`)**

```css
  /* Shadows — spesifikasi §2.3 (tanpa glow) */
  --shadow-soft: 0 1px 2px rgb(62 44 34 / 0.12), 0 8px 24px rgb(62 44 34 / 0.14);
  --shadow-lifted: 0 2px 4px rgb(62 44 34 / 0.14), 0 16px 48px rgb(62 44 34 / 0.18);
```

- [ ] **Step 5: Verifikasi & commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/app/globals.css
git commit -m "style: add terracotta palette and remap public .dark theme"
```

---

### Task 3: Button varian terracotta

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1: Perbarui varian default & outline**

Dalam `buttonVariants` ganti:

```tsx
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
```

menjadi (solid terracotta tanpa shadow, outline hairline — token-based agar admin netral tetap konsisten):

```tsx
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-none hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:hover:bg-input/50",
```

- [ ] **Step 2: Verifikasi & commit**

Run: `npm run lint`
Expected: PASS

```bash
git add src/components/ui/button.tsx
git commit -m "style: terracotta button variants without shadows"
```

---

### Task 4: Shell — PageHeader, nav, footer, public layout

**Files:**
- Modify: `src/components/layout/page-header.tsx`
- Modify: `src/components/layout/public-nav.tsx`
- Modify: `src/components/layout/public-footer.tsx`
- Modify: `src/app/(public)/layout.tsx`

- [ ] **Step 1: PageHeader terang (`page-header.tsx`)**

Ganti seluruh isi JSX:

```tsx
  return (
    <section className="border-b border-border/60 bg-clay-100/60">
      <div className="container-turaya py-20 md:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-terra-500/80" />
            <p className="overline text-terra-500">{overline}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-6 max-w-[18ch] font-display text-display-lg text-foreground">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
```

- [ ] **Step 2: PublicNav — latar terang, aksen gelap (`public-nav.tsx`)**

Ganti header wrapper (baris 32):

```tsx
    <header className="sticky top-0 z-50 border-b border-border/60 bg-cream-100/90 backdrop-blur">
```

Ganti diamond logo (baris 41) → `bg-terra-500`, wordmark (baris 43) → `text-foreground`:

```tsx
          <span
            aria-hidden
            className="inline-block size-2 rotate-45 bg-terra-500 transition-transform duration-500 group-hover:rotate-[135deg]"
          />
          <span className="font-display text-heading-lg tracking-[0.02em] text-foreground">
```

Ganti nav links (baris 54-55) → teks roast, hover/active terra:

```tsx
              className={cn(
                "overline relative text-muted-foreground transition-colors duration-[250ms] hover:text-terra-500 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-terra-500 after:transition-transform after:duration-[250ms] hover:after:scale-x-100",
                isActive(item.href) && "text-terra-500 after:scale-x-100",
              )}
```

Ganti hamburger (baris 69) → `text-foreground`. Ganti menu dropdown (baris 103) → `bg-cream-100/95`, item (baris 117) → `text-foreground`, active → `text-terra-500`, index number (baris 122) → `text-roast-300`.

- [ ] **Step 3: PublicFooter — gelap roast (`public-footer.tsx`)**

Ganti wrapper footer (baris 51):

```tsx
    <footer className="bg-roast-800 text-clay-200">
```

Ganti brand (baris 55) → `text-cream-100`. Ganti hover link (baris 36, 67, 75, 96, 108) → `hover:text-honey-300`. Ganti column title (baris 30, 88) → `text-roast-300`. Ganti email/phone (baris 67, 75) → `text-cream-200`. Ganti privasi/terms (baris 125, 131) → `text-roast-300 hover:text-cream-200`. Ganti copyright (baris 140) → `text-roast-300`, tagline footer (baris 143) → `text-roast-300`.

- [ ] **Step 4: Public layout announcement (`(public)/layout.tsx`)**

Ganti announcement bar (baris 15-19):

```tsx
        <div className="border-b border-border/60 bg-roast-700 px-4 py-2.5 text-center">
          <p className="overline text-caption text-cream-200">
            <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-honey-300" />
            {settings.announcement}
          </p>
        </div>
```

- [ ] **Step 5: Verifikasi & commit**

Run: `npm run typecheck` lalu `npm run lint`
Expected: keduanya PASS

```bash
git add src/components/layout/page-header.tsx src/components/layout/public-nav.tsx src/components/layout/public-footer.tsx "src/app/(public)/layout.tsx"
git commit -m "style: terracotta public shell (nav, footer, header, announcement)"
```

---

### Task 5: Homepage — hero, story, about

**Files:**
- Modify: `src/features/homepage/hero-timeline.tsx`
- Modify: `src/features/homepage/homepage-sections.tsx`
- Modify: `src/features/homepage/story-scene.tsx`

- [ ] **Step 1: Hero-timeline (`hero-timeline.tsx`)**

Baca file, lalu terapkan mapping:
- Latar hero `bg-noir-950` → `bg-roast-800` (blok gelap dipertahankan sebagai aksen).
- Gradient overlay `noir-800`/`noir-950` → `roast-700`/`roast-800`.
- Teks `ivory-50`/`ivory-100` → `cream-100`/`cream-200`.
- `text-champagne-400` → `text-honey-300`.
- Scroll cue: garis/teks champagne → honey; gunakan `bg-honey-300`.
- Pastikan tidak ada shadow/glow baru.

- [ ] **Step 2: Story-scene (`story-scene.tsx`)**

Baca file lalu terapkan mapping global:
- Section tetap terang `bg-clay-50` atau transparan.
- Garis/overline champagne → terra.
- Judul `ivory-50` → `foreground`.
- Body `ivory-200`/`ivory-300` → `muted-foreground`/`roast-500`.

- [ ] **Step 3: Homepage-sections (`homepage-sections.tsx` — AboutSection)**

Baca file lalu terapkan mapping global:
- Header gold rule `border-champagne-400/40` → `border-terra-500/30`.
- `text-champagne-400` → `text-terra-500`.
- `text-ivory-50` → `text-foreground`.
- `text-ivory-200`/`text-ivory-300` → `text-muted-foreground`.
- `bg-noir-800`/`bg-noir-950` (placeholder figure) → `bg-clay-100`/`bg-clay-200` dengan teks `text-roast-500`.

- [ ] **Step 4: Verifikasi & commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/features/homepage/
git commit -m "style: terracotta homepage (hero, story, about)"
```

---

### Task 6: Produk — card & gallery

**Files:**
- Modify: `src/components/products/product-card.tsx`
- Modify: `src/components/products/product-gallery.tsx`

- [ ] **Step 1: Product-card (`product-card.tsx`)**

Baca file lalu terapkan mapping:
- Kartu `border-border/40 bg-input/10` tetap (semantik sudah terracotta).
- Placeholder monogram `bg-[radial-gradient(ellipse_at_center,var(--color-noir-800),var(--color-noir-950))]` → `bg-[radial-gradient(ellipse_at_center,var(--color-clay-100),var(--color-clay-200))]`.
- Monogram teks `text-ivory-300` → `text-roast-300`; slug `text-ivory-400` → `text-roast-300`.
- Kategori overline `text-champagne-400` → `text-terra-500`.
- Harga `text-ivory-100` → `text-foreground`.
- Hover border → `hover:border-terra-500/50`.

- [ ] **Step 2: Product-gallery (`product-gallery.tsx`)**

Baca file lalu terapkan mapping:
- `text-champagne-400` → `text-terra-500`.
- Placeholder/thumbnail `noir` → `clay`.
- Tidak ada perubahan struktur.

- [ ] **Step 3: Verifikasi & commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add src/components/products/
git commit -m "style: terracotta product card and gallery"
```

---

### Task 7: Halaman listing — products, collections, ingredients, gallery, journal

**Files:**
- Modify: `src/app/(public)/products/page.tsx`
- Modify: `src/app/(public)/collections/page.tsx`
- Modify: `src/app/(public)/ingredients/page.tsx`
- Modify: `src/app/(public)/gallery/page.tsx`
- Modify: `src/app/(public)/journal/page.tsx`

- [ ] **Step 1: Terapkan mapping global di kelima file**

Baca tiap file, ganti per tabel mapping (Task header). Khusus:
- `products/page.tsx`: filter aktif `text-champagne-400` → `text-terra-500`; border `border-champagne-400/40` → `border-terra-500/30`; empty state `text-ivory-300` → `text-muted-foreground`.
- `collections/page.tsx`: placeholder `radial-gradient(noir-800,noir-950)` → `clay-100→clay-200`; judul `text-ivory-50` → `text-foreground`; index `text-champagne-500/70` → `text-terra-500/70`; hover border `hover:border-champagne-400/40` → `hover:border-terra-500/50`.
- `ingredients/page.tsx`: sama (radial placeholder, index, `text-ivory-200` → `text-muted-foreground`).
- `gallery/page.tsx`: overlay `bg-gradient-to-t from-noir-950` → `from-roast-800/90`; caption `text-ivory-50` → `text-cream-100`; index `text-champagne-400` → `text-honey-300`.
- `journal/page.tsx`: placeholder radial → clay; meta separator `text-champagne-400` → `text-terra-500`; judul `text-ivory-50` → `text-foreground`.

- [ ] **Step 2: Verifikasi & commit**

Run: `npm run typecheck` lalu `npm run lint`
Expected: keduanya PASS

```bash
git add "src/app/(public)/products/page.tsx" "src/app/(public)/collections/page.tsx" "src/app/(public)/ingredients/page.tsx" "src/app/(public)/gallery/page.tsx" "src/app/(public)/journal/page.tsx"
git commit -m "style: terracotta listing pages"
```

---

### Task 8: Halaman detail — produk, koleksi, jurnal

**Files:**
- Modify: `src/app/(public)/products/[slug]/page.tsx`
- Modify: `src/app/(public)/collections/[slug]/page.tsx`
- Modify: `src/app/(public)/journal/[slug]/page.tsx`

- [ ] **Step 1: Terapkan mapping global di ketiga file**

- `products/[slug]/page.tsx`: breadcrumb `text-champagne-400` → `text-terra-500` (separator ◆ dan link); overline `text-champagne-400` → `text-terra-500`; judul `text-ivory-50` → `text-foreground`; deskripsi `text-ivory-200` → `text-muted-foreground`; harga `text-ivory-50` → `text-foreground`; badge ukuran `bg-input/20` tetap (semantik); notes pyramid diamond `text-champagne-400` → `text-terra-500`, label `text-ivory-300` → `text-muted-foreground`; CTA koleksi `border-champagne-400/40` → `border-terra-500/30`.
- `collections/[slug]/page.tsx`: back-link diamond → `text-terra-500`; header rule → `bg-terra-500/80`; judul → `text-foreground`; deskripsi → `text-muted-foreground`; empty state → `text-muted-foreground`; kartu via ProductCard (sudah selesai Task 6).
- `journal/[slug]/page.tsx`: back-link diamond → `text-terra-500`; meta (tanggal/reading time) `text-ivory-300` → `text-muted-foreground`; body `text-ivory-200` → `text-foreground`; heading markdown tetap; prev/next `border-champagne-400/40` → `border-terra-500/30`.

- [ ] **Step 2: Verifikasi & commit**

Run: `npm run typecheck`
Expected: PASS

```bash
git add "src/app/(public)/products/[slug]/page.tsx" "src/app/(public)/collections/[slug]/page.tsx" "src/app/(public)/journal/[slug]/page.tsx"
git commit -m "style: terracotta detail pages"
```

---

### Task 9: Halaman statis & form kontak

**Files:**
- Modify: `src/app/(public)/about/page.tsx`, `philosophy/page.tsx`, `contact/page.tsx`
- Modify: `src/app/(public)/stores/page.tsx`, `faq/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`
- Modify: `src/features/contact/contact-form.tsx`

- [ ] **Step 1: Terapkan mapping global di tujuh halaman**

- About: gold rules `bg-champagne-500/80` → `bg-terra-500/80`; overline `text-champagne-400` → `text-terra-500`; judul `text-ivory-50` → `text-foreground`; body `text-ivory-200` → `text-muted-foreground`; kartu nilai `border-champagne-400/40` → `border-terra-500/30`, `text-champagne-400` → `text-terra-500`, index `text-muted-foreground`.
- Philosophy: lead quote border `border-champagne-500/60` → `border-terra-500/60`; index `text-champagne-500/70` → `text-terra-500/70`; judul `text-champagne-400` → `text-terra-500`; body → `text-muted-foreground`.
- Contact: info rows `border-champagne-400/40` → `border-terra-500/30`; index `text-champagne-500/70` → `text-terra-500/70`; link `hover:text-champagne-400` → `hover:text-terra-500`; `text-ivory-400` label → `text-roast-300`.
- Stores: kartu `border-border/40 bg-input/10` tetap; index `text-muted-foreground`; city `text-champagne-400` → `text-terra-500`; nama toko `text-ivory-50` → `text-foreground`; link hover → `hover:text-terra-500`.
- FAQ: `text-champagne-400` → `text-terra-500`; index `text-champagne-500/70` → `text-terra-500/70`; pertanyaan `text-ivory-50` → `text-foreground`; jawaban → `text-muted-foreground`.
- Privacy/Terms: index `text-champagne-500/70` → `text-terra-500/70`; judul section `text-champagne-400` → `text-terra-500`; body → `text-muted-foreground`.

- [ ] **Step 2: Contact-form (`contact-form.tsx`)**

- Success state: diamond `bg-champagne-400` → `bg-terra-500`; overline `text-champagne-400` → `text-terra-500`; judul `text-ivory-50` → `text-foreground`; body → `text-muted-foreground`.
- Field error tetap `text-destructive`.

- [ ] **Step 3: Verifikasi & commit**

Run: `npm run typecheck` lalu `npm run lint`
Expected: keduanya PASS

```bash
git add "src/app/(public)/about" "src/app/(public)/philosophy" "src/app/(public)/contact" "src/app/(public)/stores" "src/app/(public)/faq" "src/app/(public)/privacy" "src/app/(public)/terms" src/features/contact/contact-form.tsx
git commit -m "style: terracotta static pages and contact form"
```

---

### Task 10: System states — 404, error, loading

**Files:**
- Modify: `src/app/(public)/not-found.tsx`, `src/app/not-found.tsx`
- Modify: `src/app/(public)/error.tsx`
- Modify: `src/app/(public)/loading.tsx`

- [ ] **Step 1: not-found (kedua file)**

- Watermark `text-noir-800/60` → `text-roast-700/25`.
- Rule `bg-champagne-500/80` → `bg-terra-500/80`; overline `text-champagne-400` → `text-terra-500`.
- Judul `text-ivory-50` → `text-foreground`; deskripsi → `text-muted-foreground`.

- [ ] **Step 2: error (`error.tsx`)**

- Rule/overline → terra; judul → `text-foreground`; deskripsi → `text-muted-foreground`.

- [ ] **Step 3: loading (`loading.tsx`)**

- Skeleton tetap (menggunakan `bg-muted` yang sudah terracotta). Opsional: ubah teks apa pun `text-muted-foreground` (jika ada). Tidak ada perubahan lain.

- [ ] **Step 4: Verifikasi & commit**

Run: `npm run typecheck` lalu `npm run lint`
Expected: keduanya PASS

```bash
git add "src/app/(public)/not-found.tsx" "src/app/(public)/error.tsx" "src/app/(public)/loading.tsx" src/app/not-found.tsx
git commit -m "style: terracotta system states (404, error, loading)"
```

---

### Task 11: Cek anti-AI-slop & kebersihan

**Files:**
- Review: seluruh `src/app/(public)/**`, `src/components/layout/**`, `src/components/products/**`, `src/features/homepage/**`, `src/features/contact/**`

- [ ] **Step 1: Grep pola terlarang**

Run:

```bash
npm run lint
```

Lalu cari pola terlarang di file publik:

```powershell
Get-ChildItem -Path "src/app/(public)","src/components/layout","src/components/products","src/features/homepage","src/features/contact" -Recurse -Include *.tsx | Select-String -Pattern "rounded-full|from-purple|to-blue|backdrop-blur|text-gradient|✨|🚀|🎉"
```

Expected: **0 hasil** untuk emoji dan gradient (gallery overlay `from-roast-800/90` adalah satu-satunya gradient yang diizinkan — overlay foto).

- [ ] **Step 2: Cek sisa token lama di file publik**

Run:

```powershell
Get-ChildItem -Path "src/app/(public)","src/components/layout","src/components/products","src/features/homepage","src/features/contact" -Recurse -Include *.tsx | Select-String -Pattern "noir-|ivory-|champagne-"
```

Expected: 0 hasil (kecuali di blok comment yang tak terpakai). Admin tidak ikut.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify anti AI-slop rules across public site"
```

---

### Task 12: Verifikasi final — typecheck, lint, browser audit

**Files:**
- Review: seluruh perubahan

- [ ] **Step 1: Typecheck & lint**

Run: `npm run typecheck` dan `npm run lint`
Expected: keduanya PASS, 0 error.

- [ ] **Step 2: Build produksi**

Run: `npm run build`
Expected: build sukses (server data pages mungkin perlu Supabase aktif).

- [ ] **Step 3: Audit browser desktop (1440px)**

Mulai dev server, buka `http://localhost:3000`. Evaluasi via `evaluate_script`:

```js
() => {
  const el = document.documentElement;
  const bg = getComputedStyle(document.body).backgroundColor;
  const btn = document.querySelector("button");
  const overflow = el.scrollWidth > el.clientWidth;
  return {
    bodyBg: bg,
    bodyText: getComputedStyle(document.body).color,
    heroH1Font: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).fontFamily : null,
    overflowX: overflow,
    fontsLoaded: document.fonts.check('16px "Inter"') && document.fonts.check('16px "Fraunces"'),
  };
}
```

Expected: `bodyBg` ≈ `rgb(244, 238, 227)` (clay-50), teks cokelat, font Inter/Fraunces, `overflowX: false`.

- [ ] **Step 4: Audit mobile (390px)**

Gunakan `chrome-devtools_emulate` viewport `390x844x1,mobile,touch`. Periksa: tidak ada overflow horizontal, hamburger terlihat, header nav tidak terpotong. Cek juga halaman produk, detail, tentang, kontak, FAQ, 404.

- [ ] **Step 5: Cek kontras tombol solid**

Evaluasi computed style tombol `bg-primary`: warna bg `rgb(169, 77, 40)` (terra-500) dan teks `rgb(248, 244, 235)` (cream-100). Hitung rasio kontras ≈ 5.1:1 → lolos WCAG AA (≥ 4.5:1).

- [ ] **Step 6: Final commit (jika ada sisa)**

```bash
git add -A
git commit -m "style: final terracotta verification fixes"
```

---

## Self-Review

**Coverage spesifikasi:**
- §2 palet & §2.2 tipografi → Task 1-2
- §2.3 tombol → Task 3
- §4.1 navigasi/IA → Task 4
- §4.3 state coverage → Task 10
- §4.4 aksesibilitas (ring, kontras) → Task 2, 12
- §5 halaman → Task 4-10
- §3 anti-AI-slop → Task 11
- §7 verifikasi → Task 12

**Konsistensi token:** Semua token baru menggunakan penamaan clay/terra/honey/roast/cream secara konsisten. `text-terra-500` dipakai untuk aksen di latar terang; `text-honey-300` hanya di dalam blok gelap. Admin tidak disentuh (blok `.admin` + 4 raw `champagne-500` aman karena token lama tetap ada).
