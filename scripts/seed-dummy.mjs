import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const envRaw = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "").trim();
}
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const HEADERS = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };

async function postJson(path, body) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res;
}

async function patchJson(path, body) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res;
}

async function uploadSvg(bucket, path, svg) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "image/svg+xml",
      "x-upsert": "true",
    },
    body: svg,
  });
  if (!res.ok) throw new Error(`upload ${bucket}/${path}: ${res.status} ${await res.text()}`);
}

// ---- SVG generator: terracotta placeholder ----
const palette = {
  clay: ["#f4eee3", "#eae1d1"],
  terra: ["#c66a3f", "#a94d28"],
  honey: ["#e9c68f", "#d9a441"],
  roast: ["#5a4430", "#2e2018"],
  cream: ["#f8f4eb", "#ede5d8"],
};

function svgPlaceholder({ label, accent, ratio = "3:4", tone = "light" }) {
  const [w, h] = ratio === "3:4" ? [600, 800] : ratio === "4:3" ? [800, 600] : [800, 800];
  const bg = tone === "dark" ? ["#2e2018", "#3e2c22"] : palette.clay;
  const ring = accent;
  const glyph = label.slice(0, 1).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="${bg[0]}"/>
      <stop offset="100%" stop-color="${bg[1]}"/>
    </radialGradient>
    <radialGradient id="glow" cx="70%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${ring[0]}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${ring[0]}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.22}" r="${h * 0.16}" fill="none" stroke="${ring[1]}" stroke-opacity="0.5" stroke-width="1.5"/>
  <circle cx="${w * 0.78}" cy="${h * 0.22}" r="${h * 0.3}" fill="none" stroke="${ring[1]}" stroke-opacity="0.22" stroke-width="1"/>
  <text x="${w * 0.08}" y="${h * 0.5}" font-family="Georgia, 'Times New Roman', serif" font-size="${h * 0.34}" fill="${ring[1]}">${glyph}</text>
  <text x="${w * 0.09}" y="${h * 0.66}" font-family="Georgia, serif" font-size="${h * 0.045}" letter-spacing="4" fill="${tone === "dark" ? "#e9c68f" : "#a94d28"}" text-transform="uppercase">${label.toUpperCase()}</text>
</svg>`;
}

const created = new Date().toISOString();

// ============ 1. UPLOAD SVG PLACEHOLDERS ============
const uploads = [];
const productSlugs = [
  ["turaya-no-1", "No. 1"],
  ["turaya-no-2", "Senja"],
  ["turaya-no-3", "Kebun Vanili"],
  ["turaya-no-4", "Kabut Pinus"],
  ["lilin-rumah-kampung", "Rumah"],
  ["diffuser-taman-melati", "Melati"],
  ["room-spray-pantai-utara", "Pantai"],
];
for (const [slug, label] of productSlugs) {
  uploads.push([["products", `${slug}.svg`], svgPlaceholder({ label, accent: palette.terra })]);
}
const ingredientSlugs = ["cengkih", "pala", "kayu-manis", "serai-wangi", "pandan", "nilam", "kenanga"];
for (const slug of ingredientSlugs) {
  uploads.push([["ingredients", `${slug}.svg`], svgPlaceholder({ label: slug, accent: palette.terra, ratio: "4:3" })]);
}
const galleryItems = [
  ["kampung", "Kampung"],
  ["bahan-kering", "Bahan"],
  ["distilasi", "Distilasi"],
  ["kebun-vanili", "Kebun"],
  ["taman-melati", "Melati"],
  ["butik-bandung", "Butik"],
  ["senja-nusantara", "Senja"],
  ["rumah-turaya", "Rumah"],
];
for (const [slug, label] of galleryItems) {
  uploads.push([["gallery", `${slug}.svg`], svgPlaceholder({ label, accent: palette.honey, ratio: "4:3" })]);
}
const journalPosts = [
  ["mengenal-aroma-cengkih", "Cengkih"],
  ["ritual-menyambut-panen", "Panen"],
  ["cara-menyimpan-parfum", "Simpan"],
  ["senja-di-kebun-vanili", "Vanili"],
];
for (const [slug, label] of journalPosts) {
  uploads.push([["journal", `${slug}.svg`], svgPlaceholder({ label, accent: palette.honey, ratio: "16:10" })]);
}
uploads.push([
  ["branding", "hero.svg"],
  svgPlaceholder({ label: "Turaya", accent: palette.honey, ratio: "16:10", tone: "dark" }),
]);
uploads.push([
  ["branding", "about.svg"],
  svgPlaceholder({ label: "Turaya", accent: palette.terra, ratio: "4:3" }),
]);

for (const [[bucket, path], svg] of uploads) {
  await uploadSvg(bucket, path, svg);
  console.log(`uploaded ${bucket}/${path}`);
}

// ============ 2. DATA ============
const id = {
  categories: { parfum: "b0000000-0000-0000-0000-000000000001", home: "b0000000-0000-0000-0000-000000000002" },
  collections: { first: "a0000000-0000-0000-0000-000000000001" },
  ingredients: { cendana: "d0000000-0000-0000-0000-000000000001", melati: "d0000000-0000-0000-0000-000000000002", vanili: "d0000000-0000-0000-0000-000000000003" },
  product1: "c0000000-0000-0000-0000-000000000001",
};

// --- collections (3 new) ---
const seriNusantara = randomUUID();
const seriSenja = randomUUID();
const rumah = randomUUID();
await postJson("/rest/v1/collections", [
  { id: seriNusantara, name: "Seri Nusantara", slug: "seri-nusantara", description: "Aroma yang menempuh ribuan kilometer dari kampung halaman.", story: "Tiap racikan dalam seri ini lahir dari perjalanan ke kebun dan rumah produksi kecil di pelosok nusantara — cengkih dari Maluku, pala dari Pulau Banda, vanili dari lereng Jawa.", cover_image_path: null, featured: true, sort_order: 2, status: "published", created_at: created, updated_at: created },
  { id: seriSenja, name: "Seri Senja", slug: "seri-senja", description: "Aroma yang paling hangat saat senja tiba.", story: "Terinspirasi dari momen tenang menjelang malam — kayu manis, kenanga, dan sentuhan vanili yang menenangkan.", cover_image_path: null, featured: false, sort_order: 3, status: "published", created_at: created, updated_at: created },
  { id: rumah, name: "Seri Rumah", slug: "seri-rumah", description: "Rumah aroma untuk ruang yang kamu tinggali.", story: "Lilin, diffuser, dan semprotan ruangan yang membawa kehangatan kampung ke dalam rumah.", cover_image_path: null, featured: true, sort_order: 4, status: "published", created_at: created, updated_at: created },
]);
console.log("collections: 3 inserted");

// --- products (6 new) ---
const p2 = randomUUID(), p3 = randomUUID(), p4 = randomUUID(), p5 = randomUUID(), p6 = randomUUID(), p7 = randomUUID();
await postJson("/rest/v1/products", [
  { id: p2, name: "Turaya No. 2", slug: "turaya-no-2", tagline: "Aroma senja", description: "Perpaduan cengkih dan kayu manis yang hangat, dengan dasar cendana yang membumi.", story: "Dirancang untuk menemani momen paling tenang — secangkir teh hangat dan senja di ujung gang.", category_id: id.categories.parfum, collection_id: seriSenja, size: "50 ml", price: 550000, featured: true, status: "published", created_at: created, updated_at: created },
  { id: p3, name: "Turaya No. 3", slug: "turaya-no-3", tagline: "Kebun vanili", description: "Vanili manis berpadu melati dan sejumput kayu manis.", story: "Menghadirkan aroma kebun vanili di lereng timur Jawa.", category_id: id.categories.parfum, collection_id: seriNusantara, size: "50 ml", price: 650000, featured: true, status: "published", created_at: created, updated_at: created },
  { id: p4, name: "Turaya No. 4", slug: "turaya-no-4", tagline: "Kabut pinus", description: "Serai wangi dan nilam yang segar, ditutup cendana yang dalam.", story: "Aroma hutan pinus berkabut di dataran tinggi.", category_id: id.categories.parfum, collection_id: seriNusantara, size: "50 ml", price: 490000, featured: false, status: "published", created_at: created, updated_at: created },
  { id: p5, name: "Lilin Rumah Kampung", slug: "lilin-rumah-kampung", tagline: "Lilin aroma cengkih & kayu manis", description: "Lilin kedelai dengan aroma cengkih hangat.", story: "Membakar lilin ini seperti kembali ke dapur kampung.", category_id: id.categories.home, collection_id: rumah, size: "180 g", price: 185000, featured: true, status: "published", created_at: created, updated_at: created },
  { id: p6, name: "Diffuser Taman Melati", slug: "diffuser-taman-melati", tagline: "Diffuser melati & pandan", description: "Aroma taman melati yang tahan hingga 8 minggu.", story: "Tanpa api dan tanpa asap, keharuman melati menyebar pelan.", category_id: id.categories.home, collection_id: rumah, size: "100 ml", price: 245000, featured: true, status: "published", created_at: created, updated_at: created },
  { id: p7, name: "Room Spray Pantai Utara", slug: "room-spray-pantai-utara", tagline: "Semprotan ruangan serai & pala", description: "Kesegaran serai wangi dengan sentuhan pala.", story: "Satu semprotan membawa angin pantai utara ke ruanganmu.", category_id: id.categories.home, collection_id: rumah, size: "50 ml", price: 165000, featured: false, status: "published", created_at: created, updated_at: created },
]);
console.log("products: 6 inserted");

// --- ingredients (7 new) ---
const iCengkih = randomUUID(), iPala = randomUUID(), iKayuManis = randomUUID(), iSerai = randomUUID(), iPandan = randomUUID(), iNilam = randomUUID(), iKenanga = randomUUID();
await postJson("/rest/v1/ingredients", [
  { id: iCengkih, name: "Cengkih", slug: "cengkih", origin: "Maluku Utara", description: "Aroma hangat, pedas, dan khas rempah.", story: "Dikeringkan di bawah sinar matahari selama tiga hari sebelum disuling.", image_path: "ingredients/cengkih.svg", status: "published", sort_order: 1, created_at: created, updated_at: created },
  { id: iPala, name: "Pala", slug: "pala", origin: "Pulau Banda", description: "Aroma manis-rempah yang dalam.", story: "Buah pala dipanen saat jatuh alami, lalu dijemur hingga kering.", image_path: "ingredients/pala.svg", status: "published", sort_order: 2, created_at: created, updated_at: created },
  { id: iKayuManis, name: "Kayu Manis", slug: "kayu-manis", origin: "Sumatera Barat", description: "Aroma manis hangat khas kulit kayu.", story: "Kulit kayu manis dikupas dan dikeringkan selama dua minggu.", image_path: "ingredients/kayu-manis.svg", status: "published", sort_order: 3, created_at: created, updated_at: created },
  { id: iSerai, name: "Serai Wangi", slug: "serai-wangi", origin: "Jawa Barat", description: "Aroma segar, sitrus, dan berenergi.", story: "Daun serai wangi disuling untuk mengambil minyak esensialnya.", image_path: "ingredients/serai-wangi.svg", status: "published", sort_order: 4, created_at: created, updated_at: created },
  { id: iPandan, name: "Pandan", slug: "pandan", origin: "Jawa Timur", description: "Aroma manis hijau yang menenangkan.", story: "Daun pandan yang harum dikeringkan perlahan.", image_path: "ingredients/pandan.svg", status: "published", sort_order: 5, created_at: created, updated_at: created },
  { id: iNilam, name: "Nilam", slug: "nilam", origin: "Aceh", description: "Aroma earthy, woody, dan dalam.", story: "Daun nilam dikeringkan lalu disuling selama berjam-jam.", image_path: "ingredients/nilam.svg", status: "published", sort_order: 6, created_at: created, updated_at: created },
  { id: iKenanga, name: "Kenanga", slug: "kenanga", origin: "Jawa", description: "Aroma floral eksotis yang lembut.", story: "Bunga kenanga dipetik sebelum fajar.", image_path: "ingredients/kenanga.svg", status: "published", sort_order: 7, created_at: created, updated_at: created },
]);
console.log("ingredients: 7 inserted");

// --- product_ingredients (notes) ---
await postJson("/rest/v1/product_ingredients", [
  { product_id: p2, ingredient_id: iCengkih, note_stage: "top", position: 1 },
  { product_id: p2, ingredient_id: iKayuManis, note_stage: "heart", position: 1 },
  { product_id: p2, ingredient_id: id.ingredients.cendana, note_stage: "base", position: 1 },
  { product_id: p3, ingredient_id: id.ingredients.melati, note_stage: "top", position: 1 },
  { product_id: p3, ingredient_id: id.ingredients.vanili, note_stage: "heart", position: 1 },
  { product_id: p3, ingredient_id: iKayuManis, note_stage: "base", position: 1 },
  { product_id: p4, ingredient_id: iSerai, note_stage: "top", position: 1 },
  { product_id: p4, ingredient_id: iNilam, note_stage: "heart", position: 1 },
  { product_id: p4, ingredient_id: id.ingredients.cendana, note_stage: "base", position: 1 },
  { product_id: p5, ingredient_id: iCengkih, note_stage: "top", position: 1 },
  { product_id: p5, ingredient_id: iKayuManis, note_stage: "heart", position: 1 },
  { product_id: p6, ingredient_id: id.ingredients.melati, note_stage: "top", position: 1 },
  { product_id: p6, ingredient_id: iPandan, note_stage: "heart", position: 1 },
  { product_id: p6, ingredient_id: id.ingredients.vanili, note_stage: "base", position: 1 },
  { product_id: p7, ingredient_id: iSerai, note_stage: "top", position: 1 },
  { product_id: p7, ingredient_id: iPala, note_stage: "heart", position: 1 },
]);
console.log("product_ingredients: 16 inserted");

// --- product_images ---
await postJson("/rest/v1/product_images", [
  { product_id: id.product1, path: "turaya-no-1.svg", alt: "Botol Turaya No. 1", sort_order: 1, created_at: created },
  { product_id: p2, path: "turaya-no-2.svg", alt: "Botol Turaya No. 2", sort_order: 1, created_at: created },
  { product_id: p3, path: "turaya-no-3.svg", alt: "Botol Turaya No. 3", sort_order: 1, created_at: created },
  { product_id: p4, path: "turaya-no-4.svg", alt: "Botol Turaya No. 4", sort_order: 1, created_at: created },
  { product_id: p5, path: "lilin-rumah-kampung.svg", alt: "Lilin Rumah Kampung", sort_order: 1, created_at: created },
  { product_id: p6, path: "diffuser-taman-melati.svg", alt: "Diffuser Taman Melati", sort_order: 1, created_at: created },
  { product_id: p7, path: "room-spray-pantai-utara.svg", alt: "Room Spray Pantai Utara", sort_order: 1, created_at: created },
]);
console.log("product_images: 6 inserted");

// --- collection_products ---
await postJson("/rest/v1/collection_products", [
  { collection_id: seriSenja, product_id: p2, sort_order: 0 },
  { collection_id: seriNusantara, product_id: p3, sort_order: 0 },
  { collection_id: seriNusantara, product_id: p4, sort_order: 1 },
  { collection_id: rumah, product_id: p5, sort_order: 0 },
  { collection_id: rumah, product_id: p6, sort_order: 1 },
  { collection_id: rumah, product_id: p7, sort_order: 2 },
]);
console.log("collection_products: 6 inserted");

// --- journal_categories (1 new) + tags (2 new) ---
const catTeknik = randomUUID();
await postJson("/rest/v1/journal_categories", [
  { id: catTeknik, name: "Teknik", slug: "teknik", created_at: created },
]);
const tagBahan = randomUUID(), tagCara = randomUUID();
await postJson("/rest/v1/journal_tags", [
  { id: tagBahan, name: "Bahan", slug: "bahan", created_at: created },
  { id: tagCara, name: "Cara", slug: "cara", created_at: created },
]);
console.log("journal_categories: 1, journal_tags: 2 inserted");

// --- journal_posts (4 new) + post_tags ---
const j1 = randomUUID(), j2 = randomUUID(), j3 = randomUUID(), j4 = randomUUID();
const catCerita = "e0000000-0000-0000-0000-000000000001";
const catRitual = "0e4ca42b-970d-4f9a-b14b-e29d80c1ad4f";
const tagBahanLokal = "f0000000-0000-0000-0000-000000000001";
await postJson("/rest/v1/journal_posts", [
  { id: j1, title: "Mengenal Aroma Cengkih", slug: "mengenal-aroma-cengkih", excerpt: "Kenapa cengkih selalu menjadi jembatan antara makanan dan parfum.", body: `# Cengkih, Rempah yang Mengikat

Cengkih telah lama menemani dapur dan ritual nusantara. Di Turaya, cengkih menjadi salah satu bahan paling penting karena aromanya yang hangat dan khas.

## Dari kampung ke botol

Bunga cengkih dipetik, dikeringkan, lalu disuling. Prosesnya lambat — dan justru di situlah kehangatannya tertangkap.`, cover_image_path: "journal/mengenal-aroma-cengkih.svg", author_id: null, category_id: catCerita, status: "published", published_at: created, created_at: created, updated_at: created },
  { id: j2, title: "Ritual Menyambut Panen", slug: "ritual-menyambut-panen", excerpt: "Petani kami membuka panen dengan syukur.", body: `# Ritual Menyambut Panen

Sebelum memetik, petani kami menyempatkan diri untuk berdiam dan bersyukur. Ritual sederhana yang membuat hasil panen selalu dijaga dengan sabar.`, cover_image_path: "journal/ritual-menyambut-panen.svg", author_id: null, category_id: catRitual, status: "published", published_at: created, created_at: created, updated_at: created },
  { id: j3, title: "Cara Menyimpan Parfum", slug: "cara-menyimpan-parfum", excerpt: "Lima kebiasaan sederhana agar parfummu awet.", body: `# Cara Menyimpan Parfum

1. Jauhkan dari sinar matahari langsung
2. Simpan di tempat sejuk dan kering
3. Tutup rapat setelah dipakai
4. Jangan kocok botol
5. Pakai dalam 24 bulan

Dengan kebiasaan ini, aroma favoritmu akan bertahan lebih lama.`, cover_image_path: "journal/cara-menyimpan-parfum.svg", author_id: null, category_id: catTeknik, status: "published", published_at: created, created_at: created, updated_at: created },
  { id: j4, title: "Senja di Kebun Vanili", slug: "senja-di-kebun-vanili", excerpt: "Perjalanan ke kebun vanili di lereng timur Jawa.", body: `# Senja di Kebun Vanili

Saat matahari tenggelam, kebun vanili berubah warna menjadi keemasan. Aroma manis mulai terasa di udara.

## Polinasi tangan

Karena anggrek vanili hanya mekar sehari dalam setahun, tiap bunga dipolinasi dengan tangan. Sabar adalah bahan utamanya.`, cover_image_path: "journal/senja-di-kebun-vanili.svg", author_id: null, category_id: catCerita, status: "published", published_at: created, created_at: created, updated_at: created },
]);
console.log("journal_posts: 4 inserted");

await postJson("/rest/v1/post_tags", [
  { post_id: j1, tag_id: tagBahan },
  { post_id: j1, tag_id: tagBahanLokal },
  { post_id: j2, tag_id: tagCara },
  { post_id: j3, tag_id: tagCara },
  { post_id: j4, tag_id: tagBahanLokal },
]);
console.log("post_tags: 5 inserted");

// --- faq_items (7 new) ---
await postJson("/rest/v1/faq_items", [
  { question: "Apakah aman untuk kulit sensitif?", answer: "Produk kami diformulasikan dengan bahan alami. Namun kami sarankan uji tempel di kulit pergelangan tangan sebelum penggunaan penuh.", category: "Produk", sort_order: 2, status: "published", created_at: created, updated_at: created },
  { question: "Berapa lama aroma bertahan?", answer: "Untuk EDP, aroma bertahan 6-8 jam di kulit. Di pakaian bisa lebih lama. Ketahanan juga dipengaruhi jenis kulit dan cuaca.", category: "Produk", sort_order: 3, status: "published", created_at: created, updated_at: created },
  { question: "Berapa lama waktu pengiriman?", answer: "Pengiriman ke kota besar 1-3 hari kerja, ke daerah lain 3-7 hari kerja. Kami mengirim dari Bandung setiap hari kerja.", category: "Pengiriman", sort_order: 4, status: "published", created_at: created, updated_at: created },
  { question: "Apakah tersedia pengiriman ke luar negeri?", answer: "Ya, untuk kawasan ASEAN dan beberapa negara lain. Biaya menyesuaikan kurir internasional.", category: "Pengiriman", sort_order: 5, status: "published", created_at: created, updated_at: created },
  { question: "Bagaimana cara menyimpan produk?", answer: "Simpan di tempat sejuk, kering, dan jauh dari sinar matahari langsung agar aroma tetap terjaga.", category: "Perawatan", sort_order: 6, status: "published", created_at: created, updated_at: created },
  { question: "Apakah ada program isi ulang?", answer: "Kami mendukung isi ulang di butik Bandung. Bawa botol Turaya dan nikmati potongan harga.", category: "Perawatan", sort_order: 7, status: "published", created_at: created, updated_at: created },
  { question: "Apakah bisa COD?", answer: "Saat ini kami melayani transfer bank, kartu, dan e-wallet. COD tersedia untuk area Bandung Raya.", category: "Pengiriman", sort_order: 8, status: "published", created_at: created, updated_at: created },
]);
console.log("faq_items: 7 inserted");

// --- gallery_items (8 new) ---
const galleryPaths = {
  "kampung": "Kampung halaman petani di kaki gunung.",
  "bahan-kering": "Rempah-rempah dijemur di bawah matahari.",
  "distilasi": "Proses penyulingan uap di rumah produksi kecil.",
  "kebun-vanili": "Kebun vanili di lereng timur Jawa.",
  "taman-melati": "Melati dipetik sebelum fajar.",
  "butik-bandung": "Butik Turaya di Jalan Braga, Bandung.",
  "senja-nusantara": "Senja keemasan di kebun rempah.",
  "rumah-turaya": "Rumah produksi Turaya.",
};
let galSort = 1;
for (const [slug, caption] of Object.entries(galleryPaths)) {
  const cat = ["kampung", "kebun-vanili", "senja-nusantara"].includes(slug) ? "Kampung" : ["bahan-kering", "distilasi", "taman-melati"].includes(slug) ? "Bahan" : "Produk";
  await postJson("/rest/v1/gallery_items", [
    { alt: caption, caption, category: cat, path: `${slug}.svg`, sort_order: galSort++, status: "published", created_at: created, updated_at: created },
  ]);
}
console.log("gallery_items: 8 inserted");

// --- store_locations (3 new) ---
const hours = { "Senin - Jumat": "10.00 - 20.00", "Sabtu - Minggu": "10.00 - 21.00" };
await postJson("/rest/v1/store_locations", [
  { name: "Butik Turaya Jakarta", address: "Jl. Senopati No. 45, Kebayoran Baru", city: "Jakarta Selatan", country: "Indonesia", phone: "+62 21-0000-0000", email: "jakarta@turaya.id", hours, sort_order: 2, status: "published", created_at: created, updated_at: created },
  { name: "Butik Turaya Yogyakarta", address: "Jl. Malioboro No. 120", city: "Yogyakarta", country: "Indonesia", phone: "+62 274-000-000", email: "jogja@turaya.id", hours, sort_order: 3, status: "published", created_at: created, updated_at: created },
  { name: "Butik Turaya Bali", address: "Jl. Raya Ubud No. 12, Gianyar", city: "Ubud, Bali", country: "Indonesia", phone: "+62 361-000-000", email: "bali@turaya.id", hours, sort_order: 4, status: "published", created_at: created, updated_at: created },
]);
console.log("store_locations: 3 inserted");

// --- testimonials (3 new) ---
await postJson("/rest/v1/testimonials", [
  { quote: "Turaya No. 3 mengingatkanku pada kebun vanili masa kecil. Wanginya tahan seharian.", author: "Rina W.", title: "Penulis lepas", featured: true, sort_order: 2, status: "published", created_at: created, updated_at: created },
  { quote: "Lilin Rumah Kampung bikin rumah terasa seperti dapur nenek di sore hari.", author: "Dimas P.", title: "Arsitek", featured: false, sort_order: 3, status: "published", created_at: created, updated_at: created },
  { quote: "Pengiriman cepat dan aromanya benar-benar khas nusantara.", author: "Sari A.", title: "Pemilik kedai kopi", featured: false, sort_order: 4, status: "published", created_at: created, updated_at: created },
]);
console.log("testimonials: 3 inserted");

// --- homepage_sections: hero image + about image ---
await patchJson("/rest/v1/homepage_sections?slug=eq.hero", { image_path: "hero.svg" });
await patchJson("/rest/v1/homepage_sections?slug=eq.about", { image_path: "about.svg" });
console.log("homepage_sections: images linked");

// --- seo_metadata (8 new) ---
const seoPages = [
  ["products", "/products", "Produk - Turaya", "Koleksi parfum dan home fragrance dari bahan lokal pilihan."],
  ["ingredients", "/ingredients", "Bahan - Turaya", "Bahan-bahan lokal yang menjadi jiwa setiap aroma Turaya."],
  ["gallery", "/gallery", "Galeri - Turaya", "Lihat kampung, bahan, dan proses di balik setiap aroma."],
  ["about", "/about", "Tentang - Turaya", "Kenali kisah Turaya, rumah aroma nusantara."],
  ["philosophy", "/philosophy", "Filosofi - Turaya", "Filosofi di balik setiap racikan Turaya."],
  ["contact", "/contact", "Kontak - Turaya", "Hubungi tim Turaya untuk pertanyaan dan kerja sama."],
  ["faq", "/faq", "FAQ - Turaya", "Pertanyaan yang sering ditanyakan tentang produk Turaya."],
  ["stores", "/stores", "Toko - Turaya", "Temukan butik Turaya di kota terdekatmu."],
  ["privacy", "/privacy", "Kebijakan Privasi - Turaya", "Bagaimana Turaya melindungi data pribadimu."],
  ["terms", "/terms", "Syarat & Ketentuan - Turaya", "Syarat dan ketentuan penggunaan situs Turaya."],
];
for (const [page, canonical, title, desc] of seoPages) {
  await postJson("/rest/v1/seo_metadata", [
    { page, title, description: desc, canonical_url: canonical, robots: "index, follow", updated_at: created },
  ]);
}
console.log("seo_metadata: 10 inserted");

// --- site_settings ---
await patchJson("/rest/v1/site_settings?id=eq.00000000-0000-0000-0000-000000000001", {
  contact_phone: "+62 812-0000-0000",
  address: "Jl. Braga No. 88, Bandung, Jawa Barat",
  instagram_url: "https://instagram.com/turaya.id",
  tiktok_url: "https://tiktok.com/@turaya.id",
  whatsapp_number: "+6281200000000",
});
console.log("site_settings: updated");

// --- profiles (1 author for journal): existing super_admin profile, set display_name ---
await patchJson("/rest/v1/profiles?id=eq.7d15963a-3d01-421f-ad0d-56f4d890d1a5", {
  display_name: "Tim Turaya",
});
console.log("profiles: 1 updated");

console.log("\n=== SEED COMPLETE ===");
