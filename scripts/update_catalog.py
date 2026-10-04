import json, os, re, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CFG = ROOT / "data" / "affiliate_links.json"
OUT = ROOT / "data" / "products.json"

def http_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "TechCompareCatalogBot/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

def money(v):
    try:
        return f"R$ {float(v):,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "Preço não consultado"

def search_meli(query):
    url = "https://api.mercadolibre.com/sites/MLB/search?q=" + urllib.parse.quote(query) + "&limit=5"
    data = http_json(url)
    items = data.get("results", [])
    if not items:
        return None
    # Prefer a listing with a concrete price and available stock.
    for item in items:
        if item.get("price") and item.get("available_quantity", 0) != 0:
            return item
    return items[0]

def main():
    cfg = json.loads(CFG.read_text(encoding="utf-8"))
    products = []
    for row in cfg:
        item = None
        try:
            item = search_meli(row["query"])
        except Exception as exc:
            print("Mercado Livre search failed:", row["query"], exc)

        if not item:
            continue

        price = item.get("price")
        title = item.get("title") or row["query"]
        thumbnail = item.get("thumbnail")
        if thumbnail and thumbnail.startswith("http://"):
            thumbnail = thumbnail.replace("http://", "https://", 1)

        links = row.get("affiliate", {})
        stores = {}
        if links.get("mercadolivre"):
            stores["mercadolivre"] = money(price)

        products.append({
            "id": row["id"],
            "cat": row["category"],
            "icon": row.get("icon", "🛒"),
            "name": title,
            "price": money(price),
            "old": "",
            "store": "Mercado Livre",
            "discount": "",
            "image": thumbnail or "",
            "priceNote": "Preço atualizado automaticamente. Pode mudar conforme estoque, promoção, pagamento e região.",
            "storePrices": {
                "amazon": "Consulte a oferta",
                "mercadolivre": money(price),
                "magalu": "Consulte a oferta"
            },
            "affiliateUrl": links.get("amazon", ""),
            "mercadoLivreUrl": links.get("mercadolivre", ""),
            "magaluUrl": links.get("magalu", ""),
            "sourceItemId": item.get("id"),
            "updatedAt": __import__("datetime").datetime.utcnow().isoformat() + "Z"
        })

    OUT.write_text(json.dumps(products, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(products)} products")

if __name__ == "__main__":
    main()
