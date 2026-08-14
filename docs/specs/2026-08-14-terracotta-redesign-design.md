# Spesifikasi Desain: Relaunch Terracotta — Rempah & Tanah

- **Tanggal:** 2026-08-14
- **Status:** Disetujui (brainstorming visual)
- **Scope:** Seluruh situs publik Turaya (bukan admin)
- **Keputusan yang disetujui:** Terracotta · terang dominan + aksen gelap · Fraunces + Inter · visual + UX menyeluruh

## 1. Ringkasan

Relaunch penuh situs publik dari tema gelap noir/champagne menjadi tema **terracotta yang
membumi** — hangat seperti tanah kering dan tembikar, dengan aksen rempah dan kuning madu.
Perubahan mencakup visual (palet, tipografi, tekstur, komposisi) sekaligus UX (navigasi, CTA,
state, aksesibilitas). Tampilan baru harus terasa artisanal dan sangat Nusantara, bukan template
AI generik.

## 2. Arah Desain — "Rempah & Tanah"

Karakter: hangat, artisanal, membumi, jujur. Terinspirasi tanah liat, tembikar, rempah kering,
daun tembakau, dan sinar matahari sore. Layak untuk parfum & home fragrance premium namun tidak
sombong.

Aturan ruh desain:

- **Terang dominan**: krem tanah sebagai latar utama di sebagian besar halaman.
- **Aksen gelap**: blok cokelat pekat hanya di area kunci (hero, footer, beberapa kartu) sebagai
  kontras dan penutup.
- **Garis tipis & tekstur kertas**: border 1px, garis hairline, angka urut — bukan glow/bayangan.
- **Jujur & artisan**: struktur oleh tipografi dan whitespace, bukan dekorasi.

### 2.1 Palet (token terracotta)

| Token | Nilai | Peran |
|---|---|---|
| `--color-clay-50` (bg utama) | `#F4EEE3` | latar krem tanah |
| `--color-clay-100` | `#EAE1D1` | latar kartu/kotak |
| `--color-clay-200` | `#DCD0BC` | border kuat / placeholder |
| `--color-clay-300` | `#C4B69D` | border lembut |
| `--color-terra-500` (accent) | `#B4552D` | terracotta — aksen utama, tombol solid |
| `--color-terra-400` | `#C66A3F` | hover accent |
| `--color-honey-400` | `#D9A441` | madu — aksen sekunder, overline |
| `--color-roast-700` (dark) | `#3E2C22` | cokelat pekat — teks utama, blok gelap |
| `--color-roast-800` | `#2E2018` | blok gelap dalam |
| `--color-roast-500` | `#7A5C3E` | teks sekunder (muted) |
| `--color-roast-300` | `#A68F72` | teks tersier (faded) |
| `--color-cream-100` | `#F8F4EB` | teks di atas blok gelap |
| `--color-cream-200` | `#E9C68F` | aksen teks di atas blok gelap (madu muda) |

Mapping semantik: `--background` = clay-50; `--foreground` = roast-700; `--primary` = terra-500;
`--primary-foreground` = cream-100; `--muted` = clay-100; `--muted-foreground` = roast-500;
`--border` = clay-300; `--input` = clay-100; `--ring` = terra-500.

Di atas blok gelap (dark section): teks cream-100, muted-foreground = clay-200, border =
roast-500/40.

### 2.2 Tipografi

- **Display / judul:** Fraunces (Google Fonts) — serif hangat dengan karakter artisan.
  - `font-display` diubah dari Cormorant → Fraunces (opsional weight variable).
- **Body / UI:** Inter — bersih, netral, keterbacaan tinggi.
  - `font-sans` diubah dari Figtree → Inter.
- Overline/keterangan kecil: huruf kapital, `letter-spacing` luas (`.overline` dipertahankan).
- Angka: `tabular-nums` untuk harga & jumlah.

### 2.3 Tombol (anti-AI-slop)

- **Solid (primary):** bg terra-500, teks cream-100, sudut kecil (`rounded-sm`/2px), huruf kapital
  ber-spasi lebar, **tanpa bayangan dan tanpa glow**.
- **Outline:** transparan, border 1px roast-700/teks roast-700; pada blok gelap border cream-200.
- **Hover:** hanya perubahan warna solid (terra-500 → terra-400) atau border; tidak ada scale/3D.
- Ukuran tegas (`h-10`/`h-12`), label CTA eksplisit: "Jelajahi Katalog", "Beli Sekarang",
  "Kirim Pesan", "Lihat Semua".
