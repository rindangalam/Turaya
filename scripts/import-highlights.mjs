import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envRaw = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "").trim();
}
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const HEADERS = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" };

async function req(method, p, body) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`${SUPABASE_URL}${p}`, {
        method,
        headers: HEADERS,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(`${method} ${p}: ${res.status} ${await res.text()}`);
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "instagram-highlights.json");
const ASSET_DIR = path.join(__dirname, "instagram-highlights");
const GALLERY_TITLES = {
  "your-visit": "Your Visit",
  "more-tips": "More Tips",
  "reed-diffuser": "Reed Diffuser",
  exclusive: "Exclusive",
  "offline-store": "Offline Store",
  "order-online": "Order Online",
  testimoni: "Testimoni",
};

async function uploadJpg(bucket, filePath, buffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`, {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    body: buffer,
  });
  if (!res.ok && res.status !== 409) throw new Error(`upload ${filePath}: ${res.status} ${await res.text()}`);
}

const items = JSON.parse(readFileSync(DATA_FILE, "utf8"));
const photos = items.filter((i) => i.type === "image" && !i.poster && i.file);
console.log(`Foto asli dari highlight: ${photos.length}`);

const existing = await get("/rest/v1/gallery_items?select=path");
const existingPaths = new Set((existing ?? []).map((g) => g.path));

let uploadedCount = 0;
let skippedCount = 0;

for (const photo of photos) {
  const buffer = readFileSync(path.join(ASSET_DIR, photo.file));
  const num = photo.file.replace(/\.jpg$/, "").match(/-(\d+)$/);
  const slug = `${photo.slug}-${num ? num[1] : photo.slug}`;
  const title = GALLERY_TITLES[photo.slug] ?? photo.slug;
  if (existingPaths.has(slug)) {
    console.log(`  skip (exists): ${slug}`);
    skippedCount++;
    continue;
  }
  await uploadJpg("gallery", slug, buffer);
  console.log(`  upload: ${slug} (${Math.round(buffer.length / 1024)}KB)`);
  const row = {
    path: slug,
    alt: title,
    caption: title,
    category: "highlight",
    sort_order: photos.length + uploadedCount,
    status: "published",
  };
  await post("/rest/v1/gallery_items", row);
  uploadedCount++;
}

console.log(`\nSelesai: ${uploadedCount} upload baru, ${skippedCount} sudah ada.`);
