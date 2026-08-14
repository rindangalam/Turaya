"""Scrape & download all public photos from @turayaperfumery.

Images are captured from the live browser network (Playwright response bodies),
which satisfies Instagram CDN's session requirements.

Outputs:
  scripts/instagram-assets/<slug>.jpg   (downloaded images)
  scripts/instagram-data.json           (metadata: slug, source, caption, date, type, file)

Run: python scripts/fetch-instagram.py
"""
import base64
import json
import os
import re
import sys
from datetime import datetime

from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
ASSET_DIR = os.path.join(BASE, "instagram-assets")
DATA_FILE = os.path.join(BASE, "instagram-data.json")
PROFILE = "https://www.instagram.com/turayaperfumery/"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"

# shortcode -> semantic slug + display label (skip trophy post per user request)
POST_MAP = {
    "DWGR8kHEZ4P": ("store-2026-03", "Store 2026"),
    "DOOT0kpAazV": ("store-2025-09-a", "Store 2025"),
    "DOOTmX0gTvy": ("products-row", "Produk 2025"),
    "DOOSuGTAb6A": ("store-2025-09-b", "Store 2025"),
    "DEUhAQDy0OT": ("petrichor", "Petrichor"),
    "DBqd4EWSj6L": ("oil-car-diffuser", "Oil Car Diffuser"),
    "DBqYA05S4vo": ("reed-diffuser", "Reed Diffuser"),
}

SKIP = {"DUdEB9IETz4"}  # trophy racing post - user asked to skip


def main():
    os.makedirs(ASSET_DIR, exist_ok=True)

    # url(no query) -> best body seen for that image
    img_bodies = {}
    img_urls = {}  # url(no query) -> full url (with query) used

    def on_response(resp):
        try:
            url = resp.url
            if "scontent" not in url or "cdninstagram" not in url:
                return
            ct = resp.headers.get("content-type", "")
            if "image" not in ct:
                return
            key = url.split("?")[0]
            prev = img_bodies.get(key)
            body = resp.body()
            if prev is None or len(body) > len(prev):
                img_bodies[key] = body
                img_urls[key] = url
        except Exception:
            pass

    results = []
    used = set()

    with sync_playwright() as p:
        b = p.chromium.launch(args=["--disable-blink-features=AutomationControlled"])
        ctx = b.new_context(user_agent=UA, locale="en-US", viewport={"width": 1280, "height": 1600})
        page = ctx.new_page()
        page.on("response", on_response)

        # 1. Profile page: profile pic + highlight covers
        page.goto(PROFILE, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(7000)
        for _ in range(6):
            page.evaluate("window.scrollBy(0, 4000)")
            page.wait_for_timeout(1200)

        # map img alt -> the src with largest captured body
        def best_img(pred):
            cands = []
            for el in page.query_selector_all("img[alt]"):
                alt = el.get_attribute("alt") or ""
                src = el.get_attribute("src") or ""
                if pred(alt) and "scontent" in src:
                    key = src.split("?")[0]
                    if key in img_bodies:
                        cands.append((len(img_bodies[key]), key, src))
            cands.sort(reverse=True)
            return cands[0] if cands else None

        # profile picture
        hit = best_img(lambda a: "profile picture" in a)
        if hit:
            _, key, full = hit
            body = img_bodies[key]
            with open(os.path.join(ASSET_DIR, "profile.jpg"), "wb") as f:
                f.write(body)
            used.add(key)
            results.append({"slug": "profile", "label": "Profil", "type": "profile", "date": None,
                            "caption": None, "file": "profile.jpg", "source_url": full})
            print(f"  profile.jpg ({len(body)//1024}KB)")

        # highlight covers
        n = 0
        for el in page.query_selector_all("img[alt*='highlight story picture']"):
            src = el.get_attribute("src") or ""
            if "scontent" not in src:
                continue
            key = src.split("?")[0]
            if key in used or key not in img_bodies:
                continue
            n += 1
            slug = f"highlight-{n:02d}"
            body = img_bodies[key]
            with open(os.path.join(ASSET_DIR, f"{slug}.jpg"), "wb") as f:
                f.write(body)
            used.add(key)
            results.append({"slug": slug, "label": f"Highlight {n}", "type": "highlight",
                            "date": None, "caption": None, "file": f"{slug}.jpg", "source_url": src})
            print(f"  {slug}.jpg ({len(body)//1024}KB)")

        # 2. Each post: caption + full image (captured from network)
        links = page.eval_on_selector_all("a[href*='/p/'], a[href*='/reel/']", "els => [...new Set(els.map(e => e.href))]")
        codes = list(dict.fromkeys([l.rstrip("/").split("/")[-1] for l in links]))

        for code in codes:
            if code in SKIP:
                continue
            slug, label = POST_MAP.get(code, (code.lower(), code))
            try:
                page.goto(f"https://www.instagram.com/p/{code}/", wait_until="domcontentloaded", timeout=60000)
                page.wait_for_timeout(4000)
            except Exception as e:
                print(f"goto {code} failed: {e}")
                continue

            content = page.content()
            desc_m = re.search(r'<meta property="og:description" content="([^"]*)"', content)
            img_m = re.search(r'<meta property="og:image" content="([^"]*)"', content)
            caption = None
            if desc_m:
                raw = desc_m.group(1).replace("&quot;", '"').replace("&#39;", "'").replace("&amp;", "&").replace("\n", " ").strip()
                caption = raw
                if ': "' in raw:
                    caption = raw.split(': "', 1)[1]
                elif re.match(r'^\d+ likes?, \d+ comments? - \w+ on ', raw):
                    caption = None
                if caption and caption.endswith('".'):
                    caption = caption[:-2]
                caption = caption.strip() if caption else None
            date = None
            date_m = re.search(r'([A-Z][a-z]+ \d{1,2}, \d{4})', desc_m.group(1) if desc_m else "")
            if date_m:
                try:
                    date = datetime.strptime(date_m.group(1), "%B %d, %Y").date().isoformat()
                except Exception:
                    date = date_m.group(1)

            # find the highest-res body captured for this page's media
            # prefer full-size (t51.82787 or t51.75761) images seen on this page
            best_key, best_len = None, 0
            for key, body in img_bodies.items():
                if key in used:
                    continue
                if len(body) > best_len:
                    best_key, best_len = key, len(body)
            src = img_urls.get(best_key) if best_key else img_m.group(1) if img_m else None
            saved = False
            if best_key:
                with open(os.path.join(ASSET_DIR, f"{slug}.jpg"), "wb") as f:
                    f.write(img_bodies[best_key])
                used.add(best_key)
                saved = True
                print(f"  {slug}.jpg ({best_len//1024}KB) <- {src[:90] if src else '?'}")
            results.append({"slug": slug, "label": label, "type": "post", "date": date,
                            "caption": caption, "file": f"{slug}.jpg" if saved else None, "source_url": src})
            print(f"  {code}: {label} | {date} | {(caption or '')[:80]}")

        b.close()

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {DATA_FILE} with {len(results)} items")
    ok = sum(1 for r in results if r["file"])
    print(f"Downloaded {ok}/{len(results)} images to {ASSET_DIR}")


if __name__ == "__main__":
    sys.exit(main())
