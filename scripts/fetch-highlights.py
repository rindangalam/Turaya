"""Scrape full story content from @turayaperfumery's highlights via the private
Instagram API (using the logged-in Playwright session). Downloads each story
image/video at full resolution plus any story text.

Run: python scripts/fetch-highlights.py
"""
import json
import os
import re
import sys

from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
PROFILE_DIR = os.path.join(BASE, "pw-profile")
OUT_DIR = os.path.join(BASE, "instagram-highlights")
DATA_FILE = os.path.join(BASE, "instagram-highlights.json")
UA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"
API = "https://i.instagram.com/api/v1/feed/reels_media/"
HEADERS = {"x-ig-app-id": "936619743392459", "accept": "application/json", "user-agent": UA}


def best_image(versions):
    best, best_w = None, 0
    for v in versions.get("candidates", []):
        w = v.get("width", 0)
        if w > best_w:
            best_w = w
            best = v.get("url")
    return best


def best_video(video_versions):
    best, best_bw = None, 0
    for v in video_versions or []:
        bw = v.get("bitrate", 0) or v.get("bandwidth", 0)
        if bw > best_bw:
            best_bw = bw
            best = v.get("url")
    return best


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    results = []

    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR,
            headless=True,
            user_agent=UA,
            locale="en-US",
            viewport={"width": 390, "height": 844},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        page.goto("https://www.instagram.com/turayaperfumery/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(6000)
        logged_in = "Log in" not in (page.inner_text("body")[:2000] or "")
        print("LOGGED IN:", logged_in)
        if not logged_in:
            print("Belum login. Jalankan scripts/instagram-login.py dulu.")
            return 1

        reels = page.eval_on_selector_all("section ul li", """els => els.map(e => {
            const a = e.querySelector('a[href*="/stories/highlights/"]');
            const t = (e.innerText||'').trim();
            return a ? { id: a.getAttribute('href').match(/stories\\/highlights\\/(\\d+)/)?.[1], title: t } : null;
        }).filter(Boolean)""")
        seen_ids = set()
        uniq = []
        for r in reels:
            if r["id"] and r["id"] not in seen_ids:
                seen_ids.add(r["id"])
                uniq.append(r)
        print("HIGHLIGHT REELS:", json.dumps(uniq, ensure_ascii=False))

        for reel in uniq:
            rid = reel["id"]
            title = reel["title"]
            slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-") or "highlight"
            print(f"\n=== {title} ({rid}) ===")
            url = f"{API}?reel_ids=highlight%3A{rid}"
            try:
                resp = page.request.get(url, headers=HEADERS)
                if resp.status != 200:
                    print(f"  API {resp.status}: {resp.text()[:200]}")
                    continue
                data = resp.json()
            except Exception as e:
                print(f"  API error: {str(e)[:120]}")
                continue

            reel_data = None
            for m in data.get("reels_media", []) or []:
                if str(m.get("id", "")).split(":")[-1] == rid:
                    reel_data = m
                    break
            if reel_data is None:
                print("  reel not found in response")
                continue

            for item in reel_data.get("items", []):
                pk = item.get("pk") or item.get("id")
                mt = item.get("media_type")
                caption = None
                for c in item.get("caption", []) or []:
                    if c.get("text"):
                        caption = c["text"]
                        break
                text = caption or ""
                poster = False
                if mt == 2:
                    src = best_video(item.get("video_versions"))
                    ftype = "video"
                    if not src:
                        # story video delivered via DASH only: save its poster image
                        src = best_image(item.get("image_versions2"))
                        ftype = "image"
                        poster = True
                else:
                    src = best_image(item.get("image_versions2"))
                    ftype = "image"
                if not src:
                    print(f"  {pk}: no media url")
                    continue
                try:
                    body = page.request.get(src).body()
                except Exception as e:
                    print(f"  {pk}: download fail {str(e)[:80]}")
                    continue
                if len(body) < 1000:
                    print(f"  {pk}: empty body ({len(body)}B)")
                    continue
                fname = f"{slug}-{len(results)}.{'mp4' if ftype=='video' else 'jpg'}"
                with open(os.path.join(OUT_DIR, fname), "wb") as f:
                    f.write(body)
                print(f"  {fname} ({ftype}{' poster' if poster else ''}, {len(body)//1024}KB) text={(text or '')[:60]}")
                results.append({"title": title, "slug": slug, "id": rid, "media_id": pk,
                                "type": ftype, "file": fname, "text": text or None,
                                "poster": poster, "source_url": src})

        ctx.close()

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {DATA_FILE}: {len(results)} items")
    return 0


if __name__ == "__main__":
    sys.exit(main())
