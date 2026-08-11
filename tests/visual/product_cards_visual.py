"""Visuelle Regressionstests fuer die Produktkarten-Zeilenstruktur.

Prueft ueber alle Breakpoints hinweg:
  1. Layout-Invarianten (gleiche Kartenhoehen pro Zeile, buendige Kopfbereiche,
     kein Ueberlauf/Abschneiden) - auch mit kuenstlich verlaengerten Texten.
  2. Pixel-Vergleich gegen eingecheckte Baselines.

Nutzung:
  python tests/visual/product_cards_visual.py            # vergleichen
  python tests/visual/product_cards_visual.py --update   # Baselines neu schreiben
"""

import asyncio
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:8080"
ROOT = Path(__file__).parent
BASELINES = ROOT / "baselines"
ARTIFACTS = ROOT / "artifacts"
UPDATE = "--update" in sys.argv

# (label, viewport-Breite, viewport-Hoehe, erwartete Spalten pro Reihe)
BREAKPOINTS = [
    ("mobile-390", 390, 1400, 2),
    ("mobile-440", 440, 1400, 2),
    ("tablet-768", 768, 1400, 3),
    ("tablet-900", 900, 1400, 3),
    ("desktop-1024", 1024, 1400, 4),
    ("desktop-1280", 1280, 1400, 4),
    ("desktop-1600", 1600, 1400, 4),
]

# Textlaengen-Stresstests: (name, kuenstlicher Produktname, Kategorie, THC, CBD)
TEXT_VARIANTS = [
    ("default", None, None, None, None),
    (
        "long",
        "Nachtflor Reserve Selection 22 Batch",
        "Indica-dominant · Tiefenentspannung",
        "THC 16–19%",
        "CBD <1% (0,4)",
    ),
    ("short", "Ora", "Sativa", "THC 20%", "CBD 1%"),
]

MAX_DIFF_RATIO = 0.002  # 0,2 % abweichende Pixel toleriert (Font-Rendering)

APPLY_VARIANT = """
([name, cat, thc, cbd]) => {
  document.querySelectorAll('[data-testid="product-card"]').forEach((card, i) => {
    if (name) card.querySelector('[data-testid="product-card-name"]').textContent =
      i % 2 === 0 ? name : name + ' II';
    if (cat) card.querySelector('[data-testid="product-card-category"]').textContent = cat;
    if (thc && cbd) {
      const meta = card.querySelector('[data-testid="product-card-meta"]');
      meta.innerHTML = '<span style="white-space:nowrap">' + thc +
        '</span><br><span style="white-space:nowrap">' + cbd + '</span>';
    }
  });
}
"""

MEASURE = """
() => {
  const cards = [...document.querySelectorAll('[data-testid="product-card"]')];
  return cards.map((c) => {
    const r = c.getBoundingClientRect();
    const header = c.querySelector('[data-testid="product-card-header"]').getBoundingClientRect();
    const footer = c.querySelector('[data-testid="product-card-footer"]').getBoundingClientRect();
    const name = c.querySelector('[data-testid="product-card-name"]');
    const cat = c.querySelector('[data-testid="product-card-category"]');
    return {
      top: Math.round(r.top), bottom: Math.round(r.bottom),
      height: Math.round(r.height),
      headerTop: Math.round(header.top - r.top),
      headerBottom: Math.round(header.bottom - r.top),
      footerBottom: Math.round(footer.bottom - r.top),
      clipped: name.scrollHeight > name.clientHeight + 1 ||
               cat.scrollHeight > cat.clientHeight + 1,
      overflow: Math.round(footer.bottom - r.bottom) > 1,
    };
  });
}
"""

SETTLE = """
async () => {
  await document.fonts.ready;
  const grid = document.querySelector('[data-testid="product-grid"]');
  grid.scrollIntoView({ block: 'start' });
  const imgs = [...grid.querySelectorAll('img')];
  imgs.forEach((i) => { i.loading = 'eager'; });
  await Promise.all(imgs.map((i) => (i.complete ? null : i.decode().catch(() => null))));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}
"""

failures = []


def check(condition, message):
    if not condition:
        failures.append(message)


def rows_of(cards):
    rows, current = [], []
    for c in sorted(cards, key=lambda c: (c["top"], c["bottom"])):
        if current and abs(c["top"] - current[0]["top"]) > 2:
            rows.append(current)
            current = []
        current.append(c)
    if current:
        rows.append(current)
    return rows


