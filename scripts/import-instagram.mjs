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

async function req(method, path, body) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}${path}`, {
        method,
        headers: HEADERS,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
      if (res.status === 204) return null;
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      if (attempt === 5) throw e;
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
}
const get = (p) => req("GET", p);
const post = (p, b) => req("POST", p, b);
const patch = (p, b) => req("PATCH", p, b);
const del = (p) => req("DELETE", p);

async function uploadJpg(bucket, path, buffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "image/jpeg",
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) throw new Error(`upload ${bucket}/${path}: ${res.status} ${await res.text()}`);
  console.log(`  uploaded ${bucket}/${path}`);
}

const created = new Date().toISOString();
const ASSETS = "scripts/instagram-assets";

async function main() {
  console.log("=== 1. UPLOAD PHOTOS TO STORAGE ===");
  // products
  await uploadJpg("products", "oil-car-diffuser.jpg", readFileSync(`${ASSETS}/oil-car-diffuser.jpg`));
  await uploadJpg("products", "reed-diffuser.jpg", readFileSync(`${ASSETS}/reed-diffuser.jpg`));
  await uploadJpg("products", "petrichor.jpg", readFileSync(`${ASSETS}/petrichor.jpg`));
  // gallery
  const galleryPhotos = [
    ["store-2026-03.jpg", "store-2026-03.jpg"],
    ["store-2025-09-a.jpg", "store-2025-09-a.jpg"],
    ["store-2025-09-b.jpg", "store-2025-09-b.jpg"],
    ["products-row.jpg", "products-row.jpg"],
    ["dt2uuukeu2c.jpg", "dt2uuukeu2c.jpg"],
    ["dr81fzdkf8q.jpg", "dr81fzdkf8q.jpg"],
    ["dm7bqepyiv9.jpg", "dm7bqepyiv9.jpg"],
    ["dm7a1ays81c.jpg", "dm7a1ays81c.jpg"],
  ];
  for (const [src, dst] of galleryPhotos) await uploadJpg("gallery", dst, readFileSync(`${ASSETS}/${src}`));
  // branding (hero/about/logo)
  await uploadJpg("branding", "hero.jpg", readFileSync(`${ASSETS}/store-2026-03.jpg`));
  await uploadJpg("branding", "about.jpg", readFileSync(`${ASSETS}/store-2025-09-b.jpg`));
  await uploadJpg("branding", "logo.jpg", readFileSync(`${ASSETS}/profile.jpg`));
  // journal
  await uploadJpg("journal", "petrichor.jpg", readFileSync(`${ASSETS}/petrichor.jpg`));

  console.log("\n=== 2. FIX PATH CONVENTION (seed used bucket prefix -> 400) ===");
  const jposts = await get("/rest/v1/journal_posts?select=id,cover_image_path");
  for (const jp of jposts) {
    if (jp.cover_image_path && jp.cover_image_path.startsWith("journal/")) {
      await patch(`/rest/v1/journal_posts?id=eq.${jp.id}`, { cover_image_path: jp.cover_image_path.replace("journal/", "") });
      console.log(`  journal ${jp.cover_image_path}`);
    }
  }
  const ingr = await get("/rest/v1/ingredients?select=id,image_path");
  for (const ig of ingr) {
    if (ig.image_path && ig.image_path.startsWith("ingredients/")) {
      await patch(`/rest/v1/ingredients?id=eq.${ig.id}`, { image_path: ig.image_path.replace("ingredients/", "") });
      console.log(`  ingredient ${ig.image_path}`);
    }
  }

  console.log("\n=== 3. CATEGORIES ===");
  const cats = await get("/rest/v1/categories?select=id,name,slug");
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c]));
  if (!bySlug["car-scent"]) {
    await post("/rest/v1/categories", [
      { name: "Car Scent", slug: "car-scent", description: "Aroma untuk perjalanan dan kabin mobil.", sort_order: 3, status: "published", created_at: created, updated_at: created },
    ]);
    console.log("  created car-scent");
  }

  console.log("\n=== 4. NEW PRODUCTS (real IG names + dummy pricing) ===");
  const collections = await get("/rest/v1/collections?select=id,slug");
  const colRumah = collections.find((c) => c.slug === "seri-rumah");
  const catHome = cats.find((c) => c.slug === "home-fragrance");
  const catParfum = cats.find((c) => c.slug === "parfum");
  const carScent = (await get("/rest/v1/categories?select=id&slug=eq.car-scent"))[0];

  const prods = await get("/rest/v1/products?select=id,slug");
  const prodBySlug = Object.fromEntries(prods.map((p) => [p.slug, p]));

  const newProducts = [];
  if (!prodBySlug["oil-car-diffuser"]) {
    newProducts.push({
      id: randomUUID(), name: "Oil Car Diffuser", slug: "oil-car-diffuser",
      tagline: "Aroma mobil yang tenang",
      description: "Diffuser gantung untuk kabin mobil. Aroma menyebar pelan, macet pun terasa lebih tenang.",
      story: "Cukup gantung di kaca spion atau dashboard. Aroma minyak akan menyebar perlahan dan bertahan selama berminggu-minggu.",
      category_id: carScent.id, collection_id: colRumah.id, size: "15 ml", price: 175000,
      featured: true, status: "published", created_at: created, updated_at: created,
    });
  }
  if (!prodBySlug["reed-diffuser"]) {
    newProducts.push({
      id: randomUUID(), name: "Reed Diffuser", slug: "reed-diffuser",
      tagline: "Aroma ruangan yang menenangkan",
      description: "Reed diffuser yang mengisi ruangan dengan aroma menenangkan, tahan hingga 8 minggu.",
      story: "Satu hal kecil yang memberi dampak besar. Seisi ruangan dipenuhi aroma yang menenangkan dan enak dipandang.",
      category_id: catHome.id, collection_id: colRumah.id, size: "100 ml", price: 245000,
      featured: true, status: "published", created_at: created, updated_at: created,
    });
  }
  if (!prodBySlug["diffuser-petrichor"]) {
    newProducts.push({
      id: randomUUID(), name: "Diffuser Petrichor", slug: "diffuser-petrichor",
      tagline: "Wangi hujan yang segar",
      description: "Wangi petrichor, aroma hujan pertama yang membasuh tanah, membawa kesegaran yang berbeda.",
      story: "Wangi hujan yang meningkatkan produktivitas dan memicu ide-ide baru. Kesegaran yang berbeda dari biasanya.",
      category_id: catParfum.id, collection_id: colRumah.id, size: "100 ml", price: 225000,
      featured: false, status: "published", created_at: created, updated_at: created,
    });
  }
  if (newProducts.length) {
    await post("/rest/v1/products", newProducts);
    console.log(`  created ${newProducts.length} products`);
  } else {
    console.log("  all products already exist");
  }

  console.log("\n=== 5. PRODUCT IMAGES ===");
  const refreshed = await get("/rest/v1/products?select=id,slug");
  const pBySlug = Object.fromEntries(refreshed.map((p) => [p.slug, p]));
  const imagesMap = [
    ["oil-car-diffuser", "oil-car-diffuser.jpg", "Oil Car Diffuser gantung untuk kabin mobil"],
    ["reed-diffuser", "reed-diffuser.jpg", "Reed diffuser untuk ruangan"],
    ["diffuser-petrichor", "petrichor.jpg", "Diffuser wangi petrichor setelah hujan"],
  ];
  const existingImgs = await get("/rest/v1/product_images?select=product_id,path");
  const hasImg = (pid, path) => existingImgs.some((i) => i.product_id === pid && i.path === path);
  for (const [slug, path, alt] of imagesMap) {
    const prod = pBySlug[slug];
    if (!prod || hasImg(prod.id, path)) continue;
    await post("/rest/v1/product_images", [{ product_id: prod.id, path, alt, sort_order: 1, created_at: created }]);
    console.log(`  linked ${path} -> ${slug}`);
  }

  console.log("\n=== 6. COLLECTION PRODUCTS ===");
  const cp = await get("/rest/v1/collection_products?select=collection_id,product_id");
  const hasCP = (cid, pid) => cp.some((x) => x.collection_id === cid && x.product_id === pid);
  const rumahCovers = ["oil-car-diffuser", "reed-diffuser", "diffuser-petrichor"];
  for (const slug of rumahCovers) {
    const prod = pBySlug[slug];
    if (prod && !hasCP(colRumah.id, prod.id)) {
      await post("/rest/v1/collection_products", [{ collection_id: colRumah.id, product_id: prod.id, sort_order: 3 }]);
      console.log(`  added ${slug} to seri-rumah`);
    }
  }

  console.log("\n=== 7. GALLERY (replace SVG placeholders with real photos) ===");
  const gal = await get("/rest/v1/gallery_items?select=id,path,sort_order&order=sort_order");
  const galData = [
    ["store-2026-03.jpg", "Ruang toko TURAYA yang kami ciptakan untuk memberi jeda.", "Store", 1],
    ["store-2025-09-a.jpg", "Merasakan aroma bukan hanya sekadar menciumnya, tetapi mengingat cerita yang dibawanya.", "Store", 2],
    ["store-2025-09-b.jpg", "Store kami harum di segala sudut, tempat mencoba dan memilih produk.", "Store", 3],
    ["products-row.jpg", "Produk berderet rapi menunggu untuk terpilih.", "Produk", 4],
    ["dt2uuukeu2c.jpg", "Reel TURAYA Perfumery, Januari 2026.", "Kegiatan", 5],
    ["dr81fzdkf8q.jpg", "Reel TURAYA Perfumery, Desember 2025.", "Kegiatan", 6],
    ["dm7bqepyiv9.jpg", "Reel TURAYA Perfumery, Agustus 2025.", "Kegiatan", 7],
    ["dm7a1ays81c.jpg", "Reel TURAYA Perfumery, Agustus 2025.", "Kegiatan", 8],
  ];
  // delete old SVG gallery rows, keep count
  const toDelete = gal.filter((g) => g.path.endsWith(".svg"));
  for (const g of toDelete) {
    await del(`/rest/v1/gallery_items?id=eq.${g.id}`);
    console.log(`  deleted ${g.path}`);
  }
  for (const [path, caption, category, order] of galData) {
    await post("/rest/v1/gallery_items", [
      { alt: caption, caption, category, path, sort_order: order, status: "published", created_at: created, updated_at: created },
    ]);
    console.log(`  added ${path}`);
  }

  console.log("\n=== 8. HOMEPAGE SECTIONS (hero & about photos) ===");
  await patch("/rest/v1/homepage_sections?slug=eq.hero", { image_path: "hero.jpg" });
  await patch("/rest/v1/homepage_sections?slug=eq.about", { image_path: "about.jpg" });
  console.log("  hero.jpg, about.jpg linked");

  console.log("\n=== 9. SITE SETTINGS (real IG / WhatsApp / address / logo) ===");
  await patch("/rest/v1/site_settings?id=eq.00000000-0000-0000-0000-000000000001", {
    instagram_url: "https://www.instagram.com/turayaperfumery/",
    whatsapp_number: "6288226606175",
    contact_phone: "+62 822-6606-175",
    address: "Jl. Lintas Simpang Tiga, Lingkuang Aua Bandarajo, Pasaman Barat, Sumatera Barat",
    logo_path: "logo.jpg",
  });
  console.log("  site_settings updated");

  console.log("\n=== 10. STORE LOCATION (real store, retire fictional boutiques) ===");
  const stores = await get("/rest/v1/store_locations?select=id,sort_order&order=sort_order");
  // keep first row as the real store; retire the rest
  const real = stores[0];
  await patch(`/rest/v1/store_locations?id=eq.${real.id}`, {
    name: "TURAYA PERFUMERY",
    address: "Jl. Lintas Simpang Tiga, Lingkuang Aua Bandarajo",
    city: "Pasaman Barat",
    country: "Indonesia",
    phone: "+62 822-6606-175",
    email: "turayaperfumery@gmail.com",
    hours: { "Senin - Minggu": "09.00 - 21.00" },
    sort_order: 1,
    status: "published",
    updated_at: created,
  });
  console.log(`  updated store #1 -> TURAYA PERFUMERY, Pasaman Barat`);
  for (const s of stores.slice(1)) {
    await patch(`/rest/v1/store_locations?id=eq.${s.id}`, { status: "draft", updated_at: created });
    console.log(`  retired store #${s.sort_order}`);
  }

  console.log("\n=== 11. JOURNAL POST (real caption) ===");
  const jpost = await get("/rest/v1/journal_posts?select=id&slug=eq.wangi-petrichor");
  if (!jpost.length) {
    const jcats = await get("/rest/v1/journal_categories?select=id,slug");
    const catCerita = jcats.find((c) => c.slug === "cerita") || jcats[0];
    const tags = await get("/rest/v1/journal_tags?select=id,slug");
    const tag = tags.find((t) => t.slug === "bahan") || tags[0];
    const jid = randomUUID();
    await post("/rest/v1/journal_posts", [{
      id: jid,
      title: "Wangi Petrichor: Kesegaran Setelah Hujan",
      slug: "wangi-petrichor",
      excerpt: "Wangi petrichor membawa kesegaran yang berbeda dan memicu ide-ide baru.",
      body: `# Wangi Petrichor

Petrichor adalah aroma yang muncul saat hujan pertama membasahi tanah kering. Di TURAYA, kami menangkapnya dalam diffuser yang menghadirkan kesegaran yang berbeda.

> Dengan wangi petrichor, atau wangi hujan, kamu dibawa ke tingkat kesegaran yang berbeda, juga meningkatkan produktivitas dan memicu ide-ide baru.

Temukan di butik kami atau lewat katalog WhatsApp di bio Instagram @turayaperfumery.`,
      cover_image_path: "petrichor.jpg",
      author_id: null,
      category_id: catCerita.id,
      status: "published",
      published_at: created,
      created_at: created,
      updated_at: created,
    }]);
    if (tag) {
      await post("/rest/v1/post_tags", [{ post_id: jid, tag_id: tag.id }]);
    }
    console.log("  created journal post 'wangi-petrichor'");
  } else {
    console.log("  wangi-petrichor already exists");
  }

  console.log("\n=== 12. SEED INGREDIENT NOTES FOR NEW PRODUCTS ===");
  const ingrAll = await get("/rest/v1/ingredients?select=id,slug");
  const iBySlug = Object.fromEntries(ingrAll.map((i) => [i.slug, i.id]));
  const existingNotes = await get("/rest/v1/product_ingredients?select=product_id,ingredient_id");
  const hasNote = (pid, iid) => existingNotes.some((n) => n.product_id === pid && n.ingredient_id === iid);
  const notesMap = {
    "oil-car-diffuser": [["serai-wangi", "top", 1], ["nilam", "heart", 1], ["cendana", "base", 1]],
    "reed-diffuser": [["cengkih", "top", 1], ["kayu-manis", "heart", 1], ["vanili", "base", 1]],
    "diffuser-petrichor": [["pandan", "top", 1], ["melati", "heart", 1], ["cendana", "base", 1]],
  };
  for (const [slug, notes] of Object.entries(notesMap)) {
    const prod = pBySlug[slug];
    if (!prod) continue;
    for (const [ingrSlug, stage, pos] of notes) {
      const iid = iBySlug[ingrSlug];
      if (!iid || hasNote(prod.id, iid)) continue;
      await post("/rest/v1/product_ingredients", [{ product_id: prod.id, ingredient_id: iid, note_stage: stage, position: pos }]);
      console.log(`  note ${slug} <- ${ingrSlug} (${stage})`);
    }
  }

  console.log("\n=== IMPORT COMPLETE ===");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