- Ikon panah `→` hanya jika menunjuk ke aksi lanjut (bukan dekorasi).

## 3. Anti AI-Slop — Larangan (binding)

Pola berikut **dilarang** di seluruh situs:

1. Gradient ungu/biru/teal; gradient text pada judul.
2. Glassmorphism, backdrop-blur yang mencolok, efek glow/neon.
3. Emoji di CTA, judul, atau konten UI (🚀 ✨ 🎉).
4. Tombol pill `rounded-full` dengan bayangan tebal; gradasi pada tombol.
5. Ikon generik yang dipasang asal; efek tilt 3D palsu; parallax yang tidak perlu.
6. Kartu yang identik seragam tanpa variasi hierarki.
7. Copy AI-generik ("Elevate your senses", "Unlock the magic", dsb) — semua teks Indonesia
   natural, spesifik, dan sesuai brand.
8. Banyaknya radius yang tidak konsisten (selalu 2px/`rounded-sm`).

Setiap fitur baru harus lolos cek: "Apakah ini bisa diproduksi di buku cetak tahun 1960?"
Jika tidak, jangan dipakai.

## 4. Perbaikan UX (menyeluruh)

### 4.1 Navigasi & IA
- Nav tetap 7 item; beri label lebih jelas & aktif state terang (bg clay-100 / underline terra).
- Breadcrumb konsisten di semua halaman dalam (produk, koleksi, jurnal).
- Footer: 3 kolom (Jelajahi / Informasi / Ikuti Kami) — sudah ada, sesuaikan warna token baru.

### 4.2 CTA & copy
- Setiap CTA menyatakan aksi: "Beli Sekarang" (detail produk), "Jelajahi Katalog"
  (hero), "Lihat Semua" (listing), "Kirim Pesan" (kontak), "Kembali ke Beranda" (404).
- Hapus ambiguitas: tombol "Jelajahi koleksi" → "Lihat Koleksi".

### 4.3 State coverage
- **Loading:** skeleton tetap, warnanya clay-100/terracotta muda (bukan noir).
- **Empty:** pesan jelas + tautan tindakan ("Belum ada produk — Lihat koleksi lain").
- **Error:** 404/500 dengan teks hangat + CTA "Kembali ke Beranda".
- **Form:** error field jelas (warna terra/destructive), sukses kirim dengan konfirmasi.

### 4.4 Aksesibilitas
- Kontras teks/tombol memenuhi WCAG AA (roast-700 di clay-50 = kontras tinggi; terra-500 solid
  dengan teks cream harus dicek ≥ 4.5:1 untuk teks kecil).
- Fokus keyboard terlihat (`ring-2 ring-terra-500`).
- Emoji tidak boleh menggantikan label.

## 5. Halaman & Komponen yang Diubah

Semua file di `src/app/(public)/` dan komponen shared:

- `globals.css` — token warna baru, font swap (Fraunces/Inter), variabel semantik.
- `layout.tsx` (public) — announcement bar, skema warna.
- `public-nav.tsx` / `public-footer.tsx` — warna, state aktif, logo monogram terracotta.
- `button.tsx` — varian solid/outline terracotta.
- Hero homepage, story, about-section — komposisi terang + blok gelap.
- `products`, `collections`, `ingredients`, `journal`, `gallery`, `about`, `philosophy`,
  `contact`, `stores`, `faq`, `privacy`, `terms`, `not-found`, `error`, `loading`.
- `product-card.tsx`, `product-gallery.tsx`, `contact-form.tsx`.
- SEO/metadata tidak berubah.

## 6. Di Luar Cakupan

- Admin dashboard (tidak disentuh).
- Fitur baru (keranjang, checkout) — tidak ada.
- Migrasi data Supabase — tidak ada.

## 7. Verifikasi

1. `npm run typecheck` dan `npm run lint` lulus.
2. Audit browser: tidak ada horizontal overflow di 1440px & 390px.
3. Cek kontras tombol solid (WCAG) via evaluasi computed style.
4. Cek tidak ada pattern terlarang (grep: gradient, emoji, rounded-full tombol).
5. Screenshot/snapshot tiap halaman utama di desktop & mobile.

## 8. Risiko

- Font swap menambah beban muat — gunakan `next/font` self-host, bukan CDN eksternal.
- Mengganti token warna besar = risiko kontras; verifikasi kontras per komponen.
- Tombol solid terracotta dengan teks cream-100 berisiko kontras rendah — jaga teks putih
  murni `#FFFFFF` atau pertebal font jika < 4.5:1.
