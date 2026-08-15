import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

const envRaw = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "").trim();
}
const BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

async function upload(bucket, name, localPath) {
  const buf = await readFile(localPath);
  const r = await fetch(`${BASE}/storage/v1/object/${bucket}/${name}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/octet-stream" },
    body: buf,
  });
  const t = await r.text();
  return { ok: r.status === 200 || r.status === 409, status: r.status, text: t.slice(0, 80) };
}

async function patch(url, body) {
  const r = await fetch(`${BASE}${url}`, { method: "PATCH", headers: { ...H, Prefer: "return=representation" }, body: JSON.stringify(body) });
  const t = await r.text();
  return { ok: r.status === 200, status: r.status, text: t.slice(0, 80) };
}

const HL = "scripts/instagram-highlights/";
const AS = "scripts/instagram-assets/";

const PRODUCTS = {
  "diffuser-taman-melati": `${HL}reed-diffuser-88.jpg`,
  "lilin-rumah-kampung": `${HL}reed-diffuser-87.jpg`,
  "room-spray-pantai-utara": `${HL}more-tips-85.jpg`,
  "turaya-no-1": `${HL}more-tips-82.jpg`,
  "turaya-no-2": `${HL}more-tips-83.jpg`,
  "turaya-no-3": `${HL}order-online-97.jpg`,
  "turaya-no-4": `${HL}order-online-98.jpg`,
};

const COLLECTIONS = {
  "koleksi-pertama": `${AS}products-row.jpg`,
  "seri-rumah": `${AS}dt2uuukeu2c.jpg`,
  "seri-nusantara": `${AS}store-2025-09-a.jpg`,
  "seri-senja": `${AS}store-2026-03.jpg`,
};

const JOURNAL = {
  "mengenal-aroma-cengkih": `${HL}more-tips-77.jpg`,
  "ritual-menyambut-panen": `${HL}more-tips-78.jpg`,
  "cara-menyimpan-parfum": `${HL}more-tips-86.jpg`,
  "senja-di-kebun-vanili": `${HL}your-visit-56.jpg`,
  "perjalanan-nusantara": `${HL}your-visit-13.jpg`,
  "selamat-datang-di-turaya": `${AS}store-2025-09-b.jpg`,
};

(async () => {
  const products = await (await fetch(`${BASE}/rest/v1/products?select=id,slug`, { headers: H })).json();
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p.id]));

  console.log("=== PRODUCTS ===");
  for (const [slug, local] of Object.entries(PRODUCTS)) {
    const id = bySlug[slug];
    if (!id) { console.log(`  ${slug}: product not found`); continue; }
    const up = await upload("products", `${slug}.jpg`, local);
    const del = await fetch(`${BASE}/rest/v1/product_images?product_id=eq.${id}&path=ilike.%.svg`, { method: "DELETE", headers: H });
    const ins = await fetch(`${BASE}/rest/v1/product_images`, {
      method: "POST", headers: { ...H, Prefer: "return=representation" },
      body: JSON.stringify({ product_id: id, path: `${slug}.jpg`, alt: slug, sort_order: 0 }),
    });
    const body = await ins.text();
    console.log(`  ${slug}: upload=${up.status} delSvg=${del.status} insert=${ins.status} ${body.slice(0, 40)}`);
  }

  console.log("\n=== COLLECTIONS ===");
  for (const [slug, local] of Object.entries(COLLECTIONS)) {
    const up = await upload("collections", `${slug}.jpg`, local);
    const pt = await patch(`/rest/v1/collections?slug=eq.${slug}`, { cover_image_path: `${slug}.jpg` });
    console.log(`  ${slug}: upload=${up.status} patch=${pt.status}`);
  }

  console.log("\n=== JOURNAL ===");
  for (const [slug, local] of Object.entries(JOURNAL)) {
    const up = await upload("journal", `${slug}.jpg`, local);
    const pt = await patch(`/rest/v1/journal_posts?slug=eq.${slug}`, { cover_image_path: `${slug}.jpg` });
    console.log(`  ${slug}: upload=${up.status} patch=${pt.status}`);
  }
})();
