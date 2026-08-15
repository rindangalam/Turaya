"""Verify pages for broken images after photo import."""
import asyncio
import sys

from playwright.async_api import async_playwright

PAGES = [
    ("/", "Beranda"),
    ("/products", "Produk"),
    ("/collections", "Koleksi"),
    ("/journal", "Journal"),
    ("/gallery", "Galeri"),
    ("/ingredients", "Bahan"),
]


async def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        total_broken = 0
        for path, name in PAGES:
            await page.goto(base + path, wait_until="networkidle")
            broken = await page.evaluate(
                """() => {
                    const imgs = Array.from(document.querySelectorAll('img'));
                    return imgs
                        .filter((i) => i.complete && i.naturalWidth === 0)
                        .map((i) => i.getAttribute('src'));
                }"""
            )
            imgs = await page.evaluate("() => document.querySelectorAll('img').length")
            print(f"{name:12s} imgs={imgs:3d} broken={len(broken)} {broken[:3]}")
            total_broken += len(broken)
        await browser.close()
        print(f"\nTOTAL BROKEN: {total_broken}")
        sys.exit(1 if total_broken else 0)


asyncio.run(main())
