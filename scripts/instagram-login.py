"""Interactive login helper: open a persistent Playwright Chromium profile so the
user can sign in to Instagram, then save the session for the highlight scraper.

Run: python scripts/instagram-login.py
"""
import os
import sys

from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
PROFILE_DIR = os.path.join(BASE, "pw-profile")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"


def main():
    os.makedirs(PROFILE_DIR, exist_ok=True)
    print("Browser akan terbuka (jendela biasa). Silakan login ke Instagram di sana.")
    print("Setelah berhasil login, tutup jendela browser.")
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE_DIR,
            headless=False,
            user_agent=UA,
            locale="en-US",
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(1500)
        print("==> Login di browser, lalu tutup jendelanya.")
        ctx.wait_for_event("close", timeout=0)
    print("Session tersimpan di", PROFILE_DIR)
    return 0


if __name__ == "__main__":
    sys.exit(main())
