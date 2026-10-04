import html
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CFG = ROOT / "data" / "affiliate_links.json"
OUT = ROOT / "data" / "magalu_prices.json"


def fetch(url):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; TechCompareCatalogBot/1.0)",
            "Accept-Language": "pt-BR,pt;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read().decode("utf-8", errors="ignore")


def parse_price(value):
    if value is None:
        return None
    text = str(value).strip()
    # JSON-LD usually exposes a decimal number.
    m = re.search(r"\d+(?:\.\d+)?", text.replace(",", "."))
    if m:
        try:
            return float(m.group(0))
        except ValueError:
            pass
    # Visible Brazilian currency, e.g. R$ 1.071,00
    m = re.search(r"R\$\s*([\d.]+,\d{2})", text)
    if m:
        try:
            return float(m.group(1).replace(".", "").replace(",", "."))
        except ValueError:
            return None
    return None


def find_prices(payload):
    prices = []
    if isinstance(payload, dict):
        for key, value in payload.items():
            if key.lower() in {"price", "lowprice", "currentprice"}:
                parsed = parse_price(value)
                if parsed is not None:
                    prices.append(parsed)
            else:
                prices.extend(find_prices(value))
    elif isinstance(payload, list):
        for value in payload:
            prices.extend(find_prices(value))
    return prices


def extract_price(page):
    # Prefer structured product data when present.
    for raw in re.findall(
        r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        page,
        flags=re.I | re.S,
    ):
        try:
            data = json.loads(html.unescape(raw))
            prices = find_prices(data)
            if prices:
                return min(p for p in prices if p > 0)
        except Exception:
            continue

    # Common HTML/meta fallbacks.
    patterns = [
        r'<meta[^>]+itemprop=["\']price["\'][^>]+content=["\']([0-9.,]+)',
        r'<meta[^>]+content=["\']([0-9.,]+)["\'][^>]+itemprop=["\']price',
        r'"price"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?',
        r'"salePrice"\s*:\s*"?(\d+(?:\.\d{1,2})?)"?',
    ]
    for pattern in patterns:
        m = re.search(pattern, page, flags=re.I)
        if m:
            price = parse_price(m.group(1))
            if price and price > 0:
                return price

    return None


def main():
    cfg = json.loads(CFG.read_text(encoding="utf-8"))
    previous = {}
    if OUT.exists():
        try:
            previous = json.loads(OUT.read_text(encoding="utf-8"))
        except Exception:
            previous = {}

    result = {}
    for row in cfg:
        product_id = row["id"]
        url = row.get("affiliate", {}).get("magalu", "")
        old = previous.get(product_id, {})
        entry = dict(old) if isinstance(old, dict) else {}
        entry["url"] = url
        entry["checkedAt"] = datetime.now(timezone.utc).isoformat()

        if not url:
            entry["status"] = "missing_url"
            result[product_id] = entry
            continue

        try:
            page = fetch(url)
            price = extract_price(page)
            if price is not None:
                entry["price"] = f"R$ {price:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
                entry["numericPrice"] = round(price, 2)
                entry["status"] = "ok"
            else:
                entry["status"] = "price_not_found"
                print(f"Magalu price not found: {product_id}")
        except Exception as exc:
            # Keep the last successful price so a temporary block/outage does not
            # erase a previously valid value.
            entry["status"] = "request_failed"
            entry["error"] = str(exc)[:300]
            print(f"Magalu request failed: {product_id}: {exc}")

        result[product_id] = entry

    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated Magalu cache for {len(result)} products")


if __name__ == "__main__":
    main()