def compare(png: Path, key: str):
    baseline = BASELINES / f"{key}.png"
    if UPDATE or not baseline.exists():
        baseline.write_bytes(png.read_bytes())
        print(f"  baseline geschrieben: {baseline.name}")
        return
    a, b = Image.open(baseline).convert("RGB"), Image.open(png).convert("RGB")
    if a.size != b.size:
        failures.append(f"{key}: Groesse geaendert {a.size} -> {b.size}")
        return
    diff = ImageChops.difference(a, b).convert("L")
    changed = sum(1 for p in diff.getdata() if p > 12)
    ratio = changed / (a.size[0] * a.size[1])
    if ratio > MAX_DIFF_RATIO:
        out = ARTIFACTS / f"{key}.diff.png"
        b.save(ARTIFACTS / f"{key}.actual.png")
        diff.save(out)
        failures.append(f"{key}: {ratio:.4%} Pixel abweichend (siehe {out})")
    else:
        print(f"  pixel-diff ok ({ratio:.4%})")


async def main():
    ARTIFACTS.mkdir(exist_ok=True)
    BASELINES.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for label, w, h, expected_cols in BREAKPOINTS:
            ctx = await browser.new_context(
                viewport={"width": w, "height": h}, device_scale_factor=1
            )
            page = await ctx.new_page()
            await page.goto(BASE_URL, wait_until="domcontentloaded")
            await page.evaluate(
                "() => localStorage.setItem('grastheke.age-verified','true')"
            )
            await page.goto(f"{BASE_URL}/sortiment", wait_until="domcontentloaded")
            await page.wait_for_selector('[data-testid="product-grid"]')
            await page.evaluate(SETTLE)
            await page.wait_for_load_state("networkidle")
            await page.evaluate(SETTLE)
            await page.wait_for_timeout(400)
            for vname, *variant in TEXT_VARIANTS:
                key = f"{label}--{vname}"
                print(f"[{key}]")
                if any(variant):
                    await page.evaluate(APPLY_VARIANT, variant)
                    await page.evaluate(SETTLE)
                    await page.wait_for_timeout(200)
                cards = await page.evaluate(MEASURE)
                check(len(cards) > 0, f"{key}: keine Produktkarten gefunden")
                rows = rows_of(cards)
                full_rows = [r for r in rows if len(r) == max(len(x) for x in rows)]
                check(
                    len(full_rows[0]) == expected_cols,
                    f"{key}: {len(full_rows[0])} Spalten statt erwartet {expected_cols}",
                )
                for row in rows:
                    heights = {c["height"] for c in row}
                    check(
                        max(heights) - min(heights) <= 1,
                        f"{key}: unterschiedliche Kartenhoehen in einer Zeile {sorted(heights)}",
                    )
                    bottoms = {c["bottom"] for c in row}
                    check(
                        max(bottoms) - min(bottoms) <= 1,
                        f"{key}: Karten schliessen nicht buendig ab {sorted(bottoms)}",
                    )
                    header_tops = {c["headerTop"] for c in row}
                    check(
                        max(header_tops) - min(header_tops) <= 1,
                        f"{key}: Kopfbereiche nicht buendig {sorted(header_tops)}",
                    )
                check(
                    not any(c["clipped"] for c in cards),
                    f"{key}: Produktname/Kategorie wird abgeschnitten",
                )
                check(
                    not any(c["overflow"] for c in cards),
                    f"{key}: Inhalt laeuft aus der Karte heraus",
                )
                grid = page.locator('[data-testid="product-grid"]')
                shot = ARTIFACTS / f"{key}.png"
                await grid.screenshot(path=str(shot))
                compare(shot, key)
                if any(variant):
                    await page.reload(wait_until="domcontentloaded")
                    await page.wait_for_selector('[data-testid="product-grid"]')
                    await page.evaluate(SETTLE)
                    await page.wait_for_load_state("networkidle")
                    await page.evaluate(SETTLE)
                    await page.wait_for_timeout(400)
            await ctx.close()
        await browser.close()

    print()
    if failures:
        print(f"FEHLGESCHLAGEN ({len(failures)}):")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("Alle visuellen Regressionstests bestanden.")


asyncio.run(main())
