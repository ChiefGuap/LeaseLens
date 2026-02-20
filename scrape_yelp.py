"""
scrape_yelp.py — Playwright-based Yelp scraper for apartment listings in Davis, CA.

Searches Yelp for 'Apartments in Davis, CA', extracts Property Name, Address,
and Star Rating from the search results, and saves them to yelp_data.json.
"""

import json
import re
import sys
import time

from playwright.sync_api import sync_playwright, TimeoutError as PwTimeout


SEARCH_URL = (
    "https://www.yelp.com/search"
    "?find_desc=Apartments"
    "&find_loc=Davis%2C+CA"
)
OUTPUT_FILE = "yelp_data.json"
MAX_PAGES = 3  # how many result pages to scrape (10 results each)


def _extract_rating(card) -> str | None:
    """Pull the star rating from a result card."""
    # Yelp stores the rating in an aria-label like "4.5 star rating"
    rating_el = card.query_selector('[aria-label*="star rating"]')
    if rating_el:
        label = rating_el.get_attribute("aria-label") or ""
        match = re.search(r"([\d.]+)", label)
        if match:
            return match.group(1)
    return None


def _extract_text(card, selectors: list[str]) -> str | None:
    """Return inner text of the first element matched by any selector."""
    for sel in selectors:
        el = card.query_selector(sel)
        if el:
            text = (el.inner_text() or "").strip()
            if text:
                return text
    return None


def scrape_page(page) -> list[dict]:
    """Extract listings from the currently loaded Yelp search-results page."""
    results: list[dict] = []

    # Wait for the main search-result container to appear
    try:
        page.wait_for_selector(
            '[data-testid="serp-ia-card"], li .container__09f24__FeTO6, '
            'ul li h3 a, [class*="searchResult"]',
            timeout=15_000,
        )
    except PwTimeout:
        print("  ⚠  Timed out waiting for results (possible CAPTCHA).")
        return results

    # Give dynamic content a moment to settle
    time.sleep(2)

    # Strategy 1: structured cards via data-testid
    cards = page.query_selector_all('[data-testid="serp-ia-card"]')

    # Strategy 2: fall back to list items containing an <h3> (business name)
    if not cards:
        cards = page.query_selector_all("ul li:has(h3)")

    for card in cards:
        name = _extract_text(card, [
            "h3 a",                       # most common
            'a[href*="/biz/"]',           # link to business page
            "h3",                          # heading without link
        ])
        if not name:
            continue

        # Strip leading index numbers like "1. " or "2. "
        name = re.sub(r"^\d+\.\s*", "", name)

        address = _extract_text(card, [
            '[class*="secondaryAttributes"] address',
            "address",
            'span[class*="raw__"]',       # Yelp's raw-address span
            'p:has-text("Davis")',         # paragraph mentioning Davis
        ])

        rating = _extract_rating(card)

        results.append({
            "property_name": name,
            "address": address,
            "star_rating": rating,
        })

    return results


def scrape_yelp(headless: bool = True) -> list[dict]:
    """Launch Playwright, scrape Yelp search results, return listings."""
    all_results: list[dict] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        for page_num in range(MAX_PAGES):
            url = SEARCH_URL if page_num == 0 else f"{SEARCH_URL}&start={page_num * 10}"
            print(f"→ Loading page {page_num + 1}: {url}")

            try:
                page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            except PwTimeout:
                print(f"  ⚠  Page {page_num + 1} timed out, skipping.")
                continue

            results = scrape_page(page)
            print(f"  ✓ Extracted {len(results)} listings")
            all_results.extend(results)

            if not results:
                # No results found — stop paginating
                break

        browser.close()

    return all_results


def main() -> None:
    headless = "--no-headless" not in sys.argv
    print(f"Scraping Yelp for Apartments in Davis, CA (headless={headless})…\n")

    listings = scrape_yelp(headless=headless)

    if not listings:
        print("\n⚠  No listings extracted. Yelp may have shown a CAPTCHA.")
        print("   Try running with --no-headless to solve it manually.")
    else:
        print(f"\n✓ Total listings scraped: {len(listings)}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(listings, f, indent=2, ensure_ascii=False)

    print(f"✓ Saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
